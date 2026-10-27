import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  Shield,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowDownRight,
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
  IndianRupee,
  Plus,
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

type DashboardViewMode = 'holdings' | 'habits';

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

  // Progressive Disclosure Section State (Where Your Money Is vs Daily Habits & Streak)
  const [activeSection, setActiveSection] = useState<DashboardViewMode>('holdings');

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

  // Dynamic Asset Allocation: strictly currencies that the user has in their habit/portfolio
  // If they have at any time bought it, it stays as long as they have not sold all of it (units > 0 && inrValue > 0)
  const allocationHoldings = useMemo(() => {
    const active = holdingsList.filter((item) => (item.units || 0) > 0.00000001 && (item.inrValue || 0) > 0);
    const totalVal = active.reduce((sum, item) => sum + (item.inrValue || 0), 0);

    return active.map((item) => {
      const pct = totalVal > 0 ? (item.inrValue / totalVal) * 100 : 0;
      return {
        coin: item.coin,
        label: item.label,
        color: item.meta.color,
        icon: item.meta.icon,
        units: item.units,
        inrValue: item.inrValue,
        percentage: pct,
      };
    }).sort((a, b) => b.inrValue - a.inrValue);
  }, [holdingsList]);

  const totalAllocationValue = useMemo(() => {
    return allocationHoldings.reduce((sum, item) => sum + item.inrValue, 0);
  }, [allocationHoldings]);

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
    <div className="space-y-5 sm:space-y-6 animate-fade-in w-full pb-16">
      {/* ── TOP METRICS: MOBILE UNIFIED MASTER CARD (< sm) ─────────── */}
      <div
        className="sm:hidden relative overflow-hidden rounded-[20px] border transition-all duration-300 font-sans shadow-lg"
        style={{
          backgroundColor: themeMode === 'dark' ? '#0B0F15' : '#FFFFFF',
          borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Primary Hero Section: Total Balance */}
        <div className="relative p-5 pb-4">
          <IndianRupee className="absolute top-2 right-2 w-16 h-16 opacity-[0.08] pointer-events-none select-none text-neutral-400 dark:text-white" strokeWidth={1.5} />
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
              Total Balance
            </span>
            <div className="text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums" style={{ color: colors.textPrimary }}>
              {scrubbedPoint ? (
                `₹${scrubbedPoint.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              ) : (
                <CountUp to={tabMetrics.marketValue} prefix="₹" decimals={2} duration={1} />
              )}
            </div>
            <div
              className={`inline-flex items-center gap-1 text-[11px] font-bold font-mono mt-1.5 ${
                displayedDeltaPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              <span>{displayedDeltaPercentage >= 0 ? '↗ +' : '↘ -'}{Math.abs(displayedDeltaPercentage).toFixed(2)}%</span>
              <span className="text-neutral-400 font-normal">vs last month</span>
            </div>
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="w-full h-px" style={{ backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }} />

        {/* Secondary Sub-Metrics: 2-Column Split */}
        <div
          className="grid grid-cols-2 divide-x p-3.5 sm:p-4"
          style={{
            backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.015)',
            borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
          }}
        >
          {/* Sub-Metric 1: Today's P&L */}
          <div className="pr-3 flex flex-col justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider font-mono text-neutral-400">
              Today's Return
            </span>
            <div
              className="text-lg font-extrabold font-mono tracking-tight mt-1 tabular-nums"
              style={{ color: isPositiveGain ? colors.semanticSuccess : colors.semanticDanger }}
            >
              <CountUp to={Math.abs(tabMetrics.netDeltaRupees)} prefix={isPositiveGain ? '+₹' : '-₹'} decimals={2} duration={1} />
            </div>
            <div
              className={`inline-flex items-center gap-0.5 text-[10px] font-bold font-mono mt-0.5 ${
                isPositiveGain ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              <span>{isPositiveGain ? '↗ +' : '↘ -'}{Math.abs(tabMetrics.netDeltaPercentage * 0.12).toFixed(2)}%</span>
            </div>
          </div>

          {/* Sub-Metric 2: Total Return */}
          <div className="pl-3.5 flex flex-col justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider font-mono text-neutral-400">
              Total Return
            </span>
            <div className="text-lg font-extrabold font-mono tracking-tight mt-1 tabular-nums" style={{ color: colors.textPrimary }}>
              {tabMetrics.netDeltaPercentage >= 0 ? '+' : '-'}{Math.abs(tabMetrics.netDeltaPercentage).toFixed(1)}%
            </div>
            <div
              className={`inline-flex items-center gap-0.5 text-[10px] font-bold font-mono mt-0.5 ${
                tabMetrics.netDeltaPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              <span>{tabMetrics.netDeltaPercentage >= 0 ? '↗ +' : '↘ -'}{Math.abs(tabMetrics.netDeltaPercentage).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOP 3 WATERMARK METRIC CARDS: DESKTOP GRID (>= sm) ── */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-4 sm:gap-5 font-sans">
        {/* Card 1: Total Balance */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[18px] border transition-all duration-300 flex flex-col justify-between h-[132px]"
          style={{
            backgroundColor: themeMode === 'dark' ? '#0B0F15' : '#FFFFFF',
            borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <IndianRupee className="absolute -top-1 -right-1 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.08] pointer-events-none select-none text-neutral-400 dark:text-white" strokeWidth={1.5} />
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider block font-mono text-neutral-400">
              Total Balance
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums" style={{ color: colors.textPrimary }}>
              {scrubbedPoint ? (
                `₹${scrubbedPoint.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              ) : (
                <CountUp to={tabMetrics.marketValue} prefix="₹" decimals={2} duration={1} />
              )}
            </div>
          </div>
          <div
            className={`inline-flex items-center gap-1 w-fit text-[11px] font-bold font-mono relative z-10 ${
              displayedDeltaPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <span>{displayedDeltaPercentage >= 0 ? '↗ +' : '↘ -'}{Math.abs(displayedDeltaPercentage).toFixed(2)}%</span>
            <span className="text-neutral-400 font-normal">vs last month</span>
          </div>
        </div>

        {/* Card 2: Today's P&L */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[18px] border transition-all duration-300 flex flex-col justify-between h-[132px]"
          style={{
            backgroundColor: themeMode === 'dark' ? '#0B0F15' : '#FFFFFF',
            borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          {isPositiveGain ? (
            <TrendingUp className="absolute -top-1 -right-1 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.08] pointer-events-none select-none text-emerald-400" strokeWidth={1.5} />
          ) : (
            <TrendingDown className="absolute -top-1 -right-1 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.08] pointer-events-none select-none text-rose-400" strokeWidth={1.5} />
          )}
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider block font-mono text-neutral-400">
              Today's Return
            </span>
            <div
              className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums"
              style={{ color: isPositiveGain ? colors.semanticSuccess : colors.semanticDanger }}
            >
              <CountUp to={Math.abs(tabMetrics.netDeltaRupees)} prefix={isPositiveGain ? '+₹' : '-₹'} decimals={2} duration={1} />
            </div>
          </div>
          <div
            className={`inline-flex items-center gap-1 w-fit text-[11px] font-bold font-mono relative z-10 ${
              isPositiveGain ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <span>{isPositiveGain ? '↗ +' : '↘ -'}{Math.abs(tabMetrics.netDeltaPercentage * 0.12).toFixed(2)}%</span>
            <span className="text-neutral-400 font-normal">vs last month</span>
          </div>
        </div>

        {/* Card 3: Total Return */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[18px] border transition-all duration-300 flex flex-col justify-between h-[132px]"
          style={{
            backgroundColor: themeMode === 'dark' ? '#0B0F15' : '#FFFFFF',
            borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          {tabMetrics.netDeltaPercentage >= 0 ? (
            <ArrowUpRight className="absolute -top-1 -right-1 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.08] pointer-events-none select-none text-emerald-400" strokeWidth={1.5} />
          ) : (
            <ArrowDownRight className="absolute -top-1 -right-1 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.08] pointer-events-none select-none text-rose-400" strokeWidth={1.5} />
          )}
          <div className="relative z-10">
            <span className="text-[11px] font-semibold uppercase tracking-wider block font-mono text-neutral-400">
              Total Return
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums" style={{ color: colors.textPrimary }}>
              {tabMetrics.netDeltaPercentage >= 0 ? '+' : '-'}{Math.abs(tabMetrics.netDeltaPercentage).toFixed(1)}%
            </div>
          </div>
          <div
            className={`inline-flex items-center gap-1 w-fit text-[11px] font-bold font-mono relative z-10 ${
              tabMetrics.netDeltaPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <span>{tabMetrics.netDeltaPercentage >= 0 ? '↗ +' : '↘ -'}{Math.abs(tabMetrics.netDeltaPercentage).toFixed(1)}%</span>
            <span className="text-neutral-400 font-normal">vs last month</span>
          </div>
        </div>
      </div>

      {/* ── MAIN 68% / 32% GRID ROW (PORTFOLIO VALUE + DONUT ALLOCATION) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Left Card (~68% width): Portfolio Value Trajectory */}
        <div
          className="lg:col-span-8 p-6 sm:p-7 rounded-[20px] border flex flex-col justify-between min-h-[460px]"
          style={{
            backgroundColor: themeMode === 'dark' ? '#0B0F15' : '#FFFFFF',
            borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <div>
            {/* Header: Title, Subtitle, Gain Pill */}
            <div className="flex items-center justify-between gap-4 mb-2">
              <div>
                <h3 className="text-lg font-bold tracking-tight" style={{ color: colors.textPrimary }}>
                  Portfolio Value
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5 font-medium">
                  {timeframe === 'ALL'
                    ? 'All time trajectory'
                    : timeframe === '1Y'
                    ? 'Last 12 months'
                    : timeframe === '3M'
                    ? 'Last 3 months'
                    : timeframe === '1M'
                    ? 'Last 30 days'
                    : 'Last 7 days'}
                </p>
              </div>

              {(() => {
                const gainPct = chartSeriesResult?.horizonGainPercentage ?? tabMetrics.netDeltaPercentage;
                const gainInr = chartSeriesResult?.horizonGain ?? tabMetrics.netDeltaRupees;
                const isPositive = gainInr >= 0;
                return (
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                      isPositive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{isPositive ? '+' : '-'}{Math.abs(gainPct).toFixed(2)}%</span>
                  </div>
                );
              })()}
            </div>

            {/* Financial Monotone Spline Line Chart with Scrubber and Satmix Purple Glow */}
            <div className="relative w-full my-2">
              <LineChart
                series={chartSeriesResult}
                benchmarkSeries={benchmarkSeries}
                height={250}
                accentColor="#8B5CF6"
                interactive={true}
                showLegend={benchmarkMode !== 'none'}
                showAxisLabels={true}
              />
            </div>
          </div>

          {/* Controls Footer: Basket Filter, Horizon Tabs & Quick Actions */}
          <div className="pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2" style={{ borderColor: colors.borderDim }}>
            {/* Basket Filter Tabs: Full width 3-column split on mobile, compact on desktop */}
            <div className="w-full sm:w-fit grid grid-cols-3 sm:flex items-center gap-1 p-1 rounded-xl border" style={{ backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)', borderColor: colors.borderDim }}>
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
                    className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-bold transition-all text-center cursor-pointer select-none active:scale-[0.96] ${
                      isActive ? 'bg-[#5D17EB] text-white shadow-xs' : 'text-neutral-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Timeframe & Action Buttons (Single Unified Row on Mobile) */}
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto flex-nowrap">
              {/* Horizon / Timeframe Tabs */}
              <div className="h-8 flex items-center gap-0.5 sm:gap-1 p-1 rounded-xl border text-[11px] sm:text-xs font-mono" style={{ backgroundColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)', borderColor: colors.borderDim }}>
                {(['1W', '1M', '3M', '1Y', 'ALL'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeframe(t)}
                    className={`h-full px-2 sm:px-2.5 rounded-lg font-bold flex items-center justify-center transition-colors cursor-pointer select-none active:scale-[0.96] ${
                      timeframe === t ? 'bg-[#5D17EB]/20 text-purple-600 dark:text-[#A78BFA] border border-[#8B5CF6]/40' : 'text-neutral-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Action Buttons: Add & Withdraw */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setDepositOpen(true)}
                  className="h-8 px-3 rounded-xl font-bold text-xs bg-[#5D17EB] hover:bg-[#6D28D9] text-white shadow-[0_0_12px_rgba(93,23,235,0.35)] transition-all hover:scale-[1.02] active:scale-[0.96] inline-flex items-center gap-1.5 cursor-pointer select-none"
                  title="Add Funds / Invest"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span>Add</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawOpen(true)}
                  className="h-8 px-3 rounded-xl font-bold text-xs border transition-all active:scale-[0.96] inline-flex items-center gap-1.5 cursor-pointer select-none"
                  style={{ borderColor: colors.borderDim, color: colors.textPrimary, backgroundColor: themeMode === 'dark' ? 'transparent' : 'rgba(0, 0, 0, 0.03)' }}
                  title="Withdraw Funds"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card (~32% width): Asset Allocation (Donut Chart & Legend) */}
        <div
          className="lg:col-span-4 p-6 sm:p-7 rounded-[20px] border flex flex-col justify-between min-h-[460px]"
          style={{
            backgroundColor: themeMode === 'dark' ? '#0B0F15' : '#FFFFFF',
            borderColor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold tracking-tight" style={{ color: colors.textPrimary }}>
                  Asset Allocation
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Current distribution
                </p>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {allocationHoldings.length} {allocationHoldings.length === 1 ? 'Asset' : 'Assets'}
              </span>
            </div>

            {/* SVG Donut Chart */}
            <div className="flex items-center justify-center my-6 relative">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 160 160">
                {/* Background track circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="52"
                  fill="transparent"
                  stroke={themeMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'}
                  strokeWidth="20"
                />

                {/* Slices dynamically derived from allocationHoldings */}
                {(() => {
                  const circumference = 2 * Math.PI * 52; // ~326.73
                  let accumulated = 0;

                  return allocationHoldings.map((s) => {
                    const ratio = s.percentage / 100;
                    const strokeDash = ratio * circumference;
                    const offset = accumulated * circumference;
                    accumulated += ratio;

                    return (
                      <circle
                        key={s.coin}
                        cx="80"
                        cy="80"
                        r="52"
                        fill="transparent"
                        stroke={s.color}
                        strokeWidth="20"
                        strokeDasharray={`${strokeDash} ${circumference}`}
                        strokeDashoffset={-offset}
                        className="transition-all duration-700 ease-out"
                      />
                    );
                  });
                })()}
              </svg>

              {/* Center Metric Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">
                  {allocationHoldings.length === 0 ? 'Empty' : 'Holdings'}
                </span>
                <span className="text-base font-extrabold font-mono tabular-nums" style={{ color: colors.textPrimary }}>
                  ₹{Math.round(totalAllocationValue).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Legend List: Strictly user-held currencies */}
            {allocationHoldings.length > 0 ? (
              <div className="space-y-2 pt-1 font-sans text-xs">
                {allocationHoldings.map((item) => (
                  <div
                    key={item.coin}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold" style={{ color: colors.textPrimary }}>{item.label}</span>
                        <span className="text-[10px] font-mono font-bold text-neutral-400">({item.coin})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-neutral-400 text-[11px] tabular-nums hidden sm:inline">
                        ₹{item.inrValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className="font-mono font-bold tabular-nums min-w-[44px] text-right" style={{ color: colors.textPrimary }}>
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-neutral-400 font-sans border border-dashed border-white/10 rounded-xl my-2">
                <p className="font-medium text-neutral-300">No active assets in this portfolio.</p>
                <p className="text-[11px] text-neutral-500 mt-1">Start a habit or deposit to allocate funds.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── SECONDARY UTILITIES: HOLDINGS BREAKDOWN & HABITS ─── */}
      <div className="pt-2">
        <div className="flex items-center justify-between border-b pb-3 mb-5" style={{ borderColor: colors.borderDim }}>
          <div className="flex items-center gap-2">
            {[
              { id: 'holdings' as const, label: 'Where Your Money Is' },
              { id: 'habits' as const, label: 'Daily Habits & Streaks' },
            ].map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/25 shadow-xs'
                      : 'text-neutral-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white border border-transparent hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
              Spot Custodial Execution
            </span>
          </div>
        </div>

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
      </div>

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
