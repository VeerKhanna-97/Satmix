// ============================================================
// FILE: src/components/marketing/HowItWorksSection.tsx
// PURPOSE: "Four steps, then it runs on habit."
//          Interactive Satmix Onboarding Quiz & 4-Step Walkthrough
//          Orchestrated via GSAP 3 Pinned ScrollTrigger & Lenis
//          - Desktop: Pinned 2-column layout with 3D tilting titanium chassis
//            and hardware-accelerated horizontal scrubbed screen carousel
//          - Mobile: Pinned full-viewport phone frame with synchronized
//            horizontal screen track, step indicators, and progress pills
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  ChevronLeft,
  Minus,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StepItem {
  title: string;
  body: string;
}

const STEPS_DATA: StepItem[] = [
  {
    title: 'Take a 2-minute quiz',
    body: 'Five questions about how you handle ups and downs. You get a starting point and a risk limit you can change.',
  },
  {
    title: 'Pick a basket',
    body: 'Stable or Growth. You choose the mix, never individual coins, and never the timing.',
  },
  {
    title: 'Set your daily amount',
    body: 'From ₹10 a day on Stable, or ₹30 on Growth. Pause or change it whenever you like.',
  },
  {
    title: 'Watch it build',
    body: 'One tap a day. Every buy comes with a receipt showing where the money went and exactly what it cost.',
  },
];

// 3D Chassis perspective rotation coordinates per step (desktop)
const TILT_ANGLES = [
  { x: 3, y: -7 },
  { x: 2, y: 6 },
  { x: 4, y: -5 },
  { x: 1, y: 3 },
];

/* ─────────────────────────────────────────────────────────────
   5-QUESTION QUIZ DATA SPECIFICATION
   ───────────────────────────────────────────────────────────── */
interface QuizQuestion {
  id: number;
  question: string;
  supporting: string;
  options: string[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Your crypto falls 30% in a month. What do you do?',
    supporting: 'This happens in crypto, sometimes more than once a year. There are no wrong answers.',
    options: ['Take it all out', 'Pause for a while', 'Keep going as planned'],
  },
  {
    id: 2,
    question: 'How often do you check price charts?',
    supporting: 'Checking daily can cause stress. DCA is built for set-and-forget consistency.',
    options: ['Multiple times a day', 'Once a week', 'Rarely or monthly'],
  },
  {
    id: 3,
    question: 'What is your target time horizon?',
    supporting: 'Compounding works best over months and years, not days or weeks.',
    options: ['Under 6 months', '1 to 3 years', '3+ years'],
  },
  {
    id: 4,
    question: 'How much can you comfortably set aside each day?',
    supporting: 'Consistent micro-savings build long-term holdings without straining your budget.',
    options: ['₹10 to ₹30 a day', '₹50 to ₹100 a day', '₹100+ a day'],
  },
  {
    id: 5,
    question: 'Which portfolio philosophy fits you best?',
    supporting: 'Stable prioritizes capital safety; Growth targets maximum long-term upside.',
    options: ['Capital safety with stable yields', 'Balanced growth and stability', 'Maximum long-term crypto growth'],
  },
];

