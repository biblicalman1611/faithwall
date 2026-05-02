import { useEffect, useState, useCallback } from 'react';
import {
  Home, Lock, Unlock, TrendingUp, Flame, BookOpen,
  Sun, Moon, Briefcase, Lamp, Users, Heart, Mic, Pen,
  Check, Share2, Shield, AlertTriangle, Smartphone
} from 'lucide-react';

/* ───────── types ───────── */
interface WallRecord {
  date: string;
  mode: string;
  verse: string;
}

interface DailyVerse {
  reference: string;
  text: string;
  translation: string;
}

interface AppState {
  accessStarted: string | null;
  isPremium: boolean;
  activeMode: string | null;
  activeModeStart: number | null;
  totalWalls: number;
  currentStreak: number;
  longestStreak: number;
  wallHistory: WallRecord[];
  dailyVerse: DailyVerse;
  screenMinutesToday: number | null;
  screenCheckInDate: string;
}

type Screen = 'home' | 'unwall' | 'progress';

/* ───────── constants ───────── */
const STORAGE_KEY = 'fw_app_state';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

const DEFAULT_STATE: AppState = {
  accessStarted: null,
  isPremium: true,
  activeMode: null,
  activeModeStart: null,
  totalWalls: 0,
  currentStreak: 0,
  longestStreak: 0,
  wallHistory: [],
  dailyVerse: {
    reference: 'John 3:16',
    text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    translation: 'KJV',
  },
  screenMinutesToday: null,
  screenCheckInDate: todayKey(),
};

const DAILY_VERSE: DailyVerse = {
  reference: 'John 3:16',
  text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
  translation: 'KJV',
};

const VERSES_POOL: DailyVerse[] = [
  DAILY_VERSE,
  { reference: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.', translation: 'KJV' },
  { reference: 'Psalm 23:1', text: 'The LORD is my shepherd; I shall not want.', translation: 'KJV' },
  { reference: 'Colossians 3:2', text: 'Set your affection on things above, not on things on the earth.', translation: 'KJV' },
  { reference: 'Proverbs 3:5-6', text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.', translation: 'KJV' },
  { reference: 'Joshua 1:9', text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.', translation: 'KJV' },
  { reference: 'Matthew 11:28', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', translation: 'KJV' },
  { reference: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.', translation: 'KJV' },
];

const MODES = [
  { name: 'Family Time', icon: <Users className="w-5 h-5" />, color: '#C4453A', bg: 'bg-red-50', border: 'border-red-200' },
  { name: 'Homeschool', icon: <BookOpen className="w-5 h-5" />, color: '#4A7FB5', bg: 'bg-blue-50', border: 'border-blue-200' },
  { name: 'Devotion', icon: <Sun className="w-5 h-5" />, color: '#D4A843', bg: 'bg-amber-50', border: 'border-amber-200' },
  { name: 'Study', icon: <Lamp className="w-5 h-5" />, color: '#5A8F6E', bg: 'bg-green-50', border: 'border-green-200' },
  { name: 'Sleep', icon: <Moon className="w-5 h-5" />, color: '#7B6BAE', bg: 'bg-purple-50', border: 'border-purple-200' },
  { name: 'Work', icon: <Briefcase className="w-5 h-5" />, color: '#8B6914', bg: 'bg-yellow-50', border: 'border-yellow-200' },
];

/* ───────── helpers ───────── */
function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const next = { ...DEFAULT_STATE, ...parsed };
      if (next.screenCheckInDate !== todayKey()) {
        next.screenMinutesToday = null;
        next.screenCheckInDate = todayKey();
      }
      return next;
    }
  } catch { /* ignore */ }
  return DEFAULT_STATE;
}

function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/* ───────── brick wall visual ───────── */
function BrickWallVisual({ totalWalls }: { totalWalls: number }) {
  const maxBricks = 35; // 5 rows x 7 cols
  const filled = Math.min(totalWalls, maxBricks);
  const rows = 5;
  const cols = 7;

  return (
    <div className="space-y-1">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-1" style={{ paddingLeft: row % 2 === 1 ? '8px' : '0' }}>
          {Array.from({ length: cols }).map((_, col) => {
            const idx = row * cols + col;
            const isFilled = idx < filled;
            return (
              <div
                key={col}
                className={`flex-1 h-5 rounded-sm transition-all duration-500 ${
                  isFilled
                    ? 'bg-gradient-to-br from-[#C4453A] to-[#A63830] shadow-sm'
                    : 'bg-[#3D2B1F]/30'
                }`}
                style={{
                  animationDelay: `${idx * 50}ms`,
                  opacity: isFilled ? 1 : 0.4,
                }}
              />
            );
          })}
        </div>
      ))}
      {totalWalls > maxBricks && (
        <p className="text-center text-xs text-[#D4A843] mt-2 font-semibold">
          +{totalWalls - maxBricks} more walls!
        </p>
      )}
    </div>
  );
}

