import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FadeIn } from '../ui';

export const StepsSection: React.FC = () => {
  const { colors } = useApp();
  const [activeStep, setActiveStep] = useState(0);

  const handleStepClick = (idx: number) => {
    setActiveStep(idx);
  };

  const progressPercent = activeStep === 0 ? 0 : activeStep === 1 ? 50 : 100;

  return (
    <section
      id="steps-animation"
      className="py-16 md:py-24 border-t border-b relative overflow-hidden"
      style={{ backgroundColor: colors.bg, borderColor: colors.borderDim }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── 1. SECTION HEADER ───────────────────────────────── */}
        <FadeIn delay={0.05} direction="up" className="text-center max-w-2xl mx-auto mb-10 md:mb-14 space-y-2">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-[11px] font-mono font-medium tracking-wider uppercase"
            style={{
              backgroundColor: colors.accentTint,
              color: colors.accent,
              borderColor: colors.borderAccent,
            }}
          >
            <span>HOW IT WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight pt-0.5" style={{ color: colors.textPrimary }}>
            Savings Made Simple in 3 Steps
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
            Disciplined daily micro-accumulation engineered for compliant, diversified digital assets.
          </p>
        </FadeIn>

        {/* ── 2. THREE PHONE MOCKUPS (UNIFIED 3-COLUMN GRID) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start max-w-5xl mx-auto w-full">
          {/* ── COLUMN 1: STEP 1 (Amount Setup) ───────────────── */}
          <div
            onClick={() => handleStepClick(0)}
            className="flex flex-col items-center cursor-pointer transition-all duration-300 w-full hover:-translate-y-1"
          >
            {/* Phone Chassis */}
            <div
              className={`w-[275px] sm:w-[285px] h-[360px] rounded-3xl p-3 border-2 transition-all duration-300 relative overflow-hidden flex flex-col ${
                activeStep === 0
                  ? 'border-white ring-1 ring-white/30 opacity-100 scale-[1.02]'
                  : 'border-[#222533] opacity-50 grayscale-[50%] hover:opacity-85 hover:grayscale-0'
              }`}
              style={{ backgroundColor: '#090A10' }}
            >
              {/* Dynamic Island Notch */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-between px-2.5 z-30">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1c1c1e]" />
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.accent }} />
              </div>

              {/* In-App Screen Content */}
              <div className="flex-1 rounded-2xl p-3 border space-y-2.5 shadow-inner relative overflow-hidden flex flex-col" style={{ backgroundColor: '#11131C', borderColor: '#262B3D' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Calendar className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                    <span>Daily Savings Setup</span>
                  </div>
                  <span className="text-[8px] px-2 py-0.5 rounded-md font-bold font-mono tracking-wider" style={{ backgroundColor: colors.accentTint, color: colors.accent, border: `1px solid ${colors.borderAccent}` }}>
                    ACTIVE
                  </span>
                </div>

                {/* Amount Display */}
                <div className="text-center py-1">
                  <div className="text-2xl font-extrabold font-mono text-white">
                    ₹ 50<span className="text-xs font-normal text-gray-400">/day</span>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  <div className="py-1.5 text-center text-[11px] font-bold rounded-lg border border-gray-800 text-gray-400 bg-black/20 transition-colors hover:border-gray-600">
                    ₹20
                  </div>
                  <div className="py-1.5 text-center text-[11px] font-bold rounded-lg border border-white text-white bg-white/10 relative shadow-sm">
                    ₹50
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[7px] font-extrabold tracking-wider bg-white text-black px-1.5 py-0.5 rounded uppercase">
                      Popular
                    </span>
                  </div>
                  <div className="py-1.5 text-center text-[11px] font-bold rounded-lg border border-gray-800 text-gray-400 bg-black/20 transition-colors hover:border-gray-600">
                    ₹100
                  </div>
                </div>

                {/* Wealth Projection Card */}
                <div className="p-2 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-gray-400 font-sans">1Y Wealth Est.:</span>
                  <span className="font-bold text-emerald-400">₹21,438</span>
                </div>

                {/* Low Fade Overlay at Bottom */}
                <div className="mock-bottom-fade absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-[#11131C]/80 to-[#11131C] pointer-events-none z-20" />
              </div>
            </div>

            {/* ── STEP 1 LABELS & DESCRIPTION ── */}
            <div className="w-full max-w-[270px] mx-auto text-center flex flex-col items-center mt-3.5">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center font-extrabold text-[11px] font-mono transition-all duration-300"
                style={{
                  backgroundColor: activeStep === 0 ? colors.primary : colors.surface,
                  color: activeStep === 0 ? colors.primaryText : colors.textSecondary,
                  border: `1px solid ${colors.cardBorder}`,
                }}
              >
                01
              </div>
              <h3 className="font-extrabold text-sm mt-1.5 h-5 flex items-center justify-center truncate" style={{ color: colors.textPrimary }}>
                Select Your Daily Amount
              </h3>
              <p className="text-[11px] leading-snug mt-1 h-8 flex items-start justify-center text-center max-w-[230px]" style={{ color: colors.textSecondary }}>
                Choose an amount you want to invest daily. Start from just ₹10.
              </p>
            </div>
          </div>

          {/* ── COLUMN 2: STEP 2 (UPI AutoPay) ────────────────── */}
          <div
            onClick={() => handleStepClick(1)}
            className="flex flex-col items-center cursor-pointer transition-all duration-300 w-full hover:-translate-y-1"
          >
            {/* Phone Chassis */}
            <div
              className={`w-[275px] sm:w-[285px] h-[360px] rounded-3xl p-3 border-2 transition-all duration-300 relative overflow-hidden flex flex-col ${
                activeStep === 1
                  ? 'border-white ring-1 ring-white/30 opacity-100 scale-[1.02]'
                  : 'border-[#222533] opacity-50 grayscale-[50%] hover:opacity-85 hover:grayscale-0'
              }`}
              style={{ backgroundColor: '#090A10' }}
            >
              {/* Dynamic Island Notch */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-between px-2.5 z-30">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1c1c1e]" />
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.accent }} />
              </div>

              {/* In-App Screen Content */}
              <div className="flex-1 rounded-2xl p-3 border space-y-2.5 shadow-inner relative overflow-hidden flex flex-col" style={{ backgroundColor: '#11131C', borderColor: '#262B3D' }}>
                <div className="text-center">
                  <div className="text-xs font-bold text-white">Select UPI Payment Method</div>
                  <div className="text-[9px] text-gray-400">Debits 8:00–8:30 AM every morning</div>
                </div>

                {/* 2x2 Payment Gateways Grid */}
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  {/* PhonePe (Active) */}
                  <div className="p-2 rounded-xl border border-white/40 bg-white/10 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <img src="/assets/images/phonepe.svg" alt="PhonePe" className="w-4 h-4 object-contain" />
                      <span className="text-[11px] font-bold text-white">PhonePe</span>
                    </div>
                    <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 text-black font-extrabold stroke-[3]" />
                    </div>
                  </div>

                  {/* Paytm */}
                  <div className="p-2 rounded-xl border border-gray-800 bg-black/20 flex items-center gap-1.5 transition-colors hover:border-gray-700">
                    <img src="/assets/images/paytm.svg" alt="Paytm" className="w-4 h-4 object-contain" />
                    <span className="text-[11px] font-medium text-gray-300">Paytm</span>
                  </div>

                  {/* GPay */}
                  <div className="p-2 rounded-xl border border-gray-800 bg-black/20 flex items-center gap-1.5 transition-colors hover:border-gray-700">
                    <img src="/assets/images/gpay.svg" alt="GPay" className="w-4 h-4 object-contain" />
                    <span className="text-[11px] font-medium text-gray-300">GPay</span>
                  </div>

                  {/* Other UPI */}
                  <div className="p-2 rounded-xl border border-gray-800 bg-black/20 flex items-center gap-1.5 transition-colors hover:border-gray-700">
                    <div className="w-4 h-4 rounded-md bg-white/10 text-slate-300 font-bold text-[8px] flex items-center justify-center font-mono">
                      UPI
                    </div>
                    <span className="text-[11px] font-medium text-gray-300">BHIM UPI</span>
                  </div>
                </div>

                {/* Action Button */}
                <div
                  className="w-full py-2 rounded-xl font-bold text-[11px] text-center shadow-md mt-0.5 transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  Authorize UPI AutoPay
                </div>

                <div className="flex items-center justify-center gap-1 text-[9px] font-semibold" style={{ color: colors.accent }}>
                  <ShieldCheck className="w-3 h-3" />
                  <span>NPCI UPI AutoPay Framework</span>
                </div>

                {/* Low Fade Overlay at Bottom */}
                <div className="mock-bottom-fade absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-[#11131C]/80 to-[#11131C] pointer-events-none z-20" />
              </div>
            </div>

            {/* ── STEP 2 LABELS & DESCRIPTION ── */}
            <div className="w-full max-w-[270px] mx-auto text-center flex flex-col items-center mt-3.5">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center font-extrabold text-[11px] font-mono transition-all duration-300"
                style={{
                  backgroundColor: activeStep === 1 ? colors.primary : colors.surface,
                  color: activeStep === 1 ? colors.primaryText : colors.textSecondary,
                  border: `1px solid ${colors.cardBorder}`,
                }}
              >
                02
              </div>
              <h3 className="font-extrabold text-sm mt-1.5 h-5 flex items-center justify-center truncate" style={{ color: colors.textPrimary }}>
                Authorize UPI AutoPay
              </h3>
              <p className="text-[11px] leading-snug mt-1 h-8 flex items-start justify-center text-center max-w-[230px]" style={{ color: colors.textSecondary }}>
                Link PhonePe, GPay, or Paytm once. No daily manual transfers.
              </p>
            </div>
          </div>

          {/* ── COLUMN 3: STEP 3 (Basket Compounding) ─────────── */}
          <div
            onClick={() => handleStepClick(2)}
            className="flex flex-col items-center cursor-pointer transition-all duration-300 w-full hover:-translate-y-1"
          >
            {/* Phone Chassis */}
            <div
              className={`w-[275px] sm:w-[285px] h-[360px] rounded-3xl p-3 border-2 transition-all duration-300 relative overflow-hidden flex flex-col ${
                activeStep === 2
                  ? 'border-white ring-1 ring-white/30 opacity-100 scale-[1.02]'
                  : 'border-[#222533] opacity-50 grayscale-[50%] hover:opacity-85 hover:grayscale-0'
              }`}
              style={{ backgroundColor: '#090A10' }}
            >
              {/* Dynamic Island Notch */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-between px-2.5 z-30">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1c1c1e]" />
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: colors.accent }} />
              </div>

              {/* In-App Screen Content */}
              <div className="flex-1 rounded-2xl p-3 border space-y-2 shadow-inner relative overflow-hidden flex flex-col" style={{ backgroundColor: '#11131C', borderColor: '#262B3D' }}>
                <div className="text-center">
                  <div className="text-xs font-bold text-white">9:00 AM Batch Execution</div>
                  <div className="text-[9px] text-gray-400">Automated spot buy via CoinDCX API</div>
                </div>

                {/* Basket Card Preview */}
                <div className="p-2 rounded-xl border border-white/15 bg-white/5 text-center space-y-0.5">
                  <img src="/assets/images/btc-logo.png" alt="BTC" className="w-6 h-6 mx-auto object-contain transition-transform duration-300 hover:scale-110" />
                  <div className="font-extrabold text-xs text-white">Growth Basket (70:20:10)</div>
                  <div className="text-[9px] text-gray-400 font-mono">70% BTC · 20% ETH · 10% SOL</div>
                </div>

                {/* 3 Metric Badges */}
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="p-1.5 rounded-lg bg-black/30 border border-gray-800 text-[8px] text-gray-400 font-mono transition-colors hover:border-gray-700">
                    <span className="block font-bold text-emerald-400 text-[10px]">0%</span>
                    <span>LOCK-IN</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/30 border border-gray-800 text-[8px] text-gray-400 font-mono transition-colors hover:border-gray-700">
                    <span className="block font-bold text-emerald-400 text-[10px]">9 AM</span>
                    <span>BATCH BUY</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/30 border border-gray-800 text-[8px] text-gray-400 font-mono transition-colors hover:border-gray-700">
                    <span className="block font-bold text-amber-400 text-[10px]">24/7</span>
                    <span>PAYOUT</span>
                  </div>
                </div>

                {/* Low Fade Overlay at Bottom */}
                <div className="mock-bottom-fade absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-[#11131C]/80 to-[#11131C] pointer-events-none z-20" />
              </div>
            </div>

            {/* ── STEP 3 LABELS & DESCRIPTION ── */}
            <div className="w-full max-w-[270px] mx-auto text-center flex flex-col items-center mt-3.5">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center font-extrabold text-[11px] font-mono transition-all duration-300"
                style={{
                  backgroundColor: activeStep === 2 ? colors.primary : colors.surface,
                  color: activeStep === 2 ? colors.primaryText : colors.textSecondary,
                  border: `1px solid ${colors.cardBorder}`,
                }}
              >
                03
              </div>
              <h3 className="font-extrabold text-sm mt-1.5 h-5 flex items-center justify-center truncate" style={{ color: colors.textPrimary }}>
                Batch Buy & Accumulate
              </h3>
              <p className="text-[11px] leading-snug mt-1 h-8 flex items-start justify-center text-center max-w-[230px]" style={{ color: colors.textSecondary }}>
                Daily CoinDCX API batch fills update your portfolio with exact fractions automatically.
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. BOTTOM PROGRESS INDICATOR (PIXEL-PERFECT COLUMN ALIGNMENT) ── */}
        <div className="mt-3 md:mt-4 max-w-5xl mx-auto w-full relative hidden md:block">
          {/* Track Bar between Center of Col 1 (16.666%) and Center of Col 3 (83.333%) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[16.666%] right-[16.666%] h-0.5 rounded-full overflow-hidden z-0 pointer-events-none" style={{ backgroundColor: colors.borderDim }}>
            <div
              className="h-full transition-all duration-300"
              style={{ backgroundColor: colors.accent, width: `${progressPercent}%` }}
            />
          </div>

          {/* Step Number Nodes Centered Exactly under Columns 1, 2, and 3 */}
          <div className="grid grid-cols-3 relative z-10 w-full">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex justify-center">
                <button
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  className="w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center text-[9px] font-mono font-bold"
                  style={{
                    backgroundColor: activeStep >= idx ? colors.primary : colors.surface,
                    borderColor: activeStep >= idx ? colors.primary : colors.cardBorder,
                    color: activeStep >= idx ? colors.primaryText : colors.textSecondary,
                  }}
                  title={`Jump to Step ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
