import {
  Check, X, Infinity, Lock, Users,
  Shield, Zap, ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { STRIPE_PUBLISHABLE_KEY, PRICE_INDIVIDUAL, PRICE_FAMILY } from '../config/stripe';


interface PricingSectionProps {
  onGetPrintable: () => void;
}

function FeatureItem({ children, bold }: { children: React.ReactNode; bold?: boolean }) {
  return (
    <li className="flex items-start gap-2 text-sm py-1">
      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${bold ? 'text-[#D4A843]' : 'text-green-600'}`} />
      <span className={bold ? 'font-semibold text-[#3D2B1F]' : 'text-[#5C4D3C]'}>{children}</span>
    </li>
  );
}

function MiniFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: 'Why is launch pricing so cheap?', a: 'Founding Families help us fund development and shape the app. Full price at launch will be $59.99+.' },
    { q: 'What happens after I pay?', a: "You'll get download instructions via email when FaithWall launches. Plus your free printable right away." },
    { q: 'Can I upgrade later?', a: 'Yes, but at full launch price. $29.99/$39.99 is only for Founding Families.' },
  ];
  return (
    <div className="max-w-lg mx-auto mt-8 space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-[#E8E0D4] rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/10 transition-colors"
          >
            <span className="text-sm font-medium text-white">{item.q}</span>
            <ChevronDown className={`w-4 h-4 text-[#C4BFB5] shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && (
            <div className="px-4 pb-3 text-sm text-[#E8E0D4] border-t border-white/10 pt-2">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PricingSection({ onGetPrintable }: PricingSectionProps) {
  const [loading, setLoading] = useState<'individual' | 'family' | null>(null);

  const handleCheckout = async (priceId: string, type: 'individual' | 'family') => {
    if (STRIPE_PUBLISHABLE_KEY.includes('REPLACE')) {
      alert('Stripe needs to be configured. Add your Stripe keys in src/config/stripe.ts — takes 2 minutes!');
      return;
    }

    setLoading(type);
    try {
      if (!(window as any).Stripe) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://js.stripe.com/v3/';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Stripe'));
          document.head.appendChild(script);
        });
      }

      const stripe = (window as any).Stripe(STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: `${window.location.origin}?page=success`,
        cancelUrl: `${window.location.origin}?page=cancel`,
      });

      if (error) {
        console.error('Stripe error:', error);
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Could not start checkout. Make sure you have configured your Stripe keys.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-[#C4453A] to-[#8B3A36]">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-white text-center mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Choose Your Wall
        </h2>
        <p className="text-center text-white/80 mb-12">
          Free forever to start. Upgrade when you are ready.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FREE */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-xs font-bold text-[#8C7B6B] uppercase tracking-wider mb-2">Free</div>
            <div className="text-4xl font-bold text-[#3D2B1F] mb-1">$0</div>
            <div className="text-sm text-[#8C7B6B] mb-4">Forever</div>
            <div className="inline-block bg-[#E8E0D4] text-[#5C4D3C] text-xs font-bold px-3 py-1 rounded-full mb-4">
              COMING SOON
            </div>
            <ul className="space-y-1 mb-6">
              <FeatureItem>3 Wall Modes</FeatureItem>
              <FeatureItem>Daily Verse of the Day</FeatureItem>
              <FeatureItem>Basic screen time tracking</FeatureItem>
              <FeatureItem>Basic wall progress</FeatureItem>
              <FeatureItem>3 emergency unlocks/month</FeatureItem>
              <FeatureItem>KJV & WEB translations</FeatureItem>
              <FeatureItem>Solo only</FeatureItem>
              <li className="flex items-start gap-2 text-sm py-1 text-[#C4BFB5]">
                <X className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Family sharing</span>
              </li>
              <li className="flex items-start gap-2 text-sm py-1 text-[#C4BFB5]">
                <X className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Advanced stats</span>
              </li>
              <li className="flex items-start gap-2 text-sm py-1 text-[#5C4D3C]">
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-green-600" />
                <span>Core features available at launch</span>
              </li>
            </ul>
            <button
              onClick={onGetPrintable}
              className="w-full py-3 border-2 border-[#C4453A] text-[#C4453A] font-bold rounded-xl hover:bg-[#C4453A]/5 transition-colors"
            >
              Get the Free Printable
            </button>
          </div>

          {/* INDIVIDUAL — HIGHLIGHTED */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl border-2 border-[#D4A843] relative transform md:-translate-y-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4A843] to-[#A67C2E] text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
              50% OFF — LAUNCH PRICE
            </div>
            <div className="text-xs font-bold text-[#8C7B6B] uppercase tracking-wider mb-2">Founding Family</div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-[#3D2B1F]">$29.99</span>
              <span className="text-lg text-[#C4BFB5] line-through">$59.99</span>
            </div>
            <div className="text-sm text-[#8C7B6B] mb-3">One-time. Lifetime access.</div>
            <div className="text-xs text-[#C4453A] font-semibold mb-4">
              Founding Family pricing — limited spots
            </div>
            <ul className="space-y-1 mb-6">
              <FeatureItem bold>Everything in Free</FeatureItem>
              <FeatureItem bold><Infinity className="w-3.5 h-3.5 inline mr-1" />Unlimited Wall Modes</FeatureItem>
              <FeatureItem>All 30+ Verse Packs</FeatureItem>
              <FeatureItem>Full screen time reports + trends</FeatureItem>
              <FeatureItem>Advanced wall analytics</FeatureItem>
              <FeatureItem><Lock className="w-3.5 h-3.5 inline mr-1" />10 emergency unlocks/month</FeatureItem>
              <FeatureItem>All translations (KJV, WEB, BSB)</FeatureItem>
              <FeatureItem>Lifetime updates — forever</FeatureItem>
              <FeatureItem>Founding Family badge</FeatureItem>
            </ul>
            <button
              onClick={() => handleCheckout(PRICE_INDIVIDUAL, 'individual')}
              disabled={loading === 'individual'}
              className="w-full py-4 bg-gradient-to-r from-[#C4453A] to-[#A63830] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading === 'individual' ? 'Loading...' : 'Buy Now — $29.99'}
            </button>
          </div>

          {/* FAMILY */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#C4453A]">
            <div className="text-xs font-bold text-[#8C7B6B] uppercase tracking-wider mb-2">Household</div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-[#3D2B1F]">$39.99</span>
              <span className="text-lg text-[#C4BFB5] line-through">$79.99</span>
            </div>
            <div className="text-sm text-[#8C7B6B] mb-3">One-time. Whole family.</div>
            <div className="inline-block bg-[#C4453A] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              BEST VALUE
            </div>
            <div className="text-xs text-[#C4453A] font-semibold mb-4">
              Best value for families
            </div>
            <ul className="space-y-1 mb-6">
              <FeatureItem bold>Everything in Individual</FeatureItem>
              <FeatureItem bold><Users className="w-3.5 h-3.5 inline mr-1" />Family sharing (up to 10)</FeatureItem>
              <FeatureItem>Shared family wall</FeatureItem>
              <FeatureItem>Shared family modes</FeatureItem>
              <FeatureItem><Shield className="w-3.5 h-3.5 inline mr-1" />Parent dashboard</FeatureItem>
              <FeatureItem><Zap className="w-3.5 h-3.5 inline mr-1" />Unlimited emergency unlocks</FeatureItem>
              <FeatureItem>Priority support</FeatureItem>
            </ul>
            <button
              onClick={() => handleCheckout(PRICE_FAMILY, 'family')}
              disabled={loading === 'family'}
              className="w-full py-4 bg-gradient-to-r from-[#C4453A] to-[#A63830] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading === 'family' ? 'Loading...' : 'Buy Now — $39.99'}
            </button>
          </div>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-white/80">
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure Stripe payment</span>
          <span className="flex items-center gap-1"><Check className="w-3 h-3" /> 30-day money-back guarantee</span>
          <span className="flex items-center gap-1"><Infinity className="w-3 h-3" /> Lifetime access, no subscriptions</span>
        </div>

        <MiniFAQ />
      </div>
    </section>
  );
}
