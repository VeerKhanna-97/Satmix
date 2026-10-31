import React, { useState, useMemo, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpotlightCard, CountUp, FadeIn, HelpBadge } from '../ui';
import { BasketCurrencyIcons } from '../common/BasketCurrencyIcons';

interface AssetBreakdownItem {
  id: string;
  name: string;
  ticker: string;
  symbolLetter: string;
  whatItIs: string;
  color: string;
  stablePct: number;
  growthPct: number;
}

const ASSET_SEGREGATION_DATA: AssetBreakdownItem[] = [
  {
    id: 'usdt',
    name: 'Tether (USDT)',
    ticker: 'USDT',
    symbolLetter: 'T',
    whatItIs: 'A stablecoin designed to track the US dollar. It can still lose its peg.',
    color: '#00C99A',
    stablePct: 70,
    growthPct: 0,
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    ticker: 'BTC',
    symbolLetter: 'B',
    whatItIs: 'The oldest and largest crypto asset.',
    color: '#F7931A',
    stablePct: 30,
    growthPct: 70,
  },
  {
    id: 'eth',
    name: 'Ether',
    ticker: 'ETH',
    symbolLetter: 'E',
    whatItIs: 'The asset that powers the Ethereum network.',
    color: '#627EEA',
    stablePct: 0,
    growthPct: 20,
  },
  {
    id: 'sol',
    name: 'Solana',
    ticker: 'SOL',
    symbolLetter: 'S',
    whatItIs: 'A newer, faster network. Moves more sharply than BTC.',
    color: '#9945FF',
    stablePct: 0,
    growthPct: 10,
  },
];

