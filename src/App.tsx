import { useEffect, useState } from 'react';
import {
  Shield, BookOpen, Users, TrendingDown, TrendingUp,
  Flame, Check, Menu, XIcon, ChevronDown, Lock,
  Smartphone, Heart, AlertTriangle, Star, Zap, Gift
} from 'lucide-react';
import PricingSection from './components/PricingSection';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';
import DemoApp from './pages/DemoApp';

/* ───────── helpers ───────── */
const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

/* ───────── data ───────── */
const FAQS = [
  { q: 'What data do you collect?', a: 'Almost none. Your name, email, and wall progress (streak count). We do NOT track which apps you use, which verses you read, or your browsing history. Your Scripture time is between you and God.' },
  { q: 'Can you see what apps I use?', a: 'No. FaithWall uses Apple\'s Screen Time API and Android\'s Usage Stats — these tell us total screen time, but NOT what websites you visit or what you do inside apps. We only know you spent 45 minutes on Instagram, not what you looked at.' },
  { q: 'Is my kids\' data safe?', a: 'Yes. We\'re COPPA-compliant. Kids under 13 need parent consent. We don\'t collect location, contacts, photos, or any personal data from children\'s accounts. Their wall data belongs to your family.' },
  { q: 'How does the app blocking actually work?', a: 'On iPhone, we use Apple\'s official Screen Time API — the same system Apple built for parental controls. On Android, we use the Accessibility Service with your permission. You control what gets blocked and when. You can unblock anytime by completing a Scripture task or using an emergency unlock.' },
  { q: 'Will this slow down my phone?', a: 'No. FaithWall doesn\'t run in the background constantly. It activates only when you start a Wall Mode. When inactive, it uses virtually zero battery or processing power.' },
  { q: 'Does it work offline?', a: 'Yes! The core Bible content (KJV and WEB translations) is stored on your device. You can wall your phone, read verses, and track progress even without internet. Screen time sync happens when you\'re back online.' },
  { q: 'What if I need to make an emergency call?', a: 'Emergency calls (911) always work, even when your phone is walled. Phone, Messages, and Maps can be set as "always allowed" apps in your mode settings.' },
  { q: 'What Bible translations are available?', a: 'Starter tier: King James Version (KJV) and World English Bible (WEB) — both public domain. Premium: adds Berean Standard Bible (BSB). You can also open any verse in YouVersion for NIV, ESV, NKJV, and 2,000+ other translations.' },
  { q: 'Are the verses random or themed?', a: 'Both! Your daily verse is themed (Family, Peace, Strength, Homeschool, etc.). Quick unlock uses verses from your chosen theme pack. You can also set favorites or add custom verses.' },
  { q: 'Do I have to be a Christian to use this?', a: 'Not at all. FaithWall works for anyone who wants to reduce screen time through meaningful reflection. The Scripture content is there if you want it, but the app blocking and focus tools work regardless.' },
  { q: 'Can I set this up on my kids\' phones?', a: 'Yes! With a Family plan, you can invite up to 10 family members. Each person gets their own wall, but you can see family progress on the parent dashboard. Kids 8+ can use FaithWall with parent setup.' },
  { q: 'Can I control my kids\' walls from my phone?', a: 'Yes. The parent dashboard lets you see each family member\'s active mode, wall count, and screen time. You can also start a "Family Wall Mode" that applies to everyone\'s phone at once — perfect for dinner time or homeschool hours.' },
  { q: 'Won\'t my teenager just uninstall it?', a: 'We have layered protection. On iOS, Family Sharing prevents app removal without parent approval. On Android, Device Admin mode requires a password to uninstall. But honestly? The best protection is conversation. When teens see YOU building your wall, they\'re more likely to build theirs.' },
  { q: 'What do I get when I buy FaithWall?', a: "You get a full year of FaithWall — unlimited Wall Modes, all 30+ verse packs, screen time reports, family sharing, and every update we release during your subscription. Your Founding Family rate is locked in: pay $29.99/yr now, and that's your rate forever, even when regular price goes up." },
  { q: 'Is this a subscription?', a: 'Yes. FaithWall is an annual subscription. $29.99/yr for individual or $39.99/yr for your whole household. Cancel anytime. Prefer lifetime? $199 one-time.' },
  { q: 'What happens after I buy?', a: "You\'ll receive download instructions via email immediately after purchase. Your Founding Family membership includes all current and future features." },
  { q: 'Can I use FaithWall right away?', a: 'Yes. The web app works immediately in your browser. iOS and Android apps are rolling out to Founding Family members first.' },
  { q: 'Where does the screen time data come from?', a: 'iPhone: Apple\'s Screen Time API (built into iOS). Android: Android\'s Digital Wellbeing system. We show you the same data your phone already tracks — just organized to highlight your Scripture time vs. scrolling time.' },
  { q: 'Isn\'t this just replacing one addiction with another?', a: 'That\'s a fair question. The difference is intentionality. Doomscrolling is passive and endless — you lose track of time. Reading Scripture is active and time-bounded — 90 seconds, then you choose what to do next. Research shows that even brief moments of reflection reduce impulsive phone use over time.' },
  { q: 'What if I just read the verse quickly without thinking?', a: 'We\'ve all been there. That\'s why FaithWall has multiple task types — you can choose to type the verse from memory, write a prayer, or answer a reflection question. The goal isn\'t speed; it\'s presence. Even 90 seconds of intentional focus changes your brain\'s response to the scroll.' },
  { q: 'Doesn\'t this make me dependent on an app for self-control?', a: 'Think of it like training wheels. FaithWall provides external structure while you build internal discipline. Most users find they naturally reach for their Bible app before their social apps after 2-3 weeks. The wall becomes a habit, then a choice, then a way of life.' },
  { q: 'What if my kids see me bypassing the Scripture task?', a: 'Then they learn that Mom is human — and that\'s okay. But here\'s the thing: when you bypass, you see your streak break and your wall get a gap. That visual feedback is surprisingly motivating. Most parents tell us they complete the task because they don\'t want to show their kids a broken wall.' },
];