interface ScreenProps {
  active: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

/* ─────────────────────────────────────────────────────────────
   PHONE SCREEN 1: 5-Question Interactive Risk Quiz
   ───────────────────────────────────────────────────────────── */
const QuizScreen: React.FC<ScreenProps> = ({ onNext }) => {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({ 0: 2 }); // Initial reference: question 1 option 3 pre-selected

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const selectedOption = answers[currentIdx] ?? null;

  const handleSelectOption = (optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleContinue = () => {
    if (selectedOption === null) return;
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else if (onNext) {
      onNext();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  return (
    <div
      className={`relative h-full w-full flex flex-col justify-between select-none p-3.5 xs:p-4 transition-colors duration-200 ${
        isLight ? 'bg-white text-slate-900' : 'bg-[#080909] text-white'
      }`}
    >
      <div>
        {/* In-app navigation header */}
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1.5">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className={`p-1 -ml-1 transition-opacity ${
              currentIdx === 0
                ? 'opacity-20 cursor-default'
                : 'text-[#00C99A] cursor-pointer hover:opacity-80'
            }`}
            aria-label="Previous question"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[#00C99A] font-bold text-xs">--</span>
        </div>

        {/* Section label & Question counter */}
        <p className="text-[12px] font-semibold text-[#00C99A] font-mono tracking-wide">
          Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
        </p>

        {/* Question heading */}
        <h4
          className={`font-extrabold leading-[1.2] tracking-tight text-[16px] xs:text-[17.5px] mt-1 ${
            isLight ? 'text-slate-900' : 'text-[#DADADA]'
          }`}
        >
          {currentQ.question}
        </h4>

        {/* Supporting text */}
        <p
          className={`leading-snug text-[11.5px] xs:text-[12px] mt-1 mb-3 ${
            isLight ? 'text-slate-500' : 'text-neutral-400'
          }`}
        >
          {currentQ.supporting}
        </p>

        {/* Selectable Options */}
        <div className="space-y-2 mt-2">
          {currentQ.options.map((opt, i) => {
            const isPicked = selectedOption === i;
            return (
              <div
                key={opt}
                onClick={() => handleSelectOption(i)}
                className={`flex items-center justify-between rounded-xl border transition-all duration-200 p-2.5 xs:p-3 cursor-pointer select-none active:scale-[0.98] ${
                  isPicked
                    ? `border-[#00C99A] bg-[#00C99A]/10 shadow-sm ${
                        isLight ? 'shadow-slate-200' : ''
                      }`
                    : isLight
                    ? 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    : 'border-white/10 bg-[#101212] hover:border-white/20'
                }`}
              >
                <span
                  className={`text-[12.5px] xs:text-[13px] font-semibold ${
                    isPicked
                      ? 'text-[#00C99A]'
                      : isLight
                      ? 'text-slate-700'
                      : 'text-neutral-300'
                  }`}
                >
                  {opt}
                </span>

                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isPicked
                      ? 'border-[#00C99A] bg-[#00C99A] text-black shadow-xs shadow-[#00C99A]/40'
                      : isLight
                      ? 'border-slate-300'
                      : 'border-white/20'
                  }`}
                >
                  {isPicked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={selectedOption === null}
        className={`w-full rounded-xl bg-[#00C99A] font-bold text-[#090A0E] tracking-wide shadow-md shadow-[#00C99A]/20 flex items-center justify-center active:scale-[0.98] h-10 text-[12.5px] transition-all duration-200 select-none ${
          selectedOption === null
            ? 'opacity-40 cursor-not-allowed'
            : 'cursor-pointer hover:opacity-95'
        }`}
      >
        {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Continue' : 'Complete Quiz'}
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PHONE SCREEN 2: Pick a Basket
   ───────────────────────────────────────────────────────────── */
const BasketScreen: React.FC<ScreenProps> = ({ onNext, onBack }) => {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';
  const [selectedBasket, setSelectedBasket] = useState(1); // Default Growth

  const baskets = [
    {
      name: 'Stable',
      subtitle: 'Shields savings from large drops',
      min: '10',
      dots: '••',
      bars: [
        { asset: 'USDT', pct: 70, color: '#00C99A' },
        { asset: 'BTC', pct: 30, color: '#F7931A' },
      ],
    },
    {
      name: 'Growth',
      subtitle: 'Upside across top assets for 1+ yr',
      min: '30',
      dots: '•••',
      bars: [
        { asset: 'BTC', pct: 70, color: '#F7931A' },
        { asset: 'ETH', pct: 20, color: '#627EEA' },
        { asset: 'SOL', pct: 10, color: '#9945FF' },
      ],
    },
  ];

  return (
    <div
      className={`relative h-full w-full flex flex-col justify-between select-none p-3.5 xs:p-4 transition-colors duration-200 ${
        isLight ? 'bg-white text-slate-900' : 'bg-[#080909] text-white'
      }`}
    >
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-[#00C99A] cursor-pointer hover:opacity-80"
            aria-label="Back to quiz"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[#00C99A] font-bold text-xs">--</span>
        </div>

        <h4
          className={`font-extrabold leading-[1.18] tracking-tight text-[17px] xs:text-[18px] mt-0.5 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          Pick a basket
        </h4>
        <p
          className={`leading-tight text-[11.5px] xs:text-[12px] mt-0.5 mb-2.5 ${
            isLight ? 'text-slate-500' : 'text-neutral-400'
          }`}
        >
          You choose the mix. Never the coins, never the timing.
        </p>

        {/* 2 Baskets Comparison Cards */}
        <div className="space-y-2 mt-2">
          {baskets.map((b, i) => {
            const isPicked = selectedBasket === i;
            return (
              <div
                key={b.name}
                onClick={() => setSelectedBasket(i)}
                className={`rounded-xl border transition-all duration-200 p-2.5 xs:p-3 cursor-pointer select-none ${
                  isPicked
                    ? `border-[#00C99A] bg-[#00C99A]/10 shadow-sm ${isLight ? 'shadow-slate-200' : ''}`
                    : isLight
                    ? 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    : 'border-white/10 bg-[#101212] hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-extrabold text-[14px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {b.name}
                      </span>
                      <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        from ₹{b.min}/day
                      </span>
                    </div>
                    <p className={`mt-0.5 text-[10.5px] leading-tight ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                      {b.subtitle}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#00C99A] tracking-widest">{b.dots}</span>
                </div>

                {/* Split Asset Proportion Bar */}
                <div className={`mt-2 flex h-2 gap-1 overflow-hidden rounded-full ${isLight ? 'bg-slate-200' : 'bg-white/10'}`}>
                  {b.bars.map((bar) => (
                    <div
                      key={bar.asset}
                      style={{ width: `${bar.pct}%`, backgroundColor: bar.color }}
                      className="h-full rounded-full"
                    />
                  ))}
                </div>

                {/* Asset Legend */}
                <div className={`mt-1.5 flex items-center gap-2.5 text-[9.5px] font-mono ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  {b.bars.map((bar) => (
                    <span key={bar.asset} className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: bar.color }} />
                      <span>{bar.asset} {bar.pct}%</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full rounded-xl bg-[#00C99A] font-bold text-[#090A0E] tracking-wide shadow-md shadow-[#00C99A]/20 flex items-center justify-center active:scale-[0.98] h-10 text-[12.5px] cursor-pointer hover:opacity-95 select-none"
      >
        Continue
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PHONE SCREEN 3: Set Daily Amount
   ───────────────────────────────────────────────────────────── */
const AmountScreen: React.FC<ScreenProps> = ({ onNext, onBack }) => {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';
  const [amount, setAmount] = useState(30);
  const chips = [10, 30, 50, 100];

  return (
    <div
      className={`relative h-full w-full flex flex-col justify-between select-none p-3.5 xs:p-4 transition-colors duration-200 ${
        isLight ? 'bg-white text-slate-900' : 'bg-[#080909] text-white'
      }`}
    >
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-[#00C99A] cursor-pointer hover:opacity-80"
            aria-label="Back to baskets"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[#00C99A] font-bold text-xs">--</span>
        </div>

        <h4
          className={`font-extrabold leading-[1.18] tracking-tight text-[17px] xs:text-[18px] mt-0.5 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}
        >
          How much each day?
        </h4>
        <p
          className={`text-[11.5px] xs:text-[12px] mt-0.5 ${
            isLight ? 'text-slate-500' : 'text-neutral-400'
          }`}
        >
          From ₹10 a day on Stable, or ₹30 on Growth. Pause or change it whenever you like.
        </p>

        {/* Big centered amount display */}
        <div className="text-center my-3">
          <div
            className={`font-mono font-extrabold tracking-tight text-4xl ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            ₹{amount}
          </div>
          <p
            className={`mt-0.5 text-[11px] font-mono ${
              isLight ? 'text-slate-500' : 'text-neutral-400'
            }`}
          >
            every day
          </p>
        </div>

        {/* Preset Amount Chips */}
        <div className="flex justify-center gap-2">
          {chips.map((val) => {
            const isPicked = amount === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={`flex items-center justify-center rounded-xl border font-mono font-semibold transition-all duration-200 h-9 px-3.5 text-[12px] cursor-pointer ${
                  isPicked
                    ? 'border-[#00C99A] bg-[#00C99A] text-[#090A0E] font-bold shadow-sm shadow-[#00C99A]/20'
                    : isLight
                    ? 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    : 'border-white/10 bg-[#101212] text-neutral-300 hover:border-white/20'
                }`}
              >
                ₹{val}
              </button>
            );
          })}
        </div>

        {/* Fee breakdown card */}
        <div
          className={`rounded-xl border p-2.5 text-[10.5px] font-mono mt-3 space-y-1 ${
            isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-[#101212]'
          }`}
        >
          <div className={`flex justify-between ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
            <span>Fee per buy, incl. GST:</span>
            <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>₹0.35</span>
          </div>
          <div className={`flex justify-between ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
            <span>Shown before every buy:</span>
            <span className="text-[#00C99A] font-semibold">Always</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full rounded-xl bg-[#00C99A] font-bold text-[#090A0E] tracking-wide shadow-md shadow-[#00C99A]/20 flex items-center justify-center active:scale-[0.98] h-10 text-[12.5px] cursor-pointer hover:opacity-95 select-none"
      >
        Set ₹{amount} a day
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PHONE SCREEN 4: Watch It Build / Receipt
   ───────────────────────────────────────────────────────────── */
const ReceiptScreen: React.FC<ScreenProps> = ({ onBack }) => {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';
  const receiptItems = [
    ['You paid', '₹30.00'],
    ['Satmix fee', '₹0.30'],
    ['GST on fee', '₹0.05'],
    ['Went into basket', '₹29.65'],
    ['Bought', '0.0000053 BTC'],
  ];

  return (
    <div
      className={`relative h-full w-full flex flex-col justify-between select-none p-3.5 xs:p-4 transition-colors duration-200 ${
        isLight ? 'bg-white text-slate-900' : 'bg-[#080909] text-white'
      }`}
    >
      <div>
        {/* Receipt header with back arrow */}
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-1">
          <button
            type="button"
            onClick={onBack}
            className="p-1 -ml-1 text-[#00C99A] cursor-pointer hover:opacity-80"
            aria-label="Back to amount"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>Receipt</span>
          <div className="w-4" />
        </div>

        {/* Animated check badge */}
        <div className="text-center mt-1">
          <span className="mx-auto flex items-center justify-center rounded-full bg-[#00C99A]/15 border border-[#00C99A]/30 h-10 w-10">
            <Check className="w-5 h-5 text-[#00C99A] stroke-[3]" />
          </span>
          <p
            className={`font-extrabold font-mono tracking-tight mt-1.5 text-xl ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            ₹30 to BTC
          </p>
          <p className={`text-[10.5px] font-mono mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
            Today, 9:41 am
          </p>
        </div>

        {/* Notice badge */}
        <div
          className={`rounded-xl leading-snug border mt-2.5 p-2 text-[11px] ${
            isLight
              ? 'bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-white/[0.04] text-neutral-300 border-white/10'
          }`}
        >
          Today's ₹30 went to BTC to keep your mix on target.
        </div>

        {/* Itemized receipt table */}
        <dl className={`divide-y font-mono mt-2.5 text-[11.5px] ${isLight ? 'divide-slate-200' : 'divide-white/5'}`}>
          {receiptItems.map(([label, val]) => (
            <div key={label} className="flex justify-between py-1.5">
              <dt className={isLight ? 'text-slate-500' : 'text-neutral-400'}>{label}</dt>
              <dd className={`tabular-nums font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {val}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p className={`text-[10px] text-center font-mono ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
        Held in your own CoinDCX account.
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT: HowItWorksSection
   ───────────────────────────────────────────────────────────── */
export const HowItWorksSection: React.FC = () => {
  const { colors, themeMode } = useApp();
  const sectionRef = useRef<HTMLElement | null>(null);
  
  // Desktop Refs
  const desktopPinRef = useRef<HTMLDivElement | null>(null);
  const desktopPhoneChassisRef = useRef<HTMLDivElement | null>(null);
  const desktopScreensTrackRef = useRef<HTMLDivElement | null>(null);
  
  // Mobile Refs
  const mobilePinRef = useRef<HTMLDivElement | null>(null);
  const mobileScreensTrackRef = useRef<HTMLDivElement | null>(null);

  // Synchronized state for step UI highlights
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ── GSAP 3 PINNED & SCRUBBED SCROLLTRIGGER ORCHESTRATION ──
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── DESKTOP SCROLLTIMELINE (>= 1024px) ───────────────────
      mm.add('(min-width: 1024px)', () => {
        if (!desktopPinRef.current || !desktopScreensTrackRef.current || !desktopPhoneChassisRef.current) return;

        // Total timeline duration: 7 units (1 dwell + 1 transition per step)
        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'how-it-works-desktop',
            trigger: sectionRef.current,
            pin: desktopPinRef.current,
            start: 'top top',
            end: '+=2600',
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;
              setScrollProgress(p);
              // Map continuous progress to active step (0, 1, 2, 3)
              let step = 0;
              if (p >= 0.72) step = 3;
              else if (p >= 0.44) step = 2;
              else if (p >= 0.18) step = 1;
              setActiveStep(step);
            },
          },
        });

        // Step 0: Initial state (Quiz)
        gsap.set(desktopScreensTrackRef.current, { xPercent: 0 });
        gsap.set(desktopPhoneChassisRef.current, {
          rotateX: TILT_ANGLES[0].x,
          rotateY: TILT_ANGLES[0].y,
        });

        // Step 1 -> Step 2 (Slide from 0% to -25%)
        tl.to(desktopScreensTrackRef.current, {
          xPercent: -25,
          ease: 'power2.inOut',
          duration: 1,
        }, 1)
        .to(desktopPhoneChassisRef.current, {
          rotateX: TILT_ANGLES[1].x,
          rotateY: TILT_ANGLES[1].y,
          ease: 'power1.inOut',
          duration: 1,
        }, 1)

        // Step 2 -> Step 3 (Slide from -25% to -50%)
        .to(desktopScreensTrackRef.current, {
          xPercent: -50,
          ease: 'power2.inOut',
          duration: 1,
        }, 3)
        .to(desktopPhoneChassisRef.current, {
          rotateX: TILT_ANGLES[2].x,
          rotateY: TILT_ANGLES[2].y,
          ease: 'power1.inOut',
          duration: 1,
        }, 3)

        // Step 3 -> Step 4 (Slide from -50% to -75%)
        .to(desktopScreensTrackRef.current, {
          xPercent: -75,
          ease: 'power2.inOut',
          duration: 1,
        }, 5)
        .to(desktopPhoneChassisRef.current, {
          rotateX: TILT_ANGLES[3].x,
          rotateY: TILT_ANGLES[3].y,
          ease: 'power1.inOut',
          duration: 1,
        }, 5);

        // Terminal dwell buffer
        tl.to({}, { duration: 1 }, 6);
      });

      // ── MOBILE SCROLLTIMELINE (< 1024px) ─────────────────────
      mm.add('(max-width: 1023px)', () => {
        if (!mobilePinRef.current || !mobileScreensTrackRef.current) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'how-it-works-mobile',
            trigger: sectionRef.current,
            pin: mobilePinRef.current,
            start: 'top top',
            end: '+=2000',
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;
              setScrollProgress(p);
              let step = 0;
              if (p >= 0.72) step = 3;
              else if (p >= 0.44) step = 2;
              else if (p >= 0.18) step = 1;
              setActiveStep(step);
            },
          },
        });

        gsap.set(mobileScreensTrackRef.current, { xPercent: 0 });

        tl.to(mobileScreensTrackRef.current, {
          xPercent: -25,
          ease: 'power2.inOut',
          duration: 1,
        }, 1)
        .to(mobileScreensTrackRef.current, {
          xPercent: -50,
          ease: 'power2.inOut',
          duration: 1,
        }, 3)
        .to(mobileScreensTrackRef.current, {
          xPercent: -75,
          ease: 'power2.inOut',
          duration: 1,
        }, 5);

        tl.to({}, { duration: 1 }, 6);
      });
    }, sectionRef);

    // Refresh ScrollTrigger to ensure accurate layout metrics
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  // Programmatic smooth step jump (integrating Lenis when available)
  const handleStepClick = (index: number) => {
    setActiveStep(index);
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
    const stId = isDesktop ? 'how-it-works-desktop' : 'how-it-works-mobile';
    const st = ScrollTrigger.getById(stId);

    if (st) {
      // Map step index (0, 1, 2, 3) to the center of its dwell zone
      const targetFraction = (index * 2 + 0.5) / 7;
      const targetScroll = st.start + targetFraction * (st.end - st.start);

      if ((window as any).satmixLenis) {
        (window as any).satmixLenis.scrollTo(targetScroll, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  };

  const handleNextStep = () => {
    if (activeStep < STEPS_DATA.length - 1) {
      handleStepClick(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 0) {
      handleStepClick(activeStep - 1);
    }
  };

  // Global listener for navbar "How It Works" click
  useEffect(() => {
    const handleResetToOne = () => {
      handleStepClick(0);
    };

    window.addEventListener('satmix:reset-steps-to-one', handleResetToOne);
    return () => window.removeEventListener('satmix:reset-steps-to-one', handleResetToOne);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="steps-animation"
      className="relative"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Seamless ambient blend connecting from WaitlistSection */}
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none z-0"
        style={{
          background:
            themeMode === 'dark'
              ? 'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(93, 23, 235, 0.06) 0%, transparent 100%)'
              : 'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(93, 23, 235, 0.03) 0%, transparent 100%)',
        }}
      />

      {/* ==============================================================
          A. DESKTOP VIEWPORT (lg:flex, hidden on mobile)
          GSAP Pinned 2-Column ScrollTrigger Timeline + 3D Tilting Phone Frame
          ============================================================== */}
      <div
        ref={desktopPinRef}
        className="hidden lg:flex h-screen flex-col justify-between w-full pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-hidden relative z-10"
      >
        {/* 1. Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
              Four steps, then it runs on habit.
            </h2>
          </div>
        </div>

        {/* 2. Main Desktop Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center z-10">
          <div className="grid grid-cols-12 gap-14 items-center w-full">
            
            {/* Left Column: Vertical Timeline Steps */}
            <div className="col-span-6 relative">
              <ol className="space-y-4 relative" aria-label="Steps">
                {STEPS_DATA.map((step, idx) => {
                  const isCurrent = activeStep === idx;
                  const isPast = idx < activeStep;

                  return (
                    <li key={step.title} className="relative">
                      {/* Vertical connecting rail segment to next step */}
                      {idx < STEPS_DATA.length - 1 && (
                        <div
                          className="absolute left-[28px] -translate-x-1/2 top-[48px] bottom-[-24px] w-[2px] z-0 overflow-hidden pointer-events-none rounded-full"
                          style={{
                            backgroundColor:
                              themeMode === 'dark'
                                ? 'rgba(255, 255, 255, 0.12)'
                                : 'rgba(15, 23, 42, 0.12)',
                          }}
                        >
                          <div
                            className="w-full bg-[#00C99A] origin-top transition-transform duration-300 rounded-full"
                            style={{
                              transform: idx < activeStep ? 'scaleY(1)' : isCurrent ? `scaleY(${Math.max(0, (scrollProgress * 4 - idx))})` : 'scaleY(0)',
                              height: '100%',
                            }}
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleStepClick(idx)}
                        className="group flex w-full gap-5 p-2 rounded-2xl text-left transition-all duration-300 cursor-pointer select-none relative z-10"
                      >
                        {/* Number Indicator Circle */}
                        <span
                          className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-extrabold font-mono transition-all duration-300 shadow-sm"
                          style={{
                            backgroundColor: isCurrent
                              ? themeMode === 'dark' ? '#FFFFFF' : '#0F172A'
                              : isPast
                              ? themeMode === 'dark' ? '#080909' : '#F1F5F9'
                              : themeMode === 'dark' ? '#080909' : '#F8FAFC',
                            borderColor: isCurrent
                              ? themeMode === 'dark' ? '#FFFFFF' : '#0F172A'
                              : isPast
                              ? '#00C99A'
                              : colors.borderDim,
                            color: isCurrent
                              ? themeMode === 'dark' ? '#000000' : '#FFFFFF'
                              : isPast
                              ? '#00C99A'
                              : colors.textSecondary,
                            boxShadow: isCurrent
                              ? themeMode === 'dark'
                                ? '0 0 18px rgba(255,255,255,0.45)'
                                : '0 4px 14px rgba(15, 23, 42, 0.25)'
                              : undefined,
                          }}
                        >
                          {idx + 1}
                        </span>

                        {/* Title & Body */}
                        <div className="min-w-0 flex-1 pt-1">
                          <span
                            className="block text-xl sm:text-2xl font-extrabold tracking-tight transition-colors duration-300"
                            style={{
                              color: isCurrent
                                ? colors.textPrimary
                                : isPast
                                ? colors.textSecondary
                                : themeMode === 'dark' ? '#6B7280' : '#94A3B8',
                            }}
                          >
                            {step.title}
                          </span>

                          {/* Smooth expanding description accordion */}
                          <div
                            className={`transition-all duration-300 ease-out overflow-hidden ${
                              isCurrent ? 'max-h-28 opacity-100 mt-2' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <p className="text-sm leading-relaxed max-w-md font-medium text-neutral-400">
                              {step.body}
                            </p>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Right Column: 3D Titanium Phone Chassis with Hardware Scrub Track */}
            <div className="col-span-6 flex items-center justify-center relative">
              <div
                className="absolute w-[340px] h-[480px] rounded-full blur-[100px] opacity-25 pointer-events-none"
                style={{ background: '#00C99A' }}
              />

              <div
                ref={desktopPhoneChassisRef}
                style={{ perspective: 1400 }}
                className="relative select-none will-change-transform"
              >
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[240px] h-10 rounded-[50%] bg-black/60 blur-xl pointer-events-none" />

                <div
                  className={`relative w-[310px] h-[580px] rounded-[50px] p-[9px] transition-all duration-300 ${
                    themeMode === 'light'
                      ? 'bg-gradient-to-b from-[#E2E8F0] via-[#CBD5E1] to-[#94A3B8] shadow-[0_32px_75px_-15px_rgba(15,23,42,0.22),0_12px_24px_-6px_rgba(15,23,42,0.12),0_0_0_1px_rgba(255,255,255,0.9)]'
                      : 'bg-gradient-to-b from-[#3E414B] via-[#20222D] to-[#12131A] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.18)]'
                  }`}
                >
                  <div
                    className={`relative w-full h-full rounded-[42px] p-[2px] transition-colors duration-300 overflow-hidden ${
                      themeMode === 'light'
                        ? 'bg-[#CBD5E1] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8)]'
                        : 'bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                    }`}
                  >
                    <div
                      className={`relative w-full h-full rounded-[40px] flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
                        themeMode === 'light' ? 'bg-white' : 'bg-[#080909]'
                      }`}
                    >
                      {/* Dynamic Island Notch */}
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none">
                        <div className="w-24 h-5 rounded-full bg-black flex items-center justify-between px-3 shadow-sm border border-white/5">
                          <div className="w-2 h-2 rounded-full bg-[#111] border border-white/10" />
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00C99A]/60" />
                        </div>
                      </div>

                      {/* Continuous Scrubbed Horizontal Screen Carousel */}
                      <div className="relative flex-1 pt-7 overflow-hidden">
                        <div
                          ref={desktopScreensTrackRef}
                          className="flex h-full w-[400%] will-change-transform"
                        >
                          <div className="w-1/4 h-full flex-shrink-0 relative overflow-hidden">
                            <QuizScreen active={activeStep === 0} onNext={handleNextStep} />
                          </div>
                          <div className="w-1/4 h-full flex-shrink-0 relative overflow-hidden">
                            <BasketScreen active={activeStep === 1} onNext={handleNextStep} onBack={handlePrevStep} />
                          </div>
                          <div className="w-1/4 h-full flex-shrink-0 relative overflow-hidden">
                            <AmountScreen active={activeStep === 2} onNext={handleNextStep} onBack={handlePrevStep} />
                          </div>
                          <div className="w-1/4 h-full flex-shrink-0 relative overflow-hidden">
                            <ReceiptScreen active={activeStep === 3} onBack={handlePrevStep} />
                          </div>
                        </div>
                      </div>

                      {/* Home Indicator Bar */}
                      <div
                        className={`w-28 h-1 rounded-full mx-auto mb-2 pointer-events-none z-50 transition-colors duration-300 ${
                          themeMode === 'light' ? 'bg-slate-300' : 'bg-white/20'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ==============================================================
          B. MOBILE VIEWPORT (flex lg:hidden)
          GSAP Pinned Full-Viewport Container Driving 4 Steps on Scrub
          ============================================================== */}
      <div
        ref={mobilePinRef}
        className="flex lg:hidden h-screen flex-col justify-center items-center w-full px-4 pt-16 pb-12 xs:pb-14 select-none box-border overflow-hidden z-10 relative"
      >
        {/* Mobile Ambient Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[400px] rounded-full blur-[80px] opacity-15 pointer-events-none"
          style={{ background: '#00C99A' }}
        />

        {/* Section Heading */}
        <div className="w-full text-center mb-2 xs:mb-3">
          <h2 className="text-xl xs:text-2xl font-extrabold tracking-tight leading-[1.15]" style={{ color: colors.textPrimary }}>
            Four steps, then it runs on habit.
          </h2>
        </div>

        {/* Realistic Mobile Phone Frame */}
        <div className="w-full flex items-center justify-center relative select-none mb-2.5 xs:mb-3">
          <div className="relative select-none flex items-center justify-center">
            
            {/* Left Hardware Buttons */}
            <div className={`absolute -left-[3.5px] top-[74px] w-[3.5px] h-[28px] rounded-l-xs border-l border-y ${
              themeMode === 'light' ? 'bg-[#CBD5E1] border-slate-300' : 'bg-[#2F323A] border-white/10'
            }`} />
            <div className={`absolute -left-[3.5px] top-[110px] w-[3.5px] h-[28px] rounded-l-xs border-l border-y ${
              themeMode === 'light' ? 'bg-[#CBD5E1] border-slate-300' : 'bg-[#2F323A] border-white/10'
            }`} />
            {/* Right Hardware Button: Sleep/Wake */}
            <div className={`absolute -right-[3.5px] top-[88px] w-[3.5px] h-[44px] rounded-r-xs border-r border-y ${
              themeMode === 'light' ? 'bg-[#CBD5E1] border-slate-300' : 'bg-[#2F323A] border-white/10'
            }`} />

            {/* Outer Phone Chassis */}
            <div
              className={`relative w-[280px] xs:w-[305px] sm:w-[325px] h-[425px] xs:h-[455px] sm:h-[485px] rounded-[44px] p-[7.5px] transition-all duration-300 ${
                themeMode === 'light'
                  ? 'shadow-[0_25px_60px_-12px_rgba(15,23,42,0.20),0_0_0_1px_rgba(255,255,255,0.9)]'
                  : 'shadow-[0_20px_50px_-12px_rgba(0,0,0,0.92),0_0_0_1px_rgba(255,255,255,0.16)]'
              }`}
              style={{
                background:
                  themeMode === 'light'
                    ? 'linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 45%, #94A3B8 100%)'
                    : 'linear-gradient(180deg, #3A3D48 0%, #20222B 40%, #121319 100%)',
              }}
            >
              {/* Inner Metallic Rim */}
              <div
                className={`relative w-full h-full rounded-[38px] p-[1.5px] transition-all duration-300 ${
                  themeMode === 'light'
                    ? 'bg-gradient-to-b from-white/90 via-white/50 to-slate-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]'
                    : 'bg-gradient-to-b from-white/15 via-white/5 to-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                }`}
              >
                {/* Screen Viewport */}
                <div
                  className={`relative w-full h-full rounded-[36px] flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
                    themeMode === 'light'
                      ? 'bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]'
                      : 'bg-[#080909] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.8)]'
                  }`}
                >
                  {/* Status Bar & Dynamic Island */}
                  <div
                    className={`relative w-full h-7 px-4 pt-1.5 flex items-center justify-between text-[11px] font-semibold z-50 pointer-events-none transition-colors duration-300 ${
                      themeMode === 'light' ? 'text-slate-800' : 'text-white/90'
                    }`}
                  >
                    <span className="font-semibold tracking-tight text-[11px] pl-0.5">9:41</span>

                    <div className="absolute left-1/2 -translate-x-1/2 top-1.5 h-4 w-24 rounded-full bg-black border border-white/5 flex items-center justify-between px-2.5 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#16181F] border border-white/10" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00C99A]/60" />
                    </div>

                    <div className="flex items-center gap-1.5 pr-0.5">
                      <svg className="w-3.5 h-2.5 fill-current" viewBox="0 0 17 12">
                        <rect x="0" y="8" width="2.5" height="4" rx="0.5" />
                        <rect x="4.5" y="5.5" width="2.5" height="6.5" rx="0.5" />
                        <rect x="9" y="3" width="2.5" height="9" rx="0.5" />
                        <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" />
                      </svg>
                      <div
                        className={`w-3.5 h-2 rounded-[2px] border p-[0.5px] flex items-center ${
                          themeMode === 'light' ? 'border-slate-800' : 'border-white/80'
                        }`}
                      >
                        <div className={`h-full w-full rounded-[0.5px] ${themeMode === 'light' ? 'bg-slate-800' : 'bg-white'}`} />
                      </div>
                    </div>
                  </div>

                  {/* Centered URL Bar */}
                  <div
                    className={`w-full flex items-center justify-center gap-1 text-[8.5px] font-mono py-0.5 opacity-70 pointer-events-none z-40 ${
                      themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'
                    }`}
                  >
                    <Lock className={`w-2.5 h-2.5 ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'}`} />
                    <span>satmix.in/app</span>
                  </div>

                  {/* Mobile Scrubbed Horizontal Screen Carousel */}
                  <div className="relative flex-1 overflow-hidden">
                    <div
                      ref={mobileScreensTrackRef}
                      className="flex h-full w-[400%] will-change-transform"
                    >
                      <div className="w-1/4 h-full flex-shrink-0 relative overflow-hidden">
                        <QuizScreen active={activeStep === 0} onNext={handleNextStep} />
                      </div>
                      <div className="w-1/4 h-full flex-shrink-0 relative overflow-hidden">
                        <BasketScreen active={activeStep === 1} onNext={handleNextStep} onBack={handlePrevStep} />
                      </div>
                      <div className="w-1/4 h-full flex-shrink-0 relative overflow-hidden">
                        <AmountScreen active={activeStep === 2} onNext={handleNextStep} onBack={handlePrevStep} />
                      </div>
                      <div className="w-1/4 h-full flex-shrink-0 relative overflow-hidden">
                        <ReceiptScreen active={activeStep === 3} onBack={handlePrevStep} />
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator Bar */}
                  <div className={`w-24 h-1 rounded-full mx-auto mb-1.5 pointer-events-none z-50 flex-shrink-0 ${
                    themeMode === 'light' ? 'bg-slate-300' : 'bg-white/30'
                  }`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Progress Indicators & Step Details (Positioned Directly Below Phone) */}
        <div className="w-full max-w-[280px] xs:max-w-[305px] sm:max-w-[325px] mx-auto space-y-1.5 select-none">
          {/* 4-Step Segmented Progress Bar */}
          <div className="flex gap-1.5 w-full">
            {STEPS_DATA.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleStepClick(i)}
                className="h-1 flex-1 rounded-full overflow-hidden cursor-pointer transition-colors"
                style={{
                  backgroundColor:
                    themeMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.12)',
                }}
                aria-label={`Jump to step ${i + 1}`}
              >
                <div
                  className="h-full bg-[#00C99A] transition-all duration-200 origin-left"
                  style={{
                    width:
                      i < activeStep
                        ? '100%'
                        : i === activeStep
                        ? `${Math.min(100, Math.max(0, (scrollProgress * 4 - i) * 100))}%`
                        : '0%',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Dynamic Step Text */}
          <div className="pt-0.5 text-center">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#00C99A]">
              Step {activeStep + 1} of 4
            </span>
            <h4 className="text-sm font-extrabold tracking-tight mt-0.5" style={{ color: colors.textPrimary }}>
              {STEPS_DATA[activeStep]?.title}
            </h4>
            <p className="text-[11px] leading-tight text-neutral-400 mt-0.5 line-clamp-2">
              {STEPS_DATA[activeStep]?.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