export const CalculatorSection: React.FC = () => {
  const { colors, setViewMode, setAuthSubView, isAuthenticated } = useApp();

  // Default to Stable Basket (starts at ₹10)
  const [strategy, setStrategy] = useState<'low' | 'high'>('low');
  const [dailySavings, setDailySavings] = useState(10);

  const minSavings = strategy === 'high' ? 30 : 10;

  const handleStrategyChange = useCallback((newStrat: 'low' | 'high') => {
    setStrategy(newStrat);
    if (newStrat === 'high') {
      setDailySavings((prev) => (prev < 30 ? 30 : prev));
    }
  }, []);

  const annualRate = strategy === 'low' ? 0.08 : 0.28;

  // Mathematically accurate daily compounding calculation across 365 days
  const calculations = useMemo(() => {
    const totalInvested = dailySavings * 365;
    const dailyRate = Math.pow(1 + annualRate, 1 / 365) - 1;
    let accumulatedValue = totalInvested;

    if (dailyRate > 0) {
      accumulatedValue = Math.round(
        dailySavings * ((Math.pow(1 + dailyRate, 365) - 1) / dailyRate) * (1 + dailyRate)
      );
    }

    const estimatedGains = Math.max(0, accumulatedValue - totalInvested);
    const effectiveGainPercent = ((estimatedGains / totalInvested) * 100).toFixed(1);

    return {
      totalInvested,
      accumulatedValue,
      estimatedGains,
      gainPercent: effectiveGainPercent,
    };
  }, [dailySavings, annualRate]);

  // Range fill percentage for smooth slider track
  const sliderPercentage = ((dailySavings - minSavings) / (500 - minSavings)) * 100;

  const presets = strategy === 'high' ? [30, 50, 100, 200, 300, 500] : [10, 25, 50, 100, 250, 500];

  const getEverydayComparison = (amount: number) => {
    if (amount <= 15) return 'Less than a cup of chai';
    if (amount <= 30) return 'Less than a packet of biscuits';
    if (amount <= 60) return 'Less than a cold drink or coffee';
    if (amount <= 120) return 'Less than an evening snack';
    if (amount <= 250) return 'About a casual meal';
    return 'Less than a weekend movie ticket';
  };

  return (
    <section id="calc-section" className="py-12 sm:py-16 md:py-24 relative overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      {/* Subtle ambient connector glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-15"
        style={{
          background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── SECTION HEADER ────── */}
        <FadeIn delay={0.05} direction="up" className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight pt-0.5 font-display" style={{ color: colors.textPrimary }}>
            See Your Savings Grow in Real Time
          </h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto mt-1" style={{ color: colors.textSecondary }}>
            See how saving small amounts every morning builds meaningful wealth over 1 year compared to letting money sit idle.
          </p>
        </FadeIn>

        {/* ── RESTRUCTURED 2-COLUMN LAYOUT: CONTROLS (LEFT) vs. ESTIMATES & ASSET BREAKDOWN (RIGHT) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start max-w-6xl mx-auto">
          {/* ── LEFT COLUMN: CONTROLS ─────────────────────────── */}
          <FadeIn delay={0.15} direction="left" className="lg:col-span-5 h-full">
            <SpotlightCard
              spotlightColor={colors.accentTint}
              className="rounded-2xl p-5 sm:p-7 border shadow-xl flex flex-col justify-between h-full"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
            >
              <div className="space-y-6">
                {/* 1. Pick Your Mix (Toggle Switch with Crypto Logos) */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="block text-xs font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                      1. Pick Your Mix
                    </span>
                    <HelpBadge
                      title="Investment Mix"
                      content="Toggle between Stable (shields savings with Digital US Dollars) or Growth (aims for higher wealth with Bitcoin, Ether, and Solana)."
                    />
                  </div>

                  {/* Unified Segmented Toggle Switch */}
                  <div
                    role="tablist"
                    aria-label="Select investment basket strategy"
                    className="relative p-1 rounded-xl border flex items-center select-none"
                    style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}
                  >
                    {/* Animated Sliding Highlight Pill */}
                    <div
                      className="absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
                      style={{
                        left: strategy === 'low' ? '4px' : 'calc(50% + 2px)',
                        width: 'calc(50% - 6px)',
                        backgroundColor: colors.card,
                        border: `1px solid ${colors.borderDim || 'rgba(255, 255, 255, 0.12)'}`,
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
                      }}
                    />

                    {/* Stable Option */}
                    <button
                      type="button"
                      role="tab"
                      aria-selected={strategy === 'low'}
                      onClick={() => handleStrategyChange('low')}
                      className={`relative z-10 flex-1 py-2.5 px-3 rounded-lg flex items-center justify-between text-left transition-colors duration-200 cursor-pointer active:scale-[0.98] ${
                        strategy === 'low' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <BasketCurrencyIcons basketId="stable" size="xs" />
                        <div className="truncate">
                          <span className="block font-bold text-xs sm:text-sm leading-tight truncate">
                            Stable
                          </span>
                          <span className="block text-[10px] text-neutral-400 font-mono mt-0.5">
                            from ₹10/day
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-400 pl-1 shrink-0 [font-variant-numeric:tabular-nums]">
                        ~8%
                      </span>
                    </button>

                    {/* Growth Option */}
                    <button
                      type="button"
                      role="tab"
                      aria-selected={strategy === 'high'}
                      onClick={() => handleStrategyChange('high')}
                      className={`relative z-10 flex-1 py-2.5 px-3 rounded-lg flex items-center justify-between text-left transition-colors duration-200 cursor-pointer active:scale-[0.98] ${
                        strategy === 'high' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <BasketCurrencyIcons basketId="growth" size="xs" />
                        <div className="truncate">
                          <span className="block font-bold text-xs sm:text-sm leading-tight truncate">
                            Growth
                          </span>
                          <span className="block text-[10px] text-neutral-400 font-mono mt-0.5">
                            from ₹30/day
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-400 pl-1 shrink-0 [font-variant-numeric:tabular-nums]">
                        ~28%
                      </span>
                    </button>
                  </div>
                </div>

                {/* 2. Daily Savings Amount */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                      2. Daily Savings Amount
                    </span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono [font-variant-numeric:tabular-nums]" style={{ color: colors.textPrimary }}>
                        ₹{dailySavings}
                      </span>
                      <span className="text-xs font-normal ml-1" style={{ color: colors.textSecondary }}>/day</span>
                    </div>
                  </div>

                  {/* Range Slider Track */}
                  <div className="relative py-1.5">
                    <input
                      id="daily-savings-slider"
                      name="dailySavings"
                      type="range"
                      min={minSavings}
                      max={500}
                      step={5}
                      value={dailySavings}
                      onChange={(e) => setDailySavings(Math.max(minSavings, parseInt(e.target.value, 10)))}
                      aria-label="Daily investment amount in Indian Rupees"
                      aria-valuemin={minSavings}
                      aria-valuemax={500}
                      aria-valuenow={dailySavings}
                      aria-valuetext={`₹${dailySavings} per day`}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer transition-all focus:outline-none shadow-inner"
                      style={{
                        background: `linear-gradient(to right, ${colors.accent} 0%, ${colors.accent} ${sliderPercentage}%, ${colors.surface} ${sliderPercentage}%, ${colors.surface} 100%)`,
                      }}
                    />
                  </div>

                  {/* Daily spending comparison */}
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400 font-medium">Daily equivalent:</span>
                    <span className="font-semibold text-emerald-400 font-mono">{getEverydayComparison(dailySavings)}</span>
                  </div>

                  {/* Preset Chips */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2.5">
                    {presets.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setDailySavings(preset)}
                        className="h-8 rounded-lg text-xs font-semibold font-mono border transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.97] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 flex items-center justify-center cursor-pointer [font-variant-numeric:tabular-nums]"
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
                  className="w-full h-12 rounded-xl font-semibold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(93,23,235,0.25)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.96] flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 cursor-pointer"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  <span>Start Saving ₹{dailySavings}/day</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </button>
              </div>
            </SpotlightCard>
          </FadeIn>

          {/* ── RIGHT COLUMN: PROJECTED ESTIMATES + ASSET SEGREGATION IN ONE SUBSECTION ── */}
          <FadeIn delay={0.25} direction="right" className="lg:col-span-7 h-full">
            <SpotlightCard
              spotlightColor={colors.accentTint}
              className="rounded-2xl border shadow-xl overflow-hidden flex flex-col justify-between h-full"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              }}
            >
              {/* 1. UPPER SUBSECTION: PROJECTED ESTIMATES */}
              <div className="p-5 sm:p-7 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5" style={{ color: colors.accent }}>
                    <span>1-YEAR ESTIMATED WEALTH</span>
                    <HelpBadge
                      title="Automated Daily Saving"
                      content="By saving every morning, you automatically buy more when prices are low and less when prices are high, protecting you from bad timing."
                    />
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold border font-mono tracking-wider [font-variant-numeric:tabular-nums]" style={{ backgroundColor: colors.mintTint, color: colors.semanticSuccess, borderColor: colors.borderMint }}>
                    +₹{calculations.estimatedGains.toLocaleString('en-IN')} (+{calculations.gainPercent}%)
                  </span>
                </div>

                {/* Big CountUp Result */}
                <div>
                  <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight flex items-baseline [font-variant-numeric:tabular-nums]" style={{ color: colors.textPrimary }}>
                    <CountUp
                      to={calculations.accumulatedValue}
                      prefix="₹"
                      duration={0.8}
                      className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight"
                    />
                  </div>
                  <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    Total estimated value after 1 full year of automated daily micro-savings.
                  </div>
                </div>

                {/* Total Saved vs. Profit Comparison Grid */}
                <div className="grid grid-cols-2 gap-3.5 p-3.5 sm:p-4 rounded-xl border transition-colors" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <div>
                    <span className="block text-[11px] font-medium" style={{ color: colors.textSecondary }}>
                      Total Money You Save
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono mt-0.5 block [font-variant-numeric:tabular-nums]" style={{ color: colors.textPrimary }}>
                      <CountUp to={calculations.totalInvested} prefix="₹" duration={0.8} />
                    </span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-emerald-400">
                      Estimated Profit
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-0.5 block [font-variant-numeric:tabular-nums]">
                      <CountUp to={calculations.estimatedGains} prefix="+₹" duration={0.8} />
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. LOWER SUBSECTION: ASSET SEGREGATION BREAKDOWN */}
              <div className="border-t" style={{ borderColor: colors.borderDim }}>
                {/* Table Header */}
                <div
                  className="grid grid-cols-12 px-5 sm:px-7 py-3 text-[11px] font-semibold text-neutral-400 border-b select-none tracking-wide bg-white/[0.015]"
                  style={{ borderColor: colors.borderDim }}
                >
                  <div className="col-span-5 sm:col-span-4">Asset</div>
                  <div className="col-span-4 sm:col-span-5">What it is</div>
                  <div className="col-span-3 sm:col-span-3 text-right">Share of each buy</div>
                </div>

                {/* Asset Rows */}
                <div className="divide-y" style={{ borderColor: colors.borderDim }}>
                  {ASSET_SEGREGATION_DATA.map((asset) => {
                    const share = strategy === 'low' ? asset.stablePct : asset.growthPct;
                    const isActive = share > 0;

                    return (
                      <div
                        key={asset.id}
                        className={`grid grid-cols-12 items-center px-5 sm:px-7 py-3 sm:py-3.5 transition-colors duration-200 ${
                          isActive ? 'bg-transparent' : 'opacity-35'
                        }`}
                      >
                        {/* Col 1: Asset Badge & Ticker */}
                        <div className="col-span-5 sm:col-span-4 flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs font-mono shrink-0 border transition-colors"
                            style={{
                              borderColor: isActive ? `${asset.color}60` : 'rgba(255, 255, 255, 0.1)',
                              color: isActive ? asset.color : 'rgba(255, 255, 255, 0.4)',
                              backgroundColor: isActive ? `${asset.color}15` : 'transparent',
                            }}
                          >
                            {asset.symbolLetter}
                          </div>
                          <div className="min-w-0">
                            <span
                              className={`font-bold text-xs sm:text-[13px] block truncate transition-colors ${
                                isActive ? 'text-white' : 'text-neutral-400'
                              }`}
                            >
                              {asset.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400 block">
                              {asset.ticker}
                            </span>
                          </div>
                        </div>

                        {/* Col 2: What it is */}
                        <div className="col-span-4 sm:col-span-5 pr-2">
                          <p
                            className={`text-[11px] sm:text-xs leading-snug transition-colors ${
                              isActive ? 'text-neutral-300' : 'text-neutral-500'
                            }`}
                          >
                            {asset.whatItIs}
                          </p>
                        </div>

                        {/* Col 3: Share of each buy */}
                        <div className="col-span-3 sm:col-span-3 flex flex-col items-end justify-center select-none">
                          <span
                            className={`font-mono font-extrabold text-sm sm:text-lg [font-variant-numeric:tabular-nums] transition-colors ${
                              isActive ? 'text-white' : 'text-neutral-500'
                            }`}
                          >
                            {share}%
                          </span>
                          {isActive && (
                            <div
                              className="h-1 rounded-full mt-1 transition-all duration-300"
                              style={{
                                width: `${Math.max(14, (share / 70) * 36)}px`,
                                backgroundColor: asset.color,
                              }}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Callout */}
                <div
                  className="px-5 sm:px-7 py-3 text-[11px] text-neutral-400 font-normal border-t select-none bg-white/[0.01]"
                  style={{ borderColor: colors.borderDim }}
                >
                  Kept on target with new buys only. Nothing is sold to rebalance.
                </div>
              </div>

              {/* Bottom Footnote */}
              <div className="px-5 sm:px-7 py-2.5 border-t" style={{ borderColor: colors.borderDim }}>
                <p className="text-[10px] leading-relaxed" style={{ color: colors.textTertiary }}>
                  *Calculated daily across 365 days based on reference growth rates. Digital assets fluctuate in market price.
                </p>
              </div>
            </SpotlightCard>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
