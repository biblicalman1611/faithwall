import { useEffect, useState } from 'react';
import { Check, Copy, Facebook, Mail } from 'lucide-react';

export default function ThanksPage() {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'https://faithwall.deadhidden.org';
  const shareText = 'I just got the "10 Verses for Screen-Free Family Time" printable from FaithWall! Beautiful KJV devotional you can print at home. Get yours:';

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
    const subject = 'Printable: 10 Verses for Screen-Free Family Time';
    const body = `${shareText}\n\n${shareUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F0] to-[#F5EDE0] flex flex-col items-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Check className="w-12 h-12 text-white" strokeWidth={3} />
        </div>

        {/* Headline */}
        <h1
          className="text-4xl md:text-5xl font-bold text-[#3D2B1F] mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Your Printable is on Its Way!
        </h1>
        <p className="text-lg text-[#8C7B6B] mb-2">
          Check your email for the &quot;10 Verses for Screen-Free Family Time&quot; PDF.
        </p>

        {/* Launch notice */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D4] p-4 mb-8 mt-6">
          <p className="text-sm text-[#5C4D3C]">
            FaithWall is live now in your browser. Full app access coming to your inbox.
          </p>
        </div>

        {/* Share section */}
        <div className="mb-8">
          <h3 className="font-bold text-[#3D2B1F] mb-3">While you wait, share this with a mom who needs it</h3>
          <p className="text-sm text-[#8C7B6B] mb-4">
            Every homeschool mom needs Scripture-based tools for her family 🧱
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

        {/* Footer */}
        <div className="text-sm text-[#8C7B6B] space-y-2">
          <p>
            Questions?{' '}
            <a href="mailto:adam@deadhidden.org" className="text-[#C4453A] hover:underline font-medium">
              adam@deadhidden.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
