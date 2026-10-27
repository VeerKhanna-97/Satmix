import React, { useState } from 'react';
import {
  Check,
  ShieldCheck,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  FileCheck2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FadeIn, CountUp } from '../ui';
import { motion, AnimatePresence } from 'motion/react';

interface StepData {
  number: string;
  badge: string;
  title: string;
  body: string;
}

const STEPS: StepData[] = [
  {
    number: '01',
    badge: '2-Min Assessment',
    title: 'Take a 2-minute quiz',
    body: 'Five short questions about how you handle market swings. You get an optimal starting risk limit tailored to your comfort.',
  },
  {
    number: '02',
    badge: 'Portfolio Strategy',
    title: 'Pick a basket',
    body: 'Choose between Stable (USDT + BTC capital preservation) or Growth (BTC + ETH + SOL compounding). You choose the mix, never the timing.',
  },
  {
    number: '03',
    badge: 'Daily Discipline',
    title: 'Set your daily amount',
    body: 'Start from just ₹10 a day on Stable, or ₹30 on Growth. Pause, raise, or lower your automated mandate whenever you like with one tap.',
  },
  {
    number: '04',
    badge: 'Hands-Free Habit',
    title: 'Watch it build on habit',
    body: 'Automated daily UPI buys without manual timing. Every transaction comes with an itemized receipt showing asset splits and exact costs.',
  },
];

