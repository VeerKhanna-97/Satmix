import React from 'react';
import { ArrowRight, ChevronDown, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FadeIn, WordRotator, Phone3DModel } from '../ui';
import { HeroCoinsCanvas } from '../3d/HeroCoinsCanvas';

export const Hero: React.FC = () => {
  const { colors, themeMode, setViewMode, setAuthSubView, isAuthenticated } = useApp();

  const handleStartSaving = () => {
    if (isAuthenticated) {
      setViewMode('app');
    } else {
      setAuthSubView('signup');
      setViewMode('auth');
    }
  };

  const handlePhoneClick = () => {
    if (isAuthenticated) {
      setViewMode('app');
    } else {
      setAuthSubView('login');
      setViewMode('auth');
    }
  };

  return (
    <section className="relative pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-20 md:pb-24 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle, ${colors.accent} 0%, rgba(93, 23, 235, 0.45) 45%, transparent 75%)`,
        }}
      />

      {/* 3D WebGL Floating Crypto Coin Constellation (Layer 0) */}
      <HeroCoinsCanvas themeMode={themeMode} className="z-0 opacity-90 lg:opacity-100" />

      {/* Atmospheric Soft Frost Vignette — Desktop Layer (Subtle Peripheral Blend) */}
      <div
        className="hidden lg:block absolute inset-0 pointer-events-none z-[1] transition-colors duration-500"
        style={{
          background:
            themeMode === 'dark'
              ? 'radial-gradient(ellipse 65% 55% at 32% 45%, rgba(9, 10, 14, 0.72) 0%, rgba(9, 10, 14, 0.45) 55%, rgba(9, 10, 14, 0.05) 100%)'
              : 'radial-gradient(ellipse 65% 55% at 32% 45%, rgba(248, 250, 252, 0.78) 0%, rgba(248, 250, 252, 0.50) 55%, rgba(248, 250, 252, 0.10) 100%)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          maskImage: 'radial-gradient(ellipse 80% 65% at 35% 45%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 65% at 35% 45%, black 20%, transparent 80%)',
        }}
      />

      {/* Atmospheric Strong Frost Vignette — Mobile Phone Layer (Deep Opacity & Strong Blur for Crystal-Clear Text Readability) */}
      <div
        className="block lg:hidden absolute inset-0 pointer-events-none z-[1] transition-colors duration-500"
        style={{
          background:
            themeMode === 'dark'
              ? 'radial-gradient(ellipse 92% 75% at 50% 28%, rgba(9, 10, 14, 0.94) 0%, rgba(9, 10, 14, 0.88) 45%, rgba(9, 10, 14, 0.50) 75%, transparent 100%)'
              : 'radial-gradient(ellipse 92% 75% at 50% 28%, rgba(248, 250, 252, 0.96) 0%, rgba(248, 250, 252, 0.90) 45%, rgba(248, 250, 252, 0.50) 75%, transparent 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maskImage: 'radial-gradient(ellipse 95% 80% at 50% 28%, black 55%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 95% 80% at 50% 28%, black 55%, transparent 95%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <FadeIn delay={0.08} direction="up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.06]" style={{ color: colors.textPrimary }}>
                <span className="block font-bold">The platform to</span>
                <span className="block mt-1 sm:mt-2">
                  <WordRotator
                    words={['compound', 'automate', 'grow']}
                    accentColor={colors.accent}
                    intervalMs={2600}
                    staggerMs={45}
                  />
                </span>
                <span className="block mt-1 sm:mt-2 font-extrabold tabular-nums whitespace-nowrap" style={{ color: colors.textPrimary }}>
                  from ₹10/day
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.18} direction="up">
              <p className="text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed" style={{ color: colors.textSecondary }}>
                Save small. Compound big. Automatically save from ₹10 daily into top digital assets using your favorite UPI app. No trading skills needed. Cash out to your bank anytime.
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.28} direction="up">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1 lg:pt-2">
                <button
                  type="button"
                  onClick={handleStartSaving}
                  className="w-full sm:w-auto h-12 px-7 rounded-xl font-semibold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(93,23,235,0.25)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.96] inline-flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 cursor-pointer"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  <span>Launch App</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </button>

                <a
                  href="#waitlist-section"
                  className="w-full sm:w-auto h-12 px-6 rounded-xl font-semibold text-sm transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/[0.04] hover:border-white/20 active:scale-[0.96] border inline-flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                >
                  <span>Join Waitlist</span>
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                </a>

                <a
                  href="#calc-section"
                  className="w-full sm:w-auto h-12 px-5 rounded-xl font-semibold text-sm transition-[transform,opacity] duration-150 ease-out hover:opacity-80 active:scale-[0.96] inline-flex items-center justify-center gap-1.5 select-none text-xs"
                  style={{
                    color: colors.textSecondary,
                  }}
                >
                  <span>Calculate Growth →</span>
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: 3D Phone Model with Mobile Dashboard View */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <FadeIn delay={0.2} direction="up" className="w-full flex items-center justify-center">
              <Phone3DModel onOpenApp={handlePhoneClick} />
            </FadeIn>
          </div>
        </div>

        {/* ── CORE TRUST PILLARS & REGULATORY TRANSPARENCY ── */}
        <FadeIn delay={0.28} direction="up">
          <div className="mt-12 sm:mt-16 text-center relative z-10">
            <ul className="mx-auto flex max-w-2xl flex-wrap justify-center items-center gap-x-6 sm:gap-x-8 gap-y-2.5 text-xs sm:text-sm font-medium">
              {[
                'Spot buys only',
                'In your own exchange account',
                'Fees shown before every buy',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[2.5] flex-shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p
              className="mx-auto mt-3 max-w-md text-[11.5px] sm:text-xs leading-relaxed"
              style={{ color: colors.textTertiary }}
            >
              Crypto is volatile. You can lose money. Satmix does not give investment advice.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Hero;
