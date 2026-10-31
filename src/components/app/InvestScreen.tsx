import React, { useState, useMemo } from 'react';
import {
  Shield,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Clock,
  Target,
  Check,
  PauseCircle,
  PlayCircle,
  PiggyBank,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BasketCurrencyIcons } from '../common/BasketCurrencyIcons';
import { UpiMandateModal } from '../payment/UpiMandateModal';
import { getBasketById, BASKETS } from '../../data/baskets';
import { BasketId } from '../../types';
import { SpotlightCard, CountUp, HelpBadge } from '../ui';

const STABLE_PRESETS = [10, 20, 30, 50, 100];
const GROWTH_PRESETS = [30, 50, 100, 250, 500];

const HORIZONS = [
  { label: '1 Year', years: 1 },
  { label: '3 Years', years: 3 },
  { label: '5 Years', years: 5 },
];

const getEverydayComparison = (amount: number) => {
  if (amount <= 15) return 'Less than a cup of chai';
  if (amount <= 30) return 'Less than a packet of biscuits';
  if (amount <= 60) return 'Less than a cold drink or coffee';
  if (amount <= 120) return 'Less than an evening snack';
  if (amount <= 250) return 'About a casual meal';
  return 'Less than a weekend movie ticket';
};

export const InvestScreen: React.FC = () => {
  const {
    selectedBasketId,
    setSelectedBasketId,
    dailyAmount,
    setDailyAmount,
    prototypeState,
    setupHabit,
    toggleHabitPause,
    triggerConfetti,
    colors,
    tabMetrics,
    themeMode,
  } = useApp();

  const activeBasket = getBasketById(selectedBasketId);
  const [horizonIdx, setHorizonIdx] = useState(0);
  const [mandateModalOpen, setMandateModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const minSavings = activeBasket.minDailyAmount;
  const maxSavings = 500;
  const sliderPercentage = Math.min(
    100,
    Math.max(0, ((dailyAmount - minSavings) / (maxSavings - minSavings)) * 100)
  );

  const horizon = HORIZONS[horizonIdx];
  const presets = selectedBasketId === 'stable' ? STABLE_PRESETS : GROWTH_PRESETS;
  const currentHabit = selectedBasketId === 'stable' ? prototypeState.habits.stable : prototypeState.habits.growth;
  const isHabitConfigured = currentHabit?.setupAt !== null;
  const isHabitActive = isHabitConfigured && !currentHabit?.paused;

  const handleBasketChange = (id: BasketId) => {
    setSelectedBasketId(id);
    const defaultAmt = id === 'growth' ? 30 : 10;
    if (dailyAmount < defaultAmt || dailyAmount === 10 || dailyAmount === 30 || dailyAmount === 50) {
      setDailyAmount(defaultAmt);
    }
  };

  // Mathematically calibrated compounding projections (Satmix Basket vs Idle Bank Savings)
  const projection = useMemo(() => {
    const months = horizon.years * 12;
    const monthlyRate = activeBasket.growthRate / 12;
    const monthlyDeposit = dailyAmount * (365 / 12);

    let accumulatedValue = 0;
    const bankAnnualRate = 0.035; // 3.5% standard Indian bank savings account interest
    const bankMonthlyRate = bankAnnualRate / 12;
    let bankAccumulated = 0;

    for (let m = 1; m <= months; m++) {
      accumulatedValue = accumulatedValue * (1 + monthlyRate) + monthlyDeposit;
      bankAccumulated = bankAccumulated * (1 + bankMonthlyRate) + monthlyDeposit;
    }

    const totalInvested = dailyAmount * 365 * horizon.years;
    const totalGains = Math.max(0, accumulatedValue - totalInvested);
    const bankGains = Math.max(0, bankAccumulated - totalInvested);
    const extraVsBank = Math.max(0, accumulatedValue - bankAccumulated);

    return {
      totalInvested: Math.round(totalInvested),
      futureValue: Math.round(accumulatedValue),
      totalGains: Math.round(totalGains),
      bankValue: Math.round(bankAccumulated),
      bankGains: Math.round(bankGains),
      extraVsBank: Math.round(extraVsBank),
    };
  }, [dailyAmount, horizon, activeBasket]);

  // Tangible Wealth Milestones (grounded in everyday saver targets)
  const milestones = useMemo(() => {
    const dailyDeposit = Math.max(10, dailyAmount);
    const target1 = 10000;
    const target2 = 50000;
    const daysTo10k = Math.max(1, Math.round(target1 / dailyDeposit));
    const daysTo50k = Math.max(1, Math.round(target2 / dailyDeposit));
    const yearsTo50k = (daysTo50k / 365).toFixed(1);

    return [
      {
        id: 'm1',
        title: '₹10,000 First Milestone',
        subtext: `${daysTo10k} days away at ₹${dailyDeposit}/day`,
        badge: `${Math.min(100, Math.round((tabMetrics.marketValue / target1) * 100))}% Reached`,
        achieved: tabMetrics.marketValue >= target1,
      },
      {
        id: 'm2',
        title: '0.01 Bitcoin Milestone',
        subtext: 'Accumulate 1% of a full Bitcoin',
        badge: `${Math.min(100, Math.round(((tabMetrics.holdings.BTC.units || 0) / 0.01) * 100))}% Reached`,
        achieved: (tabMetrics.holdings.BTC.units || 0) >= 0.01,
      },
      {
        id: 'm3',
        title: '₹50,000 Wealth Cushion',
        subtext: `${yearsTo50k} years of disciplined daily habit`,
        badge: `${Math.min(100, Math.round((tabMetrics.marketValue / target2) * 100))}% Reached`,
        achieved: tabMetrics.marketValue >= target2,
      },
    ];
  }, [dailyAmount, tabMetrics.marketValue, tabMetrics.holdings.BTC.units]);

  // Net Realized Liquidity (1% TDS Indian Tax Transparency)
  const netLiquidity = useMemo(() => {
    const grossVal = tabMetrics.marketValue;
    const tds1Pct = Math.round(grossVal * 0.01 * 100) / 100;
    const netPayout = Math.max(0, grossVal - tds1Pct);
    return {
      grossVal,
      tds1Pct,
      netPayout,
      netPercentage: 99.0,
    };
  }, [tabMetrics.marketValue]);

  const handleSaveHabit = async () => {
    await setupHabit(selectedBasketId, dailyAmount);
    triggerConfetti();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* ── TOP HEADER BANNER ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: colors.borderDim }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.textPrimary }}>
            Strategy & Growth
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: colors.textSecondary }}>
            Configure your daily savings habit, see how small amounts compound over time, and manage your automated daily UPI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-bold font-mono px-3 py-1 rounded-lg border flex items-center gap-1.5"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
              color: '#8B5CF6',
            }}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>08:00 AM IST DAILY</span>
          </span>
        </div>
      </div>

      {/* ── 4 WATERMARK METRIC CARDS (HIGH-SIGNAL HABIT ANCHORS) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 font-mono">
        {/* Card 1: Daily Auto-Save */}
        <div
          className="rounded-[18px] p-5 sm:p-6 border relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[128px]"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <img
            src="/icons/daily.png"
            alt=""
            aria-hidden="true"
            className="absolute -right-2 -top-2 w-20 h-20 sm:w-24 sm:h-24 object-contain pointer-events-none select-none opacity-[0.07] invert dark:invert-0"
          />
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider block text-neutral-400">
              DAILY AUTO-SAVE
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums" style={{ color: colors.textPrimary }}>
              ₹{dailyAmount}<span className="text-xs font-normal text-neutral-400">/day</span>
            </div>
          </div>
          <div className="text-[11px] flex items-center gap-1.5 font-sans relative z-10" style={{ color: colors.textSecondary }}>
            <span>~₹{Math.round(dailyAmount * 30.4).toLocaleString('en-IN')}/mo</span>
            <span className="opacity-40">·</span>
            <span className="text-purple-400 font-mono font-semibold">UPI AutoPay</span>
          </div>
        </div>

        {/* Card 2: Monthly Commitment (Replaced trader alpha with real budget anchor) */}
        <div
          className="rounded-[18px] p-5 sm:p-6 border relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[128px]"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <img
            src="/icons/rupee.png"
            alt=""
            aria-hidden="true"
            className="absolute -right-1 -top-1 w-20 h-20 sm:w-24 sm:h-24 object-contain pointer-events-none select-none opacity-[0.07] invert dark:invert-0"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider block text-neutral-400">
                MONTHLY BUDGET
              </span>
              <HelpBadge
                title="Automated Monthly Impact"
                content="Your linked UPI app debits your chosen micro-saving amount every morning at 8:00 AM automatically. You can pause or adjust it anytime."
              />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-emerald-400">
              ₹{Math.round(dailyAmount * 30.4).toLocaleString('en-IN')}
            </div>
          </div>
          <div className="text-[11px] flex items-center gap-1.5 font-sans relative z-10" style={{ color: colors.textSecondary }}>
            <PiggyBank className="w-3.5 h-3.5 text-emerald-400" />
            <span>~30 micro-buys every month</span>
          </div>
        </div>

        {/* Card 3: Projected Value */}
        <div
          className="rounded-[18px] p-5 sm:p-6 border relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[128px]"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <img
            src="/icons/projected-value.png"
            alt=""
            aria-hidden="true"
            className="absolute -right-1 -top-1 w-20 h-20 sm:w-24 sm:h-24 object-contain pointer-events-none select-none opacity-[0.07] invert dark:invert-0"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider block text-neutral-400">
                {horizon.label} ESTIMATED VALUE
              </span>
              <HelpBadge
                title="Estimated Growth"
                content="Estimated future value based on consistent daily micro-investing compounded at reference basket growth rates. Past performance is not a guarantee."
              />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-purple-400">
              <CountUp to={projection.futureValue} prefix="₹" duration={1} />
            </div>
          </div>
          <div className="text-[11px] flex items-center gap-1.5 font-sans relative z-10" style={{ color: colors.textSecondary }}>
            <span>Compounded at</span>
            <span className="text-emerald-400 font-mono font-semibold">~{Math.round(activeBasket.growthRate * 100)}% p.a.</span>
          </div>
        </div>

        {/* Card 4: Instant Cashout */}
        <div
          className="rounded-[18px] p-5 sm:p-6 border relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[128px]"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <img
            src="/icons/liquidity.png"
            alt=""
            aria-hidden="true"
            className="absolute -right-2 -top-2 w-20 h-20 sm:w-24 sm:h-24 object-contain pointer-events-none select-none opacity-[0.07] invert dark:invert-0"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider block text-neutral-400">
                INSTANT CASHOUT
              </span>
              <HelpBadge
                title="Instant Bank Cashout"
                content="Zero lock-in. You can withdraw your money straight to your bank account anytime via instant IMPS / UPI. Satmix charges 0% exit fees."
              />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums" style={{ color: colors.textPrimary }}>
              {netLiquidity.netPercentage}%
            </div>
          </div>
          <div className="text-[11px] flex items-center gap-1.5 font-sans relative z-10" style={{ color: colors.textSecondary }}>
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Direct to bank • Zero exit fee</span>
          </div>
        </div>
      </div>

      {/* ── 2-COLUMN INSTITUTIONAL GRID (CONFIG + FORECAST on Left, EXECUTION on Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column (7 Cols): Stance Selector, Daily Dial, Compounding Reality */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Savings Mix (Interactive Segmented Stance Selector) */}
          <SpotlightCard
            spotlightColor="rgba(93, 23, 235, 0.08)"
            className="rounded-[20px] p-6 border shadow-xl space-y-4"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-0.5">
                  Step 1 · Choose Your Stance
                </span>
                <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  Curated Savings Stance
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Passive & Hands-Free
              </span>
            </div>

            {/* Seamless 2-Option Segmented Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {BASKETS.map((b) => {
                const isSelected = selectedBasketId === b.id;
                const isStable = b.id === 'stable';

                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleBasketChange(b.id)}
                    className={`p-4 rounded-xl border text-left transition-all duration-150 ease-out active:scale-[0.98] relative cursor-pointer ${
                      isSelected
                        ? 'border-purple-500/50 bg-purple-500/[0.08] shadow-[0_0_20px_rgba(93,23,235,0.15)]'
                        : 'border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.02]'
                    }`}
                    style={{ backgroundColor: isSelected ? undefined : colors.surface }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BasketCurrencyIcons basketId={b.id} size="sm" />
                        <div>
                          <span className="font-bold text-sm block" style={{ color: colors.textPrimary }}>
                            {b.name}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {isStable ? 'Capital First' : 'Wealth First'}
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-purple-400/20 text-purple-400 flex items-center justify-center border border-purple-400/40">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-neutral-400 px-2 py-0.5 rounded border border-white/[0.08]">
                          From ₹{b.minDailyAmount}/day
                        </span>
                      )}
                    </div>

                    {/* Exact Rupee Split Rule */}
                    <div className="p-2 rounded-lg bg-black/20 border border-white/[0.04] text-[11px] font-mono font-semibold" style={{ color: isStable ? '#10B981' : '#F59E0B' }}>
                      {isStable ? '₹8.5 Digital USD + ₹1.5 BTC per ₹10' : '₹21 BTC + ₹6 ETH + ₹3 SOL per ₹30'}
                    </div>

                    <p className="text-[11px] mt-2 line-clamp-2 leading-relaxed" style={{ color: colors.textSecondary }}>
                      {isStable
                        ? 'Shields savings with dollar stability (~8% p.a. ref). Best for capital safety.'
                        : 'Captures upside across top 3 digital assets (~28% p.a. ref). Best for 1+ year growth.'}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Active Stance Split Confirmation Banner */}
            <div
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 ${
                selectedBasketId === 'stable'
                  ? 'border-emerald-500/25 bg-emerald-500/[0.06]'
                  : 'border-purple-500/25 bg-purple-500/[0.06]'
              }`}
            >
              <div className="flex items-start sm:items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                    selectedBasketId === 'stable'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div
                    className="text-xs sm:text-sm font-semibold font-mono tracking-tight"
                    style={{ color: colors.textPrimary }}
                  >
                    {selectedBasketId === 'stable'
                      ? 'Every ₹10 is split into ₹8.5 Digital USD + ₹1.5 BTC automatically.'
                      : 'Every ₹30 is split into ₹21 BTC + ₹6 ETH + ₹3 SOL automatically.'}
                  </div>
                  {dailyAmount > activeBasket.minDailyAmount && (
                    <div className="text-[11px] font-mono mt-0.5 text-neutral-400">
                      At your selected ₹{dailyAmount}/day:{' '}
                      <span className={selectedBasketId === 'stable' ? 'text-emerald-400 font-semibold' : 'text-purple-400 font-semibold'}>
                        {selectedBasketId === 'stable'
                          ? `₹${(dailyAmount * 0.85).toFixed(1)} Digital USD + ₹${(dailyAmount * 0.15).toFixed(1)} BTC daily`
                          : `₹${(dailyAmount * 0.7).toFixed(1)} BTC + ₹${(dailyAmount * 0.2).toFixed(1)} ETH + ₹${(dailyAmount * 0.1).toFixed(1)} SOL daily`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border shrink-0 self-start sm:self-auto ${
                  selectedBasketId === 'stable'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                }`}
              >
                Daily
              </span>
            </div>
          </SpotlightCard>

          {/* Section 2: Daily Savings Amount (Tactile Habit Dial) */}
          <SpotlightCard
            spotlightColor="rgba(93, 23, 235, 0.08)"
            className="rounded-[20px] p-6 border shadow-xl space-y-5"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-0.5">
                  Step 2 · Daily Habit
                </span>
                <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  Set Your Daily Amount
                </h2>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400 tabular-nums">
                  ₹{dailyAmount}
                </span>
                <span className="text-xs text-neutral-400 ml-1 font-sans">/day</span>
              </div>
            </div>

            {/* Range Slider */}
            <div className="space-y-2.5">
              <div className="relative py-1">
                <input
                  type="range"
                  min={minSavings}
                  max={maxSavings}
                  step="5"
                  value={dailyAmount}
                  onChange={(e) =>
                    setDailyAmount(Math.max(minSavings, parseInt(e.target.value, 10) || minSavings))
                  }
                  aria-label="Daily savings amount"
                  className="w-full h-3 rounded-full appearance-none cursor-pointer focus:outline-none transition-all shadow-inner border border-white/10"
                  style={{
                    background: `linear-gradient(to right, #8B5CF6 0%, #A855F7 ${sliderPercentage}%, ${
                      themeMode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.15)'
                    } ${sliderPercentage}%, ${
                      themeMode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.15)'
                    } 100%)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Min: ₹{minSavings}/day
                </span>
                <span className="flex items-center gap-1.5">
                  Max: ₹{maxSavings}/day
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                </span>
              </div>
            </div>

            {/* Quick Preset Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-400 block">
                Quick Selection Chips
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {presets.map((preset) => {
                  const isSelected = dailyAmount === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setDailyAmount(preset)}
                      className={`min-w-[64px] h-9 px-3.5 rounded-xl text-xs font-bold font-mono border transition-all duration-150 ease-out active:scale-[0.96] cursor-pointer ${
                        isSelected
                          ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(93,23,235,0.25)]'
                          : 'border-white/[0.08] hover:border-white/[0.18] text-neutral-300 hover:bg-white/[0.04]'
                      }`}
                      style={{ backgroundColor: isSelected ? undefined : colors.surface }}
                    >
                      ₹{preset}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Relatable Everyday Spending Equivalent */}
            <div className="p-3 rounded-xl border flex items-center justify-between text-xs font-sans" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <span className="text-neutral-400">Daily equivalent:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <span>☕</span>
                <span>{getEverydayComparison(dailyAmount)}</span>
              </span>
            </div>
          </SpotlightCard>

          {/* Section 3: The Compounding Forecast (Transparent Reality vs Bank) */}
          <SpotlightCard
            spotlightColor="rgba(93, 23, 235, 0.08)"
            className="rounded-[20px] p-6 border shadow-xl space-y-4"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-0.5">
                  Step 3 · Compounding Reality
                </span>
                <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  What Your Money Builds
                </h2>
              </div>

              {/* Horizon Switcher Pills */}
              <div className="flex items-center p-1 rounded-xl border gap-1 self-start sm:self-auto" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                {HORIZONS.map((h, idx) => (
                  <button
                    key={h.label}
                    type="button"
                    onClick={() => setHorizonIdx(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 ease-out active:scale-[0.96] cursor-pointer ${
                      horizonIdx === idx
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Comparison: You Deposit vs Satmix Compounded vs Idle Bank */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Box 1: What You Put In */}
              <div className="p-3.5 rounded-xl border space-y-1 font-mono" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <span className="text-[10px] uppercase text-neutral-400 block font-sans">You Deposit</span>
                <div className="text-lg font-bold text-white tabular-nums">
                  ₹{projection.totalInvested.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-neutral-500 block font-sans">
                  ₹{dailyAmount}/day × {horizon.years * 365} days
                </span>
              </div>

              {/* Box 2: Satmix Compounded Value */}
              <div className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/[0.06] space-y-1 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-purple-300 font-sans font-semibold">Satmix Value</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                    +₹{projection.totalGains.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-lg font-bold text-purple-300 tabular-nums">
                  ₹{projection.futureValue.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-emerald-400 block font-sans">
                  ~{Math.round(activeBasket.growthRate * 100)}% p.a. reference
                </span>
              </div>

              {/* Box 3: Idle Bank Alternative */}
              <div className="p-3.5 rounded-xl border space-y-1 font-mono" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-neutral-400 font-sans">Bank Account</span>
                  <span className="text-[9px] text-neutral-400 font-mono">3.5% p.a.</span>
                </div>
                <div className="text-lg font-bold text-neutral-400 tabular-nums">
                  ₹{projection.bankValue.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-purple-400 block font-sans font-semibold">
                  Satmix +₹{projection.extraVsBank.toLocaleString('en-IN')} ahead
                </span>
              </div>
            </div>

            {/* Tangible Wealth Milestones */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-neutral-400 block mb-2">
                Habit Milestones
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {milestones.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl border flex flex-col justify-between space-y-1.5"
                    style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>{m.title}</span>
                      <Target className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <p className="text-[11px] text-neutral-400">{m.subtext}</p>
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      {m.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column (5 Cols): AutoPay Mandate Execution & Liquidity Guarantee */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card: AutoPay Plan & Activation */}
          <SpotlightCard
            spotlightColor="rgba(93, 23, 235, 0.08)"
            className="rounded-[20px] p-6 border shadow-xl space-y-5"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-0.5">
                Automated Plan
              </span>
              <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                Daily UPI AutoPay Details
              </h3>
            </div>

            {/* Key Execution Metrics */}
            <div className="divide-y divide-slate-200 dark:divide-white/[0.06] font-mono text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Daily Amount</span>
                <strong className="text-purple-400 font-bold tabular-nums">₹{dailyAmount} / day</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Monthly Budget</span>
                <strong className="tabular-nums text-white">₹{Math.round(dailyAmount * 30.4).toLocaleString('en-IN')}</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Daily Execution</span>
                <strong className="text-white">8:00 AM IST Daily</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Lock-in Period</span>
                <span className="text-emerald-400 font-bold">Zero Days (Withdraw Anytime)</span>
              </div>
            </div>

            {/* 1% TDS Transparency (Govt Tax Law) */}
            <div className="p-3.5 rounded-xl border space-y-1.5 font-mono text-xs" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex items-center justify-between font-sans">
                <span className="font-semibold" style={{ color: colors.textPrimary }}>Liquidity Guarantee</span>
                <span className="text-emerald-400 font-bold">99% Net Payout</span>
              </div>
              <div className="flex justify-between text-[11px] text-neutral-400 pt-1">
                <span>Gross Portfolio Value:</span>
                <strong className="tabular-nums" style={{ color: colors.textPrimary }}>₹{netLiquidity.grossVal.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 font-sans">
                  <span>Govt Tax (1% TDS):</span>
                  <HelpBadge
                    title="1% TDS on Crypto Withdrawals"
                    content="As mandated by the Govt of India, 1% TDS is deducted on sales and deposited directly to the Income Tax Department against your PAN card. You can claim it back when filing taxes. Satmix charges 0% exit fees."
                  />
                </span>
                <strong className="text-rose-400 tabular-nums">-₹{netLiquidity.tds1Pct.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between text-[11px] text-purple-400 pt-1 border-t border-slate-200 dark:border-white/[0.06] font-bold">
                <span>Net Bank Payout:</span>
                <strong className="tabular-nums">₹{netLiquidity.netPayout.toLocaleString('en-IN')}</strong>
              </div>
              <p className="text-[10px] text-neutral-400 pt-1 font-sans leading-relaxed">
                *1% TDS is deposited directly to the Income Tax Department against your PAN card. Satmix charges zero exit penalties.
              </p>
            </div>

            {/* Success message banner */}
            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Habit saved! AutoPay active at ₹{dailyAmount}/day.</span>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="space-y-3 pt-1">
              {isHabitConfigured ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl border text-xs" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isHabitActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span className="font-bold" style={{ color: colors.textPrimary }}>
                        {isHabitActive ? 'Daily Habit Running' : 'Habit Paused'}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-neutral-400">
                      ₹{currentHabit?.dailyAmount}/day
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleHabitPause(selectedBasketId)}
                      className="flex-1 h-11 px-4 rounded-xl text-xs font-bold border transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 cursor-pointer"
                      style={{
                        backgroundColor: isHabitActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        borderColor: isHabitActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                        color: isHabitActive ? colors.semanticDanger : colors.semanticSuccess,
                      }}
                    >
                      {isHabitActive ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                      <span>{isHabitActive ? 'Pause Habit' : 'Resume Habit'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveHabit}
                      className="flex-1 h-11 px-4 rounded-xl text-xs font-bold shadow-[0_0_16px_rgba(93,23,235,0.35)] bg-gradient-to-r from-[#5D17EB] to-[#7C3AED] text-white transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Update Rate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSaveHabit}
                  className="w-full h-12 rounded-xl text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(93,23,235,0.4)] bg-gradient-to-r from-[#5D17EB] to-[#7C3AED] hover:brightness-105 text-white transition-all active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Activate Daily AutoPay (₹{dailyAmount}/day)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setMandateModalOpen(true)}
                className="w-full h-10 rounded-xl text-xs font-semibold border transition-all active:scale-[0.97] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ borderColor: colors.cardBorder, backgroundColor: colors.surface, color: colors.textPrimary }}
              >
                <span>Set Up Daily UPI AutoPay</span>
              </button>
            </div>

            {/* Zero Lock-In Peace of Mind Notice */}
            <div className="p-3.5 rounded-xl border text-[11px] space-y-1" style={{ backgroundColor: 'rgba(93, 23, 235, 0.04)', borderColor: colors.borderDim }}>
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: colors.textPrimary }}>
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Zero Lock-In Commitment</span>
              </div>
              <p className="leading-relaxed" style={{ color: colors.textSecondary }}>
                Debits are processed via NPCI UPI AutoPay directly from your linked bank account. Pause, adjust amounts, or withdraw back to your bank account anytime with zero exit penalties.
              </p>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* ── UPI MANDATE MODAL ─────────────────────────────────── */}
      <UpiMandateModal
        isOpen={mandateModalOpen}
        onClose={() => setMandateModalOpen(false)}
        dailyAmount={dailyAmount}
      />
    </div>
  );
};
