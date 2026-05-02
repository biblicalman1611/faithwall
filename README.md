# FaithWall — Claude Handoff

## Answers to Your Questions

### 1. Where is the code?
**Right here in this folder.** The zip is at `/mnt/agents/output/faithwall-export.zip` — download it, unzip it, and you'll have the full project. This is a complete, self-contained project ready for `git init`.

### 2. Separate repo from deadhidden?
**Yes, separate repo.** Claude's right — different Vercel project, different domain, different concerns. Do NOT put this in the deadhidden repo.

### 3. Resend domain verified?
**Yes, already done.** `deadhidden.org` is verified in Resend (you already send from `noreply@deadhidden.org`). The new sending address `adam@deadhidden.org` just needs to be added as a sender if it isn't already.

### 4. Subdomain: faithwall.deadhidden.org?
**Yes.** Subdomain of deadhidden.org via IONOS DNS. CNAME to Vercel is straightforward. **No, you don't need faithwall.app** — we scrubbed that from the code. faithwall.deadhidden.org is the only domain referenced everywhere.

---

## What to Do Right Now

```bash
# 1. Unzip
unzip faithwall-export.zip

# 2. Enter the folder
cd faithwall-export

# 3. Install deps
npm install

# 4. Git init + push to GitHub
git init
git add .
git commit -m "FaithWall product launch"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/faithwall.git
git push -u origin main

# 5. Deploy to Vercel
vercel --prod

# 6. Add environment variable in Vercel dashboard:
# RESEND_API_KEY = your_resend_api_key

# 7. Point domain in Vercel:
# Projects → faithwall → Settings → Domains → Add: faithwall.deadhidden.org
# Then in IONOS: DNS → Add CNAME that Vercel gives you
```

---

## Project Structure

```
faithwall-export/
├── api/
│   ├── create-checkout-session.js     # Stripe checkout session
│   ├── stripe-webhook.js              # Stripe purchase email webhook
│   └── emails/
│       └── purchase-welcome.js        # Purchase confirmation email
├── src/
│   ├── components/
│   │   ├── PricingSection.tsx         # 3-tier pricing with Stripe
│   │   └── ui/                        # 40+ shadcn/ui components
│   ├── config/
│   │   └── stripe.ts                  # LIVE Stripe keys
│   ├── pages/
│   │   ├── CancelPage.tsx             # Cancelled checkout
│   │   ├── DemoApp.tsx                # FaithWall web room
│   │   ├── SuccessPage.tsx            # Post-purchase
│   ├── App.tsx                        # Main app — all landing page sections
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Custom styles + animations
├── faithwall-emails/                  # Email templates for launch
│   ├── substack-launch-biblicalman.md
│   ├── substack-launch-biblicalwomanhood.md
│   ├── substack-launch-deadhidden.md
│   └── purchase-welcome.js
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── vercel.json                        # Vercel routing + API config
└── README.md
```

---

## Environment Variables

| Variable | Value | Where |
|----------|-------|-------|
| `RESEND_API_KEY` | Private Resend API key | Add to Vercel dashboard |
| `STRIPE_SECRET_KEY` | Private Stripe secret key | Add to Vercel dashboard |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Add after creating the webhook endpoint |
| `FAITHWALL_APP_URL` | `https://faithwall.deadhidden.org` | Add to Vercel dashboard |

### Setting in Vercel:
1. Vercel dashboard → Project → Settings → Environment Variables
2. Add the private values above
3. Save → Redeploy

### Already configured in the repo:
- `.env.example` — template showing the expected variable names
- `.gitignore` — `.env.local` and `.env` are gitignored (key won't leak)

### Stripe keys:
The frontend has the publishable key only, which is safe for browser use. Server checkout and webhooks use private Vercel environment variables.

---

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Stripe Checkout + Payment Link fallback
- Stripe webhook purchase emails
- Resend email API via Vercel serverless function
- 40+ shadcn/ui components pre-installed

---

## No Beta, No Placeholder Branding

Your wife was right — this is a **product launch**, not a beta. Customer-facing copy now avoids old beta-language, third-party branding, and placeholder hooks:
- old beta CTA language
- "kimi", "formspree", "fridge magnet"
- `faithwall.app` or `hello@` anywhere

All references point to:
- **Domain:** `faithwall.deadhidden.org`
- **Email:** `adam@deadhidden.org`
- **Product name:** FaithWall
- **Pricing:** $29.99 individual / $39.99 household (one-time Founding Family access)

---

## The Funnel

```
Substack reader clicks link
        ↓
faithwall.deadhidden.org
        ↓
Sales landing page
        ↓
OPTION A: "Get FaithWall — $29.99" → Stripe → $$
OPTION B: "Choose Founding Family Access" → Stripe Checkout/payment link → $$
        ↓
Purchase: Success page → FaithWall web room
Purchase webhook: Welcome email from adam@deadhidden.org
Buyer: Personal thank-you from your family
```

---

## Support Section

The "Support the Mission" section now points back to the confirmed Founding Family checkout choices instead of an unverified gift link.

---

## Substack Launch Emails

The 3 launch email templates are in `faithwall-emails/`:
- `substack-launch-biblicalman.md` — Strong, direct, calls men to lead
- `substack-launch-biblicalwomanhood.md` — Warm, sisterly, homeschool mom voice
- `substack-launch-deadhidden.md` — Edgy, counter-cultural, provocative

Copy-paste-ready. Just swap in your links.