/* ───────── components ───────── */

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#FDF8F0]/95 backdrop-blur shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#C4453A]" />
          <span className="text-xl font-bold text-[#3D2B1F]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>FaithWall</span>
        </button>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5C4D3C]">
          <button onClick={() => scrollTo('how')} className="hover:text-[#C4453A] transition-colors">How It Works</button>
          <button onClick={() => scrollTo('screen-time')} className="hover:text-[#C4453A] transition-colors">Screen Time</button>
          <button onClick={() => scrollTo('family')} className="hover:text-[#C4453A] transition-colors">Family</button>
          <button onClick={() => scrollTo('pricing')} className="hover:text-[#C4453A] transition-colors">Pricing</button>
          <button onClick={() => scrollTo('faq')} className="hover:text-[#C4453A] transition-colors">FAQ</button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => scrollTo('pricing')} className="hidden sm:block px-5 py-2 bg-gradient-to-r from-[#C4453A] to-[#A63830] text-white text-sm font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all">
            Get FaithWall
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2">
            {open ? <XIcon className="w-5 h-5 text-[#3D2B1F]" /> : <Menu className="w-5 h-5 text-[#3D2B1F]" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-[#FDF8F0] border-t border-[#E8E0D4] px-4 py-4 space-y-3">
          <button onClick={() => { scrollTo('how'); setOpen(false); }} className="block w-full text-left text-sm text-[#5C4D3C] py-2">How It Works</button>
          <button onClick={() => { scrollTo('screen-time'); setOpen(false); }} className="block w-full text-left text-sm text-[#5C4D3C] py-2">Screen Time</button>
          <button onClick={() => { scrollTo('family'); setOpen(false); }} className="block w-full text-left text-sm text-[#5C4D3C] py-2">Family</button>
          <button onClick={() => { scrollTo('pricing'); setOpen(false); }} className="block w-full text-left text-sm text-[#5C4D3C] py-2">Pricing</button>
          <button onClick={() => { scrollTo('faq'); setOpen(false); }} className="block w-full text-left text-sm text-[#5C4D3C] py-2">FAQ</button>
          <button onClick={() => { scrollTo('pricing'); setOpen(false); }} className="block w-full text-center py-2 bg-[#C4453A] text-white rounded-full text-sm font-semibold">Get FaithWall</button>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  return (
    <section className="pt-28 pb-16 px-4 text-center bg-gradient-to-b from-[#FDF8F0] to-[#F5EDE0]">
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/80 border border-[#E8E0D4] rounded-full px-4 py-1.5 mb-6 text-xs text-[#8C7B6B]">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Built for families who want Scripture before scrolling
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#3D2B1F] leading-tight mb-5"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Your kids see you on your phone—but{" "}
          <span className="text-[#C4453A]">what if they saw you in the Word first?</span>
        </h1>
        <p className="text-lg text-[#8C7B6B] max-w-xl mx-auto mb-8">
          FaithWall locks distracting apps until you spend quality time with Scripture. Built for Christian families who want presence over scrolling. Become a Founding Family today.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-10">
          <button
            onClick={() => scrollTo('pricing')}
            className="px-8 py-4 bg-gradient-to-r from-[#C4453A] to-[#A63830] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg"
          >
            Get FaithWall — $29.99/yr
          </button>
        </div>

        {/* Phone mockup */}
        <div className="relative mx-auto w-[280px] h-[560px] bg-[#1A1210] rounded-[40px] p-3 shadow-2xl border-4 border-[#3D2B1F]/20">
          <div className="w-full h-full bg-gradient-to-b from-[#FDF8F0] to-[#F5EDE0] rounded-[32px] overflow-hidden flex flex-col">
            {/* Mock header */}
            <div className="bg-gradient-to-r from-[#C4453A] to-[#A63830] text-white px-4 py-3 text-center">
              <p className="text-xs opacity-80">Good {greeting}, builder.</p>
              <p className="text-sm font-bold">🔒 Currently Walled — Family Time</p>
              <p className="text-xs opacity-80 font-mono">00:23:45</p>
            </div>
            {/* Mock content */}
            <div className="flex-1 p-3 space-y-2">
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <p className="text-[10px] text-[#8C7B6B] mb-1">📖 Verse of the Day — Tap to reveal</p>
                <p className="text-[9px] text-[#5C4D3C] italic">"For God so loved the world..."</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Family Time', 'Homeschool', 'Devotion', 'Study'].map((m) => (
                  <div key={m} className="bg-white rounded-lg p-2 shadow-sm text-center">
                    <div className="w-6 h-6 bg-[#C4453A]/10 rounded-full mx-auto mb-1 flex items-center justify-center">
                      <Shield className="w-3 h-3 text-[#C4453A]" />
                    </div>
                    <p className="text-[9px] font-medium text-[#3D2B1F]">{m}</p>
                    <div className="mt-1 bg-[#C4453A] text-white text-[7px] py-0.5 rounded-full font-bold">WALL NOW</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-2 shadow-sm">
                <p className="text-[9px] text-[#8C7B6B]">🧱 12 walls laid • 5-day streak 🔥</p>
                <div className="flex gap-1 mt-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className={`flex-1 h-3 rounded-sm ${i < 6 ? 'bg-[#C4453A]' : 'bg-[#E8E0D4]'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-[#8C7B6B] italic" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          "Build your wall. One verse at a time." — Nehemiah 4:6
        </p>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-[#3D2B1F] text-center mb-12"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          The #1 thing homeschool moms don't talk about
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Smartphone className="w-6 h-6" />, title: 'The Hypocrisy', text: 'You set strict screen-time rules for your kids. Then you spend 45 minutes on Instagram during their math lesson.', cite: 'Every homeschool mom, honest version' },
            { icon: <Heart className="w-6 h-6" />, title: 'The Guilt', text: '"Mommy, why are you always on your phone?" When your daughter calls it out, the guilt cuts deep.', cite: 'Real story from a homeschool community' },
            { icon: <AlertTriangle className="w-6 h-6" />, title: 'The Failed Solutions', text: 'I set iPhone Screen Time limits. I hit "Ignore Limit" every. single. day. Willpower is not enough.', cite: 'iPhone Screen Time: 1, Moms: 0' },
          ].map((c) => (
            <div key={c.title} className="bg-[#FDF8F0] rounded-2xl p-6 border border-[#E8E0D4]">
              <div className="w-12 h-12 bg-[#C4453A]/10 rounded-xl flex items-center justify-center text-[#C4453A] mb-4">
                {c.icon}
              </div>
              <h3 className="font-bold text-[#3D2B1F] mb-2">{c.title}</h3>
              <p className="text-sm text-[#5C4D3C] mb-3">{c.text}</p>
              <p className="text-xs text-[#8C7B6B] italic">— {c.cite}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="py-20 px-4 bg-gradient-to-b from-[#FDF8F0] to-[#F5EDE0]">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-[#3D2B1F] text-center mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          What if your biggest distraction became your daily devotional?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { step: '1', icon: <BookOpen className="w-6 h-6" />, title: 'Choose Your Mode', desc: 'Family Time. Homeschool Hours. Morning Devotion. Bedtime. Create custom modes. Pick which apps to block.' },
            { step: '2', icon: <Lock className="w-6 h-6" />, title: 'Wall Your Phone', desc: 'One tap. Distracting apps vanish. Notifications silenced. A timer shows how long you\'ve been focused. Your phone becomes a tool, not a trap.' },
            { step: '3', icon: <Zap className="w-6 h-6" />, title: 'Unlock with Scripture', desc: 'To reopen your apps, spend 90 seconds in God\'s Word — read a verse, reflect, pray. Then choose: 15 min, 30 min, 1 hour, or 2 hours of access.' },
          ].map((s) => (
            <div key={s.step} className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#C4453A] to-[#A63830] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                {s.icon}
              </div>
              <span className="text-xs font-bold text-[#C4453A] uppercase tracking-wider">Step {s.step}</span>
              <h3 className="font-bold text-[#3D2B1F] mt-1 mb-2">{s.title}</h3>
              <p className="text-sm text-[#8C7B6B]">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-12 text-sm text-[#5C4D3C] italic" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          "So we rebuilt the wall... for the people worked with all their heart." — Nehemiah 4:6
        </p>
      </div>
    </section>
  );
}

function ScreenTimeSection() {
  return (
    <section id="screen-time" className="py-20 px-4 bg-[#1A1210] text-white">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#D4A843' }}
        >
          See Your Screen Time. Build Your Wall.
        </h2>
        <p className="text-center text-[#C4BFB5] mb-12">Real data. Real change. Real growth.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#2A201C] rounded-2xl p-6 border border-[#3D2B1F]">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span className="text-sm font-semibold text-red-400">This Week</span>
            </div>
            <p className="text-3xl font-bold mb-1">4.2 hrs</p>
            <p className="text-xs text-[#8C7B6B]">Time on Instagram (down 23%)</p>
            <div className="mt-4 h-2 bg-[#3D2B1F] rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-red-500 to-red-400 rounded-full" />
            </div>
          </div>
          <div className="bg-[#2A201C] rounded-2xl p-6 border border-[#3D2B1F]">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm font-semibold text-green-400">Scripture Time</span>
            </div>
            <p className="text-3xl font-bold mb-1">47 min</p>
            <p className="text-xs text-[#8C7B6B]">Time in God's Word (up 47%)</p>
            <div className="mt-4 h-2 bg-[#3D2B1F] rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
            </div>
          </div>
          <div className="bg-[#2A201C] rounded-2xl p-6 border border-[#D4A843]">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-[#D4A843]" />
              <span className="text-sm font-semibold text-[#D4A843]">Your Wall</span>
            </div>
            <p className="text-3xl font-bold mb-1">12 walls</p>
            <p className="text-xs text-[#8C7B6B]">Laid this week • 5-day streak 🔥</p>
            <div className="flex gap-1 mt-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-5 h-4 rounded-sm bg-[#C4453A]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FamilySection() {
  return (
    <section id="family" className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-[#3D2B1F] text-center mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          One Wall. Your Whole Family.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[
            { icon: <Shield className="w-6 h-6" />, title: "Mom's Phone", desc: 'Set up FaithWall on your own phone first. Choose your modes. Build your wall. Your kids see you leading by example.' },
            { icon: <Users className="w-6 h-6" />, title: "Kids' Phones", desc: 'Invite your kids (ages 8+). Set up their modes from your parent dashboard. They see YOUR progress too — parent modeling in action.' },
            { icon: <Heart className="w-6 h-6" />, title: 'Spouse Sync', desc: 'Link your spouse\'s phone. Share family modes like "Dinner Time" and "Homeschool Hours." Build the wall together.' },
          ].map((f) => (
            <div key={f.title} className="bg-[#FDF8F0] rounded-2xl p-6 border border-[#E8E0D4]">
              <div className="w-12 h-12 bg-[#C4453A]/10 rounded-xl flex items-center justify-center text-[#C4453A] mb-4">
                {f.icon}
              </div>
              <h3 className="font-bold text-[#3D2B1F] mb-2">{f.title}</h3>
              <p className="text-sm text-[#8C7B6B]">{f.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-sm text-[#5C4D3C] italic max-w-lg mx-auto" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          "This isn't about spying — it's about building something together. When your kids see you laying walls, they want to lay walls too."
        </p>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20 px-4 bg-[#1A1210]">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-center mb-12"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#D4A843' }}
        >
          What Families Are Saying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { text: 'I was hitting "Ignore Limit" on Screen Time every single day. Then I found something better than a limit — a reason. Reading Psalm 23 to unlock my phone changed the whole tone of our homeschool day.', author: 'Sarah M.', detail: 'homeschool mom of 3' },
            { text: "My son caught me scrolling during math and said 'Mommy, why are you always on your phone?' FaithWall gives me external help — I literally CAN'T open Instagram without reading a verse first. Now my kids see the right thing.", author: 'Jessica T.', detail: 'homeschool mom of 4' },
            { text: "Two weeks in and my screen time is down 47%. I memorized Colossians 3:2 because I had to type it to unlock my phone. The kids are ASKING me to read them the verses I get. This has been an answer to prayer.", author: 'Rachel K.', detail: 'homeschool mom of 2' },
          ].map((t, i) => (
            <div key={i} className="bg-[#2A201C] rounded-2xl p-6 border border-[#3D2B1F]">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 text-[#D4A843] fill-[#D4A843]" />)}
              </div>
              <p className="text-sm text-[#E8E0D4] mb-4 italic">"{t.text}"</p>
              <p className="text-xs text-[#8C7B6B]">— {t.author}, {t.detail}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-6 mt-10 text-xs text-[#C4BFB5]">
          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> KJV, WEB & BSB Scriptures</span>
          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Free core features</span>
          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> Family sharing</span>
          <span className="flex items-center gap-1"><Check className="w-3 h-3 text-green-500" /> No subscriptions required</span>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section id="faq" className="py-20 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-bold text-[#3D2B1F] text-center mb-12"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Questions? We Have Answers.
        </h2>
        <div className="space-y-3">
          {FAQS.map((f, i) => (
            <div key={i} className="border border-[#E8E0D4] rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FDF8F0] transition-colors"
              >
                <span className="font-medium text-[#3D2B1F] text-sm pr-4">{f.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#8C7B6B] shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-4 text-sm text-[#5C4D3C] leading-relaxed border-t border-[#E8E0D4] pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-center mt-8 text-sm text-[#8C7B6B]">
          Still have questions? Email us at{' '}
          <a href="mailto:adam@deadhidden.org" className="text-[#C4453A] hover:underline">adam@deadhidden.org</a>
        </p>
      </div>
    </section>
  );
}

function SupportMission() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#1A1210] to-[#2A201C]">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-[#D4A843]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Gift className="w-8 h-8 text-[#D4A843]" />
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#F5F0E8' }}
        >
          Help Us Build the Wall
        </h2>
        <p className="text-[#C4BFB5] mb-4 max-w-lg mx-auto">
          FaithWall is being built by a homeschool dad for his own family — and for yours. 
          We are not backed by venture capital. We are backed by families who believe Scripture 
          should come before scrolling.
        </p>
        <p className="text-[#D4A843] italic mb-8 max-w-lg mx-auto" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          "So built we the wall; and all the wall was joined together... for the people had a mind to work."
          <br/><span className="text-sm not-italic font-bold">— Nehemiah 4:6</span>
        </p>
        <p className="text-[#8C7B6B] text-sm mb-8">
          Every gift goes directly into development — iOS and Android apps, family sharing, 
          more verse packs, and making sure this tool reaches every Christian family that needs it. Purchases support the ongoing mission too.
        </p>
        <a
          href="https://buy.stripe.com/9B614o1Jq4EIcgu3p5c3m09"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D4A843] to-[#A67C2E] text-[#1A1210] font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg"
        >
          <Gift className="w-5 h-5" />
          Give a One-Time Gift
        </a>
        <p className="mt-4 text-xs text-[#5C4A3A]">
          Stripe secured • Any amount helps • You will receive a personal thank-you from our family
        </p>
      </div>
    </section>
  );
}


function Footer() {
  return (
    <footer className="py-12 px-4 bg-[#1A1210] text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Shield className="w-5 h-5 text-[#C4453A]" />
        <span className="text-lg font-bold text-[#F5F0E8]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>FaithWall</span>
      </div>
      <p className="text-sm text-[#8C7B6B] mb-6 italic">"Build your wall. One verse at a time."</p>
      <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm text-[#C4BFB5]">
        <button onClick={() => scrollTo('how')} className="hover:text-white transition-colors">How It Works</button>
        <button onClick={() => scrollTo('screen-time')} className="hover:text-white transition-colors">Screen Time</button>
        <button onClick={() => scrollTo('family')} className="hover:text-white transition-colors">Family</button>
        <button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors">Pricing</button>
        <button onClick={() => scrollTo('faq')} className="hover:text-white transition-colors">FAQ</button>
        <a href="mailto:adam@deadhidden.org" className="hover:text-white transition-colors">Contact</a>
      </div>
      <p className="text-xs text-[#5C4A3A]">&copy; 2026 FaithWall. Built for His glory.</p>
      <p className="text-xs text-[#5C4A3A] mt-1">Made by a homeschool dad who was tired of his own screen time 🧱</p>
    </footer>
  );
}

/* ───────── main landing page ───────── */
function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <ScreenTimeSection />
      <FamilySection />
      <Testimonials />
      <SupportMission />
      <PricingSection />
      <FAQ />
      <Footer />
    </div>
  );
}

/* ───────── app router ───────── */
export default function App() {
  const [page, setPage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPage(params.get('page') || '');
    const handlePop = () => setPage(new URLSearchParams(window.location.search).get('page') || '');
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  if (page === 'success') return <SuccessPage />;
  if (page === 'cancel') return <CancelPage onBackToPricing={() => { window.location.search = ''; }} />;
  if (page === 'app') return <DemoApp />;
  return <LandingPage />;
}
