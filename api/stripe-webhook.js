import crypto from 'node:crypto';
import { getPurchaseWelcomeEmail } from './emails/purchase-welcome.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function parseStripeSignature(header) {
  return String(header || '')
    .split(',')
    .reduce((acc, item) => {
      const [key, value] = item.split('=');
      if (key && value) acc[key] = value;
      return acc;
    }, {});
}

function verifyStripeSignature(rawBody, header, secret) {
  const parsed = parseStripeSignature(header);
  const timestamp = parsed.t;
  const signature = parsed.v1;

  if (!timestamp || !signature) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const signedPayload = `${timestamp}.${rawBody.toString('utf8')}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  const expectedBuffer = Buffer.from(expected, 'hex');
  const signatureBuffer = Buffer.from(signature, 'hex');

  return (
    expectedBuffer.length === signatureBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
  );
}

function detectTier(session) {
  if (session.metadata?.tier === 'family') return 'family';
  if (session.amount_total && session.amount_total >= 3999) return 'family';
  return 'individual';
}

async function sendResendEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !to) return false;

  const from = process.env.FAITHWALL_FROM_EMAIL || 'FaithWall <adam@deadhidden.org>';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      text,
      reply_to: 'adam@deadhidden.org',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('Resend email failed', response.status, body);
    return false;
  }

  return true;
}

async function fulfillCheckoutSession(session) {
  const email = session.customer_details?.email || session.customer_email;
  const tier = detectTier(session);
  const message = getPurchaseWelcomeEmail(email, tier);

  await sendResendEmail({
    to: email,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  const adminEmail = process.env.FAITHWALL_ADMIN_EMAIL || 'adam@deadhidden.org';
  await sendResendEmail({
    to: adminEmail,
    subject: `FaithWall sale: ${tier}`,
    html: `<p>FaithWall purchase completed.</p><p><strong>Email:</strong> ${email || 'unknown'}</p><p><strong>Tier:</strong> ${tier}</p><p><strong>Amount:</strong> ${session.amount_total || 0}</p>`,
    text: `FaithWall purchase completed.\nEmail: ${email || 'unknown'}\nTier: ${tier}\nAmount: ${session.amount_total || 0}`,
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Stripe webhook is not configured' });
  }

  const signature = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await readRawBody(req);
    if (!verifyStripeSignature(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)) {
      return res.status(400).json({ error: 'Invalid Stripe signature' });
    }
    event = JSON.parse(rawBody.toString('utf8'));
  } catch (error) {
    console.error('Stripe webhook signature error', error);
    return res.status(400).json({ error: 'Invalid Stripe signature' });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      await fulfillCheckoutSession(event.data.object);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Stripe webhook fulfillment error', error);
    return res.status(500).json({ error: 'Webhook fulfillment failed' });
  }
}
