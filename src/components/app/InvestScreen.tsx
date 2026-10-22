import React, { useState, useMemo } from 'react';
import {
  Shield,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  PauseCircle,
  PlayCircle,
  Calendar,
  Lock,
  Coins,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BasketCurrencyIcons } from '../common/BasketCurrencyIcons';
import { UpiMandateModal } from '../payment/UpiMandateModal';
import { getBasketById, BASKETS } from '../../data/baskets';
import { BasketId } from '../../types';
import { SpotlightCard, CountUp } from '../ui';
import { motion, AnimatePresence } from 'motion/react';

const STABLE_PRESETS = [10, 20, 30, 50, 100];
const GROWTH_PRESETS = [30, 50, 100, 250, 500];

const HORIZONS = [
  { label: '1 Year', years: 1 },
  { label: '3 Years', years: 3 },
  { label: '5 Years', years: 5 },
];

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
    themeMode,
  } = useApp();

  const activeBasket = getBasketById(selectedBasketId);
  const [horizonIdx, setHorizonIdx] = useState(0);
  const [mandateModalOpen, setMandateModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  // Compounding math calculations
  const projection = useMemo(() => {
    const months = horizon.years * 12;
    const monthlyRate = activeBasket.growthRate / 12;
    const monthlyDeposit = dailyAmount * (365 / 12);

    let accumulatedValue = 0;
    const trajectory: { month: number; invested: number; value: number }[] = [];

    for (let m = 1; m <= months; m++) {
      accumulatedValue = accumulatedValue * (1 + monthlyRate) + monthlyDeposit;
      const totalInv = dailyAmount * (365 / 12) * m;
      trajectory.push({
        month: m,
        invested: Math.round(totalInv),
        value: Math.round(accumulatedValue),
      });
    }

    const totalInvested = dailyAmount * 365 * horizon.years;
    const totalGains = Math.max(0, accumulatedValue - totalInvested);

    return {
      totalInvested: Math.round(totalInvested),
      futureValue: Math.round(accumulatedValue),
      totalGains: Math.round(totalGains),
      trajectory,
    };
  }, [dailyAmount, horizon, activeBasket]);

  const handleSaveHabit = async () => {
    await setupHabit(selectedBasketId, dailyAmount);
    triggerConfetti();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // SVG Area Line Chart geometry for projection curve
  const chartSvg = useMemo(() => {
    const points = projection.trajectory;
    if (points.length === 0) return { path: '', area: '', maxVal: 0 };

    const maxVal = Math.max(...points.map((p) => p.value));
    const width = 600;
    const height = 160;
    const padX = 20;
    const padY = 20;

    const coords = points.map((p, idx) => {
      const x = padX + (idx / (points.length - 1)) * (width - padX * 2);
      const y = height - padY - (p.value / (maxVal || 1)) * (height - padY * 2);
      return { x, y };
    });

    // Smooth spline
    let path = `M ${coords[0].x.toFixed(2)},${coords[0].y.toFixed(2)}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2 < coords.length ? i + 2 : coords.length - 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
    }

    const lastCoord = coords[coords.length - 1];
    const area = `${path} L ${lastCoord.x.toFixed(2)},${height} L ${coords[0].x.toFixed(2)},${height} Z`;

    return { path, area, maxVal, width, height };
  }, [projection.trajectory]);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* ── TOP HEADER BANNER ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: colors.borderDim }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.textPrimary }}>
            Auto-Save & Habit Engine
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: colors.textSecondary }}>
            Automate disciplined crypto micro-investments into {activeBasket.name} via UPI AutoPay
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-bold font-mono px-3 py-1 rounded-lg border flex items-center gap-1.5"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
              color: '#22D3EE',
            }}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            08:00 AM IST DAILY
          </span>
        </div>
      </div>

      {/* ── 4 WATERMARK METRIC CARDS ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
        {/* Card 1: Daily SIP */}
        <div
          className="rounded-[20px] p-4 sm:p-5 border relative overflow-hidden backdrop-blur-md"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <div className="absolute right-3 bottom-1 text-neutral-500/[0.07] font-extrabold text-4xl select-none pointer-events-none">
            DAILY
          </div>
          <div className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400 mb-1">
            DAILY AUTO-SAVE
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums" style={{ color: colors.textPrimary }}>
            ₹{dailyAmount}<span className="text-xs font-normal text-neutral-400">/day</span>
          </div>
          <div className="text-[11px] mt-2 flex items-center gap-1.5 font-sans" style={{ color: colors.textSecondary }}>
            <span>~₹{Math.round(dailyAmount * 30.4).toLocaleString('en-IN')}/mo</span>
            <span className="opacity-40">·</span>
            <span className="text-cyan-400 font-mono font-semibold">UPI AutoPay</span>
          </div>
        </div>

        {/* Card 2: Projected Value */}
        <div
          className="rounded-[20px] p-4 sm:p-5 border relative overflow-hidden backdrop-blur-md"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <div className="absolute right-3 bottom-1 text-neutral-500/[0.07] font-extrabold text-4xl select-none pointer-events-none">
            VALUATION
          </div>
          <div className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400 mb-1">
            {horizon.label} PROJECTED VALUE
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-cyan-400">
            <CountUp to={projection.futureValue} prefix="₹" duration={1} />
          </div>
          <div className="text-[11px] mt-2 flex items-center gap-1.5 font-sans" style={{ color: colors.textSecondary }}>
            <span>Compounded at</span>
            <span className="text-emerald-400 font-mono font-semibold">~{Math.round(activeBasket.growthRate * 100)}% p.a.</span>
          </div>
        </div>

        {/* Card 3: Est. Compounded Gains */}
        <div
          className="rounded-[20px] p-4 sm:p-5 border relative overflow-hidden backdrop-blur-md"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <div className="absolute right-3 bottom-1 text-neutral-500/[0.07] font-extrabold text-4xl select-none pointer-events-none">
            YIELD
          </div>
          <div className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400 mb-1">
            EST. COMPOUNDED GAIN
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight tabular-nums text-emerald-400">
            <CountUp to={projection.totalGains} prefix="+₹" duration={1} />
          </div>
          <div className="text-[11px] mt-2 flex items-center gap-1.5 font-sans" style={{ color: colors.textSecondary }}>
            <span>Principal:</span>
            <span className="font-mono tabular-nums text-neutral-300">₹{projection.totalInvested.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Card 4: Flexibility & Lock-in */}
        <div
          className="rounded-[20px] p-4 sm:p-5 border relative overflow-hidden backdrop-blur-md"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <div className="absolute right-3 bottom-1 text-neutral-500/[0.07] font-extrabold text-4xl select-none pointer-events-none">
            FLEXIBLE
          </div>
          <div className="text-[10px] tracking-wider uppercase font-semibold text-neutral-400 mb-1">
            HABIT COMMITMENT
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-100">
            Zero Lock-In
          </div>
          <div className="text-[11px] mt-2 flex items-center gap-1.5 font-sans" style={{ color: colors.textSecondary }}>
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pause, adjust, or withdraw 24/7</span>
          </div>
        </div>
      </div>

      {/* ── 2-COLUMN INSTITUTIONAL CONFIGURATION GRID ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Strategy, Amount, Compounding Curve */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Basket Strategy Selector */}
          <SpotlightCard
            spotlightColor="rgba(6, 182, 212, 0.08)"
            className="rounded-[22px] p-6 border shadow-xl space-y-4"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                  Step 1 · Allocation Strategy
                </span>
                <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  Choose Your Crypto Basket
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                2 Curated Mixes
              </span>
            </div>

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
                        ? 'border-cyan-500/50 bg-cyan-500/[0.05] shadow-[0_0_20px_rgba(6,182,212,0.12)]'
                        : 'border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.02]'
                    }`}
                    style={{ backgroundColor: isSelected ? undefined : colors.surface }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <BasketCurrencyIcons basketId={b.id} size="sm" />
                        <span className="font-bold text-sm" style={{ color: colors.textPrimary }}>
                          {b.name}
                        </span>
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center border border-cyan-400/40">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono font-bold text-neutral-400 px-2 py-0.5 rounded border border-white/[0.08]">
                          Min ₹{b.minDailyAmount}
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-mono font-semibold" style={{ color: isStable ? '#10B981' : '#F59E0B' }}>
                      {isStable ? '85% USDT / 15% BTC' : '70% BTC / 20% ETH / 10% SOL'}
                    </div>

                    <p className="text-[11px] mt-1.5 line-clamp-2" style={{ color: colors.textSecondary }}>
                      {isStable
                        ? 'USD-pegged stable reserve shield. Minimal downside volatility with steady liquidity.'
                        : 'Blue-chip long-term accumulation across the top 3 dominant decentralized networks.'}
                    </p>
                  </button>
                );
              })}
            </div>
          </SpotlightCard>

          {/* Section 2: Daily SIP Amount */}
          <SpotlightCard
            spotlightColor="rgba(6, 182, 212, 0.08)"
            className="rounded-[22px] p-6 border shadow-xl space-y-5"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                  Step 2 · Disciplined Capital
                </span>
                <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  Daily Investment Amount
                </h2>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400 tabular-nums">
                  ₹{dailyAmount}
                </span>
                <span className="text-xs text-neutral-400 ml-1 font-sans">/day</span>
              </div>
            </div>

            {/* Range Slider */}
            <div>
              <input
                type="range"
                min={activeBasket.minDailyAmount}
                max="500"
                step="5"
                value={dailyAmount}
                onChange={(e) =>
                  setDailyAmount(Math.max(activeBasket.minDailyAmount, parseInt(e.target.value, 10) || activeBasket.minDailyAmount))
                }
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                style={{ backgroundColor: colors.surface }}
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-400 mt-2">
                <span>Min: ₹{activeBasket.minDailyAmount}/day</span>
                <span>Max: ₹500/day</span>
              </div>
            </div>

            {/* Quick Preset Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-400 block">
                Quick Selection Presets
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
                          ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
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
          </SpotlightCard>

          {/* Section 3: Compounding Trajectory Projection */}
          <SpotlightCard
            spotlightColor="rgba(6, 182, 212, 0.08)"
            className="rounded-[22px] p-6 border shadow-xl space-y-4"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                  Step 3 · Compounding Horizon
                </span>
                <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  Long-Term Wealth Trajectory
                </h2>
              </div>

              {/* Horizon Switcher Pills */}
              <div className="flex items-center p-1 rounded-xl border gap-1" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                {HORIZONS.map((h, idx) => (
                  <button
                    key={h.label}
                    type="button"
                    onClick={() => setHorizonIdx(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-150 ease-out active:scale-[0.96] cursor-pointer ${
                      horizonIdx === idx
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Glowing SVG Area Line Chart */}
            <div className="pt-2 relative overflow-hidden rounded-xl border p-3" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex justify-between items-center text-xs font-mono mb-2 px-1">
                <span className="text-neutral-400">Compounding Curve ({horizon.years * 365} Days)</span>
                <span className="text-emerald-400 font-bold tabular-nums">Peak: ₹{projection.futureValue.toLocaleString('en-IN')}</span>
              </div>

              <div className="h-40 w-full relative">
                <svg
                  viewBox={`0 0 ${chartSvg.width} ${chartSvg.height}`}
                  preserveAspectRatio="none"
                  className="w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="investCompoundingGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.35" />
                      <stop offset="85%" stopColor="#22D3EE" stopOpacity="0.02" />
                      <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="20" y1="40" x2="580" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  <line x1="20" y1="80" x2="580" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  <line x1="20" y1="120" x2="580" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                  {/* Gradient Area */}
                  {chartSvg.area && (
                    <path d={chartSvg.area} fill="url(#investCompoundingGlow)" />
                  )}

                  {/* Glowing Stroke */}
                  {chartSvg.path && (
                    <path
                      d={chartSvg.path}
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                    />
                  )}
                </svg>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 pt-2 border-t mt-1" style={{ borderColor: colors.borderDim }}>
                <span>Day 1 (₹0)</span>
                <span>Principal: ₹{projection.totalInvested.toLocaleString('en-IN')}</span>
                <span>Est. Gains: +₹{projection.totalGains.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column (5 cols): Order Specification & AutoPay Activation */}
        <div className="lg:col-span-5 space-y-6">
          <SpotlightCard
            spotlightColor="rgba(6, 182, 212, 0.08)"
            className="rounded-[22px] p-6 border shadow-xl space-y-6"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
                Execution Spec
              </span>
              <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                AutoPay Order Details
              </h2>
            </div>

            {/* Asset Allocation Breakdown */}
            <div className="p-4 rounded-xl border space-y-3" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span style={{ color: colors.textPrimary }}>Asset Weighting</span>
                <span className="font-mono text-cyan-400">{activeBasket.name}</span>
              </div>

              {/* Progress bars */}
              <div className="space-y-2">
                {activeBasket.allocation.map((coin) => (
                  <div key={coin.ticker} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="font-semibold" style={{ color: colors.textPrimary }}>{coin.label} ({coin.ticker})</span>
                      <span className="font-bold tabular-nums" style={{ color: colors.textSecondary }}>{coin.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${coin.pct}%`,
                          backgroundColor: coin.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Execution Metrics Ledger */}
            <div className="divide-y font-mono text-xs" style={{ borderColor: colors.borderDim }}>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Daily Debit Amount</span>
                <strong className="text-cyan-400 font-bold tabular-nums">₹{dailyAmount} / day</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Monthly Run Rate (30.4d)</span>
                <strong className="text-neutral-200 tabular-nums">₹{Math.round(dailyAmount * 30.4).toLocaleString('en-IN')}</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-sans text-neutral-400">1-Year Capital Total</span>
                <strong className="text-neutral-200 tabular-nums">₹{(dailyAmount * 365).toLocaleString('en-IN')}</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Debit Execution Window</span>
                <strong className="text-neutral-200">08:00 AM IST Daily</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Settlement Type</span>
                <strong className="text-neutral-200">Spot Custodial Execution</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Lock-in Period</span>
                <span className="font-mono text-emerald-400 font-bold">Zero Days (Liquid)</span>
              </div>
            </div>

            {/* Success message banner */}
            {saveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Habit configured! Daily SIP scheduled at ₹{dailyAmount}/day.</span>
              </div>
            )}

            {/* Active / Inactive Habit Status & Controls */}
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
                      ₹{currentHabit?.dailyAmount}/day active
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
                      className="flex-1 h-11 px-4 rounded-xl text-xs font-bold shadow-[0_0_16px_rgba(6,182,212,0.3)] bg-gradient-to-r from-cyan-500 to-indigo-600 text-white transition-all active:scale-[0.97] flex items-center justify-center gap-1.5 cursor-pointer"
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
                  className="w-full h-12 rounded-xl text-xs font-bold tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.35)] bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-105 text-white transition-all active:scale-[0.97] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Start Daily Auto-Saving (₹{dailyAmount}/day)</span>
                </button>
              )}

              {/* Set up UPI mandate via dialog */}
              <button
                type="button"
                onClick={() => setMandateModalOpen(true)}
                className="w-full h-10 rounded-xl text-xs font-semibold border transition-all active:scale-[0.97] hover:bg-white/[0.04] text-neutral-300 flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ borderColor: colors.cardBorder, backgroundColor: colors.surface }}
              >
                <span>Authorize UPI AutoPay Mandate</span>
              </button>
            </div>

            {/* Peace of Mind Regulatory & Liquidity Note */}
            <div className="p-3.5 rounded-xl border text-[11px] space-y-1" style={{ backgroundColor: 'rgba(6, 182, 212, 0.04)', borderColor: colors.borderDim }}>
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: colors.textPrimary }}>
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero Lock-In Commitment</span>
              </div>
              <p className="leading-relaxed" style={{ color: colors.textSecondary }}>
                Debits are processed via NPCI UPI AutoPay directly from your linked bank account. You can pause, adjust amounts, or withdraw back to your bank account anytime with zero exit penalty.
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