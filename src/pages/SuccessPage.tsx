import { useEffect, useState } from 'react';
import { Check, Copy, Facebook, Mail } from 'lucide-react';

export default function SuccessPage() {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://faithwall.deadhidden.org';
  const shareText = 'I just joined FaithWall as a Founding Family member! Lock distracting apps, unlock with Scripture, build your family wall. Join me:';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleShareEmail = () => {
    const subject = 'Join me on FaithWall!';
    const body = `${shareText}\n\n${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F0] to-[#F5EDE0] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>

        <h1
          className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Welcome to the Wall, Founding Family!
        </h1>
        <p className="text-[#8C7B6B] mb-8">
          Your payment was successful. Your Founding Family annual subscription is active.
        </p>

        {/* Next steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D4] p-6 mb-8 text-left">
          <h3 className="font-bold text-[#3D2B1F] mb-4">What happens next:</h3>
          <p className="text-sm text-[#5C4D3C]">
            You now have full access to FaithWall. Check your email for login instructions.
          </p>
        </div>

        {/* Share section */}
        <div className="mb-8">
          <h3 className="font-bold text-[#3D2B1F] mb-3">Share FaithWall with friends</h3>
          <p className="text-sm text-[#8C7B6B] mb-4">
            Know a mom who needs this? Spread the word 🧱
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E0D4] rounded-xl text-sm text-[#3D2B1F] hover:bg-[#F5EDE0] transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleShareFacebook}
              className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-xl text-sm hover:bg-[#166fe5] transition-colors"
            >
              <Facebook className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handleShareEmail}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E8E0D4] rounded-xl text-sm text-[#3D2B1F] hover:bg-[#F5EDE0] transition-colors"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-[#8C7B6B]">
          Have questions? Email us at{' '}
          <a href="mailto:adam@deadhidden.org" className="text-[#C4453A] hover:underline">
            adam@deadhidden.org
          </a>
        </p>
      </div>
    </div>
  );
}
