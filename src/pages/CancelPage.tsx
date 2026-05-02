import { Heart, ArrowLeft } from 'lucide-react';

interface CancelPageProps {
  onBackToPricing?: () => void;
}

export default function CancelPage({ onBackToPricing }: CancelPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F0] to-[#F5EDE0] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-[#F5EDE0] rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-[#C4453A]" />
        </div>

        <h1
          className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          No worries — grace abounds.
        </h1>
        <p className="text-[#8C7B6B] mb-8">
          The Founding Family pricing is here when you are ready.
        </p>

        <button
          onClick={() => {
            if (onBackToPricing) onBackToPricing();
            else window.location.search = '';
          }}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-[#C4453A] text-[#C4453A] font-bold rounded-2xl hover:bg-[#C4453A]/5 transition-colors mx-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Pricing
        </button>

        <p className="mt-8 text-xs text-[#8C7B6B]">
          Questions? Email us at{' '}
          <a href="mailto:adam@deadhidden.org" className="text-[#C4453A] hover:underline">
            adam@deadhidden.org
          </a>
        </p>
      </div>
    </div>
  );
}
