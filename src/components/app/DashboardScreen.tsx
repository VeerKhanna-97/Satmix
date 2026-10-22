import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  Shield,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Flame,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  ChevronDown,
  X,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Coins,
  ShieldCheck,
  LayoutGrid,
  Table,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LineChart } from '../common/LineChart';
import { MiniLineChart } from '../common/MiniLineChart';
import { DepositModal } from '../payment/DepositModal';
import { WithdrawModal } from '../payment/WithdrawModal';
import { getBasketById } from '../../data/baskets';
import { BasketCurrencyIcons } from '../common/BasketCurrencyIcons';
import { StreakWeeklyTracker } from './StreakWeeklyTracker';
import { generateChartSeries, generateAssetWeekSeries, generateBenchmarkSeries, ChartTimeframe, ChartDataPoint } from '../../utils/chartSeries';
import { CustomDateRangePicker } from '../common/CustomDateRangePicker';
import { SpotlightCard, CountUp, FadeIn } from '../ui';
import { motion, AnimatePresence } from 'motion/react';
import { HoldingsMatrixTable } from './HoldingsMatrixTable';
import { useSatmixPortfolio } from '../../hooks/useSatmixPortfolio';

type DashboardViewMode = 'overview' | 'holdings' | 'habits';

export const DashboardScreen: React.FC = () => {
  const {
    user,
    prototypeState,
    activeTabFilter,
    setActiveTabFilter,
    tabMetrics,
    livePrices,
    isPricesLoading,
    streakState,
    transactions,
    liveCoins,
    colors,
    themeMode,
    setActiveTab,
    toggleHabitPause,
    triggerAccrual,
  } = useApp();

  // Progressive Disclosure Section State (Overview vs Where Your Money Is vs Habits & Streak)
  const [activeSection, setActiveSection] = useState<DashboardViewMode>('overview');

  // Timeframe filter state & Custom View Range
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1M');
  const [isCustomPickerOpen, setIsCustomPickerOpen] = useState(false);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const thirtyDaysAgoStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  }, []);
  const [customStartDate, setCustomStartDate] = useState(thirtyDaysAgoStr);
  const [customEndDate, setCustomEndDate] = useState(todayStr);

  const formatRangeLabel = useCallback((startStr: string, endStr: string) => {
    if (!startStr || !endStr) return 'Select Horizon';
    const [y1, m1, d1] = startStr.split('-').map(Number);
    const [y2, m2, d2] = endStr.split('-').map(Number);
    if (!y1 || !m1 || !d1 || !y2 || !m2 || !d2) return `${startStr} – ${endStr}`;
    const dObj1 = new Date(y1, m1 - 1, d1);
    const dObj2 = new Date(y2, m2 - 1, d2);
    const s1 = dObj1.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const s2 = dObj2.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${s1} – ${s2}`;
  }, []);

  // Modals & View Modes
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedAssetModal, setSelectedAssetModal] = useState<any | null>(null);
  const [holdingsViewMode, setHoldingsViewMode] = useState<'cards' | 'matrix'>('cards');

  // Dynamic Scrubber & Benchmark Overlays
  const [scrubbedPoint, setScrubbedPoint] = useState<ChartDataPoint | null>(null);
  const [benchmarkMode, setBenchmarkMode] = useState<'none' | 'btc' | 'fd'>('none');

  const { holdings: matrixHoldings } = useSatmixPortfolio();

  // Chart series derived from tab metrics
  const chartSeriesResult = useMemo(() => {
    return generateChartSeries(
      timeframe,
      transactions,
      {
        totalInvested: tabMetrics.totalInvested,
        currentValue: tabMetrics.marketValue,
        totalReturnsRupees: tabMetrics.netDeltaRupees,
        totalReturnsPercentage: tabMetrics.netDeltaPercentage,
        oneDayChangeRupees: Math.round(tabMetrics.marketValue * 0.012),
        oneDayChangePercentage: 1.2,
        averageMonthlyReturn: activeTabFilter === 'growth' ? 2.3 : 0.8,
      },
      activeTabFilter === 'all' ? 'growth' : activeTabFilter,
      liveCoins,
      timeframe === 'CUSTOM' ? { startDate: customStartDate, endDate: customEndDate } : undefined
    );
  }, [timeframe, transactions, tabMetrics, activeTabFilter, liveCoins, customStartDate, customEndDate]);

  const benchmarkSeries = useMemo(() => {
    if (benchmarkMode === 'none' || !chartSeriesResult?.points) return null;
    return generateBenchmarkSeries(chartSeriesResult.points, benchmarkMode);
  }, [benchmarkMode, chartSeriesResult?.points]);

  const greetingTime = useMemo(() => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const isPositiveGain = tabMetrics.netDeltaRupees >= 0;

  // Dynamic Scrubber Overwrite Values (Groww / Apple Stocks Model)
  const displayedMarketValue = scrubbedPoint ? scrubbedPoint.value : tabMetrics.marketValue;
  const displayedDeltaRupees = scrubbedPoint ? scrubbedPoint.gain : tabMetrics.netDeltaRupees;
  const displayedDeltaPercentage = scrubbedPoint ? scrubbedPoint.gainPercentage : tabMetrics.netDeltaPercentage;
  const isDisplayPositive = displayedDeltaRupees >= 0;

  // Holdings list with asset intelligence & metadata
  const holdingsList = useMemo(() => {
    const assetMeta = {
      BTC: {
        tag: 'Store of Value',
        color: '#f7931b',
        bg: 'rgba(247, 147, 27, 0.12)',
        border: 'rgba(247, 147, 27, 0.25)',
        icon: '/currencies/bitcoin.png',
        desc: 'Bitcoin is the foundational digital currency with a strictly capped supply of 21 million units.',
        basketName: 'Growth Mix (70%) & Stable Mix (15%)',
        basketId: 'growth' as const,
        network: 'Bitcoin Native Layer-1',
        tokenStandard: 'UTXO Native',
      },
      ETH: {
        tag: 'Smart Contracts',
        color: themeMode === 'light' ? '#0F172A' : '#ffffff',
        bg: themeMode === 'light' ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.12)',
        border: themeMode === 'light' ? 'rgba(15, 23, 42, 0.20)' : 'rgba(255, 255, 255, 0.25)',
        icon: '/currencies/ethereum-eth-logo.png',
        desc: 'Ethereum powers decentralized apps and automated financial smart contracts globally.',
        basketName: 'Growth Mix (20%)',
        basketId: 'growth' as const,
        network: 'Ethereum Mainnet',
        tokenStandard: 'ERC-20 Native',
      },
      SOL: {
        tag: 'High Speed',
        color: '#9945fe',
        bg: 'rgba(153, 69, 254, 0.12)',
        border: 'rgba(153, 69, 254, 0.25)',
        icon: '/currencies/Solana.png',
        desc: 'Solana is built for lightning-fast, low-cost micro-transactions and digital applications.',
        basketName: 'Growth Mix (10%)',
        basketId: 'growth' as const,
        network: 'Solana Network',
        tokenStandard: 'SPL Token',
      },
      USDT: {
        tag: 'Digital Dollar',
        color: '#26a17b',
        bg: 'rgba(38, 161, 123, 0.12)',
        border: 'rgba(38, 161, 123, 0.25)',
        icon: '/currencies/USDT.png',
        desc: 'Tether USD is pegged 1:1 with the US Dollar to keep your savings stable and safe from market dips.',
        basketName: 'Stable Mix (85%)',
        basketId: 'stable' as const,
        network: 'Multi-Chain USD Stable Reserve',
        tokenStandard: 'ERC-20 / TRC-20 Pegged',
      },
    };

    const entries = [
      {
        coin: 'BTC' as const,
        label: 'Bitcoin',
        meta: assetMeta.BTC,
        ...tabMetrics.holdings.BTC,
        weekSeries: generateAssetWeekSeries('BTC', prototypeState.activity, tabMetrics.holdings.BTC),
      },
      {
        coin: 'ETH' as const,
        label: 'Ethereum',
        meta: assetMeta.ETH,
        ...tabMetrics.holdings.ETH,
        weekSeries: generateAssetWeekSeries('ETH', prototypeState.activity, tabMetrics.holdings.ETH),
      },
      {
        coin: 'SOL' as const,
        label: 'Solana',
        meta: assetMeta.SOL,
        ...tabMetrics.holdings.SOL,
        weekSeries: generateAssetWeekSeries('SOL', prototypeState.activity, tabMetrics.holdings.SOL),
      },
      {
        coin: 'USDT' as const,
        label: 'Digital Dollars (USDT)',
        meta: assetMeta.USDT,
        ...tabMetrics.holdings.USDT,
        weekSeries: generateAssetWeekSeries('USDT', prototypeState.activity, tabMetrics.holdings.USDT),
      },
    ];
    return entries.filter((e) => e.units > 0 || tabMetrics.marketValue === 0);
  }, [tabMetrics.holdings, tabMetrics.marketValue, prototypeState.activity, themeMode]);

  const isStableConfigured = prototypeState.habits.stable?.setupAt !== null;
  const isStableActive = isStableConfigured && !prototypeState.habits.stable.paused;
  const stableDailyRate =
    !prototypeState.habits.stable?.dailyAmount ||
    prototypeState.habits.stable.dailyAmount === 50 ||
    prototypeState.habits.stable.dailyAmount < 10
      ? 10
      : prototypeState.habits.stable.dailyAmount;

  const isGrowthConfigured = prototypeState.habits.growth?.setupAt !== null;
  const isGrowthActive = isGrowthConfigured && !prototypeState.habits.growth.paused;
  const growthDailyRate =
    !prototypeState.habits.growth?.dailyAmount ||
    prototypeState.habits.growth.dailyAmount === 50 ||
    prototypeState.habits.growth.dailyAmount < 30
      ? 30
      : prototypeState.habits.growth.dailyAmount;

  const [priceFlashMap, setPriceFlashMap] = useState<Record<string, 'up' | 'down' | null>>({});
  const prevPricesRef = useRef<typeof livePrices>(livePrices);

  React.useEffect(() => {
    const prev = prevPricesRef.current;
    const newFlashes: Record<string, 'up' | 'down' | null> = {};
    let hasChange = false;

    (['BTC', 'ETH', 'SOL', 'USDT'] as const).forEach((coin) => {
      if (livePrices[coin] > prev[coin]) {
        newFlashes[coin] = 'up';
        hasChange = true;
      } else if (livePrices[coin] < prev[coin]) {
        newFlashes[coin] = 'down';
        hasChange = true;
      }
    });

    if (hasChange) {
      setPriceFlashMap(newFlashes);
      const timer = setTimeout(() => {
        setPriceFlashMap({});
      }, 900);
      prevPricesRef.current = livePrices;
      return () => clearTimeout(timer);
    }
    prevPricesRef.current = livePrices;
  }, [livePrices]);

  const fxRate = livePrices.USD_INR > 0 ? livePrices.USD_INR : 87.85 * 1.025;
  const btcUsd = livePrices.BTC / fxRate;
  const ethUsd = livePrices.ETH / fxRate;
  const solUsd = livePrices.SOL / fxRate;

  const tickerItems = useMemo(() => [
    { symbol: 'BTC', inr: `₹${Math.round(livePrices.BTC).toLocaleString('en-IN')}`, usd: `$${Math.round(btcUsd).toLocaleString('en-US')}` },
    { symbol: 'ETH', inr: `₹${Math.round(livePrices.ETH).toLocaleString('en-IN')}`, usd: `$${Math.round(ethUsd).toLocaleString('en-US')}` },
    { symbol: 'SOL', inr: `₹${Math.round(livePrices.SOL).toLocaleString('en-IN')}`, usd: `$${Math.round(solUsd).toLocaleString('en-US')}` },
    { symbol: 'USDT', inr: `₹${livePrices.USDT.toFixed(2)}`, usd: '$1.00' },
  ], [livePrices, btcUsd, ethUsd, solUsd]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto pb-16">
      {/* ── TOP GREETING & STREAK BADGE ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            {greetingTime}, {user?.name?.split(' ')[0] || 'Investor'}
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: colors.textSecondary }}>
            Here is your daily crypto savings summary.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Streak Status Pill */}
          <div
            className="px-3 py-1.5 rounded-xl border text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm"
            style={{
              backgroundColor:
                streakState.status === 'ACTIVE'
                  ? 'rgba(245, 158, 11, 0.12)'
                  : streakState.status === 'AT_RISK'
                  ? 'rgba(239, 68, 68, 0.12)'
                  : streakState.status === 'FROZEN'
                  ? 'rgba(6, 182, 212, 0.12)'
                  : colors.surface,
              borderColor:
                streakState.status === 'ACTIVE'
                  ? 'rgba(245, 158, 11, 0.3)'
                  : streakState.status === 'AT_RISK'
                  ? 'rgba(239, 68, 68, 0.35)'
                  : streakState.status === 'FROZEN'
                  ? 'rgba(6, 182, 212, 0.35)'
                  : colors.cardBorder,
              color:
                streakState.status === 'ACTIVE'
                  ? '#F59E0B'
                  : streakState.status === 'AT_RISK'
                  ? '#EF4444'
                  : streakState.status === 'FROZEN'
                  ? '#06B6D4'
                  : colors.textSecondary,
            }}
          >
            {streakState.status === 'ACTIVE' ? (
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            ) : streakState.status === 'AT_RISK' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : streakState.status === 'FROZEN' ? (
              <Shield className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
            ) : (
              <Zap className="w-4 h-4 text-amber-400" />
            )}
            <span>
              {streakState.status === 'FROZEN'
                ? `${streakState.currentStreak}d Protected`
                : `${streakState.currentStreak}d Streak`}
            </span>
          </div>
        </div>
      </div>

      {/* ── PROGRESSIVE DISCLOSURE MODE SWITCHER (APPLE FINANCE STYLE) ── */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl border w-full sm:w-fit overflow-x-auto shadow-xs" style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}>
        {[
          { id: 'overview' as const, label: 'Overview' },
          { id: 'holdings' as const, label: 'Where Your Money Is' },
          { id: 'habits' as const, label: 'Daily Habits & Streaks' },
        ].map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className="relative flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-[color,transform] duration-150 ease-out active:scale-[0.98] select-none text-center whitespace-nowrap"
              style={{
                color: isActive ? colors.primaryText : colors.textSecondary,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDashboardSectionPill"
                  className="absolute inset-0 rounded-xl shadow-md z-0"
                  style={{ backgroundColor: colors.primary }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── MODE 1: OVERVIEW (CALM HERO, CLEAN TRENDLINE & ESSENTIAL ACTIONS) ── */}
      {activeSection === 'overview' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          {/* Basket Filter Sub-Tabs */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl border w-fit" style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}>
              {[
                { id: 'all', label: 'All Mixes' },
                { id: 'stable', label: 'Stable Mix (Safe)' },
                { id: 'growth', label: 'Growth Mix (Upside)' },
              ].map((tab) => {
                const isActive = activeTabFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabFilter(tab.id as 'all' | 'stable' | 'growth')}
                    className="relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors select-none"
                    style={{
                      color: isActive ? colors.primaryText : colors.textSecondary,
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeBasketSubPill"
                        className="absolute inset-0 rounded-xl shadow-xs z-0"
                        style={{ backgroundColor: colors.primary }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Live Price Sync Trigger */}
            <button
              type="button"
              onClick={() => triggerAccrual()}
              className="text-xs font-mono font-medium flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity"
              style={{ color: colors.textSecondary }}
              title="Sync live prices"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPricesLoading ? 'animate-spin text-amber-400' : ''}`} />
              <span>Live Rates</span>
            </button>
          </div>

          {/* ── TOP 4 WATERMARK METRIC CARDS (REFERENCE IMAGE 1) ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 font-sans">
            {/* Card 1: Total Balance */}
            <div
              className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
              style={{
                backgroundColor: themeMode === 'dark' ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
                borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <span className="absolute top-4 right-4 text-3xl font-mono opacity-5 pointer-events-none select-none text-white font-bold">₹</span>
              <span className="text-[11px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
                Total Balance
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-white">
                {scrubbedPoint ? (
                  `₹${scrubbedPoint.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                ) : (
                  <CountUp to={tabMetrics.marketValue} prefix="₹" decimals={2} duration={1} />
                )}
              </div>
              <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-emerald-500/10 text-emerald-400">
                <span>↗ +{Math.abs(displayedDeltaPercentage).toFixed(2)}%</span>
                <span className="text-neutral-400 font-normal">vs last month</span>
              </div>
            </div>

            {/* Card 2: Today's P&L / Total Profit */}
            <div
              className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
              style={{
                backgroundColor: themeMode === 'dark' ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
                borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <TrendingUp className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-white" />
              <span className="text-[11px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
                Today's P&L
              </span>
              <div
                className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums"
                style={{ color: isPositiveGain ? colors.semanticSuccess : colors.semanticDanger }}
              >
                <CountUp to={Math.abs(tabMetrics.netDeltaRupees)} prefix={isPositiveGain ? '+₹' : '-₹'} decimals={2} duration={1} />
              </div>
              <div
                className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono"
                style={{
                  backgroundColor: isPositiveGain ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: isPositiveGain ? colors.semanticSuccess : colors.semanticDanger,
                }}
              >
                <span>{isPositiveGain ? '↗ +' : '↘ -'}{Math.abs(tabMetrics.netDeltaPercentage * 0.12).toFixed(2)}%</span>
                <span className="text-neutral-400 font-normal">today</span>
              </div>
            </div>

            {/* Card 3: Total Return */}
            <div
              className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
              style={{
                backgroundColor: themeMode === 'dark' ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
                borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <ArrowUpRight className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-white" />
              <span className="text-[11px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
                Total Return
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-white">
                {tabMetrics.netDeltaPercentage >= 0 ? '+' : ''}{tabMetrics.netDeltaPercentage.toFixed(2)}%
              </div>
              <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-emerald-500/10 text-emerald-400">
                <span>↗ +{Math.abs(tabMetrics.netDeltaPercentage).toFixed(2)}%</span>
                <span className="text-neutral-400 font-normal">cumulative</span>
              </div>
            </div>

            {/* Card 4: Daily Auto-Save Habit */}
            <div
              className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
              style={{
                backgroundColor: themeMode === 'dark' ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
                borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <Calendar className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-white" />
              <span className="text-[11px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
                Daily Auto-Save
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-white">
                ₹{(isStableActive ? stableDailyRate : 0) + (isGrowthActive ? growthDailyRate : 0)}
                <span className="text-xs font-normal text-neutral-400">/day</span>
              </div>
              <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-cyan-500/10 text-cyan-400">
                <span>{(isStableActive ? 1 : 0) + (isGrowthActive ? 1 : 0)} Active Habits</span>
              </div>
            </div>
          </div>

          {/* ── MAIN 65% / 35% GRID ROW (PORTFOLIO VALUE + DONUT) ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 mb-6">
            {/* Left Card (~65% width): Portfolio Value Trajectory */}
            <div
              className="lg:col-span-8 p-5 sm:p-7 rounded-[22px] border flex flex-col justify-between"
              style={{
                backgroundColor: themeMode === 'dark' ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
                borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      Portfolio Value
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {timeframe === 'ALL' ? 'Since inception (Sep 16)' : `Last ${timeframe} compounding horizon`}
                    </p>
                  </div>

                  {/* Top-Right Horizon Gain Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+{Math.abs(displayedDeltaPercentage).toFixed(2)}%</span>
                  </div>
                </div>

                {/* Line Chart */}
                <div className="mb-4">
                  <LineChart
                    series={chartSeriesResult}
                    benchmarkSeries={benchmarkSeries}
                    height={190}
                    showLegend={benchmarkMode !== 'none'}
                    showAxisLabels={true}
                    interactive={true}
                    onHoverPoint={setScrubbedPoint}
                  />
                </div>
              </div>

              {/* Controls Footer: Basket Filter, Horizon Tabs & Quick Actions */}
              <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Basket Filter Tabs */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/5 w-fit">
                  {[
                    { id: 'all', label: 'All Mixes' },
                    { id: 'stable', label: 'Stable Mix' },
                    { id: 'growth', label: 'Growth Mix' },
                  ].map((tab) => {
                    const isActive = activeTabFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTabFilter(tab.id as 'all' | 'stable' | 'growth')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          isActive ? 'bg-cyan-500 text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Timeframe & Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/5 text-xs font-mono">
                    {(['1W', '1M', '3M', '1Y', 'ALL'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeframe(t)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                          timeframe === t ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDepositOpen(true)}
                      className="h-8 px-3.5 rounded-xl font-bold text-xs bg-cyan-500 text-black shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] transition-transform hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-1.5"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      <span>+ Add</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawOpen(true)}
                      className="h-8 px-3.5 rounded-xl font-bold text-xs border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors active:scale-[0.98] inline-flex items-center gap-1.5"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Withdraw</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card (~35% width): Asset Allocation (Donut Chart & Legend) */}
            <div
              className="lg:col-span-4 p-5 sm:p-7 rounded-[22px] border flex flex-col justify-between"
              style={{
                backgroundColor: themeMode === 'dark' ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
                borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
              }}
            >
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Asset Allocation
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Current distribution
                </p>

                {/* SVG Donut Chart */}
                <div className="flex items-center justify-center my-6 relative">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                    {/* Background track circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="52"
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.04)"
                      strokeWidth="16"
                    />

                    {/* Proportional Segments */}
                    {(() => {
                      const totalVal = tabMetrics.marketValue > 0 ? tabMetrics.marketValue : 1;
                      const circumference = 2 * Math.PI * 52; // ~326.73
                      let accumulated = 0;

                      // Colors mapped to Image 1: Cyan, Blue, Amber, Slate, etc.
                      const segmentColors = {
                        USDT: '#06B6D4', // Cyan
                        BTC: '#F59E0B',  // Amber
                        ETH: '#6366F1',  // Blue / Indigo
                        SOL: '#10B981',  // Emerald
                      };

                      return holdingsList.map((item) => {
                        const pct = (item.inrValue / totalVal);
                        if (pct <= 0) return null;
                        const strokeDash = pct * circumference;
                        const offset = accumulated * circumference;
                        accumulated += pct;

                        return (
                          <circle
                            key={item.coin}
                            cx="80"
                            cy="80"
                            r="52"
                            fill="transparent"
                            stroke={segmentColors[item.coin as keyof typeof segmentColors] || item.meta.color}
                            strokeWidth="16"
                            strokeDasharray={`${strokeDash} ${circumference}`}
                            strokeDashoffset={-offset}
                            className="transition-all duration-700 ease-out"
                          />
                        );
                      });
                    })()}
                  </svg>

                  {/* Center Total Value Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                      Total
                    </span>
                    <span className="text-sm font-bold font-mono text-white mt-0.5 tabular-nums">
                      ₹{Math.round(tabMetrics.marketValue).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Legend List (Matching Image 1) */}
                <div className="space-y-2.5 pt-2">
                  {holdingsList.map((item) => {
                    const totalVal = tabMetrics.marketValue > 0 ? tabMetrics.marketValue : 1;
                    const pct = ((item.inrValue / totalVal) * 100).toFixed(0);
                    const segmentColors = {
                      USDT: '#06B6D4',
                      BTC: '#F59E0B',
                      ETH: '#6366F1',
                      SOL: '#10B981',
                    };
                    const dotColor = segmentColors[item.coin as keyof typeof segmentColors] || item.meta.color;

                    return (
                      <div
                        key={item.coin}
                        onClick={() => setSelectedAssetModal(item)}
                        className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
                          <span className="text-neutral-300 font-medium group-hover:text-white transition-colors">
                            {item.coin === 'USDT' ? 'Digital Dollars' : item.coin === 'BTC' ? 'Bitcoin' : item.coin === 'ETH' ? 'Ethereum' : 'Solana'}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-neutral-200 tabular-nums">
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── ACTIVE HABIT SNAPSHOT CARD ──────────────────────── */}
          <div className="p-5 sm:p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center border flex-shrink-0" style={{ backgroundColor: colors.accentTint, borderColor: colors.borderAccent, color: colors.accent }}>
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base" style={{ color: colors.textPrimary }}>
                  Daily Auto-Saving Habit
                </h4>
                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                  {activeTabFilter === 'growth'
                    ? (isGrowthActive
                        ? `Auto-saving ₹${growthDailyRate}/day into Growth Mix every morning at 9:00 AM.`
                        : 'Growth Mix daily auto-saving is currently paused.')
                    : activeTabFilter === 'stable'
                    ? (isStableActive
                        ? `Auto-saving ₹${stableDailyRate}/day into Stable Mix every morning at 9:00 AM.`
                        : 'Stable Mix daily auto-saving is currently paused.')
                    : (isGrowthActive && isStableActive
                        ? `Auto-saving ₹${growthDailyRate}/day into Growth Mix & ₹${stableDailyRate}/day into Stable Mix every morning at 9:00 AM.`
                        : isGrowthActive
                        ? `Auto-saving ₹${growthDailyRate}/day into Growth Mix every morning at 9:00 AM.`
                        : isStableActive
                        ? `Auto-saving ₹${stableDailyRate}/day into Stable Mix every morning at 9:00 AM.`
                        : 'Set up an automated daily habit from ₹10 to build wealth steadily.')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveSection('habits')}
                className="px-4 py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-white/5 active:scale-[0.98]"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textPrimary }}
              >
                Manage Habit →
              </button>
            </div>
          </div>

          {/* ── PEACE OF MIND & FINANCIAL SAFETY BANNER ─────────── */}
          <div className="p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
              <span className="font-bold block" style={{ color: colors.textPrimary }}>
                Your money is safe and always accessible
              </span>
              Crypto will be bought and held through a regulated execution partner (to be announced). Your coins belong strictly to you and can be withdrawn directly to your bank account via UPI anytime with zero lock-in period.
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 2: WHERE YOUR MONEY IS (COIN BREAKDOWN & CARDS) ── */}
      {activeSection === 'holdings' && (
        <div className="space-y-6 animate-fade-in">
          <SpotlightCard
            spotlightColor={colors.accentTint}
            className="rounded-3xl p-5 sm:p-7 border shadow-lg space-y-6"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            {/* Header with View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg" style={{ color: colors.textPrimary }}>
                  Where Your Money Is
                </h3>
                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                  Real fractional crypto units held safely in your account at live spot market prices.
                </p>
              </div>

              {/* View Switcher: Cards vs Table */}
              <div className="flex items-center p-0.5 rounded-xl border w-fit" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <button
                  type="button"
                  onClick={() => setHoldingsViewMode('cards')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                  style={{
                    backgroundColor: holdingsViewMode === 'cards' ? colors.primary : 'transparent',
                    color: holdingsViewMode === 'cards' ? colors.primaryText : colors.textSecondary,
                  }}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHoldingsViewMode('matrix')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                  style={{
                    backgroundColor: holdingsViewMode === 'matrix' ? colors.primary : 'transparent',
                    color: holdingsViewMode === 'matrix' ? colors.primaryText : colors.textSecondary,
                  }}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
              </div>
            </div>

            {/* Asset Weighting Bar */}
            {tabMetrics.marketValue > 0 && (
              <div className="space-y-2.5 p-4 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-wider text-[10px]" style={{ color: colors.textTertiary }}>
                    How Your Money is Split
                  </span>
                  <span className="font-mono font-bold text-xs" style={{ color: colors.textPrimary }}>
                    Total: ₹{tabMetrics.marketValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Stacked Proportional Bar */}
                <div
                  className="h-3 w-full rounded-full overflow-hidden flex gap-1 p-0.5"
                  style={{
                    backgroundColor: themeMode === 'light' ? '#E2E8F0' : colors.card,
                    border: themeMode === 'light' ? '1px solid #CBD5E1' : 'none',
                  }}
                >
                  {holdingsList.map((item) => {
                    const pct = tabMetrics.marketValue > 0 ? (item.inrValue / tabMetrics.marketValue) * 100 : 0;
                    if (pct <= 0) return null;
                    return (
                      <div
                        key={item.coin}
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: item.meta.color,
                        }}
                        title={`${item.label}: ${pct.toFixed(1)}%`}
                      />
                    );
                  })}
                </div>

                {/* Distribution Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono">
                  {holdingsList.map((item) => {
                    const pct = tabMetrics.marketValue > 0 ? ((item.inrValue / tabMetrics.marketValue) * 100).toFixed(1) : '0.0';
                    return (
                      <div key={item.coin} className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center overflow-hidden p-0.5 shadow-xs flex-shrink-0">
                          <img src={item.meta.icon} alt={item.coin} className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold" style={{ color: colors.textPrimary }}>{item.coin}:</span>
                        <span style={{ color: colors.textSecondary }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Holdings Content: Table or Cards */}
            {holdingsViewMode === 'matrix' ? (
              <HoldingsMatrixTable
                holdings={matrixHoldings}
                onSelectAsset={(coin) => {
                  const found = holdingsList.find((h) => h.coin === coin);
                  if (found) setSelectedAssetModal(found);
                }}
              />
            ) : (
              <div className="space-y-3">
                {holdingsList.map((item) => {
                  const isProfit = item.gainRupees >= 0;

                  return (
                    <div
                      key={item.coin}
                      onClick={() => setSelectedAssetModal(item)}
                      className="p-4 sm:p-5 rounded-2xl border transition-all duration-150 ease-out cursor-pointer hover:border-white/20 active:scale-[0.99] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.borderDim,
                      }}
                    >
                      {/* Left: Coin Icon, Label, Description */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                          <img
                            src={item.meta.icon}
                            alt={item.label}
                            className="w-full h-full object-contain select-none"
                            loading="lazy"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm sm:text-base truncate" style={{ color: colors.textPrimary }}>
                              {item.label}
                            </span>
                            <span
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold flex-shrink-0"
                              style={{
                                backgroundColor: colors.card,
                                borderColor: colors.borderDim,
                                color: colors.textSecondary,
                              }}
                            >
                              {item.meta.tag}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono font-bold" style={{ color: colors.accent }}>
                              {item.units === 0
                                ? `0.00 ${item.coin}`
                                : item.coin === 'BTC'
                                ? `${(item.units || 0).toFixed(8)} BTC`
                                : item.coin === 'ETH'
                                ? `${(item.units || 0).toFixed(6)} ETH`
                                : item.coin === 'SOL'
                                ? `${(item.units || 0).toFixed(4)} SOL`
                                : `${(item.units || 0).toFixed(2)} USDT`}
                            </span>
                            <span className="text-[11px]" style={{ color: colors.textTertiary }}>
                              • Tap to view
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Rupee Valuation & Returns */}
                      <div className="text-left sm:text-right font-mono border-t sm:border-t-0 pt-2 sm:pt-0" style={{ borderColor: colors.borderDim }}>
                        <div className="text-base sm:text-lg font-bold" style={{ color: colors.textPrimary }}>
                          ₹{item.inrValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs font-semibold flex sm:justify-end items-center gap-1" style={{ color: isProfit ? colors.semanticSuccess : colors.semanticDanger }}>
                          <span>{isProfit ? '+' : '-'}₹{Math.abs(item.gainRupees).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span>({item.gainPercentage >= 0 ? '+' : '-'}{Math.abs(item.gainPercentage).toFixed(2)}%)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SpotlightCard>
        </div>
      )}

      {/* ── MODE 3: DAILY HABITS & STREAKS ─────────────────────── */}
      {activeSection === 'habits' && (
        <div className="space-y-6 sm:space-y-8 animate-fade-in">
          {/* Streak Weekly Tracker */}
          <StreakWeeklyTracker onQuickDeposit={() => setDepositOpen(true)} />

          {/* Active Habit Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Stable Habit Card */}
            <SpotlightCard
              spotlightColor={colors.accentTint}
              className="rounded-3xl p-6 border shadow-lg space-y-4"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BasketCurrencyIcons basketId="stable" size="sm" />
                  <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>Stable Mix Habit</h3>
                </div>
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border tracking-wider"
                  style={{
                    backgroundColor: !isStableConfigured ? colors.surface : isStableActive ? colors.accentTint : 'rgba(245, 158, 11, 0.1)',
                    color: !isStableConfigured ? colors.textTertiary : isStableActive ? colors.accent : colors.semanticWarning,
                    borderColor: !isStableConfigured ? colors.borderDim : isStableActive ? colors.borderAccent : 'rgba(245, 158, 11, 0.3)',
                  }}
                >
                  {!isStableConfigured ? 'NOT CONFIGURED' : isStableActive ? 'AUTOPAY ACTIVE' : 'PAUSED'}
                </span>
              </div>

              <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                85% Digital Dollars (USDT) / 15% Bitcoin (BTC). Built for capital safety with low price volatility.
              </p>

              {isStableConfigured ? (
                <div className="p-4 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <div>
                    <span className="text-xs block" style={{ color: colors.textTertiary }}>Daily Auto-Deposit</span>
                    <span className="text-2xl font-extrabold font-mono" style={{ color: colors.textPrimary }}>
                      ₹{stableDailyRate}/day
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleHabitPause('stable')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-opacity hover:opacity-80"
                      style={{
                        backgroundColor: isStableActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        borderColor: isStableActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                        color: isStableActive ? colors.semanticDanger : colors.semanticSuccess,
                      }}
                    >
                      {isStableActive ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('invest')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
                      style={{ backgroundColor: colors.accentTint, color: colors.accent }}
                    >
                      Change Amount →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <div>
                    <span className="text-xs block" style={{ color: colors.textTertiary }}>Minimum Start</span>
                    <span className="text-lg font-bold font-mono" style={{ color: colors.textPrimary }}>From ₹10/day</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('invest')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-90 shadow-xs"
                    style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                  >
                    + Setup Habit →
                  </button>
                </div>
              )}

              <div className="text-[11px] font-mono flex items-center justify-between" style={{ color: colors.textSecondary }}>
                <span>Auto-deposit: <strong>Automated Daily</strong></span>
                <span>Minimum: <strong>₹10/day</strong></span>
              </div>
            </SpotlightCard>

            {/* Growth Habit Card */}
            <SpotlightCard
              spotlightColor={colors.accentTint}
              className="rounded-3xl p-6 border shadow-lg space-y-4"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BasketCurrencyIcons basketId="growth" size="sm" />
                  <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>Growth Mix Habit</h3>
                </div>
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border tracking-wider"
                  style={{
                    backgroundColor: !isGrowthConfigured ? colors.surface : isGrowthActive ? colors.accentTint : 'rgba(245, 158, 11, 0.1)',
                    color: !isGrowthConfigured ? colors.textTertiary : isGrowthActive ? colors.accent : colors.semanticWarning,
                    borderColor: !isGrowthConfigured ? colors.borderDim : isGrowthActive ? colors.borderAccent : 'rgba(245, 158, 11, 0.3)',
                  }}
                >
                  {!isGrowthConfigured ? 'NOT CONFIGURED' : isGrowthActive ? 'AUTOPAY ACTIVE' : 'PAUSED'}
                </span>
              </div>

              <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                70% Bitcoin / 20% Ethereum / 10% Solana. Designed for compounding long-term growth.
              </p>

              {isGrowthConfigured ? (
                <div className="p-4 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <div>
                    <span className="text-xs block" style={{ color: colors.textTertiary }}>Daily Auto-Deposit</span>
                    <span className="text-2xl font-extrabold font-mono" style={{ color: colors.textPrimary }}>
                      ₹{growthDailyRate}/day
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleHabitPause('growth')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-opacity hover:opacity-80"
                      style={{
                        backgroundColor: isGrowthActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        borderColor: isGrowthActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                        color: isGrowthActive ? colors.semanticDanger : colors.semanticSuccess,
                      }}
                    >
                      {isGrowthActive ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('invest')}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
                      style={{ backgroundColor: colors.accentTint, color: colors.accent }}
                    >
                      Change Amount →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <div>
                    <span className="text-xs block" style={{ color: colors.textTertiary }}>Minimum Start</span>
                    <span className="text-lg font-bold font-mono" style={{ color: colors.textPrimary }}>From ₹30/day</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('invest')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-90 shadow-xs"
                    style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                  >
                    + Setup Habit →
                  </button>
                </div>
              )}

              <div className="text-[11px] font-mono flex items-center justify-between" style={{ color: colors.textSecondary }}>
                <span>Auto-deposit: <strong>Automated Daily</strong></span>
                <span>Minimum: <strong>₹30/day</strong></span>
              </div>
            </SpotlightCard>
          </div>
        </div>
      )}

      {/* ── ASSET DETAIL INSPECTION MODAL (PLAIN LANGUAGE AUDITED) ── */}
      {selectedAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-lg rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b" style={{ borderColor: colors.borderDim }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={selectedAssetModal.meta.icon}
                    alt={selectedAssetModal.label}
                    className="w-full h-full object-contain select-none"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold" style={{ color: colors.textPrimary }}>
                      {selectedAssetModal.label} ({selectedAssetModal.coin})
                    </h3>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold uppercase"
                      style={{
                        backgroundColor: colors.card,
                        borderColor: colors.borderDim,
                        color: colors.textSecondary,
                      }}
                    >
                      {selectedAssetModal.meta.tag}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                    {selectedAssetModal.meta.basketName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAssetModal(null)}
                className="p-1.5 rounded-xl hover:opacity-80 transition-opacity"
                style={{ color: colors.textTertiary }}
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Asset Description */}
            <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
              {selectedAssetModal.meta.desc}
            </p>

            {/* Token Balance Card */}
            <div
              className="p-5 rounded-2xl border text-center space-y-1.5"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.borderDim,
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: colors.textTertiary }}>
                Your Balance in Units
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono" style={{ color: colors.textPrimary }}>
                {selectedAssetModal.units === 0
                  ? `0.00 ${selectedAssetModal.coin}`
                  : selectedAssetModal.coin === 'BTC'
                  ? `${(selectedAssetModal.units || 0).toFixed(8)} BTC`
                  : selectedAssetModal.coin === 'ETH'
                  ? `${(selectedAssetModal.units || 0).toFixed(6)} ETH`
                  : selectedAssetModal.coin === 'SOL'
                  ? `${(selectedAssetModal.units || 0).toFixed(4)} SOL`
                  : `${(selectedAssetModal.units || 0).toFixed(2)} USDT`}
              </div>
              <div className="text-sm font-bold font-mono" style={{ color: colors.accent }}>
                ₹{selectedAssetModal.inrValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Plain English Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Current Market Price</span>
                <strong className="text-sm block mt-0.5" style={{ color: colors.textPrimary }}>
                  ₹{Math.round(selectedAssetModal.priceInr).toLocaleString('en-IN')}
                </strong>
                <span className="text-[10px]" style={{ color: colors.textTertiary }}>
                  (${Math.round(selectedAssetModal.priceUsd).toLocaleString('en-US')})
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Total You Invested</span>
                <strong className="text-sm block mt-0.5" style={{ color: colors.textPrimary }}>
                  ₹{selectedAssetModal.investedInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
                <span className="text-[10px]" style={{ color: colors.textTertiary }}>
                  From Daily Auto-Saving
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Average Price Paid</span>
                <strong className="text-sm block mt-0.5" style={{ color: colors.textPrimary }}>
                  ₹{Math.round(selectedAssetModal.avgBuyPriceInr).toLocaleString('en-IN')}
                </strong>
                <span className="text-[10px]" style={{ color: colors.textTertiary }}>
                  Daily Averaging Price
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Total Profit / Loss</span>
                <strong
                  className="text-sm block mt-0.5"
                  style={{ color: selectedAssetModal.gainRupees >= 0 ? colors.semanticSuccess : colors.semanticDanger }}
                >
                  {selectedAssetModal.gainRupees >= 0 ? '+' : '-'}₹{Math.abs(selectedAssetModal.gainRupees).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
                <span
                  className="text-[10px] font-bold"
                  style={{ color: selectedAssetModal.gainRupees >= 0 ? colors.semanticSuccess : colors.semanticDanger }}
                >
                  ({selectedAssetModal.gainPercentage >= 0 ? '+' : '-'}{Math.abs(selectedAssetModal.gainPercentage).toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Safety & Bank Withdrawal Info */}
            <div className="p-4 rounded-2xl border text-xs space-y-2 font-sans" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex items-center gap-2 font-bold" style={{ color: colors.textPrimary }}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Safety & Bank Access Commitment</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                Crypto will be bought and held through a regulated execution partner (to be announced). Your coins are bought automatically daily and stored in your name. You can withdraw directly back to your bank account anytime.
              </p>
            </div>

            {/* Action CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedAssetModal(null);
                  setActiveTab('invest');
                }}
                className="py-3 px-4 rounded-xl font-bold text-xs shadow-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <span>Change Daily Amount</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedAssetModal(null);
                  setWithdrawOpen(true);
                }}
                className="py-3 px-4 rounded-xl font-bold text-xs border transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textPrimary }}
              >
                <span>Withdraw to Bank</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
      <WithdrawModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} />
    </div>
  );
};
