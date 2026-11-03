// ============================================================
// FILE: src/components/marketing/HowItWorksSection.tsx
// PURPOSE: "Four steps, then it runs on habit."
//          Interactive Satmix Onboarding Quiz & 4-Step Design System
//          - Recreated from Claude Artifact reference (https://claude.ai/artifact/3hqYpJV8vabS67LnGR7aJp)
//          - Design Tokens:
//            * Page Background: #080909
//            * Elevated Surface: #101212 / #121417
//            * Primary Turquoise Accent: #00C99A
//            * Primary Text: #DADADA / #FFFFFF
//            * Muted Secondary Text: #8E8E93 / #A1A1AA
//          - Step 1: 5-Question Interactive Risk Quiz (selectable answers, back/continue navigation)
//          - Step 2: Pick a Basket (Stable 70/30 vs Growth 70/20/10)
//          - Step 3: Set Daily Amount (₹10, ₹30, ₹50, ₹100 chips + fee transparency)
//          - Step 4: Watch It Build (Itemized live receipt breakdown)
//          - Dual Viewport:
//            * Desktop (lg:flex): 2-column sticky scroll-timeline with 3D tilting titanium chassis
//            * Mobile (block lg:hidden): Natural flow, centered flagship phone frame, 4-segment progress bar
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  ChevronLeft,
  Minus,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence, useScroll } from 'motion/react';

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
   5-QUESTION QUIZ DATA SPECIFICATION (Phase 4)
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
const QuizScreen: React.FC<ScreenProps> = ({ active, onNext }) => {
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
              <motion.div
                key={opt}
                onClick={() => handleSelectOption(i)}
                animate={{ scale: isPicked ? [1, 0.99, 1] : 1 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center justify-between rounded-xl border px-3.5 transition-all duration-200 h-[42px] xs:h-[45px] text-[12.5px] xs:text-[13px] cursor-pointer select-none ${
                  isPicked
                    ? `border-[#00C99A] bg-[#00C99A]/10 font-semibold ${isLight ? 'text-slate-900 shadow-xs' : 'text-white'}`
                    : isLight
                    ? 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    : 'border-white/10 bg-[#101212] text-neutral-300 hover:border-white/20'
                }`}
              >
                <span>{opt}</span>
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                    isPicked
                      ? 'border-[#00C99A] bg-[#00C99A]'
                      : isLight
                      ? 'border-slate-300 bg-white'
                      : 'border-white/20'
                  }`}
                >
                  {isPicked && <Check className="w-2.5 h-2.5 text-[#090A0E] stroke-[3]" />}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Continue Action Button */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={selectedOption === null}
        className={`w-full rounded-xl font-bold tracking-wide transition-all duration-200 flex items-center justify-center h-10 text-[12.5px] select-none ${
          selectedOption !== null
            ? 'bg-[#00C99A] text-[#090A0E] shadow-md shadow-[#00C99A]/20 active:scale-[0.98] cursor-pointer hover:opacity-95'
            : isLight
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
            : 'bg-white/10 text-neutral-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   PHONE SCREEN 2: Pick a Basket (Screenshot 2 Reference)
   ───────────────────────────────────────────────────────────── */
const BasketScreen: React.FC<ScreenProps> = ({ onNext, onBack }) => {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';
  const [selectedBasket, setSelectedBasket] = useState<number>(1); // Default Growth mix selected

  const baskets = [
    {
      name: 'Stable',
      subtitle: 'Lower risk than Growth, not risk-free.',
      min: 10,
      bars: [
        { asset: 'USDT', pct: 70, color: '#26A17B' },
        { asset: 'BTC', pct: 30, color: '#F7931A' },
      ],
      dots: '--',
    },
    {
      name: 'Growth',
      subtitle: 'Long-term crypto, built a little every day.',
      min: 30,
      bars: [
        { asset: 'BTC', pct: 70, color: '#F7931A' },
        { asset: 'ETH', pct: 20, color: '#627EEA' },
        { asset: 'SOL', pct: 10, color: '#9945FF' },
      ],
      dots: '••••',
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
   PHONE SCREEN 3: Set Daily Amount (Screenshot 3 Reference)
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
   PHONE SCREEN 4: Watch It Build / Receipt (Screenshot 4 Reference)
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

        {/* Itemized receipt table matching Screenshot 4 */}
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
        Held in your own [Partner] account.
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT: StepsSection
   ───────────────────────────────────────────────────────────── */
export const HowItWorksSection: React.FC = () => {
  const { colors, themeMode } = useApp();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Monitor continuous scroll progress inside desktop section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      // If auto-scroll navigation is in progress, skip updating steps to avoid jank and scroll cancellation
      if ((window as unknown as { __satmixNavigating?: boolean }).__satmixNavigating) {
        return;
      }

      const stepIndex = Math.max(
        0,
        Math.min(STEPS_DATA.length - 1, Math.floor(latest * STEPS_DATA.length))
      );
      setActiveStep((prev) => {
        if (prev !== stepIndex) {
          setDirection(stepIndex > prev ? 1 : -1);
        }
        return stepIndex;
      });
    });
  }, [scrollYProgress]);

  const handleStepClick = (index: number) => {
    setDirection(index > activeStep ? 1 : -1);
    setActiveStep(index);

    if (sectionRef.current) {
      const top = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const height = sectionRef.current.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: top + height * ((index + 0.5) / STEPS_DATA.length),
        behavior: 'smooth',
      });
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

  const currentTilt = TILT_ANGLES[activeStep] || TILT_ANGLES[0];
  const activeStepData = STEPS_DATA[activeStep] || STEPS_DATA[0];

  // Global listener to jump to Step 1 from navbar "How It Works" regardless of current scroll or page
  useEffect(() => {
    const handleResetToOne = () => {
      setActiveStep(0);
      setDirection(-1);
    };

    window.addEventListener('satmix:reset-steps-to-one', handleResetToOne);
    return () => window.removeEventListener('satmix:reset-steps-to-one', handleResetToOne);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="steps-animation"
      className="relative h-[360vh]"
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
          2-Column Sticky Scroll-Driven Timeline + 3D Tilting Phone Frame
          ============================================================== */}
      <div className="hidden lg:flex sticky top-0 h-[100dvh] flex-col justify-between w-full pt-20 sm:pt-24 pb-8 sm:pb-12 overflow-hidden">
        
        {/* 1. Header (Sticky Top) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
              Four steps, then it runs on habit.
            </h2>
          </div>
        </div>

        {/* 2. Main Desktop Sticky Grid */}
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
                            className="w-full bg-[#00C99A] origin-top transition-transform duration-500 rounded-full"
                            style={{
                              transform: idx < activeStep ? 'scaleY(1)' : 'scaleY(0)',
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
                                ? '0 0 15px rgba(255,255,255,0.4)'
                                : '0 4px 14px rgba(15, 23, 42, 0.2)'
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

                          <AnimatePresence initial={false}>
                            {isCurrent && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                                className="overflow-hidden"
                              >
                                <p className="pt-2 text-sm leading-relaxed max-w-md font-medium text-neutral-400">
                                  {step.body}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Right Column: 3D Titanium Phone Chassis */}
            <div className="col-span-6 flex items-center justify-center relative">
              <div
                className="absolute w-[340px] h-[480px] rounded-full blur-[100px] opacity-25 pointer-events-none"
                style={{ background: '#00C99A' }}
              />

              <motion.div
                animate={{
                  rotateX: currentTilt.x,
                  rotateY: currentTilt.y,
                }}
                transition={{ type: 'spring', stiffness: 100, damping: 22 }}
                style={{ perspective: 1400 }}
                className="relative select-none"
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

                      {/* Screen Switcher */}
                      <div className="relative flex-1 pt-7 overflow-hidden">
                        <AnimatePresence custom={direction} initial={false} mode="wait">
                          <motion.div
                            key={activeStep}
                            custom={direction}
                            variants={{
                              enter: (dir: number) => ({
                                x: dir > 0 ? '100%' : '-30%',
                                opacity: 0,
                              }),
                              center: {
                                x: '0%',
                                opacity: 1,
                              },
                              exit: (dir: number) => ({
                                x: dir > 0 ? '-30%' : '100%',
                                opacity: 0,
                              }),
                            }}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                            className="absolute inset-0 h-full w-full"
                          >
                            {activeStep === 0 && <QuizScreen active={activeStep === 0} onNext={handleNextStep} />}
                            {activeStep === 1 && <BasketScreen active={activeStep === 1} onNext={handleNextStep} onBack={handlePrevStep} />}
                            {activeStep === 2 && <AmountScreen active={activeStep === 2} onNext={handleNextStep} onBack={handlePrevStep} />}
                            {activeStep === 3 && <ReceiptScreen active={activeStep === 3} onBack={handlePrevStep} />}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <div
                        className={`w-28 h-1 rounded-full mx-auto mb-2 pointer-events-none z-50 transition-colors duration-300 ${
                          themeMode === 'light' ? 'bg-slate-300' : 'bg-white/20'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>

      </div>

      {/* ==============================================================
          B. MOBILE VIEWPORT (flex lg:hidden)
          Sticky Full-Screen Container Driving 4 Steps on Scroll
          ============================================================== */}
      <div className="flex lg:hidden sticky top-0 h-[100dvh] flex-col justify-center items-center w-full px-4 pt-16 pb-12 xs:pb-14 select-none box-border overflow-hidden z-10">
        
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

        {/* Realistic Mobile Phone Frame (Proportional to 100dvh mobile viewport) */}
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
              {/* Thin Inner Metallic Rim */}
              <div
                className={`relative w-full h-full rounded-[38px] p-[1.5px] transition-all duration-300 ${
                  themeMode === 'light'
                    ? 'bg-gradient-to-b from-white/90 via-white/50 to-slate-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]'
                    : 'bg-gradient-to-b from-white/15 via-white/5 to-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                }`}
              >
                
                {/* Concentric Screen Container */}
                <div
                  className={`relative w-full h-full rounded-[36px] flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
                    themeMode === 'light'
                      ? 'bg-white shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]'
                      : 'bg-[#080909] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.8)]'
                  }`}
                >
                  
                  {/* iOS Status Bar & Dynamic Island */}
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

                  {/* Centered In-App Browser URL Bar */}
                  <div
                    className={`w-full flex items-center justify-center gap-1 text-[8.5px] font-mono py-0.5 opacity-70 pointer-events-none z-40 ${
                      themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'
                    }`}
                  >
                    <Lock className={`w-2.5 h-2.5 ${themeMode === 'light' ? 'text-slate-500' : 'text-neutral-400'}`} />
                    <span>satmix.in/app</span>
                  </div>

                  {/* Reactive Screen Container with Animated Swapping */}
                  <div className="relative flex-1 overflow-hidden">
                    <AnimatePresence custom={direction} initial={false} mode="wait">
                      <motion.div
                        key={activeStep}
                        custom={direction}
                        variants={{
                          enter: (dir: number) => ({
                            x: dir > 0 ? '100%' : '-30%',
                            opacity: 0,
                          }),
                          center: {
                            x: '0%',
                            opacity: 1,
                          },
                          exit: (dir: number) => ({
                            x: dir > 0 ? '-30%' : '100%',
                            opacity: 0,
                          }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        className="absolute inset-0 h-full w-full"
                      >
                        {activeStep === 0 && <QuizScreen active={activeStep === 0} onNext={handleNextStep} />}
                        {activeStep === 1 && <BasketScreen active={activeStep === 1} onNext={handleNextStep} onBack={handlePrevStep} />}
                        {activeStep === 2 && <AmountScreen active={activeStep === 2} onNext={handleNextStep} onBack={handlePrevStep} />}
                        {activeStep === 3 && <ReceiptScreen active={activeStep === 3} onBack={handlePrevStep} />}
                      </motion.div>
                    </AnimatePresence>
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
                className="h-1 flex-1 rounded-full overflow-hidden cursor-pointer transition-colors" style={{ backgroundColor: themeMode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.12)" }}
                aria-label={`Jump to step ${i + 1}`}
              >
                <span
                  className="block h-full bg-[#00C99A] transition-transform duration-300 origin-left"
                  style={{ transform: `scaleX(${i <= activeStep ? 1 : 0})` }}
                />
              </button>
            ))}
          </div>

          {/* Synchronized Step Number & Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.16 }}
              className="space-y-0.5 text-left pt-0.5"
            >
              <h3 className="text-[15px] xs:text-[16px] font-bold tracking-tight flex items-baseline gap-2" style={{ color: colors.textPrimary }}>
                <span className="font-mono font-bold" style={{ color: colors.textPrimary }}>{activeStep + 1}</span>
                <span>{activeStepData.title}</span>
              </h3>
              <p className="text-[12px] xs:text-[12.5px] leading-snug font-normal line-clamp-2" style={{ color: colors.textSecondary }}>
                {activeStepData.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
