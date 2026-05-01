/**
 * FaithWall Lead Magnet Welcome Email
 * Fires when someone requests the free "10 Verses" printable (not a purchase)
 *
 * Usage:
 *   import { getLeadMagnetEmail } from './lead-magnet-welcome.js';
 *   const { subject, html, text } = getLeadMagnetEmail(email);
 *
 * Parameters:
 *   email — the subscriber's email address
 *
 * Returns:
 *   { subject, html, text }
 */

export function getLeadMagnetEmail(email) {
  const subject = "Your 10 Verses Printable is here";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your 10 Verses Printable</title>
  <style>
    body, table, td, p { margin: 0; padding: 0; }
    body { background-color: #F9F6F1; font-family: Georgia, 'Times New Roman', serif; }
    a { color: #8B5E3C; text-decoration: underline; }
    .wrap { width: 100%; max-width: 600px; margin: 0 auto; background-color: #FDFBF7; }
    .header { background-color: #5C3D2E; padding: 32px 24px; text-align: center; }
    .header h1 { color: #E8D5B5; font-size: 28px; letter-spacing: 0.5px; margin: 0; }
    .header p { color: #C9A87C; font-size: 14px; margin-top: 6px; font-style: italic; }
    .body { padding: 32px 28px; color: #3E2723; }
    .body p { font-size: 17px; line-height: 1.7; margin-bottom: 18px; }
    .greeting { font-size: 20px; font-weight: bold; color: #5C3D2E; margin-bottom: 22px; }
    .download { background-color: #EAF0E6; border-left: 4px solid #7A9E6E; padding: 20px 22px; margin: 24px 0; border-radius: 0 8px 8px 0; }
    .download p { margin: 0 0 14px 0; font-size: 16px; }
    .btn { display: inline-block; background-color: #7A9E6E; color: #FFFFFF !important; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 15px; font-weight: bold; letter-spacing: 0.3px; }
    .btn:hover { background-color: #6B8F5E; }
    .divider { border: none; border-top: 1px solid #E0D5C7; margin: 28px 0; }
    .fw-preview { background-color: #F3EDE4; border-radius: 8px; padding: 22px 24px; margin: 24px 0; }
    .fw-preview h3 { font-size: 16px; color: #5C3D2E; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.8px; }
    .fw-preview p { font-size: 15px; line-height: 1.7; color: #4E342E; margin-bottom: 14px; }
    .price { font-size: 18px; font-weight: bold; color: #5C3D2E; }
    .signoff { font-style: italic; color: #6D4C41; }
    .signature { margin-top: 4px; font-weight: bold; color: #5C3D2E; }
    .footer { background-color: #5C3D2E; padding: 24px; text-align: center; color: #C9A87C; font-size: 13px; line-height: 1.6; }
    .footer a { color: #E8D5B5; }
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
            <p class="greeting">Hi there, friend.</p>

            <p>Thank you for downloading the <strong>"10 Verses to Build Your Family Wall"</strong> printable. This little collection has been an anchor for our family, and I pray it becomes one for yours too.</p>

            <div class="download">
              <p>Your printable is ready. Click below to download the PDF:</p>
              <p><a href="https://faithwall.deadhidden.org/faithwall-10-verses-printable.pdf" class="btn">Download My Printable</a></p>
            </div>

            <p>Print it out. Tape it to the fridge. Put a copy on the bathroom mirror. Read these verses with your kids at breakfast. Let them sink in. The wall starts with a single brick.</p>

            <hr class="divider" />

            <div class="fw-preview">
              <h3>While You're Building Your Wall...</h3>
              <p>FaithWall launches soon — a screen-locking app that puts <strong>Scripture before scrolling</strong>. Every time you reach for the apps that eat your time, you'll meet a verse first. A pause. A reminder of who you are and who you belong to.</p>
              <p>Lock any app. Set family modes for every device in your home. Track your screen time. All verse packs included, with new ones added forever.</p>
              <p class="price">$29.99 individual &nbsp;|&nbsp; $39.99 family — lifetime, no subscription</p>
              <p style="margin-top: 14px;"><a href="https://faithwall.deadhidden.org" class="btn">Join the Founding Family</a></p>
            </div>

            <hr class="divider" />

            <p class="signoff">Reply to this email if you have any questions — I read every one.</p>
            <p class="signature">Adam<br/>FaithWall</p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>You&rsquo;re receiving this because you requested the free printable.<br/>Questions? <a href="mailto:adam@deadhidden.org">adam@deadhidden.org</a></p>
            <p style="margin-top: 8px; font-size: 12px; color: #A89078;">FaithWall &mdash; Scripture before scrolling.<br/><a href="https://faithwall.deadhidden.org">faithwall.deadhidden.org</a></p>
          </div>

        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Hi there, friend.

Thank you for downloading the "10 Verses to Build Your Family Wall" printable. This little collection has been an anchor for our family, and I pray it becomes one for yours too.

YOUR DOWNLOAD LINK:
https://faithwall.deadhidden.org/faithwall-10-verses-printable.pdf

Print it out. Tape it to the fridge. Put a copy on the bathroom mirror. Read these verses with your kids at breakfast. Let them sink in. The wall starts with a single brick.

---

WHILE YOU'RE BUILDING YOUR WALL...

FaithWall launches soon — a screen-locking app that puts Scripture before scrolling. Every time you reach for the apps that eat your time, you'll meet a verse first. A pause. A reminder of who you are and who you belong to.

Lock any app. Set family modes for every device in your home. Track your screen time. All verse packs included, with new ones added forever.

$29.99 individual | $39.99 family — lifetime, no subscription

Join the Founding Family: https://faithwall.deadhidden.org

---

Reply to this email if you have any questions — I read every one.

Adam
FaithWall

---

You're receiving this because you requested the free printable.
Questions? adam@deadhidden.org

FaithWall — Scripture before scrolling.
https://faithwall.deadhidden.org`;

  return { subject, html, text };
}
