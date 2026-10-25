import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FadeIn, WordRotator, Phone3DModel } from '../ui';

export const Hero: React.FC = () => {
  const { colors, setViewMode, setAuthSubView, isAuthenticated } = useApp();

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
    <section className="relative pt-6 sm:pt-10 md:pt-14 pb-14 sm:pb-20 md:pb-24 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle, ${colors.accent} 0%, rgba(93, 23, 235, 0.45) 45%, transparent 75%)`,
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
                No coin picking. No market timing. No staring at charts. Auto-invest from ₹10 daily via UPI AutoPay into curated baskets of top crypto assets. Withdraw to your bank anytime.
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
                  <span>{isAuthenticated ? 'Open Web Dashboard' : 'Start with ₹10/Day'}</span>
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
      </div>
    </section>
  );
};

export default Hero;
