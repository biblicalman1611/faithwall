const PRICE_BY_TIER = {
  individual: process.env.STRIPE_PRICE_INDIVIDUAL || 'price_1TSP5vLN6IypHVMVrT4SsXqd',
  family: process.env.STRIPE_PRICE_FAMILY || 'price_1TSP5wLN6IypHVMVPWLbEap1',
};

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function readJsonBody(req) {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  const raw = await readRawBody(req);
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe server key is not configured' });
  }

  const body = await readJsonBody(req);
  const tier = body?.tier === 'family' ? 'family' : 'individual';
  const price = PRICE_BY_TIER[tier];
  const baseUrl = process.env.FAITHWALL_APP_URL || 'https://faithwall.deadhidden.org';
  const params = new URLSearchParams({
    mode: 'payment',
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
    allow_promotion_codes: 'true',
    customer_creation: 'always',
    'line_items[0][price]': price,
    'line_items[0][quantity]': '1',
    'metadata[app]': 'faithwall',
    'metadata[tier]': tier,
  });

  try {
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2026-02-25.clover',
      },
      body: params.toString(),
    });

    const session = await response.json();

    if (!response.ok) {
      console.error('Stripe checkout error', session);
      return res.status(500).json({ error: 'Could not create checkout session' });
    }

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error', error);
    return res.status(500).json({ error: 'Could not create checkout session' });
  }
}
