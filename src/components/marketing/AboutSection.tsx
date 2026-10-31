import React from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Coins,
  CheckCircle2,
  XCircle,
  Zap,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpotlightCard, FadeIn } from '../ui';

const LinkedinIcon = () => (
  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const AboutSection: React.FC = () => {
  const { colors, themeMode } = useApp();

  return (
    <section id="about-section" className="py-16 sm:py-20 md:py-28 relative overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      {/* Subtle ambient connector glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-12"
        style={{
          background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── 1. SECTION HEADER ────── */}
        <FadeIn delay={0.05} direction="up" className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-16 space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight pt-0.5 font-display" style={{ color: colors.textPrimary }}>
            Daily Crypto. Starting at ₹10.
          </h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mt-1.5" style={{ color: colors.textSecondary }}>
            The financial thesis, automated mechanics, and system architecture behind Satmix.
          </p>
        </FadeIn>

        {/* ── 2. EDITORIAL BENTO (RESTRUCTURED CARDS) ────── */}
        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 mb-16 sm:mb-20 md:mb-24">
          
          {/* ── TOP TIER: CORE CONVICTION & CONTRAST BENTO (2 Columns) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            
            {/* Left Card: The Core Thesis & Invariants (7 Cols) */}
            <FadeIn delay={0.1} direction="up" className="lg:col-span-7 h-full">
              <SpotlightCard
                spotlightColor={colors.accentTint}
                className="rounded-[28px] p-6 sm:p-8 lg:p-9 border shadow-xl flex flex-col justify-between h-full backdrop-blur-md relative overflow-hidden"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                }}
              >
                <div>
                  {/* High-Impact Statement */}
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                    Most people don’t fail at crypto because they picked the wrong coin.
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed mt-3.5">
                    They fail because lump-sum investing forces retail users to guess market tops and bottoms. Starting feels expensive, complicated, and anxiety-inducing. Satmix replaces speculative timing with a mathematical daily micro-saving habit.
                  </p>
                </div>

                {/* 3 Core Invariant Badges */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-6 sm:pt-8 border-t border-white/[0.08] mt-6 select-none">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                    <span className="block text-[11px] sm:text-xs font-bold text-white">No Coin Picking</span>
                    <span className="block text-[10px] text-neutral-400 mt-0.5">Curated Baskets</span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                    <span className="block text-[11px] sm:text-xs font-bold text-white">No Market Timing</span>
                    <span className="block text-[10px] text-neutral-400 mt-0.5">Daily Rupee Cost Avg</span>
                  </div>
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                    <span className="block text-[11px] sm:text-xs font-bold text-white">No Chart Anxiety</span>
                    <span className="block text-[10px] text-neutral-400 mt-0.5">100% Autopilot</span>
                  </div>
                </div>
              </SpotlightCard>
            </FadeIn>

            {/* Right Card: RCA vs The Lump-Sum Trap (5 Cols) */}
            <FadeIn delay={0.18} direction="up" className="lg:col-span-5 h-full">
              <SpotlightCard
                spotlightColor={colors.accentTint}
                className="rounded-[28px] p-6 sm:p-8 border shadow-xl flex flex-col justify-between h-full backdrop-blur-md relative overflow-hidden"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                }}
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2">
                    Lump-Sum vs. Daily RCA
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    Why buying smaller amounts daily mathematically outperforms trying to time market dips.
                  </p>
                </div>

                {/* Direct Comparison Split */}
                <div className="space-y-3 select-none">
                  {/* The Old Way: Lump Sum */}
                  <div className="p-3.5 rounded-2xl border border-red-500/20 bg-red-500/[0.04]">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-400 mb-1">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>The Lump-Sum Trap</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug">
                      High emotional exposure. Buying at hype peaks, panic selling on dips, and 24/7 stress.
                    </p>
                  </div>

                  {/* The Satmix Way: Daily RCA */}
                  <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06]">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>The Satmix Daily Habit</span>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-snug">
                      Automatically accumulates more units when prices drop and fewer when they rise. Zero chart watching.
                    </p>
                  </div>
                </div>

                <div className="pt-3.5 mt-2 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400 text-center select-none">
                  Smooths volatility over months & years
                </div>
              </SpotlightCard>
            </FadeIn>
          </div>

          {/* ── BOTTOM TIER: 3 OPERATIONAL GUARANTEES (3 Columns) ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* Guarantee 1: 100% Autopilot UPI */}
            <FadeIn delay={0.22} direction="up" className="h-full">
              <SpotlightCard
                spotlightColor={colors.accentTint}
                className="rounded-[24px] p-6 border shadow-lg flex flex-col justify-between h-full backdrop-blur-md"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                }}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 select-none">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    100% Autopilot Mandates
                  </h4>
                  <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed">
                    Set up your daily recurring micro-saving once via Google Pay, PhonePe, or Paytm. Executes automatically every morning without daily OTPs or PIN entry.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/[0.06] text-[11px] font-mono text-purple-400">
                  from ₹10/day • 0 daily effort
                </div>
              </SpotlightCard>
            </FadeIn>

            {/* Guarantee 2: Zero Tax-Event Rebalancing */}
            <FadeIn delay={0.28} direction="up" className="h-full">
              <SpotlightCard
                spotlightColor={colors.accentTint}
                className="rounded-[24px] p-6 border shadow-lg flex flex-col justify-between h-full backdrop-blur-md"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                }}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 select-none">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    Zero Tax-Event Rebalancing
                  </h4>
                  <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed">
                    Portfolio ratios are adjusted exclusively through incoming daily buy proportions. Nothing is ever sold to rebalance, protecting you from India's 30% VDA tax and 1% TDS.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/[0.06] text-[11px] font-mono text-emerald-400">
                  New buys only • 0 taxable sales
                </div>
              </SpotlightCard>
            </FadeIn>

            {/* Guarantee 3: 24/7 Bank Liquidity */}
            <FadeIn delay={0.34} direction="up" className="h-full">
              <SpotlightCard
                spotlightColor={colors.accentTint}
                className="rounded-[24px] p-6 border shadow-lg flex flex-col justify-between h-full backdrop-blur-md"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                }}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 select-none">
                    <Coins className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    24/7 Bank Liquidity
                  </h4>
                  <p className="text-xs sm:text-[13px] text-neutral-400 leading-relaxed">
                    Zero lock-ins and zero withdrawal penalties. Convert your holdings back to rupees and withdraw directly to your verified Indian bank account via instant IMPS / UPI anytime.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/[0.06] text-[11px] font-mono text-amber-400">
                  Direct IMPS / UPI • 0 lock-ins
                </div>
              </SpotlightCard>
            </FadeIn>
          </div>
        </div>

        {/* ── 3. LEADERSHIP TEAM (Prestige Editorial Finish) ── */}
        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0.05} className="text-center max-w-xl mx-auto mb-8 md:mb-10 space-y-1">
            <h3 className="text-2xl font-bold font-display" style={{ color: colors.textPrimary }}>
              The Minds Behind Satmix
            </h3>
            <p className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>
              Meet the founders building a simple daily crypto habit.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* Founder 1: Sheiden Borges */}
            <FadeIn delay={0.1} direction="up">
              <SpotlightCard
                spotlightColor={colors.accentTint}
                className="rounded-3xl p-5 border text-center space-y-3 shadow-lg backdrop-blur-md"
                style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
              >
                <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 shadow-md select-none" style={{ borderColor: colors.borderAccent }}>
                  <img src="/assets/images/CEO.jpeg" alt="Sheiden Borges" width="80" height="80" loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
                </div>
                <div>
                  <h4 className="font-bold text-base" style={{ color: colors.textPrimary }}>Sheiden Borges</h4>
                  <p className="text-xs font-semibold" style={{ color: colors.accent }}>Founder & CEO</p>
                  <p className="text-[11px] mt-1" style={{ color: colors.textSecondary }}>Strategy, Direction & Growth</p>
                </div>
                <a
                  href="https://www.linkedin.com/in/sheiden-borges-654415276"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-semibold font-mono border transition-[transform,background-color,border-color] duration-150 ease-out hover:border-amber-500/40 active:scale-[0.98] select-none"
                  style={{ color: colors.accent, borderColor: colors.borderAccent, backgroundColor: colors.accentTint }}
                >
                  <LinkedinIcon /> LinkedIn Profile
                </a>
              </SpotlightCard>
            </FadeIn>

            {/* Founder 2: Veer Khanna */}
            <FadeIn delay={0.2} direction="up">
              <SpotlightCard
                spotlightColor={colors.accentTint}
                className="rounded-3xl p-5 border text-center space-y-3 shadow-lg backdrop-blur-md"
                style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
              >
                <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 shadow-md select-none" style={{ borderColor: colors.borderAccent }}>
                  <img src="/assets/images/CTO.jpeg" alt="Veer Khanna" width="80" height="80" loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
                </div>
                <div>
                  <h4 className="font-bold text-base" style={{ color: colors.textPrimary }}>Veer Khanna</h4>
                  <p className="text-xs font-semibold" style={{ color: colors.accent }}>Co-Founder & CTO</p>
                  <p className="text-[11px] mt-1" style={{ color: colors.textSecondary }}>Product Architecture & Engineering</p>
                </div>
                <a
                  href="https://www.linkedin.com/in/veerkhanna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-semibold font-mono border transition-[transform,background-color,border-color] duration-150 ease-out hover:border-amber-500/40 active:scale-[0.98] select-none"
                  style={{ color: colors.accent, borderColor: colors.borderAccent, backgroundColor: colors.accentTint }}
                >
                  <LinkedinIcon /> LinkedIn Profile
                </a>
              </SpotlightCard>
            </FadeIn>

            {/* Founder 3: Shashank Jajodia */}
            <FadeIn delay={0.3} direction="up">
              <SpotlightCard
                spotlightColor={colors.accentTint}
                className="rounded-3xl p-5 border text-center space-y-3 shadow-lg backdrop-blur-md"
                style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
              >
                <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 shadow-md select-none" style={{ borderColor: colors.borderAccent }}>
                  <img src="/assets/images/CFO.jpeg" alt="Shashank Jajodia" width="80" height="80" loading="lazy" decoding="async" className="w-full h-full object-cover object-center" />
                </div>
                <div>
                  <h4 className="font-bold text-base" style={{ color: colors.textPrimary }}>Shashank Jajodia</h4>
                  <p className="text-xs font-semibold" style={{ color: colors.accent }}>Co-Founder & CFO</p>
                  <p className="text-[11px] mt-1" style={{ color: colors.textSecondary }}>Growth, Outreach & Finance</p>
                </div>
                <a
                  href="https://www.linkedin.com/in/shashank-jajodia-528b5b299"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-semibold font-mono border transition-[transform,background-color,border-color] duration-150 ease-out hover:border-amber-500/40 active:scale-[0.98] select-none"
                  style={{ color: colors.accent, borderColor: colors.borderAccent, backgroundColor: colors.accentTint }}
                >
                  <LinkedinIcon /> LinkedIn Profile
                </a>
              </SpotlightCard>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
