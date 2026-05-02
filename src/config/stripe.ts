/**
 * STRIPE CONFIG — LIVE KEYS
 * Real money. Connected to Stripe account.
 * 
 * NOTE: Current Founding Family checkout uses one-time payment mode.
 * If FaithWall later moves to recurring subscriptions, create recurring prices
 * in Stripe and update the pricing copy at the same time.
 */

export const STRIPE_PUBLISHABLE_KEY = 'pk_live_51PeIdjLN6IypHVMVce7yFZF4aOnZ2xy0ciYJG2MAH0dTSalm3xrNdJM4C7DqSp8FijVcUXZHeANjsyQXNUVhsIK800VEbQ17M1';

// One-time Founding Family prices.
export const PRICE_INDIVIDUAL = 'price_1TSP5vLN6IypHVMVrT4SsXqd';
export const PRICE_FAMILY = 'price_1TSP5wLN6IypHVMVPWLbEap1';

/**
 * Stripe Payment Links — hosted checkout pages.
 * Simpler than Stripe.js client-side checkout: no publishable key,
 * no client-only-checkout setting, Stripe handles payment mode.
 * Generate at https://dashboard.stripe.com/payment-links
 */
export const PAYMENT_LINKS = {
  individual: 'https://buy.stripe.com/aFa14ogEkefi2FUf7Nc3m0a',
  family: 'https://buy.stripe.com/3cIfZids87QU1BQaRxc3m0b',
} as const;

export const PRODUCTS = {
  individual: {
    name: 'FaithWall — Founding Family Individual',
    price: 29.99,
    originalPrice: 59.99,
    billing: 'one-time',
  },
  family: {
    name: 'FaithWall — Founding Family Household',
    price: 39.99,
    originalPrice: 79.99,
    billing: 'one-time',
  },
};
