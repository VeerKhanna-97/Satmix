import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Clock,
  CheckSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface TutorialStep {
  title: string;
  badge: string;
  desc: string;
  icon: any;
  highlight?: string;
  subBullets: string[];
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'Daily Crypto Micro-Investing from ₹10',
    badge: 'Step 1 of 5 · The Habit',
    desc: 'Satmix turns disciplined daily micro-savings into long-term digital asset wealth. Automate daily debits without staring at charts or timing volatile market tops and bottoms.',
    icon: Sparkles,
    highlight: 'Start with just ₹10/day (less than a daily chai)',
    subBullets: [
      'Automated daily Rupee Cost Averaging (DCA)',
      'Disciplined daily compounding without stress',
      'No lump-sum capital requirement',
    ],
  },
  {
    title: 'Two Curated Baskets (Run Both Concurrently)',
    badge: 'Step 2 of 5 · The Baskets',
    desc: 'Choose between Stable Basket (85% USDT / 15% BTC) for capital guarding or Growth Basket (70% BTC / 20% ETH / 10% SOL) for core market upside. You can run both at the same time with separate daily amounts.',
    icon: Layers,
    highlight: 'Stable Basket: Capital Guard · Growth Basket: Market Upside',
    subBullets: [
      'Stable Basket: Min ₹10/day · 85% USDT + 15% BTC',
      'Growth Basket: Min ₹30/day · 70% BTC + 20% ETH + 10% SOL',
      'Zero coin picking, zero churn, zero emotional trades',
    ],
  },
  {
    title: 'Live Market Pricing & Automated Execution',
    badge: 'Step 3 of 5 · Execution Engine',
    desc: 'All crypto asset prices and holdings Mark-to-Market (MTM) valuations update in real-time from live crypto spot markets. Your daily micro-investments are automated seamlessly via UPI AutoPay.',
    icon: Clock,
    highlight: 'Real-time live MTM tracking · Disciplined daily execution',
    subBullets: [
      'Real-time live spot prices for BTC, ETH, SOL, and USDT',
      'Automatic daily habit tracking with instant ledger updates',
      'Instant UPI deposits and 24/7 bank withdrawals',
    ],
  },
  {
    title: 'Streaks & Streak Freeze Shields',
    badge: 'Step 4 of 5 · Habit Protection',
    desc: 'Investing daily builds your continuous streak, unlocking XP rewards and milestone badges. If you ever miss a day due to bank downtime or a busy schedule, our Streak Freeze Shields protect you automatically.',
    icon: Shield,
    highlight: 'Earn 1 Shield every 14 active days (Hold up to 2)',
    subBullets: [
      'Auto-Protection: Missed a day? 1 Shield is consumed to keep your streak intact',
      'Fixed Sunday-to-Saturday calendar tracker keeps progress clear and predictable',
      'Maintain continuous momentum to unlock exclusive milestone ranks and XP perks',
    ],
  },
  {
    title: 'Find Your Basket Fit with a 3-Question Quiz',
    badge: 'Step 5 of 5 · Onboarding Fit',
    desc: 'Take our 30-second 3-question quiz to find whether Stable or Growth basket matches your current financial goals and risk comfort. You can always switch or add the other basket anytime.',
    icon: CheckSquare,
    highlight: 'Personalized basket fit · 100% control to adjust anytime',
    subBullets: [
      '3 quick questions on price moves, experience, and goals',
      'Score ≤ 3 suggests Stable · Score ≥ 4 suggests Growth',
      'Confirm amount, save habit, and start compounding',
    ],
  },
];

interface TutorialModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onFinish: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onFinish,
}) => {
  const { colors, triggerConfetti } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const stepData = TUTORIAL_STEPS[currentStep];
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirst = currentStep === 0;
  const Icon = stepData.icon;

  const handleNext = () => {
    if (isLast) {
      triggerConfetti();
      onFinish();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    triggerConfetti();
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 backdrop-blur-2xl relative overflow-hidden"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        }}
      >
        {/* Background glow */}
        <div
          className="absolute -top-24 -right-24 w-60 h-60 rounded-full blur-[100px] pointer-events-none opacity-20 animate-ambient-glow"
          style={{ background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)` }}
        />

        {/* Top Header & Progress */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border font-mono"
              style={{
                backgroundColor: colors.accentTint,
                borderColor: colors.borderAccent,
                color: colors.accent,
              }}
            >
              {stepData.badge}
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{ color: colors.textSecondary }}
          >
            Skip Tutorial
          </button>
        </div>

        {/* Progress Dots */}
        <div
          className="grid gap-2 mb-6"
          style={{ gridTemplateColumns: `repeat(${TUTORIAL_STEPS.length}, minmax(0, 1fr))` }}
        >
          {TUTORIAL_STEPS.map((_, idx) => (
            <div
              key={idx}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  idx <= currentStep ? colors.accent : colors.surface,
              }}
            />
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
            {/* Step Icon */}
            <div
              className="w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: colors.accentTint,
                borderColor: colors.borderAccent,
                color: colors.accent,
              }}
            >
              <Icon className="w-6 h-6" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
                {stepData.title}
              </h2>
              <p className="text-xs sm:text-sm mt-2 leading-relaxed" style={{ color: colors.textSecondary }}>
                {stepData.desc}
              </p>
            </div>

            {/* Highlight Box */}
            {stepData.highlight && (
              <div
                className="p-3.5 rounded-2xl border text-xs font-bold font-mono flex items-center gap-2"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.borderAccent,
                  color: colors.accent,
                }}
              >
                <Zap className="w-4 h-4 flex-shrink-0" />
                <span>{stepData.highlight}</span>
              </div>
            )}

            {/* Sub-bullet items */}
            <div className="space-y-2 pt-1">
              {stepData.subBullets.map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-center gap-2.5 text-xs" style={{ color: colors.textPrimary }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.semanticSuccess }} />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 pt-8 mt-6 border-t" style={{ borderColor: colors.borderDim }}>
          {!isFirst && (
            <button
              onClick={handleBack}
              className="h-11 px-4 rounded-xl font-bold text-xs border transition-all hover:bg-white/5 active:scale-[0.98] flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.cardBorder,
                color: colors.textSecondary,
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 h-11 px-5 rounded-xl font-bold text-xs tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-all hover:brightness-105 active:scale-[0.98] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            style={{ backgroundColor: colors.primary, color: colors.primaryText }}
          >
            <span>{isLast ? 'Finish & Start Basket Fit Quiz' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};
