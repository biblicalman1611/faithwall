/**
 * STRIPE CONFIG — LIVE KEYS
 * Real money. Connected to Stripe account.
 * 
 * NOTE: For MVP, using one-time payment mode.
 * True annual subscription billing will be implemented via Stripe Billing in Phase 2.
 */

export const STRIPE_PUBLISHABLE_KEY = 'pk_live_51PeIdjLN6IypHVMVce7yFZF4aOnZ2xy0ciYJG2MAH0dTSalm3xrNdJM4C7DqSp8FijVcUXZHeANjsyQXNUVhsIK800VEbQ17M1';

// ANNUAL subscription prices (Stripe Dashboard: set these as recurring/annual)
export const PRICE_INDIVIDUAL = 'price_1TSP5vLN6IypHVMVrT4SsXqd';
export const PRICE_FAMILY = 'price_1TSP5wLN6IypHVMVPWLbEap1';

// Lifetime tier — create this in Stripe dashboard as $199 one-time
export const PRICE_LIFETIME = 'price_REPLACE_WITH_LIFETIME_PRICE_ID';

/**
 * Stripe Payment Links — hosted checkout pages.
 * Simpler than Stripe.js client-side checkout: no publishable key,
 * no client-only-checkout setting, Stripe handles subscription/payment mode.
 * Generate at https://dashboard.stripe.com/payment-links
 */
export const PAYMENT_LINKS = {
  individual: 'https://buy.stripe.com/aFa14ogEkefi2FUf7Nc3m0a',
  family: 'https://buy.stripe.com/3cIfZids87QU1BQaRxc3m0b',
  lifetime: '', // TODO: create $199 one-time Payment Link
} as const;

export const PRODUCTS = {
  individual: {
    name: 'FaithWall — Founding Family Individual',
    price: 29.99,
    originalPrice: 59.99,
    billing: 'annual',
  },
  family: {
    name: 'FaithWall — Founding Family Household',
    price: 39.99,
    originalPrice: 79.99,
    billing: 'annual',
  },
  lifetime: {
    name: 'FaithWall — Lifetime Founding Family',
    price: 199.00,
    originalPrice: 299.00,
    billing: 'one-time',
  },
};
