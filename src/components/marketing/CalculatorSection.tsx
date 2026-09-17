import React, { useState, useMemo, useCallback } from 'react';
import { Shield, Rocket, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpotlightCard, CountUp, Magnet, FadeIn } from '../ui';

export const CalculatorSection: React.FC = () => {
  const { colors, setViewMode, setAuthSubView, isAuthenticated } = useApp();

  // Default to Stable Basket (starts at ₹10)
  const [strategy, setStrategy] = useState<'low' | 'high'>('low');
  const [dailySavings, setDailySavings] = useState(10);

  // Strategy switch logic:
  const handleStrategyChange = useCallback((newStrat: 'low' | 'high') => {
    setStrategy(newStrat);
    if (dailySavings < 10) {
      setDailySavings(10);
    }
  }, [dailySavings]);

  const annualRate = strategy === 'low' ? 0.08 : 0.28;

  // Compounding math based strictly on net portfolio value projection
  const calculations = useMemo(() => {
    const days = 365;
    const dailyRate = annualRate / 365;
    let totalInvested = 0;
    let accumulatedValue = 0;

    for (let d = 0; d < days; d++) {
      totalInvested += dailySavings;
      accumulatedValue += dailySavings;
      accumulatedValue *= 1 + dailyRate;
    }

    const estimatedGains = Math.max(0, accumulatedValue - totalInvested);

    return {
      totalInvested: Math.round(totalInvested),
      accumulatedValue: Math.round(accumulatedValue),
      estimatedGains: Math.round(estimatedGains),
    };
  }, [dailySavings, annualRate]);

  // Range fill percentage for ultra-smooth slider track
  const sliderPercentage = ((dailySavings - 10) / (500 - 10)) * 100;

  const presets = [10, 25, 50, 100, 250, 500];

  return (
    <section id="calc-section" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── 1. SECTION HEADER ────── */}
        <FadeIn delay={0.05} direction="up" className="text-center max-w-2xl mx-auto mb-8 md:mb-10 space-y-2">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-[11px] font-mono font-medium tracking-wider uppercase"
            style={{
              backgroundColor: colors.accentTint,
              color: colors.accent,
              borderColor: colors.borderAccent,
            }}
          >
            <span>SYSTEMATIC COMPOUNDING ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight pt-0.5" style={{ color: colors.textPrimary }}>
            See Your Savings Grow in Real Time
          </h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mt-1" style={{ color: colors.textSecondary }}>
            Calculate your estimated wealth accumulation powered by systematic daily Rupee Cost Averaging.
          </p>
        </FadeIn>

        {/* ── 2. MAIN CALCULATOR 2-COLUMN GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">
          {/* ── LEFT CARD: CONTROLS ─────────────────────────── */}
          <FadeIn delay={0.15} direction="left" className="h-full">
            <SpotlightCard
              spotlightColor={colors.accentTint}
              className="rounded-2xl p-6 sm:p-8 lg:p-9 border shadow-xl flex flex-col justify-between h-full"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
            >
              <div className="space-y-6">
                {/* Strategy Selector */}
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>
                    1. Select Systematic Basket
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleStrategyChange('low')}
                      className="p-3.5 rounded-2xl border text-left transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                      style={{
                        backgroundColor: strategy === 'low' ? colors.accentTint : colors.surface,
                        borderColor: strategy === 'low' ? colors.accent : colors.cardBorder,
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>Stable Basket</span>
                      </div>
                      <div className="flex justify-between items-baseline mt-1">
                        <span className="text-[11px] font-mono text-emerald-500 font-bold">~8% Ref. Return</span>
                        <span className="text-[9px]" style={{ color: colors.textTertiary }}>min ₹10/day</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStrategyChange('high')}
                      className="p-3.5 rounded-2xl border text-left transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                      style={{
                        backgroundColor: strategy === 'high' ? colors.accentTint : colors.surface,
                        borderColor: strategy === 'high' ? colors.accent : colors.cardBorder,
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Rocket className="w-4 h-4" style={{ color: colors.accent }} />
                        <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>Growth Basket</span>
                      </div>
                      <div className="flex justify-between items-baseline mt-1">
                        <span className="text-[11px] font-mono text-emerald-500 font-bold">~28% Hist. CAGR</span>
                        <span className="text-[9px]" style={{ color: colors.textTertiary }}>min ₹10/day</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Daily Smooth Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                      2. Daily Investment Amount
                    </span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono" style={{ color: colors.textPrimary }}>
                        ₹{dailySavings}
                      </span>
                      <span className="text-xs font-normal ml-1" style={{ color: colors.textSecondary }}>/day</span>
                    </div>
                  </div>

                  {/* Smooth Range Track with Dynamic Gradient Fill */}
                  <div className="relative py-1.5">
                    <input
                      type="range"
                      min={10}
                      max={500}
                      step={5}
                      value={dailySavings}
                      onChange={(e) => setDailySavings(parseInt(e.target.value, 10))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer transition-all focus:outline-none shadow-inner"
                      style={{
                        background: `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${sliderPercentage}%, ${colors.surface} ${sliderPercentage}%, ${colors.surface} 100%)`,
                      }}
                    />
                  </div>

                  {/* Preset Chips */}
                  <div className="grid grid-cols-6 gap-1.5 sm:gap-2 mt-2.5">
                    {presets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setDailySavings(preset)}
                        className="h-8 rounded-lg text-xs font-semibold font-mono border transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.97] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 flex items-center justify-center"
                        style={{
                          backgroundColor: dailySavings === preset ? colors.primary : colors.surface,
                          borderColor: dailySavings === preset ? colors.primary : colors.cardBorder,
                          color: dailySavings === preset ? colors.primaryText : colors.textSecondary,
                        }}
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <button
                  type="button"
                  onClick={() => {
                    if (isAuthenticated) {
                      setViewMode('app');
                    } else {
                      setAuthSubView('signup');
                      setViewMode('auth');
                    }
                  }}
                  className="w-full h-12 rounded-xl font-semibold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(247,147,26,0.2)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  <span>Automate with This Plan (₹{dailySavings}/day)</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </button>
              </div>
            </SpotlightCard>
          </FadeIn>

          {/* ── RIGHT CARD: RESULTS ─────────────────────────── */}
          <FadeIn delay={0.25} direction="right" className="h-full">
            <SpotlightCard
              spotlightColor="rgba(247, 147, 26, 0.15)"
              className="rounded-2xl p-6 sm:p-8 lg:p-9 border shadow-xl flex flex-col justify-between h-full"
              style={{
                background: `linear-gradient(135deg, ${colors.card} 0%, ${colors.cardHigh || colors.card} 100%)`,
                borderColor: colors.cardBorder,
              }}
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5" style={{ color: colors.accent }}>
                    <span>1-YEAR PROJECTED PORTFOLIO VALUE</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold border font-mono tracking-wider" style={{ backgroundColor: colors.mintTint, color: colors.semanticSuccess, borderColor: colors.borderMint }}>
                    +{((calculations.estimatedGains / calculations.totalInvested) * 100).toFixed(1)}% GAIN
                  </span>
                </div>

                {/* Total Balance Result with Live CountUp */}
                <div>
                  <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight flex items-baseline" style={{ color: colors.textPrimary }}>
                    <CountUp
                      to={calculations.accumulatedValue}
                      prefix="₹"
                      duration={0.8}
                      className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight"
                    />
                  </div>
                  <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    Daily Rupee Cost Averaging projection based on {(annualRate * 100).toFixed(0)}% reference baseline
                  </div>
                </div>

                {/* Stats Split Grid */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl border transition-colors" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <div>
                    <span className="block text-[11px] font-medium" style={{ color: colors.textSecondary }}>
                      Total Principal Outlay
                    </span>
                    <span className="text-lg font-bold font-mono mt-0.5 block" style={{ color: colors.textPrimary }}>
                      <CountUp to={calculations.totalInvested} prefix="₹" duration={0.8} />
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-emerald-500">
                      Projected Growth
                    </span>
                    <span className="text-lg font-bold font-mono text-emerald-500 mt-0.5 block">
                      <CountUp to={calculations.estimatedGains} prefix="+₹" duration={0.8} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] leading-relaxed pt-5" style={{ color: colors.textTertiary }}>
                *Projections simulate historical periodic compounding with systematic daily execution. Digital assets carry market risk.
              </p>
            </SpotlightCard>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
