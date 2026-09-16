import React from 'react';
import { BookOpen, Compass, Eye, ShieldCheck, RefreshCw, Coins } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpotlightCard, TiltedCard, Magnet, FadeIn } from '../ui';

const LinkedinIcon = () => (
  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const AboutSection: React.FC = () => {
  const { colors } = useApp();

  return (
    <section id="about-section" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── 1. SECTION HEADER ────── */}
        <FadeIn delay={0.05} direction="up" className="text-center max-w-2xl mx-auto mb-8 md:mb-10 space-y-2">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-[11px] font-mono font-medium tracking-wider uppercase"
            style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}
          >
            <span>VISION, MISSION & CORE BELIEF</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight pt-0.5" style={{ color: colors.textPrimary }}>
            Daily Crypto. Starting at ₹10.
          </h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mt-1.5" style={{ color: colors.textSecondary }}>
            Making daily crypto ownership simple for young Indians who want to start small and stay consistent.
          </p>
        </FadeIn>

        {/* ── 2. THREE-CARD GRID ───── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto mb-14 md:mb-16">
          {/* Card 1: Core Belief */}
          <FadeIn delay={0.1} direction="up" className="h-full">
            <SpotlightCard
              spotlightColor={colors.accentTint}
              className="rounded-3xl p-6 sm:p-7 lg:p-8 border shadow-xl flex flex-col justify-start h-full backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: colors.accentTint, color: colors.accent }}
              >
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mt-4 h-6 flex items-center" style={{ color: colors.textPrimary }}>
                Core Belief
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed mt-2" style={{ color: colors.textSecondary }}>
                Most people do not fail at crypto because they picked the wrong coin. They fail because starting feels expensive, complicated, and stressful. Satmix removes that friction completely.
              </p>
            </SpotlightCard>
          </FadeIn>

          {/* Card 2: Our Mission */}
          <FadeIn delay={0.2} direction="up" className="h-full">
            <SpotlightCard
              spotlightColor={colors.primaryTint}
              className="rounded-3xl p-6 sm:p-7 lg:p-8 border shadow-xl flex flex-col justify-start h-full backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: colors.primaryTint, color: colors.textPrimary }}
              >
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mt-4 h-6 flex items-center" style={{ color: colors.textPrimary }}>
                Our Mission
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed mt-2" style={{ color: colors.textSecondary }}>
                Let someone set a UPI AutoPay from ₹10 a day and automatically buy a clear risk basket. No coin picking. No market timing. No chart anxiety.
              </p>
            </SpotlightCard>
          </FadeIn>

          {/* Card 3: Our Vision */}
          <FadeIn delay={0.3} direction="up" className="h-full">
            <SpotlightCard
              spotlightColor={colors.accentTint}
              className="rounded-3xl p-6 sm:p-7 lg:p-8 border shadow-xl flex flex-col justify-start h-full backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: colors.accentTint, color: colors.accent }}
              >
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mt-4 h-6 flex items-center" style={{ color: colors.textPrimary }}>
                Our Vision
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed mt-2" style={{ color: colors.textSecondary }}>
                Make daily crypto ownership simple for young Indians who want to start small and stay consistent through seamless, non-custodial fintech automation.
              </p>
            </SpotlightCard>
          </FadeIn>
        </div>

        {/* ── 3. WHY DAILY AUTO-INVESTING DEEP DIVE ─────────── */}
        <FadeIn delay={0.15}>
          <SpotlightCard
            spotlightColor={colors.accentTint}
            className="rounded-3xl p-7 sm:p-9 lg:p-10 border shadow-xl mb-14 md:mb-16 max-w-5xl mx-auto backdrop-blur-md"
            style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3.5">
                <h3 className="text-xl sm:text-2xl font-bold" style={{ color: colors.textPrimary }}>
                  Why Daily Micro-Investing with Rupee Cost Averaging?
                </h3>
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                  Lump-sum investing forces retail users to guess market timing. Satmix applies <strong>Rupee Cost Averaging (RCA)</strong>: you automatically buy more units when market prices dip and fewer when they peak, smoothing out crypto volatility over months and years without checking charts.
                </p>
                <div className="pt-1.5 flex flex-wrap gap-4 text-xs font-semibold" style={{ color: colors.textPrimary }}>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" style={{ color: colors.textSecondary }} /> Non-Custodial Security</span>
                  <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4" style={{ color: colors.accent }} /> Daily UPI AutoPay</span>
                  <span className="flex items-center gap-1.5"><Coins className="w-4 h-4" style={{ color: colors.accent }} /> 24/7 Bank Liquidity</span>
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-1 gap-3">
                <div className="p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: colors.card, borderColor: colors.borderDim }}>
                  <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>100% Autopilot Mandates</div>
                  <div className="text-[11px] mt-0.5" style={{ color: colors.textSecondary }}>Set it up once via Google Pay, PhonePe, or Paytm from ₹10/day.</div>
                </div>
                <div className="p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: colors.card, borderColor: colors.borderDim }}>
                  <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>No Lock-ins or Hidden Penalties</div>
                  <div className="text-[11px] mt-0.5" style={{ color: colors.textSecondary }}>Pause, modify, or withdraw your capital back to your bank anytime 24/7.</div>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </FadeIn>

        {/* ── 4. LEADERSHIP TEAM ─────────────────────────────── */}
        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0.05} className="text-center max-w-xl mx-auto mb-8 md:mb-10 space-y-1">
            <h3 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              The Minds Behind Satmix
            </h3>
            <p className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>
              Meet the founders building disciplined digital asset wealth systems.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Founder 1: Sheiden Borges */}
            <FadeIn delay={0.1} direction="up">
              <TiltedCard maxAngle={6} scale={1.02}>
                <SpotlightCard
                  spotlightColor={colors.accentTint}
                  className="rounded-3xl p-5 border text-center space-y-3 shadow-lg backdrop-blur-md"
                  style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
                >
                  <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 shadow-md transition-transform duration-300 hover:scale-105" style={{ borderColor: colors.borderAccent }}>
                    <img src="/src/assets/images/CEO.jpeg" alt="Sheiden Borges" className="w-full h-full object-cover object-center" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base" style={{ color: colors.textPrimary }}>Sheiden Borges</h4>
                    <p className="text-xs font-semibold" style={{ color: colors.accent }}>Founder & CEO</p>
                    <p className="text-[11px] mt-1" style={{ color: colors.textSecondary }}>Strategy, Direction & Growth</p>
                  </div>
                  <Magnet strength={8}>
                    <a
                      href="https://www.linkedin.com/in/sheiden-borges-654415276"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold font-mono hover:underline px-3 py-1.5 rounded-lg border transition-colors"
                      style={{ color: colors.accent, borderColor: colors.borderAccent, backgroundColor: colors.accentTint }}
                    >
                      <LinkedinIcon /> LinkedIn Profile
                    </a>
                  </Magnet>
                </SpotlightCard>
              </TiltedCard>
            </FadeIn>

            {/* Founder 2: Veer Khanna */}
            <FadeIn delay={0.2} direction="up">
              <TiltedCard maxAngle={6} scale={1.02}>
                <SpotlightCard
                  spotlightColor={colors.accentTint}
                  className="rounded-3xl p-5 border text-center space-y-3 shadow-lg backdrop-blur-md"
                  style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
                >
                  <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 shadow-md transition-transform duration-300 hover:scale-105" style={{ borderColor: colors.borderAccent }}>
                    <img src="/src/assets/images/CTO.jpeg" alt="Veer Khanna" className="w-full h-full object-cover object-center" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base" style={{ color: colors.textPrimary }}>Veer Khanna</h4>
                    <p className="text-xs font-semibold" style={{ color: colors.accent }}>Co-Founder & CTO</p>
                    <p className="text-[11px] mt-1" style={{ color: colors.textSecondary }}>Product Architecture & Engineering</p>
                  </div>
                  <Magnet strength={8}>
                    <a
                      href="https://www.linkedin.com/in/veerkhanna"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold font-mono hover:underline px-3 py-1.5 rounded-lg border transition-colors"
                      style={{ color: colors.accent, borderColor: colors.borderAccent, backgroundColor: colors.accentTint }}
                    >
                      <LinkedinIcon /> LinkedIn Profile
                    </a>
                  </Magnet>
                </SpotlightCard>
              </TiltedCard>
            </FadeIn>

            {/* Founder 3: Shashank Jajodia */}
            <FadeIn delay={0.3} direction="up">
              <TiltedCard maxAngle={6} scale={1.02}>
                <SpotlightCard
                  spotlightColor={colors.accentTint}
                  className="rounded-3xl p-5 border text-center space-y-3 shadow-lg backdrop-blur-md"
                  style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
                >
                  <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 shadow-md transition-transform duration-300 hover:scale-105" style={{ borderColor: colors.borderAccent }}>
                    <img src="/src/assets/images/CFO.jpeg" alt="Shashank Jajodia" className="w-full h-full object-cover object-center" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base" style={{ color: colors.textPrimary }}>Shashank Jajodia</h4>
                    <p className="text-xs font-semibold" style={{ color: colors.accent }}>Co-Founder & CFO</p>
                    <p className="text-[11px] mt-1" style={{ color: colors.textSecondary }}>Growth, Outreach & Finance</p>
                  </div>
                  <Magnet strength={8}>
                    <a
                      href="https://www.linkedin.com/in/shashank-jajodia-528b5b299"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold font-mono hover:underline px-3 py-1.5 rounded-lg border transition-colors"
                      style={{ color: colors.accent, borderColor: colors.borderAccent, backgroundColor: colors.accentTint }}
                    >
                      <LinkedinIcon /> LinkedIn Profile
                    </a>
                  </Magnet>
                </SpotlightCard>
              </TiltedCard>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};
