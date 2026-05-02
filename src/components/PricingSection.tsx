import {
  Check, Lock, Users,
  Shield, Zap, ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { PAYMENT_LINKS } from '../config/stripe';


interface PricingSectionProps {}

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
    { q: 'Why is Founding Family pricing so low?', a: 'This is early-access pricing while FaithWall is being built in public. Your one-time purchase helps fund the web app, the native iOS/Android app, and family features.' },
    { q: 'What happens after I pay?', a: "Stripe confirms your purchase, then you can open the FaithWall web room right away. You'll also be first in line for the native app releases." },
    { q: 'Is this a subscription?', a: 'No. The live checkout links are one-time Founding Family purchases: $29.99 individual or $39.99 household.' },
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

export default function PricingSection(_: PricingSectionProps) {
  const [loading, setLoading] = useState<'individual' | 'family' | null>(null);

  const handleCheckout = async (type: 'individual' | 'family') => {
    setLoading(type);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: type }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }
    } catch {
      // Fall back to Stripe Payment Links when the server checkout endpoint is not configured yet.
    }

    const url = PAYMENT_LINKS[type];
    if (url) {
      window.location.href = url;
      return;
    }

    setLoading(null);
    alert('Checkout is being connected. Email adam@deadhidden.org and we will get you set up.');
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
          One-time Founding Family access. No subscription. Help build the native app while using the web room today.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* INDIVIDUAL — HIGHLIGHTED */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl border-2 border-[#D4A843] relative transform md:-translate-y-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4A843] to-[#A67C2E] text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
              50% OFF — FOUNDING FAMILY
            </div>
            <div className="text-xs font-bold text-[#8C7B6B] uppercase tracking-wider mb-2">Founding Family</div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-[#3D2B1F]">$29.99</span>
              <span className="text-lg text-[#C4BFB5] line-through">$59.99</span>
            </div>
            <div className="text-sm text-[#8C7B6B] mb-3">One-time early-access purchase.</div>
            <div className="text-xs text-[#C4453A] font-semibold mb-4">
              Founding Family price
            </div>
            <ul className="space-y-1 mb-6">
              <FeatureItem bold>Immediate FaithWall web room access</FeatureItem>
              <FeatureItem bold>Scripture unlock flow and wall progress</FeatureItem>
              <FeatureItem>Manual screen-time check-ins</FeatureItem>
              <FeatureItem>Buyer updates as the native apps ship</FeatureItem>
              <FeatureItem>First access to iOS and Android builds</FeatureItem>
              <FeatureItem>Founding Family updates</FeatureItem>
            </ul>
            <button
              onClick={() => handleCheckout('individual')}
              disabled={loading === 'individual'}
              className="w-full py-4 bg-gradient-to-r from-[#C4453A] to-[#A63830] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading === 'individual' ? 'Loading...' : 'Join — $29.99'}
            </button>
          </div>

          {/* FAMILY */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#C4453A]">
            <div className="text-xs font-bold text-[#8C7B6B] uppercase tracking-wider mb-2">Household</div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-[#3D2B1F]">$39.99</span>
              <span className="text-lg text-[#C4BFB5] line-through">$79.99</span>
            </div>
            <div className="text-sm text-[#8C7B6B] mb-3">One-time household early access.</div>
            <div className="inline-block bg-[#C4453A] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              BEST VALUE
            </div>
            <div className="text-xs text-[#C4453A] font-semibold mb-4">
              Founding household price
            </div>
            <ul className="space-y-1 mb-6">
              <FeatureItem bold>Everything in Individual</FeatureItem>
              <FeatureItem bold><Users className="w-3.5 h-3.5 inline mr-1" />Household access for your family</FeatureItem>
              <FeatureItem>Shared family wall in the web room</FeatureItem>
              <FeatureItem>Family modes as they ship</FeatureItem>
              <FeatureItem><Shield className="w-3.5 h-3.5 inline mr-1" />Parent dashboard priority access</FeatureItem>
              <FeatureItem><Zap className="w-3.5 h-3.5 inline mr-1" />Native app beta priority</FeatureItem>
              <FeatureItem>Founding Family updates</FeatureItem>
              <FeatureItem>Priority support</FeatureItem>
            </ul>
            <button
              onClick={() => handleCheckout('family')}
              disabled={loading === 'family'}
              className="w-full py-4 bg-gradient-to-r from-[#C4453A] to-[#A63830] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading === 'family' ? 'Loading...' : 'Join Household — $39.99'}
            </button>
          </div>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-white/80">
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure Stripe payment</span>
          <span className="flex items-center gap-1"><Check className="w-3 h-3" /> All sales final</span>
          <span className="flex items-center gap-1"><Check className="w-3 h-3" /> One-time Founding Family access</span>
        </div>

        <MiniFAQ />
      </div>
    </section>
  );
}