export const StepsSection: React.FC = () => {
  const { colors, themeMode, setViewMode, setAuthSubView, isAuthenticated } = useApp();
  const [activeStep, setActiveStep] = useState(0);

  const handleStartNow = () => {
    if (isAuthenticated) {
      setViewMode('app');
    } else {
      setAuthSubView('signup');
      setViewMode('auth');
    }
  };

  return (
    <section
      id="steps-animation"
      className="py-14 sm:py-20 md:py-28 border-t border-b relative overflow-hidden"
      style={{ backgroundColor: colors.bg, borderColor: colors.borderDim }}
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full blur-[160px] opacity-15 pointer-events-none"
        style={{ background: colors.accent }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── 1. SECTION HEADER ───────────────────────────────── */}
        <FadeIn delay={0.05} direction="up" className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 md:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider border shadow-xs" style={{ backgroundColor: colors.accentTint, borderColor: colors.accent, color: colors.accent }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>HOW SATMIX WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            Savings Made Simple in 4 Steps
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
            Four steps, then it runs on habit. Save small amounts every morning without thinking about it. 100% automated via UPI.
          </p>
        </FadeIn>

        {/* ── 2. INTERACTIVE STEPPER GRID (LEFT: TIMELINE LIST, RIGHT: DYNAMIC CHASSIS VIEW) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center max-w-5xl mx-auto">
          
          {/* Left Column: 4-Step Interactive Navigation */}
          <div className="lg:col-span-7 space-y-3.5">
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                    isActive
                      ? 'shadow-lg scale-[1.01]'
                      : 'hover:border-white/20 opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: isActive ? colors.surface : 'transparent',
                    borderColor: isActive ? colors.accent : colors.borderDim,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Step Number Pill */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm sm:text-base flex-shrink-0 transition-colors shadow-xs ${
                        isActive ? 'text-white' : 'text-neutral-400 border border-white/10'
                      }`}
                      style={{
                        backgroundColor: isActive ? colors.accent : colors.card,
                      }}
                    >
                      {step.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-purple-400">
                          {step.badge}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ACTIVE STEP
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold tracking-tight mt-0.5" style={{ color: colors.textPrimary }}>
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm mt-1.5 leading-relaxed" style={{ color: colors.textSecondary }}>
                        {step.body}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Launch CTA beneath list */}
            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={handleStartNow}
                className="h-11 px-6 rounded-xl font-semibold text-xs tracking-wide shadow-md transition-all active:scale-[0.96] inline-flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <span>Start Your Savings Habit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-neutral-400 font-mono">Takes &lt; 2 minutes</span>
            </div>
          </div>

          {/* Right Column: 3D Frontal Phone View with Active Step Mockup */}
          <div className="lg:col-span-5 flex items-center justify-center">
            {/* Frontal Titanium Phone Chassis */}
            <div
              className="relative w-[300px] sm:w-[325px] h-[580px] rounded-[44px] p-[8px] bg-gradient-to-b from-[#383B4A] via-[#1D1F2A] to-[#11121A] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.18),0_0_35px_rgba(93,23,235,0.2)]"
            >
              {/* Inner Bezel (Concentric 44px - 8px = 36px) */}
              <div className="relative w-full h-full rounded-[36px] bg-black p-[2px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden">
                
                {/* OLED Display Screen */}
                <div className="relative w-full h-full rounded-[34px] bg-[#090A0E] flex flex-col justify-between overflow-hidden font-sans text-slate-100 p-4 pt-9">
                  
                  {/* Dynamic Island Pill */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-5 rounded-full bg-black flex items-center justify-between px-3 shadow-sm border border-white/5">
                      <div className="w-2 h-2 rounded-full bg-[#111] border border-white/10" />
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40" />
                    </div>
                  </div>

                  {/* ── MOCKUP SCREENS (SWAPPING PER ACTIVE STEP) ── */}
                  <div className="flex-1 flex flex-col justify-start overflow-hidden">
                    <AnimatePresence mode="wait">
                      {/* ── SCREEN 1: 2-MINUTE QUIZ MOCKUP ── */}
                      {activeStep === 0 && (
                        <motion.div
                          key="step-0"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4 pt-2"
                        >
                          <div className="flex items-center justify-between text-xs font-mono text-purple-400">
                            <span>Question 1 of 5</span>
                            <span className="text-[11px] text-neutral-400">Risk Profile</span>
                          </div>
                          <div>
                            <h4 className="text-lg font-extrabold text-white leading-tight">
                              Your crypto drops 30% in a month. What do you do?
                            </h4>
                            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                              Crypto fluctuates naturally. There are no wrong answers.
                            </p>
                          </div>

                          <div className="space-y-2 pt-2">
                            {[
                              'Take it all out to bank',
                              'Pause for a few weeks',
                              'Keep daily savings going as planned',
                            ].map((opt, i) => (
                              <div
                                key={opt}
                                className={`p-3 rounded-xl border text-xs font-medium transition-colors ${
                                  i === 2
                                    ? 'bg-[#5D17EB]/20 border-purple-500/60 text-white font-bold'
                                    : 'bg-white/[0.03] border-white/10 text-neutral-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{opt}</span>
                                  {i === 2 && <Check className="w-3.5 h-3.5 text-purple-300" />}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-neutral-400 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>Calculates personalized maximum volatility tolerance.</span>
                          </div>
                        </motion.div>
                      )}

                      {/* ── SCREEN 2: BASKET SELECTION MOCKUP ── */}
                      {activeStep === 1 && (
                        <motion.div
                          key="step-1"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-3.5 pt-2"
                        >
                          <div>
                            <span className="text-xs font-mono font-bold text-purple-400">Step 2: Choose Strategy</span>
                            <h4 className="text-lg font-extrabold text-white leading-tight mt-0.5">
                              Pick a basket
                            </h4>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              You choose the mix. Satmix handles the execution.
                            </p>
                          </div>

                          {/* Stable Basket Card */}
                          <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white">Stable Basket</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">From ₹10/day</span>
                            </div>
                            <p className="text-[11px] text-neutral-400 leading-tight">
                              Lower price swings. 85% Digital USD + 15% Bitcoin.
                            </p>
                            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden flex">
                              <div className="h-full bg-emerald-400 w-[85%]" />
                              <div className="h-full bg-amber-400 w-[15%]" />
                            </div>
                          </div>

                          {/* Growth Basket Card (Selected) */}
                          <div className="p-3.5 rounded-xl border border-purple-500/60 bg-[#5D17EB]/20 space-y-2 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>Growth Basket</span>
                                <Check className="w-3.5 h-3.5 text-purple-300" />
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">From ₹30/day</span>
                            </div>
                            <p className="text-[11px] text-purple-200 leading-tight">
                              Higher long-term growth. 70% BTC + 20% ETH + 10% SOL.
                            </p>
                            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden flex">
                              <div className="h-full bg-amber-400 w-[70%]" />
                              <div className="h-full bg-blue-400 w-[20%]" />
                              <div className="h-full bg-purple-400 w-[10%]" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ── SCREEN 3: SET DAILY AMOUNT MOCKUP ── */}
                      {activeStep === 2 && (
                        <motion.div
                          key="step-2"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4 pt-2 text-center"
                        >
                          <div>
                            <span className="text-xs font-mono font-bold text-purple-400">Step 3: Daily Cadence</span>
                            <h4 className="text-lg font-extrabold text-white leading-tight mt-0.5">
                              How much each day?
                            </h4>
                            <p className="text-xs text-neutral-400 mt-0.5">
                              Growth starts at ₹30. Change or pause anytime.
                            </p>
                          </div>

                          <div className="py-4">
                            <div className="text-5xl font-extrabold font-mono text-white tracking-tight">
                              ₹30
                            </div>
                            <span className="text-xs font-mono text-neutral-400 block mt-1">every morning at 8:00 AM</span>
                          </div>

                          {/* Amount Quick-Pick Chips */}
                          <div className="flex items-center justify-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
                            {[10, 30, 50, 100].map((amt) => (
                              <span
                                key={amt}
                                className={`px-3 py-1 rounded-full font-bold transition-colors ${
                                  amt === 30
                                    ? 'bg-[#5D17EB] text-white shadow-xs'
                                    : 'text-neutral-400'
                                }`}
                              >
                                ₹{amt}
                              </span>
                            ))}
                          </div>

                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-neutral-400 text-left space-y-1.5">
                            <div className="flex justify-between">
                              <span>Fee per buy (incl. GST)</span>
                              <span className="font-mono text-white">₹0.35</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shown before every buy</span>
                              <span className="font-semibold text-emerald-400">100% Transparent</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* ── SCREEN 4: WATCH IT BUILD (RECEIPT & HABIT MOCKUP) ── */}
                      {activeStep === 3 && (
                        <motion.div
                          key="step-3"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-3 pt-2"
                        >
                          <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2 text-emerald-400">
                              <Check className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                            <h4 className="text-xl font-extrabold font-mono text-white">
                              ₹30 Auto-Saved
                            </h4>
                            <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                              Today at 8:00 AM • UPI Mandate
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-[11px] text-emerald-300 leading-snug">
                            Today's ₹30 was split automatically across Bitcoin, Ethereum, and Solana.
                          </div>

                          {/* Itemized Receipt Breakdown */}
                          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono space-y-2 divide-y divide-white/5">
                            <div className="flex justify-between">
                              <span className="text-neutral-400">You paid</span>
                              <span className="text-white font-bold">₹30.00</span>
                            </div>
                            <div className="flex justify-between pt-1.5">
                              <span className="text-neutral-400">Satmix fee (1%)</span>
                              <span className="text-neutral-300">₹0.30</span>
                            </div>
                            <div className="flex justify-between pt-1.5">
                              <span className="text-neutral-400">Into Bitcoin (70%)</span>
                              <span className="text-amber-400 font-semibold">₹20.75</span>
                            </div>
                            <div className="flex justify-between pt-1.5">
                              <span className="text-neutral-400">Into Ethereum (20%)</span>
                              <span className="text-blue-400 font-semibold">₹5.93</span>
                            </div>
                            <div className="flex justify-between pt-1.5">
                              <span className="text-neutral-400">Into Solana (10%)</span>
                              <span className="text-purple-400 font-semibold">₹2.97</span>
                            </div>
                          </div>

                          <p className="text-[10px] text-center text-neutral-400">
                            Stored in your own protected custody account.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Phone Home Indicator Bar */}
                  <div className="w-24 h-1 rounded-full bg-white/20 mx-auto pointer-events-none mt-2" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StepsSection;
