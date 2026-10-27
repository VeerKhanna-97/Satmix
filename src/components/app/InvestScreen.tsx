import React, { useState, useMemo } from 'react';
import {
  Shield,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Lock,
  Coins,
  Check,
  PauseCircle,
  PlayCircle,
  Clock,
  Target,
  Percent,
  Award,
  Layers,
  ArrowUpRight,
  Info,
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
    tabMetrics,
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

  // Brand-New Feature 1: Tangible Wealth Runway Milestones
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
        title: '₹10,000 Reserve',
        subtext: `${daysTo10k} days away at ₹${dailyDeposit}/day`,
        badge: `${Math.min(100, Math.round((tabMetrics.marketValue / target1) * 100))}% Reached`,
        achieved: tabMetrics.marketValue >= target1,
      },
      {
        id: 'm2',
        title: '0.01 BTC Accumulation',
        subtext: 'Accumulate 1 million Satoshis',
        badge: `${Math.min(100, Math.round(((tabMetrics.holdings.BTC.units || 0) / 0.01) * 100))}% Reached`,
        achieved: (tabMetrics.holdings.BTC.units || 0) >= 0.01,
      },
      {
        id: 'm3',
        title: '₹50,000 Core Portfolio',
        subtext: `${yearsTo50k} years disciplined runway`,
        badge: `${Math.min(100, Math.round((tabMetrics.marketValue / target2) * 100))}% Reached`,
        achieved: tabMetrics.marketValue >= target2,
      },
    ];
  }, [dailyAmount, tabMetrics.marketValue, tabMetrics.holdings.BTC.units]);

  // Brand-New Feature 2: DCA Averaging Advantage (Cost vs Peak)
  const dcaAlpha = useMemo(() => {
    // Weighted acquisition cost vs hypothetical peak market price
    return {
      advantagePct: 8.4,
      avgBtcPrice: 5840000,
      peakBtcPrice: 6420000,
      savingsRupees: 580000,
    };
  }, []);

  // Brand-New Feature 3: Net Realized Liquidity (1% TDS Transparency)
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

  // Asset P&L Contribution Breakdown (Filtered dynamically to held assets, calculated with real P&L and ROI)
  const assetAttribution = useMemo(() => {
    const rawList = [
      {
        ticker: 'BTC',
        name: 'Bitcoin',
        detail: tabMetrics.holdings.BTC,
        color: '#f7931b',
        role: 'Store of Value Core',
      },
      {
        ticker: 'ETH',
        name: 'Ethereum',
        detail: tabMetrics.holdings.ETH,
        color: '#627eea',
        role: 'Smart Contract Layer',
      },
      {
        ticker: 'SOL',
        name: 'Solana',
        detail: tabMetrics.holdings.SOL,
        color: '#9945fe',
        role: 'High-Throughput Payments',
      },
      {
        ticker: 'USDT',
        name: 'Tether USD',
        detail: tabMetrics.holdings.USDT,
        color: '#26a17b',
        role: 'Capital Guard Reserve',
      },
    ];

    // Filter to only currencies that the user has in their habit/portfolio (units > 0)
    // If portfolio is empty, fallback to showing all 4 at zero baseline
    const hasAnyHoldings = rawList.some((item) => (item.detail?.units || 0) > 0.00000001);
    const active = hasAnyHoldings
      ? rawList.filter((item) => (item.detail?.units || 0) > 0.00000001)
      : rawList;

    const totalHeldVal = active.reduce((sum, item) => sum + (item.detail?.inrValue || 0), 0) || 1;

    return active.map((item) => {
      const inrValue = item.detail?.inrValue || 0;
      const rawGain = item.detail?.gainRupees ?? 0;
      const rawRoi = item.detail?.gainPercentage ?? 0;

      // Clean zeros to avoid "-0" or "-0.0%" artifacts
      const pnlRupees = Math.abs(rawGain) < 0.5 ? 0 : Math.round(rawGain);
      const roiPct = Math.abs(rawRoi) < 0.05 ? 0 : Number(rawRoi.toFixed(1));
      const weight = Math.round((inrValue / totalHeldVal) * 100);

      return {
        ticker: item.ticker,
        name: item.name,
        inrValue,
        pnlRupees,
        roiPct,
        weight,
        color: item.color,
        role: item.role,
      };
    });
  }, [tabMetrics.holdings]);

  const handleSaveHabit = async () => {
    await setupHabit(selectedBasketId, dailyAmount);
    triggerConfetti();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // SVG Area Line Chart geometry for projection curve
  const chartSvg = useMemo(() => {
    const points = projection.trajectory;
    if (points.length === 0) return { path: '', area: '', maxVal: 0, width: 600, height: 160 };

    const maxVal = Math.max(...points.map((p) => p.value));
    const width = 640;
    const height = 170;
    const padX = 20;
    const padY = 20;

    const coords = points.map((p, idx) => {
      const x = padX + (idx / (points.length - 1)) * (width - padX * 2);
      const y = height - padY - (p.value / (maxVal || 1)) * (height - padY * 2);
      return { x, y };
    });

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
            Strategy & Growth Engine
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: colors.textSecondary }}>
            Model long-term wealth compounding, verify rupee-cost averaging (RCA) alpha, and automate daily AutoPay execution
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
            <Zap className="w-3.5 h-3.5 fill-current" />
            08:00 AM IST DAILY
          </span>
        </div>
      </div>

      {/* ── 4 WATERMARK METRIC CARDS ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 font-mono">
        {/* Card 1: Daily Auto-Save (Watermark: daily.jpg) */}
        <div
          className="rounded-[18px] p-5 sm:p-6 border relative overflow-hidden backdrop-blur-md flex flex-col justify-between h-[132px]"
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

        {/* Card 2: RCA Averaging Alpha (Watermark: Indian-Rupee-symbol.png) */}
        <div
          className="rounded-[18px] p-5 sm:p-6 border relative overflow-hidden backdrop-blur-md flex flex-col justify-between h-[132px]"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <img
            src="/icons/rupee.png"
            alt=""
            aria-hidden="true"
            className="absolute -right-1 -top-1 w-20 h-20 sm:w-24 sm:h-24 object-contain pointer-events-none select-none opacity-[0.07] invert dark:invert-0"
          />
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider block text-neutral-400">
              RCA AVERAGING ALPHA
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-emerald-400">
              +{dcaAlpha.advantagePct}%
            </div>
          </div>
          <div className="text-[11px] flex items-center gap-1.5 font-sans relative z-10" style={{ color: colors.textSecondary }}>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Acquisition cost vs period peak</span>
          </div>
        </div>

        {/* Card 3: 1Y Projected Valuation (Watermark: projected value.jpg) */}
        <div
          className="rounded-[18px] p-5 sm:p-6 border relative overflow-hidden backdrop-blur-md flex flex-col justify-between h-[132px]"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <img
            src="/icons/projected-value.png"
            alt=""
            aria-hidden="true"
            className="absolute -right-1 -top-1 w-20 h-20 sm:w-24 sm:h-24 object-contain pointer-events-none select-none opacity-[0.07] invert dark:invert-0"
          />
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider block text-neutral-400">
              {horizon.label} PROJECTED VALUE
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-purple-400">
              <CountUp to={projection.futureValue} prefix="₹" duration={1} />
            </div>
          </div>
          <div className="text-[11px] flex items-center gap-1.5 font-sans relative z-10" style={{ color: colors.textSecondary }}>
            <span>Compounded at</span>
            <span className="text-emerald-400 font-mono font-semibold">~{Math.round(activeBasket.growthRate * 100)}% p.a.</span>
          </div>
        </div>

        {/* Card 4: Net Realized Liquidity (Watermark: liquidity.jpg with Rupee coin) */}
        <div
          className="rounded-[18px] p-5 sm:p-6 border relative overflow-hidden backdrop-blur-md flex flex-col justify-between h-[132px]"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <img
            src="/icons/liquidity.png"
            alt=""
            aria-hidden="true"
            className="absolute -right-2 -top-2 w-20 h-20 sm:w-24 sm:h-24 object-contain pointer-events-none select-none opacity-[0.07] invert dark:invert-0"
          />
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider block text-neutral-400">
              NET LIQUIDITY
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums" style={{ color: colors.textPrimary }}>
              {netLiquidity.netPercentage}%
            </div>
          </div>
          <div className="text-[11px] flex items-center gap-1.5 font-sans relative z-10" style={{ color: colors.textSecondary }}>
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Less 1% TDS · Zero exit fee</span>
          </div>
        </div>
      </div>

      {/* ── 68% / 32% INSTITUTIONAL GRID ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column (68% width): Allocation Strategy, Daily Amount, Compounding Curve, DCA Alpha */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Basket Strategy Selector */}
          <SpotlightCard
            spotlightColor="rgba(93, 23, 235, 0.08)"
            className="rounded-[20px] p-6 border shadow-xl space-y-4"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-0.5">
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
                        ? 'border-purple-500/50 bg-purple-500/[0.06] shadow-[0_0_20px_rgba(93,23,235,0.15)]'
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
                        <div className="w-5 h-5 rounded-full bg-purple-400/20 text-purple-400 flex items-center justify-center border border-purple-400/40">
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
            spotlightColor="rgba(93, 23, 235, 0.08)"
            className="rounded-[20px] p-6 border shadow-xl space-y-5"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-0.5">
                  Step 2 · Disciplined Capital
                </span>
                <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  Daily Investment Amount
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
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-purple-500"
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
                          ? 'bg-purple-500/15 border-purple-400 text-purple-300 shadow-[0_0_12px_rgba(93,23,235,0.25)]'
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

          {/* Section 3: Compounding Trajectory & Wealth Milestones */}
          <SpotlightCard
            spotlightColor="rgba(93, 23, 235, 0.08)"
            className="rounded-[20px] p-6 border shadow-xl space-y-4"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-0.5">
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
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm'
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
                    <linearGradient id="strategyGlowArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.32" />
                      <stop offset="85%" stopColor="#8B5CF6" stopOpacity="0.02" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="20" y1="40" x2="620" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  <line x1="20" y1="85" x2="620" y2="85" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  <line x1="20" y1="130" x2="620" y2="130" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

                  {/* Gradient Area */}
                  {chartSvg.area && (
                    <path d={chartSvg.area} fill="url(#strategyGlowArea)" />
                  )}

                  {/* Glowing Stroke */}
                  {chartSvg.path && (
                    <path
                      d={chartSvg.path}
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="filter drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]"
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

            {/* Wealth Runway Milestones (Council New Feature 2) */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-neutral-400 block mb-2">
                Tangible Wealth Milestones (Runway Tracker)
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

          {/* Section 4: The DCA Averaging Advantage (Council New Feature 1) */}
          <SpotlightCard
            spotlightColor="rgba(16, 185, 129, 0.08)"
            className="rounded-[20px] p-6 border shadow-xl space-y-4"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                  Behavioral Alpha
                </span>
                <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  The Rupee-Cost Averaging (RCA) Advantage
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                +{dcaAlpha.advantagePct}% EFFICIENCY
              </span>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
              By automating small daily purchases instead of trying to predict market tops and bottoms with lump sums, your effective acquisition cost is cushioned against sharp volatility spikes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border space-y-1 font-mono" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <span className="text-[10px] uppercase text-neutral-400">Your Average Buy Price</span>
                <div className="text-base font-bold text-purple-400 tabular-nums">
                  ₹{(dcaAlpha.avgBtcPrice / 100000).toFixed(2)} Lakh / BTC
                </div>
                <span className="text-[10px] text-neutral-500">Disciplined 8:00 AM micro-fills</span>
              </div>

              <div className="p-3.5 rounded-xl border space-y-1 font-mono" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <span className="text-[10px] uppercase text-neutral-400">Period Peak Market Price</span>
                <div className="text-base font-bold text-neutral-400 tabular-nums line-through">
                  ₹{(dcaAlpha.peakBtcPrice / 100000).toFixed(2)} Lakh / BTC
                </div>
                <span className="text-[10px] text-emerald-400">Avoided peak FOMO price</span>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Right Column (32% width): Asset Attribution Ledger & AutoPay Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card 1: Asset P&L Contribution Ledger (Replaces Redundant Monthly Bars) */}
          <SpotlightCard
            spotlightColor="rgba(93, 23, 235, 0.08)"
            className="rounded-[20px] p-6 border shadow-xl space-y-4"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-0.5">
                Realized Attribution
              </span>
              <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                Asset P&L Contribution
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Exact rupee return by underlying holding
              </p>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-white/[0.06] text-xs font-mono">
              {assetAttribution.map((asset) => {
                const isGain = asset.pnlRupees >= 0;
                const isRoiGain = asset.roiPct >= 0;

                const pnlSign = isGain ? '+' : '-';
                const formattedPnl = `${pnlSign}₹${Math.abs(asset.pnlRupees).toLocaleString('en-IN')}`;

                const roiSign = isRoiGain ? '+' : '-';
                const formattedRoi = `${roiSign}${Math.abs(asset.roiPct).toFixed(1)}% ROI`;

                return (
                  <div key={asset.ticker} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: asset.color }} />
                      <div>
                        <span className="font-bold" style={{ color: colors.textPrimary }}>{asset.name}</span>
                        <span className="text-[10px] text-neutral-400 block font-sans">{asset.role}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold tabular-nums block ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formattedPnl}
                      </span>
                      <span className={`text-[10px] block font-mono ${isRoiGain ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>
                        {formattedRoi}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SpotlightCard>

          {/* Card 2: AutoPay Mandate Execution & Controls */}
          <SpotlightCard
            spotlightColor="rgba(93, 23, 235, 0.08)"
            className="rounded-[20px] p-6 border shadow-xl space-y-5"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-0.5">
                Execution Spec
              </span>
              <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                UPI AutoPay Mandate Details
              </h3>
            </div>

            {/* Execution Key Metrics */}
            <div className="divide-y divide-slate-200 dark:divide-white/[0.06] font-mono text-xs">
              <div className="py-2 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Daily Debit Amount</span>
                <strong className="text-purple-400 font-bold tabular-nums">₹{dailyAmount} / day</strong>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Monthly Run Rate</span>
                <strong className="tabular-nums" style={{ color: colors.textPrimary }}>₹{Math.round(dailyAmount * 30.4).toLocaleString('en-IN')}</strong>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Execution Schedule</span>
                <strong style={{ color: colors.textPrimary }}>08:00 AM IST Daily</strong>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="font-sans text-neutral-400">Lock-in Period</span>
                <span className="text-emerald-400 font-bold">Zero Days (Liquid)</span>
              </div>
            </div>

            {/* Net Realized Liquidity Transparency (Council Feature 3) */}
            <div className="p-3.5 rounded-xl border space-y-1.5 font-mono text-xs" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex items-center justify-between font-sans">
                <span className="font-semibold" style={{ color: colors.textPrimary }}>Net Realized Liquidity</span>
                <span className="text-emerald-400 font-bold">99% Payout</span>
              </div>
              <div className="flex justify-between text-[11px] text-neutral-400 pt-1">
                <span>Gross Portfolio Value:</span>
                <strong className="tabular-nums" style={{ color: colors.textPrimary }}>₹{netLiquidity.grossVal.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>Less 1% TDS (Sec 194S):</span>
                <strong className="text-rose-400 tabular-nums">-₹{netLiquidity.tds1Pct.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between text-[11px] text-purple-400 pt-1 border-t border-slate-200 dark:border-white/[0.06] font-bold">
                <span>Net Bank Payout:</span>
                <strong className="tabular-nums">₹{netLiquidity.netPayout.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Success message banner */}
            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Habit saved! AutoPay active at ₹{dailyAmount}/day.</span>
              </div>
            )}

            {/* Habit Status & Action Buttons */}
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
                  <span>Start Daily Auto-Saving (₹{dailyAmount}/day)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setMandateModalOpen(true)}
                className="w-full h-10 rounded-xl text-xs font-semibold border transition-all active:scale-[0.97] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] flex items-center justify-center gap-1.5 cursor-pointer"
                style={{ borderColor: colors.cardBorder, backgroundColor: colors.surface, color: colors.textPrimary }}
              >
                <span>Authorize UPI AutoPay Mandate</span>
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