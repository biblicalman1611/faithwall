/**
 * FaithWall Purchase Welcome Email
 * Fires immediately after someone completes their purchase via Stripe
 *
 * Usage:
 *   import { getPurchaseWelcomeEmail } from './purchase-welcome.js';
 *   const { subject, html, text } = getPurchaseWelcomeEmail(email, tier);
 *
 * Parameters:
 *   email  — the purchaser's email address
 *   tier   — 'individual' ($29.99) or 'family' ($39.99)
 */

export function getPurchaseWelcomeEmail(email, tier) {
  const price = tier === "family" ? "$39.99" : "$29.99";
  const tierLabel = tier === "family" ? "Family" : "Individual";

  const subject = "Welcome to FaithWall, Founding Family";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to FaithWall</title>
  <style>
    /* Resets */
    body, table, td, p { margin: 0; padding: 0; }
    body { background-color: #F9F6F1; font-family: Georgia, 'Times New Roman', serif; }
    a { color: #8B5E3C; text-decoration: underline; }
    /* Container */
    .wrap { width: 100%; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; }
    /* Header */
    .header { background-color: #5C3D2E; padding: 32px 24px; text-align: center; }
    .header h1 { color: #E8D5B5; font-size: 28px; letter-spacing: 0.5px; margin: 0; }
    .header p { color: #C9A87C; font-size: 14px; margin-top: 6px; font-style: italic; }
    /* Body */
    .body { padding: 32px 28px; color: #3E2723; }
    .body p { font-size: 17px; line-height: 1.7; margin-bottom: 18px; }
    .greeting { font-size: 20px; font-weight: bold; color: #5C3D2E; margin-bottom: 22px; }
    /* Features list */
    .features { background-color: #F3EDE4; border-radius: 8px; padding: 22px 24px; margin: 24px 0; }
    .features h3 { font-size: 16px; color: #5C3D2E; margin: 0 0 14px 0; text-transform: uppercase; letter-spacing: 0.8px; }
    .features ul { margin: 0; padding-left: 20px; }
    .features li { font-size: 15px; line-height: 1.8; color: #4E342E; margin-bottom: 6px; }
    .features li span { color: #7A9E6E; font-weight: bold; margin-right: 4px; }
    /* Download card */
    .download { background-color: #EAF0E6; border-left: 4px solid #7A9E6E; padding: 20px 22px; margin: 24px 0; border-radius: 0 8px 8px 0; }
    .download p { margin: 0 0 14px 0; font-size: 16px; }
    .btn { display: inline-block; background-color: #7A9E6E; color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 15px; font-weight: bold; letter-spacing: 0.3px; }
    .btn:hover { background-color: #6B8F5E; }
    /* Divider */
    .divider { border: none; border-top: 1px solid #E0D5C7; margin: 28px 0; }
    /* Personal sign-off */
    .signoff { font-style: italic; color: #6D4C41; }
    .signature { margin-top: 4px; font-weight: bold; color: #5C3D2E; }
    /* Footer */
    .footer { background-color: #5C3D2E; padding: 24px; text-align: center; color: #C9A87C; font-size: 13px; line-height: 1.6; }
    .footer a { color: #E8D5B5; }
    /* Mobile */
    @media screen and (max-width: 480px) {
      .body { padding: 24px 18px !important; }
      .header h1 { font-size: 24px !important; }
    }
  </style>
</head>
<body>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <div class="wrap">

          <!-- Header -->
          <div class="header">
            <h1>FaithWall</h1>
            <p>Scripture before scrolling.</p>
          </div>

          <!-- Body -->
          <div class="body">
            <p class="greeting">Welcome to the wall, Founding Family.</p>

            <p>Your purchase is confirmed.</p>

            <p><strong>${tierLabel} Plan — ${price}</strong> (one-time, lifetime access)</p>

            <p>You just made one of the best investments you can make for your family&rsquo;s attention. No more mindless scrolling. No more failed screen-time limits that your kids learn to work around. Just a wall built on Scripture &mdash; and you&rsquo;re on the inside of it.</p>

            <div class="features">
              <h3>What&rsquo;s Included With Your Purchase</h3>
              <ul>
                <li><span>&check;</span> Unlimited screen-locking modes</li>
                <li><span>&check;</span> All verse packs (plus future packs at no extra cost)</li>
                <li><span>&check;</span> Screen time tracking and daily reports</li>
                <li><span>&check;</span> Family sharing across all devices</li>
                <li><span>&check;</span> Lifetime updates for as long as FaithWall exists</li>
              </ul>
            </div>

            <p><strong>Your download link will arrive via email as soon as FaithWall launches on the App Store and Google Play.</strong> We&rsquo;re putting the final polish on now, and Founding Family members like you will be the very first to get access.</p>

            <hr class="divider" />

            <p class="signoff">Have questions? Reply to this email &mdash; I read every one.</p>
            <p class="signature">Adam<br/>FaithWall</p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>You&rsquo;re receiving this because you purchased FaithWall.<br/>Questions? <a href="mailto:adam@deadhidden.org">adam@deadhidden.org</a></p>
            <p style="margin-top: 8px; font-size: 12px; color: #A89078;">FaithWall &mdash; Scripture before scrolling.<br/><a href="https://faithwall.deadhidden.org">faithwall.deadhidden.org</a></p>
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Welcome to the wall, Founding Family.

Your purchase is confirmed.

${tierLabel} Plan — ${price} (one-time, lifetime access)

You just made one of the best investments you can make for your family's attention. No more mindless scrolling. No more failed screen-time limits that your kids learn to work around. Just a wall built on Scripture — and you're on the inside of it.

WHAT'S INCLUDED WITH YOUR PURCHASE:

✓ Unlimited screen-locking modes
✓ All verse packs (plus future packs at no extra cost)
✓ Screen time tracking and daily reports
✓ Family sharing across all devices
✓ Lifetime updates for as long as FaithWall exists

Your download link will arrive via email as soon as FaithWall launches on the App Store and Google Play. We're putting the final polish on now, and Founding Family members like you will be the very first to get access.

—

—

Have questions? Reply to this email — I read every one.

Adam
FaithWall

—

You're receiving this because you purchased FaithWall.
Questions? adam@deadhidden.org

FaithWall — Scripture before scrolling.
https://faithwall.deadhidden.org`;

  return { subject, html, text };
}