/* ───────── confetti particle ───────── */
function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ['#C4453A', '#D4A843', '#FF8C42', '#FFD700', '#5A8F6E'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 40 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = 1 + Math.random() * 1.5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 4 + Math.random() * 6;
        return (
          <div
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${left}%`,
              top: '-10px',
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              animation: `confetti-fall ${duration}s ease-in ${delay}s forwards`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ───────── brick laid animation overlay ───────── */
function BrickLaidOverlay({ mode, onDone }: { mode: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#1A1210]/90">
      <Confetti active={true} />
      <div className="brick-bounce">
        <div
          className="w-20 h-14 rounded-lg shadow-2xl mb-4"
          style={{
            background: 'linear-gradient(135deg, #C4453A 0%, #8B3A36 50%, #A63830 100%)',
            boxShadow: 'inset -4px -4px 8px rgba(0,0,0,0.3), inset 4px 4px 8px rgba(255,255,255,0.15)',
          }}
        />
      </div>
      <h2
        className="text-3xl font-bold text-[#D4A843] mb-2 tracking-wide"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        WALL LAID!
      </h2>
      <p className="text-sm text-[#C4BFB5]">Your apps are being restored...</p>
      <p className="text-xs text-[#8C7B6B] mt-2">{mode} — one more brick in your wall</p>
    </div>
  );
}

/* ───────── status banner ───────── */
function StatusBanner() {
  return (
    <div className="bg-[#2A201C] border-b border-[#D4A843]/30 text-[#D4A843] px-4 py-3 text-center text-xs leading-relaxed">
      FaithWall Web Room: progress saves on this device. Native phone blocking is being built for the mobile app.
    </div>
  );
}

/* ───────── daily verse card ───────── */
function DailyVerseCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      onClick={() => setFlipped(!flipped)}
      className={`w-full rounded-2xl p-5 text-center transition-all duration-500 relative overflow-hidden ${
        flipped
          ? 'bg-gradient-to-br from-[#D4A843] to-[#A67C2E] text-white shadow-lg'
          : 'bg-white border border-[#E8E0D4] shadow-sm hover:shadow-md'
      }`}
      style={{ perspective: '1000px', minHeight: '140px' }}
    >
      {!flipped ? (
        <div className="flex flex-col items-center justify-center h-full py-4">
          <BookOpen className="w-8 h-8 text-[#D4A843] mb-2" />
          <p className="text-sm font-semibold text-[#3D2B1F]">Verse of the Day</p>
          <p className="text-xs text-[#8C7B6B] mt-1">Tap to reveal</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-2">
          <p className="text-sm leading-relaxed italic mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            &ldquo;{DAILY_VERSE.text}&rdquo;
          </p>
          <p className="text-xs font-bold">— {DAILY_VERSE.reference}</p>
          <span className="mt-2 text-[10px] bg-white/20 px-2 py-0.5 rounded-full">{DAILY_VERSE.translation}</span>
        </div>
      )}
    </button>
  );
}

/* ───────── mode cards ───────── */
function ModeCard({ mode, onWall }: { mode: typeof MODES[0]; onWall: () => void }) {
  return (
    <button
      onClick={onWall}
      className={`${mode.bg} ${mode.border} border rounded-2xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95 hover:shadow-md`}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow"
        style={{ backgroundColor: mode.color }}
      >
        {mode.icon}
      </div>
      <div className="w-full h-1 rounded-full" style={{ backgroundColor: mode.color, opacity: 0.6 }} />
      <p className="text-xs font-bold text-[#3D2B1F]">{mode.name}</p>
      <span
        className="text-[10px] font-bold text-white px-3 py-1 rounded-full mt-1"
        style={{ backgroundColor: mode.color }}
      >
        WALL NOW
      </span>
    </button>
  );
}

/* ───────── manual screen-time check-in ───────── */
function ScreenTimeCheckIn({
  minutes,
  onSave,
}: {
  minutes: number | null;
  onSave: (minutes: number) => void;
}) {
  const [value, setValue] = useState(minutes?.toString() || '');

  useEffect(() => {
    setValue(minutes?.toString() || '');
  }, [minutes]);

  const parsed = Number(value);
  const canSave = Number.isFinite(parsed) && parsed >= 0 && parsed <= 1440;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D4] p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#C4453A]/10 flex items-center justify-center text-[#C4453A] shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#3D2B1F]">Today's screen-time check-in</p>
          <p className="text-xs text-[#8C7B6B] mt-1">
            Enter the minutes from your phone report. FaithWall saves it on this device.
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ''))}
          inputMode="numeric"
          placeholder="Minutes"
          className="min-w-0 flex-1 rounded-xl border border-[#E8E0D4] bg-[#FDF8F0] px-4 py-3 text-sm text-[#3D2B1F] placeholder-[#8C7B6B] focus:outline-none focus:ring-2 focus:ring-[#C4453A]/30"
        />
        <button
          onClick={() => canSave && onSave(Math.round(parsed))}
          disabled={!canSave}
          className="px-4 py-3 bg-[#3D2B1F] text-white rounded-xl text-sm font-bold disabled:opacity-40"
        >
          Save
        </button>
      </div>
      {minutes !== null && (
        <p className="text-xs text-[#5A8F6E] font-semibold mt-3">
          Saved: {Math.floor(minutes / 60)}h {minutes % 60}m today.
        </p>
      )}
    </div>
  );
}

/* ───────── active wall banner ───────── */
function ActiveWallBanner({
  modeName,
  startTime,
  onUnwall,
  onEmergency,
}: {
  modeName: string;
  startTime: number;
  onUnwall: () => void;
  onEmergency: () => void;
}) {
  const [elapsed, setElapsed] = useState(Date.now() - startTime);

  useEffect(() => {
    const interval = setInterval(() => setElapsed(Date.now() - startTime), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#C4453A] to-[#A63830] text-white p-4 shadow-lg border-2 border-[#C4453A] animate-pulse-border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          <span className="font-bold text-sm">Currently Walled — {modeName}</span>
        </div>
        <span className="font-mono text-lg font-bold">{formatDuration(elapsed)}</span>
      </div>
      <button
        onClick={onUnwall}
        className="w-full py-2.5 bg-white/20 rounded-xl text-sm font-bold hover:bg-white/30 transition-colors mb-2"
      >
        Tap to Unwall
      </button>
      <button
        onClick={onEmergency}
        className="flex items-center gap-1 mx-auto text-[10px] text-white/60 hover:text-white/90 transition-colors"
      >
        <AlertTriangle className="w-3 h-3" />
        Emergency Unlock
      </button>
    </div>
  );
}

/* ───────── home screen ───────── */
function HomeScreen({
  state,
  onStartWall,
  onUnwall,
  onEmergency,
  onScreenCheckIn,
}: {
  state: AppState;
  onStartWall: (mode: string) => void;
  onUnwall: () => void;
  onEmergency: () => void;
  onScreenCheckIn: (minutes: number) => void;
}) {
  const greeting = getGreeting();

  return (
    <div className="space-y-5 pb-24">
      {/* Greeting */}
      <div>
        <p className="text-lg font-bold text-[#3D2B1F]">
          {greeting}, builder.
        </p>
        <p className="text-xs text-[#8C7B6B] mt-0.5">
          {state.totalWalls > 0
            ? `${state.totalWalls} walls laid \u2022 ${state.currentStreak}-day streak`
            : 'Start building your wall today.'}
        </p>
      </div>

      {/* Daily verse */}
      <DailyVerseCard />

      {/* Active wall or mode grid */}
      {state.activeMode && state.activeModeStart ? (
        <ActiveWallBanner
          modeName={state.activeMode}
          startTime={state.activeModeStart}
          onUnwall={onUnwall}
          onEmergency={onEmergency}
        />
      ) : (
        <div>
          <p className="text-sm font-semibold text-[#3D2B1F] mb-3">Choose your mode:</p>
          <div className="grid grid-cols-2 gap-3">
            {MODES.map((m) => (
              <ModeCard key={m.name} mode={m} onWall={() => onStartWall(m.name)} />
            ))}
          </div>
        </div>
      )}

      <ScreenTimeCheckIn
        minutes={state.screenMinutesToday}
        onSave={onScreenCheckIn}
      />

      {/* Quick progress preview */}
      {state.totalWalls > 0 && (
        <div className="bg-white rounded-2xl border border-[#E8E0D4] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#3D2B1F]">This Week</span>
            <span className="text-xs text-[#8C7B6B]">{state.totalWalls} walls &bull; {state.currentStreak}-day streak <Flame className="w-3 h-3 inline text-orange-500" /></span>
          </div>
          <div className="flex gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
              const walled = state.wallHistory.some((w) => {
                const wd = new Date(w.date).getDay();
                return wd === (i + 1) % 7;
              });
              return (
                <div key={i} className="flex-1 text-center">
                  <div className={`h-6 rounded-sm mb-1 ${walled ? 'bg-gradient-to-b from-[#C4453A] to-[#A63830]' : 'bg-[#E8E0D4]'}`} />
                  <span className="text-[9px] text-[#8C7B6B]">{d}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────── unwall screen ───────── */
function UnwallScreen({
  modeName,
  onComplete,
  onCancel,
}: {
  modeName: string;
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [taskType, setTaskType] = useState<string | null>(null);
  const [prayerText, setPrayerText] = useState('');
  const [received, setReceived] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [readingDone, setReadingDone] = useState(false);

  const [currentVerse] = useState(() => VERSES_POOL[Math.floor(Math.random() * VERSES_POOL.length)]);

  const handleComplete = () => {
    if (!taskType) return;
    if (taskType === 'write' && prayerText.length < 10) return;
    if (taskType === 'receive' && !received) return;
    onComplete();
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="text-center">
        <Lock className="w-8 h-8 text-[#C4453A] mx-auto mb-2" />
        <p className="text-xs text-[#8C7B6B] uppercase tracking-wider">Unwalling from {modeName}</p>
        <h2
          className="text-xl font-bold text-[#3D2B1F] mt-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Lay This Brick
        </h2>
      </div>

      {/* Verse card */}
      <div className="relative rounded-2xl bg-[#2A201C] border border-[#D4A843]/40 p-6 overflow-hidden">
        <span className="absolute top-2 left-3 text-6xl text-[#D4A843]/10 font-serif select-none">&ldquo;</span>
        <span className="absolute bottom-2 right-3 text-6xl text-[#D4A843]/10 font-serif select-none">&rdquo;</span>
        <p className="text-sm text-[#F5F0E8] leading-relaxed italic relative z-10 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {currentVerse.text}
        </p>
        <div className="flex items-center justify-between relative z-10">
          <p className="text-xs text-[#D4A843] font-bold">— {currentVerse.reference}</p>
          <span className="text-[10px] bg-[#D4A843]/20 text-[#D4A843] px-2 py-0.5 rounded-full">{currentVerse.translation}</span>
        </div>
      </div>

      <p className="text-center text-sm text-[#8C7B6B]">
        Choose a task to lay your brick and restore your apps:
      </p>

      {/* Task options */}
      {!taskType ? (
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'read', icon: <Mic className="w-5 h-5" />, label: 'Read Aloud', desc: 'Read this verse aloud' },
            { key: 'write', icon: <Pen className="w-5 h-5" />, label: 'Write Prayer', desc: 'Write a short prayer' },
            { key: 'voice', icon: <Mic className="w-5 h-5" />, label: 'Voice Prayer', desc: 'Speak a prayer' },
            { key: 'receive', icon: <Heart className="w-5 h-5" />, label: 'I Receive This', desc: 'Receive this word' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTaskType(t.key)}
              className="bg-white border border-[#E8E0D4] rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-[#C4453A] hover:shadow-md transition-all text-center"
            >
              <div className="w-10 h-10 bg-[#C4453A]/10 rounded-xl flex items-center justify-center text-[#C4453A]">
                {t.icon}
              </div>
              <p className="text-xs font-bold text-[#3D2B1F]">{t.label}</p>
              <p className="text-[10px] text-[#8C7B6B]">{t.desc}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E0D4] p-5">
          {/* Read Aloud task */}
          {taskType === 'read' && (
            <div className="text-center space-y-4">
              <p className="text-sm text-[#5C4D3C]">Read this verse aloud, then tap done:</p>
              <p className="text-sm italic text-[#3D2B1F] bg-[#FDF8F0] p-4 rounded-xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                &ldquo;{currentVerse.text}&rdquo;
              </p>
              {!readingDone ? (
                <button
                  onClick={() => setReadingDone(true)}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-[#C4453A] to-[#A63830] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                >
                  <Mic className="w-4 h-4" />
                  I read it aloud
                </button>
              ) : (
                <div className="flex items-center gap-2 justify-center text-green-600 font-semibold text-sm">
                  <Check className="w-5 h-5" />
                  Well done! Ready to lay your brick.
                </div>
              )}
            </div>
          )}

          {/* Write Prayer task */}
          {taskType === 'write' && (
            <div className="space-y-3">
              <p className="text-sm text-[#5C4D3C]">Write a short prayer inspired by this verse:</p>
              <textarea
                value={prayerText}
                onChange={(e) => setPrayerText(e.target.value)}
                placeholder="Dear Lord, help me to..."
                className="w-full h-32 p-4 rounded-xl border border-[#E8E0D4] bg-[#FDF8F0] text-sm text-[#3D2B1F] placeholder-[#8C7B6B] focus:outline-none focus:ring-2 focus:ring-[#C4453A]/30 resize-none"
              />
              <p className="text-xs text-[#8C7B6B] text-right">{prayerText.length} chars {prayerText.length < 10 && '(min 10)'}</p>
            </div>
          )}

          {/* Voice Prayer task */}
          {taskType === 'voice' && (
            <div className="text-center space-y-4">
              <p className="text-sm text-[#5C4D3C]">Hold the button and speak your prayer:</p>
              <button
                onClick={() => setReadingDone(true)}
                onMouseDown={() => setReadingDone(false)}
                onMouseUp={() => setReadingDone(true)}
                onTouchStart={() => setReadingDone(false)}
                onTouchEnd={() => setReadingDone(true)}
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all ${
                  readingDone
                    ? 'bg-green-500 scale-110'
                    : 'bg-gradient-to-br from-[#C4453A] to-[#A63830] animate-pulse'
                }`}
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
              <p className="text-xs text-[#8C7B6B]">
                {readingDone ? 'Prayer recorded! ✓' : 'Tap and hold to record'}
              </p>
            </div>
          )}

          {/* I Receive This task */}
          {taskType === 'receive' && (
            <div className="space-y-4">
              <p className="text-sm text-[#5C4D3C]">Receive this word into your heart:</p>
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => setReceived(!received)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                    received
                      ? 'bg-green-500 border-green-500'
                      : 'border-[#E8E0D4] hover:border-[#C4453A]'
                  }`}
                >
                  {received && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className="text-sm text-[#3D2B1F]">
                  I receive this word and commit to living it today.
                </span>
              </label>
              {received && (
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Optional: Add a personal note..."
                  className="w-full h-20 p-3 rounded-xl border border-[#E8E0D4] bg-[#FDF8F0] text-sm text-[#3D2B1F] placeholder-[#8C7B6B] focus:outline-none focus:ring-2 focus:ring-[#C4453A]/30 resize-none"
                />
              )}
            </div>
          )}

          {/* Complete button */}
          <button
            onClick={handleComplete}
            disabled={taskType === 'write' && prayerText.length < 10}
            className="w-full mt-4 py-3 bg-gradient-to-r from-[#C4453A] to-[#A63830] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            Lay This Brick & Unlock
          </button>

          <button
            onClick={() => { setTaskType(null); setReadingDone(false); setReceived(false); }}
            className="w-full mt-2 py-2 text-xs text-[#8C7B6B] hover:text-[#C4453A] transition-colors"
          >
            Choose a different task
          </button>
        </div>
      )}

      <button
        onClick={onCancel}
        className="w-full py-3 text-sm text-[#8C7B6B] hover:text-[#C4453A] transition-colors"
      >
        &larr; Back to Home
      </button>
    </div>
  );
}

/* ───────── progress screen ───────── */
function ProgressScreen({ state }: { state: AppState }) {
  const [copied, setCopied] = useState(false);

  const shareText = `I've laid ${state.totalWalls} walls with FaithWall! ${state.currentStreak}-day streak. Build your wall, one verse at a time.`;

  const handleShare = () => {
    navigator.clipboard.writeText(shareText + ' https://faithwall.deadhidden.org');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalFocusMinutes = state.wallHistory.length * 15;
  const focusHours = Math.floor(totalFocusMinutes / 60);
  const focusMins = totalFocusMinutes % 60;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="text-center">
        <h2
          className="text-2xl font-bold text-[#3D2B1F]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Your Family Wall
        </h2>
        <p className="text-xs text-[#8C7B6B] mt-1">Every brick matters. Every verse counts.</p>
      </div>

      {/* Streak */}
      <div className="bg-gradient-to-br from-[#C4453A] to-[#A63830] rounded-2xl p-6 text-white text-center shadow-lg">
        <Flame className="w-10 h-10 mx-auto mb-2 text-orange-300" />
        <p className="text-5xl font-bold">{state.currentStreak}</p>
        <p className="text-sm opacity-90 mt-1">day{state.currentStreak !== 1 ? 's' : ''} streak</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Walls', value: state.totalWalls.toString() },
          { label: 'Current Streak', value: `${state.currentStreak} days` },
          { label: 'Longest Streak', value: `${state.longestStreak} days` },
          { label: 'Focus Time', value: `${focusHours}h ${focusMins}m` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E8E0D4] p-4 text-center">
            <p className="text-xl font-bold text-[#3D2B1F]">{s.value}</p>
            <p className="text-[10px] text-[#8C7B6B] uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Brick wall visual */}
      <div className="bg-[#1A1210] rounded-2xl p-5">
        <p className="text-xs text-[#D4A843] font-semibold uppercase tracking-wider mb-3 text-center">
          Your Wall
        </p>
        <BrickWallVisual totalWalls={state.totalWalls} />
      </div>

      {/* Weekly progress */}
      <div className="bg-white rounded-2xl border border-[#E8E0D4] p-5">
        <p className="text-sm font-semibold text-[#3D2B1F] mb-3">This Week</p>
        <div className="space-y-2">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => {
            const dayWalls = state.wallHistory.filter((w) => new Date(w.date).getDay() === i).length;
            const pct = Math.min(dayWalls * 20, 100);
            return (
              <div key={day} className="flex items-center gap-3">
                <span className="text-[10px] text-[#8C7B6B] w-16 text-right shrink-0">{day.slice(0, 3)}</span>
                <div className="flex-1 h-3 bg-[#FDF8F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C4453A] to-[#D4A843] rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-[#8C7B6B] w-5 shrink-0">{dayWalls}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share */}
      <button
        onClick={handleShare}
        className="w-full py-3 bg-white border border-[#E8E0D4] rounded-2xl text-sm font-semibold text-[#3D2B1F] hover:bg-[#FDF8F0] transition-colors flex items-center justify-center gap-2"
      >
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
        {copied ? 'Copied to clipboard!' : 'Share my progress'}
      </button>
    </div>
  );
}

/* ───────── bottom nav ───────── */
function BottomNav({ screen, onChange }: { screen: Screen; onChange: (s: Screen) => void }) {
  const tabs: { key: Screen; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { key: 'unwall', label: 'Unwall', icon: <Unlock className="w-5 h-5" /> },
    { key: 'progress', label: 'Progress', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-[#E8E0D4] z-20">
      <div className="flex items-center justify-around py-2 max-w-md mx-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`flex flex-col items-center gap-0.5 px-6 py-1 rounded-xl transition-colors ${
              screen === t.key ? 'text-[#C4453A]' : 'text-[#8C7B6B] hover:text-[#5C4D3C]'
            }`}
          >
            {t.icon}
            <span className="text-[10px] font-medium">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────── emergency unlock modal ───────── */
function EmergencyModal({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
          <h3 className="font-bold text-[#3D2B1F]">Emergency Unlock</h3>
        </div>
        <p className="text-sm text-[#5C4D3C] mb-4">
          This will break your current streak and unwalls your phone immediately. Are you sure?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-[#E8E0D4] rounded-xl text-sm font-semibold text-[#5C4D3C] hover:bg-[#FDF8F0] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-[#C4453A] text-white rounded-xl text-sm font-bold hover:bg-[#A63830] transition-colors"
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}

/* ───────── main FaithWall room component ───────── */
export default function FaithWallRoom() {
  const [state, setState] = useState<AppState>(loadState);
  const [screen, setScreen] = useState<Screen>('home');
  const [showBrickAnim, setShowBrickAnim] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [completedMode, setCompletedMode] = useState('');

  /* persist state changes */
  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleStartWall = useCallback((mode: string) => {
    setState((s) => ({
      ...s,
      activeMode: mode,
      activeModeStart: Date.now(),
    }));
  }, []);

  const handleUnwall = useCallback(() => {
    setScreen('unwall');
  }, []);

  const handleCompleteTask = useCallback(() => {
    const mode = state.activeMode || 'Unknown';
    setCompletedMode(mode);
    setShowBrickAnim(true);
  }, [state.activeMode]);

  const handleBrickDone = useCallback(() => {
    setShowBrickAnim(false);
    setState((s) => {
      const now = new Date().toISOString();
      const newHistory = [...s.wallHistory, { date: now, mode: s.activeMode || 'Unknown', verse: DAILY_VERSE.reference }];
      const newTotal = s.totalWalls + 1;
      const newStreak = s.currentStreak + 1;
      return {
        ...s,
        activeMode: null,
        activeModeStart: null,
        totalWalls: newTotal,
        currentStreak: newStreak,
        longestStreak: Math.max(s.longestStreak, newStreak),
        wallHistory: newHistory,
      };
    });
    setScreen('home');
  }, []);

  const handleEmergencyUnlock = useCallback(() => {
    setShowEmergency(false);
    setState((s) => ({
      ...s,
      activeMode: null,
      activeModeStart: null,
      currentStreak: 0, // break streak
    }));
    setScreen('home');
  }, []);

  const handleScreenCheckIn = useCallback((minutes: number) => {
    setState((s) => ({
      ...s,
      screenMinutesToday: minutes,
      screenCheckInDate: todayKey(),
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F0] to-[#F5EDE0] flex justify-center items-start py-4 md:py-8 px-4">
      {/* Phone frame on desktop, full width on mobile */}
      <div className="w-full max-w-[400px] md:border-[8px] md:border-[#3D2B1F] md:rounded-[48px] overflow-hidden relative md:shadow-2xl md:h-[800px] md:overflow-y-auto bg-gradient-to-b from-[#FDF8F0] to-[#F5EDE0]">
        {/* Status banner */}
        <StatusBanner />

        {/* Main content */}
        <main className="px-4 pt-5 pb-20 relative min-h-[500px]">
          {screen === 'home' && (
            <HomeScreen
              state={state}
              onStartWall={handleStartWall}
              onUnwall={handleUnwall}
              onEmergency={() => setShowEmergency(true)}
              onScreenCheckIn={handleScreenCheckIn}
            />
          )}
          {screen === 'unwall' && (
            state.activeMode ? (
              <UnwallScreen
                modeName={state.activeMode}
                onComplete={handleCompleteTask}
                onCancel={() => setScreen('home')}
              />
            ) : (
              <div className="text-center pt-20 pb-24">
                <Shield className="w-12 h-12 text-[#8C7B6B] mx-auto mb-4" />
                <p className="text-lg font-bold text-[#3D2B1F] mb-2">No active wall</p>
                <p className="text-sm text-[#8C7B6B] mb-6">Start a wall from the Home screen first.</p>
                <button
                  onClick={() => setScreen('home')}
                  className="px-6 py-3 bg-gradient-to-r from-[#C4453A] to-[#A63830] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all"
                >
                  Go Home
                </button>
              </div>
            )
          )}
          {screen === 'progress' && <ProgressScreen state={state} />}

          {/* Overlays */}
          {showBrickAnim && (
            <BrickLaidOverlay mode={completedMode} onDone={handleBrickDone} />
          )}
          <EmergencyModal
            open={showEmergency}
            onConfirm={handleEmergencyUnlock}
            onCancel={() => setShowEmergency(false)}
          />
        </main>

        {/* Bottom nav */}
        <BottomNav screen={screen} onChange={setScreen} />
      </div>
    </div>
  );
}
