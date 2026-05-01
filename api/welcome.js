/**
 * POST /api/welcome
 * Handles lead magnet requests — sends the "10 Verses" printable via Resend
 * Fires when someone enters their email on the landing page to get the free PDF
 *
 * ENV: RESEND_API_KEY (set in Vercel dashboard)
 * FROM: adam@deadhidden.org
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // If no Resend key configured yet, accept silently (dev mode)
  if (!RESEND_API_KEY) {
    console.log('Lead magnet signup (no Resend key):', email);
    return res.status(200).json({ ok: true, note: 'Signed up — email queued' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FaithWall <adam@deadhidden.org>',
        to: email,
        subject: 'Your 10 Verses Printable is here',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Printable</title>
</head>
<body style="margin:0;padding:0;background:#FDF8F0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FDF8F0;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border-radius:16px;border:1px solid #E8E0D4;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#C4453A,#8B3A36);padding:40px 30px;text-align:center;">
              <h1 style="margin:0;color:#F5F0E8;font-size:28px;font-family:Georgia,serif;">FaithWall</h1>
              <p style="margin:8px 0 0;color:#D4A843;font-size:13px;font-style:italic;">Build your wall. One verse at a time.</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 30px;">
              <h2 style="margin:0 0 16px;color:#3D2B1F;font-size:22px;font-family:Georgia,serif;">Your printable is ready</h2>
              <p style="margin:0 0 20px;color:#5C4D3C;font-size:15px;line-height:1.7;">
                Hi there,<br><br>
                Thank you for requesting <em>10 Verses for Screen-Free Family Time</em>. This is a beautifully designed KJV devotional you can print at home and put on your fridge, homeschool table, or nightstand.
              </p>
              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;">
                <tr>
                  <td align="center">
                    <a href="https://faithwall.deadhidden.org/faithwall-10-verses-printable.pdf" style="display:inline-block;background:linear-gradient(135deg,#D4A843,#A67C2E);color:#1A1210;padding:16px 36px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;">Download Your Printable →</a>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0;color:#5C4D3C;font-size:14px;line-height:1.7;">
                Each page includes a handpicked KJV verse with a reflection prompt designed to help your family choose Scripture over scrolling. One verse for each day you choose presence over distraction.
              </p>
              <!-- FaithWall mention -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0;background:#FDF8F0;border-radius:12px;border-left:4px solid #D4A843;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0;color:#3D2B1F;font-size:14px;line-height:1.7;">
                      <strong>FaithWall launches soon.</strong> While you're building your wall with these verses, we're putting the final bricks in place. Become a <strong>Founding Family</strong> and get lifetime access for just <strong>$29.99</strong> (individual) or <strong>$39.99</strong> (whole family). No subscriptions. Ever.<br><br>
                      <a href="https://faithwall.deadhidden.org/#pricing" style="color:#C4453A;font-weight:bold;">Learn more about Founding Family pricing →</a>
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;color:#5C4D3C;font-size:14px;line-height:1.7;font-style:italic;">
                "So built we the wall; and all the wall was joined together... for the people had a mind to work."<br>
                <span style="color:#D4A843;font-style:normal;font-weight:bold;">— Nehemiah 4:6</span>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 30px;text-align:center;border-top:1px solid #E8E0D4;">
              <p style="margin:0;color:#8C7B6B;font-size:12px;">FaithWall • <a href="https://faithwall.deadhidden.org" style="color:#B94E48;">faithwall.deadhidden.org</a></p>
              <p style="margin:4px 0 0;color:#8C7B6B;font-size:11px;">Questions? Reply to this email or <a href="mailto:adam@deadhidden.org" style="color:#B94E48;">adam@deadhidden.org</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
        text: `Your 10 Verses Printable is here

Hi there,

Thank you for requesting 10 Verses for Screen-Free Family Time. Download your printable here:
https://faithwall.deadhidden.org/faithwall-10-verses-printable.pdf

Each page includes a handpicked KJV verse with a reflection prompt designed to help your family choose Scripture over scrolling. Print it, put it on your fridge or homeschool table, and build your wall — one verse at a time.

FAITHWALL LAUNCHES SOON
While you're building your wall with these verses, FaithWall is almost ready. Lock in Founding Family pricing:
- Individual: $29.99 (lifetime)
- Family (up to 10): $39.99 (lifetime)
https://faithwall.deadhidden.org/#pricing

No subscriptions. No monthly fees. Pay once, build your wall forever.

"So built we the wall... for the people had a mind to work." — Nehemiah 4:6

FaithWall | faithwall.deadhidden.org
Questions? adam@deadhidden.org`,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return res.status(200).json({ ok: true, note: 'Signed up' });
    }

    const data = await response.json();
    console.log('Lead magnet sent to:', email);
    return res.status(200).json({ ok: true, emailId: data.id });

  } catch (err) {
    console.error('Error:', err);
    return res.status(200).json({ ok: true });
  }
}
