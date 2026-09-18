import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronDown,
  X,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Wallet,
  Coins,
  PieChart,
  ShieldCheck,
  Lock,
  Info,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LineChart } from '../common/LineChart';
import { MiniLineChart } from '../common/MiniLineChart';
import { DepositModal } from '../payment/DepositModal';
import { WithdrawModal } from '../payment/WithdrawModal';
import { getBasketById } from '../../data/baskets';
import { EDUCATIONAL_GUIDES } from '../../data/mockData';
import { StreakWeeklyTracker } from './StreakWeeklyTracker';
import { generateChartSeries, generateAssetWeekSeries, ChartTimeframe } from '../../utils/chartSeries';
import { CustomDateRangePicker } from '../common/CustomDateRangePicker';
import { SpotlightCard, CountUp, Magnet, ShinyText, FadeIn } from '../ui';
import { motion, AnimatePresence } from 'motion/react';

export const DashboardScreen: React.FC = () => {
  const {
    user,
    prototypeState,
    activeTabFilter,
    setActiveTabFilter,
    tabMetrics,
    livePrices,
    isPricesLoading,
    streakDays,
    streakState,
    transactions,
    liveCoins,
    colors,
    setActiveTab,
    toggleHabitPause,
    triggerAccrual,
  } = useApp();

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

  // Modals
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<typeof EDUCATIONAL_GUIDES[0] | null>(null);
  const [selectedAssetModal, setSelectedAssetModal] = useState<any | null>(null);
  const [holdingsExpanded, setHoldingsExpanded] = useState(false);

  const stableBasket = getBasketById('stable');
  const growthBasket = getBasketById('growth');

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

  const greetingTime = useMemo(() => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Filtered activity for daily debits ledger
  const filteredActivity = useMemo(() => {
    if (activeTabFilter === 'all') {
      return prototypeState.activity;
    }
    return prototypeState.activity.filter(
      (a) => a.basketId.toLowerCase() === activeTabFilter.toLowerCase()
    );
  }, [prototypeState.activity, activeTabFilter]);

  const isPositiveGain = tabMetrics.netDeltaRupees >= 0;

  // Holdings list with asset intelligence & metadata
  const holdingsList = useMemo(() => {
    const assetMeta = {
      BTC: {
        tag: 'Store of Value · L1',
        color: '#F7931A',
        bg: 'rgba(247, 147, 26, 0.12)',
        border: 'rgba(247, 147, 26, 0.25)',
        desc: 'Market leader, digital gold reserve, and immutable monetary foundation.',
        basketName: 'Growth Basket (70%) & Stable Basket (15%)',
        basketId: 'growth' as const,
        network: 'Bitcoin Native Layer-1',
        tokenStandard: 'UTXO Native',
      },
      ETH: {
        tag: 'Smart Contracts · L1',
        color: '#627EEA',
        bg: 'rgba(98, 126, 234, 0.12)',
        border: 'rgba(98, 126, 234, 0.25)',
        desc: 'Decentralized application ecosystem and global smart contract settlement protocol.',
        basketName: 'Growth Basket (20%)',
        basketId: 'growth' as const,
        network: 'Ethereum Mainnet',
        tokenStandard: 'ERC-20 Native',
      },
      SOL: {
        tag: 'High Throughput · L1',
        color: '#14F195',
        bg: 'rgba(20, 241, 149, 0.12)',
        border: 'rgba(20, 241, 149, 0.25)',
        desc: 'Ultra-fast sub-second settlement and low-latency payment infrastructure.',
        basketName: 'Growth Basket (10%)',
        basketId: 'growth' as const,
        network: 'Solana Network',
        tokenStandard: 'SPL Token',
      },
      USDT: {
        tag: 'USD Capital Guard',
        color: '#26A17B',
        bg: 'rgba(38, 161, 123, 0.12)',
        border: 'rgba(38, 161, 123, 0.25)',
        desc: '1:1 USD-pegged reserve asset providing capital protection and zero price volatility.',
        basketName: 'Stable Basket (85%)',
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
        label: 'Tether USD',
        meta: assetMeta.USDT,
        ...tabMetrics.holdings.USDT,
        weekSeries: generateAssetWeekSeries('USDT', prototypeState.activity, tabMetrics.holdings.USDT),
      },
    ];
    return entries.filter((e) => e.units > 0 || tabMetrics.marketValue === 0);
  }, [tabMetrics.holdings, tabMetrics.marketValue, prototypeState.activity]);

  const isStableConfigured = prototypeState.habits.stable?.setupAt !== null;
  const isStableActive = isStableConfigured && !prototypeState.habits.stable.paused;

  const isGrowthConfigured = prototypeState.habits.growth?.setupAt !== null;
  const isGrowthActive = isGrowthConfigured && !prototypeState.habits.growth.paused;

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
    <div className="space-y-7 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* ── TOP GREETING & KYC STATUS ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            {greetingTime}, {user?.name?.split(' ')[0] || 'Investor'}
          </h1>
          <div className="flex items-center gap-2 mt-1.5 text-xs font-semibold" style={{ color: colors.textSecondary }}>
            <Shield className="w-3.5 h-3.5" style={{ color: colors.accent }} />
            <span>Tier 1 KYC Verified · Linked: {user?.bankName || 'HDFC Bank'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Real-time MTM Engine Status Pill (Clean static institutional style) */}
          <div
            className="px-3 py-1.5 rounded-xl border text-[11px] font-mono font-medium flex items-center gap-2 shadow-sm select-none"
            style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textSecondary }}
          >
            <span
              className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider"
              style={{
                backgroundColor: colors.accentTint,
                color: colors.accent,
                border: `1px solid ${colors.borderAccent}`,
              }}
            >
              LIVE
            </span>
            <span>Spot MTM · Auto-Execute</span>
          </div>

          {/* Streak Indicator */}
          <div
            className="px-3.5 py-1.5 rounded-xl border text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm"
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
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            ) : streakState.status === 'AT_RISK' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <Zap className="w-4 h-4 text-amber-400" />
            )}
            <span>{streakDays}d Streak</span>
          </div>
        </div>
      </div>

      {/* ── LIVE SPOT TICKER BAR (HORIZONTAL MARQUEE SCROLLER) ── */}
      <div
        className="p-2.5 rounded-2xl border flex items-center gap-3 overflow-hidden text-xs font-mono select-none"
        style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
      >
        <button
          type="button"
          onClick={() => triggerAccrual()}
          className="flex items-center gap-1.5 pr-2.5 border-r flex-shrink-0 z-10 hover:opacity-80 transition-opacity focus:outline-none cursor-pointer"
          style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
          title="Click to sync live spot prices from Coinbase"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-amber-400 flex-shrink-0 ${isPricesLoading ? 'animate-spin' : ''}`} />
          <span className="text-[10px] font-bold tracking-wider uppercase whitespace-nowrap" style={{ color: colors.textTertiary }}>
            LIVE SPOT TICKER
          </span>
        </button>

        <div className="flex-1 overflow-hidden relative">
          {/* Subtle edge fade overlays */}
          <div
            className="absolute left-0 top-0 bottom-0 w-3 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${colors.surface}, transparent)` }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-3 z-10 pointer-events-none"
            style={{ background: `linear-gradient(to left, ${colors.surface}, transparent)` }}
          />

          <div className="flex animate-ticker whitespace-nowrap gap-6 items-center">
            {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => {
              const flash = priceFlashMap[item.symbol];
              return (
                <div
                  key={`${item.symbol}-${idx}`}
                  className={`inline-flex items-center gap-1.5 flex-shrink-0 px-2 py-0.5 rounded-md transition-colors duration-500 ${
                    flash === 'up'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : flash === 'down'
                      ? 'bg-rose-500/20 text-rose-400'
                      : ''
                  }`}
                >
                  <span className="font-bold" style={{ color: colors.textPrimary }}>{item.symbol}</span>
                  <span
                    className="transition-colors duration-300"
                    style={{
                      color:
                        flash === 'up'
                          ? '#34D399'
                          : flash === 'down'
                          ? '#F87171'
                          : colors.textSecondary,
                    }}
                  >
                    {item.inr}
                  </span>
                  <span className="text-[10px]" style={{ color: colors.textTertiary }}>({item.usd})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SEGMENTED PORTFOLIO TABS (GROWW / SMALLCASE STYLE) ── */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl border w-fit" style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}>
        {[
          { id: 'all', label: 'All Baskets' },
          { id: 'stable', label: 'Stable Basket' },
          { id: 'growth', label: 'Growth Basket' },
        ].map((tab) => {
          const isActive = activeTabFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabFilter(tab.id as 'all' | 'stable' | 'growth')}
              className="relative px-4 py-2 rounded-xl text-xs font-bold transition-colors"
              style={{
                color: isActive ? colors.primaryText : colors.textSecondary,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeDashboardTabPill"
                  className="absolute inset-0 rounded-xl shadow-md z-0"
                  style={{ backgroundColor: colors.primary }}
                  transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── PORTFOLIO VALUATION HERO CARD (MTM) ────────────────── */}
      <FadeIn delay={0.08}>
        <SpotlightCard
          spotlightColor={colors.accentTint}
          className="rounded-3xl p-7 sm:p-9 border shadow-xl relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${colors.card} 0%, ${colors.cardHigh || colors.card} 100%)`,
            borderColor: colors.cardBorder,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: colors.textTertiary }}>
                {activeTabFilter === 'all'
                  ? 'Total Live Portfolio Valuation (MTM)'
                  : activeTabFilter === 'stable'
                  ? 'Stable Basket Valuation (MTM)'
                  : 'Growth Basket Valuation (MTM)'}
              </span>
              <div className="flex items-baseline gap-3 mt-1 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight" style={{ color: colors.textPrimary }}>
                  <CountUp to={tabMetrics.marketValue} prefix="₹" decimals={2} duration={1.1} />
                </span>

                {tabMetrics.totalInvested > 0 ? (
                  <div
                    className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-md border font-mono"
                    style={{
                      backgroundColor: isPositiveGain ? colors.mintTint : colors.redTint,
                      borderColor: isPositiveGain ? colors.borderMint : 'rgba(239, 68, 68, 0.3)',
                      color: isPositiveGain ? colors.semanticSuccess : colors.semanticDanger,
                    }}
                  >
                    {isPositiveGain ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>
                      {isPositiveGain ? '+' : ''}₹{tabMetrics.netDeltaRupees.toLocaleString('en-IN')} ({isPositiveGain ? '+' : ''}{tabMetrics.netDeltaPercentage}%)
                    </span>
                  </div>
                ) : (
                  <span className="text-xs font-semibold" style={{ color: colors.textTertiary }}>Daily AutoPay Active</span>
                )}
              </div>
            </div>

            {/* Quick Actions (Deposit & Withdraw) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDepositOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg font-semibold text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.3)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <ArrowDownLeft className="w-4 h-4 flex-shrink-0" />
                <span>+ Add Money</span>
              </button>

              <button
                onClick={() => setWithdrawOpen(true)}
                disabled={tabMetrics.marketValue <= 0}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg font-semibold text-xs border transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/[0.05] hover:border-white/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
              >
                <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>

          {/* 3 Metric Mini-Row */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl border mb-6 text-center font-mono" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
            <div>
              <span className="text-[11px] font-sans block" style={{ color: colors.textTertiary }}>Total Invested</span>
              <span className="text-sm sm:text-base font-bold" style={{ color: colors.textPrimary }}>
                <CountUp to={tabMetrics.totalInvested} prefix="₹" duration={1} />
              </span>
            </div>
            <div>
              <span className="text-[11px] font-sans block" style={{ color: colors.textTertiary }}>Live Net Return</span>
              <span className="text-sm sm:text-base font-bold" style={{ color: isPositiveGain ? colors.semanticSuccess : colors.semanticDanger }}>
                <CountUp to={Math.abs(tabMetrics.netDeltaRupees)} prefix={isPositiveGain ? '+₹' : '-₹'} duration={1} />
              </span>
            </div>
            <div>
              <span className="text-[11px] font-sans block" style={{ color: colors.textTertiary }}>Active Baskets</span>
              <span className="text-sm sm:text-base font-bold" style={{ color: colors.accent }}>
                {activeTabFilter === 'all'
                  ? `${(isStableActive ? 1 : 0) + (isGrowthActive ? 1 : 0)} Running`
                  : activeTabFilter === 'stable'
                  ? isStableActive ? '1 Running' : '0 Running'
                  : isGrowthActive ? '1 Running' : '0 Running'}
              </span>
            </div>
          </div>

          {/* Line Chart with Scrubber Crosshair & Tooltips */}
          <div className="mb-2">
            <LineChart
              series={chartSeriesResult}
              height={140}
              showLegend={true}
              showAxisLabels={true}
              interactive={true}
            />
          </div>

          {/* Timeframe Filter Tabs & Custom Date Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: colors.borderDim }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold font-mono" style={{ color: colors.textTertiary }}>Performance Horizon</span>
              {chartSeriesResult.isProjection && (
                <span
                  className="text-[10px] font-mono border px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: colors.accentTint,
                    borderColor: colors.borderAccent,
                    color: colors.accent,
                  }}
                >
                  DCA Projection Model
                </span>
              )}
              {timeframe === 'CUSTOM' && (
                <button
                  type="button"
                  onClick={() => setIsCustomPickerOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-all hover:bg-white/5 active:scale-95 shadow-sm select-none"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: isCustomPickerOpen ? colors.accent : colors.borderAccent,
                    color: colors.accent,
                  }}
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{formatRangeLabel(customStartDate, customEndDate)}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCustomPickerOpen ? 'rotate-180 text-amber-400' : ''}`} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl self-start sm:self-auto border overflow-x-auto max-w-full" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              {(['1W', '1M', '3M', '1Y', 'ALL', 'CUSTOM'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTimeframe(t);
                    if (t === 'CUSTOM') {
                      setIsCustomPickerOpen(true);
                    } else {
                      setIsCustomPickerOpen(false);
                    }
                  }}
                  className="px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all flex-shrink-0"
                  style={{
                    backgroundColor: timeframe === t ? colors.primary : 'transparent',
                    color: timeframe === t ? colors.primaryText : colors.textSecondary,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Google Flights-style Custom Date Range Dropdown Popover */}
          <AnimatePresence>
            {timeframe === 'CUSTOM' && isCustomPickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="mt-4"
              >
                <CustomDateRangePicker
                  startDate={customStartDate}
                  endDate={customEndDate}
                  onChange={(start, end) => {
                    setCustomStartDate(start);
                    setCustomEndDate(end);
                  }}
                  onClose={() => setIsCustomPickerOpen(false)}
                  colors={colors}
                  granularity={chartSeriesResult.granularity}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </SpotlightCard>
      </FadeIn>

      {/* ── CRYPTO ASSETS & WALLET HOLDINGS (EXPANDABLE ACCORDION) ─ */}
      <SpotlightCard
        spotlightColor={colors.accentTint}
        className="rounded-3xl p-5 sm:p-7 border shadow-lg transition-all duration-300"
        style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      >
        {/* Interactive Expandable Header */}
        <div
          onClick={() => setHoldingsExpanded((prev) => !prev)}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none group"
          role="button"
          tabIndex={0}
          aria-expanded={holdingsExpanded}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl border flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105" style={{ backgroundColor: colors.accentTint, borderColor: colors.borderAccent, color: colors.accent }}>
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base group-hover:opacity-90 transition-opacity" style={{ color: colors.textPrimary }}>
                  Crypto Wallet & Asset Holdings
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.accent }}>
                  {activeTabFilter.toUpperCase()}
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                Real fractional crypto units held in your non-custodial wallet with live MTM pricing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textPrimary }}>
              <Coins className="w-3.5 h-3.5" style={{ color: colors.accent }} />
              <span>{holdingsList.filter((h) => h.units > 0).length || holdingsList.length} Active Assets</span>
            </div>
            <div
              className="p-1.5 rounded-xl border flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: holdingsExpanded ? colors.accentTint : colors.surface,
                borderColor: holdingsExpanded ? colors.borderAccent : colors.borderDim,
                color: holdingsExpanded ? colors.accent : colors.textSecondary,
              }}
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${holdingsExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </div>

        {/* ── EXPANDABLE CONTENT ── */}
        <AnimatePresence initial={false}>
          {holdingsExpanded && (
            <motion.div
              key="holdings-expanded-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden space-y-6 pt-5 border-t mt-4"
              style={{ borderColor: colors.borderDim }}
            >
              {/* ── ASSET ALLOCATION VISUALIZER BAR ── */}
              {tabMetrics.marketValue > 0 && (
                <div className="space-y-2.5 p-4 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold uppercase tracking-wider text-[10px]" style={{ color: colors.textTertiary }}>
                      Asset Weighting & Portfolio Distribution
                    </span>
                    <span className="font-mono font-bold text-xs" style={{ color: colors.textPrimary }}>
                      Total: ₹{tabMetrics.marketValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  {/* Stacked Proportional Distribution Bar */}
                  <div className="h-3 w-full rounded-full overflow-hidden flex gap-1 p-0.5" style={{ backgroundColor: colors.card }}>
                    {holdingsList.map((item) => {
                      const pct = tabMetrics.marketValue > 0 ? (item.inrValue / tabMetrics.marketValue) * 100 : 0;
                      if (pct <= 0) return null;
                      return (
                        <div
                          key={item.coin}
                          className="h-full rounded-full transition-all hover:opacity-90"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: item.meta.color,
                          }}
                          title={`${item.label} (${item.coin}): ${pct.toFixed(1)}%`}
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
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.meta.color }} />
                          <span className="font-bold" style={{ color: colors.textPrimary }}>{item.coin}:</span>
                          <span style={{ color: colors.textSecondary }}>{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── ASSET CARDS LIST ── */}
              {holdingsList.length > 0 ? (
                <div className="space-y-3">
                  {holdingsList.map((item) => {
                    const allocationPct = tabMetrics.marketValue > 0
                      ? Number(((item.inrValue / tabMetrics.marketValue) * 100).toFixed(1))
                      : 0;
                    const isProfit = item.gainRupees >= 0;

                    return (
                      <div
                        key={item.coin}
                        onClick={() => setSelectedAssetModal(item)}
                        className="p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.008] hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.borderDim,
                        }}
                      >
                        {/* Left: Coin Badge & Unit Quantity */}
                        <div className="flex items-center gap-3.5 min-w-[190px]">
                          <div
                            className="w-12 h-12 rounded-2xl border flex items-center justify-center font-extrabold text-sm font-mono shadow-sm flex-shrink-0"
                            style={{
                              backgroundColor: item.meta.bg,
                              borderColor: item.meta.border,
                              color: item.meta.color,
                            }}
                          >
                            {item.coin}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm sm:text-base" style={{ color: colors.textPrimary }}>
                                {item.label}
                              </span>
                              <span
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold"
                                style={{
                                  backgroundColor: item.meta.bg,
                                  borderColor: item.meta.border,
                                  color: item.meta.color,
                                }}
                              >
                                {item.meta.tag}
                              </span>
                            </div>

                            {/* Exact Fractional Crypto Units */}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-mono font-bold" style={{ color: colors.accent }}>
                                {item.units === 0
                                  ? `0.00 ${item.coin}`
                                  : item.coin === 'BTC'
                                  ? `${item.units.toFixed(8)} BTC`
                                  : item.coin === 'ETH'
                                  ? `${item.units.toFixed(6)} ETH`
                                  : item.coin === 'SOL'
                                  ? `${item.units.toFixed(4)} SOL`
                                  : `${item.units.toFixed(2)} USDT`}
                              </span>
                              {item.usdValue > 0 && (
                                <span className="text-[11px] font-mono" style={{ color: colors.textTertiary }}>
                                  (≈ ${item.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Center: 1-Week Sub-Asset Performance Mini Graph */}
                        <div className="hidden md:flex flex-col items-center justify-center px-2 flex-shrink-0">
                          <div className="w-full flex items-center justify-between text-[9px] font-mono mb-1 px-0.5" style={{ color: colors.textTertiary }}>
                            <span>1W (Sun–Sat)</span>
                            <span
                              className="font-bold"
                              style={{
                                color:
                                  item.investedInr <= 0
                                    ? '#64748B'
                                    : isProfit
                                    ? colors.semanticSuccess
                                    : colors.semanticDanger,
                              }}
                            >
                              {item.investedInr <= 0 ? '₹0.00' : `${isProfit ? '+' : ''}₹${item.gainRupees.toFixed(2)}`}
                            </span>
                          </div>
                          <MiniLineChart
                            series={item.weekSeries}
                            width={160}
                            height={38}
                            interactive={true}
                          />
                        </div>

                        {/* Mobile: 1-Week Sub-Asset Mini Graph */}
                        <div className="md:hidden w-full flex items-center justify-between py-1.5 px-1 border-t border-b" style={{ borderColor: colors.borderDim }}>
                          <div className="flex flex-col text-[10px] font-mono" style={{ color: colors.textTertiary }}>
                            <span>1W Trajectory</span>
                            <span
                              className="font-bold text-[11px]"
                              style={{
                                color:
                                  item.investedInr <= 0
                                    ? '#64748B'
                                    : isProfit
                                    ? colors.semanticSuccess
                                    : colors.semanticDanger,
                              }}
                            >
                              {item.investedInr <= 0 ? '0.00%' : `${isProfit ? '+' : ''}${item.gainPercentage}%`}
                            </span>
                          </div>
                          <MiniLineChart
                            series={item.weekSeries}
                            width={150}
                            height={34}
                            interactive={true}
                          />
                        </div>

                        {/* Middle / Right: Financial PnL & Valuation */}
                        <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 font-mono" style={{ borderColor: colors.borderDim }}>
                          {/* Cost Basis & Performance */}
                          <div className="text-left md:text-right text-xs">
                            <div className="text-[11px]" style={{ color: colors.textTertiary }}>
                              Invested Cost Basis
                            </div>
                            <div className="font-bold text-xs sm:text-sm mt-0.5" style={{ color: colors.textPrimary }}>
                              ₹{item.investedInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            {item.investedInr > 0 && (
                              <div
                                className="text-[10px] font-bold mt-0.5 inline-flex items-center gap-0.5"
                                style={{ color: isProfit ? colors.semanticSuccess : colors.semanticDanger }}
                              >
                                <span>{isProfit ? '+' : ''}₹{item.gainRupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <span>({isProfit ? '+' : ''}{item.gainPercentage}%)</span>
                              </div>
                            )}
                          </div>

                          {/* Current Market Value */}
                          <div className="text-right">
                            <div className="text-[11px]" style={{ color: colors.textTertiary }}>
                              Current Valuation
                            </div>
                            <div className="font-extrabold text-sm sm:text-base" style={{ color: colors.textPrimary }}>
                              ₹{item.inrValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-[10px] font-semibold mt-0.5 flex items-center justify-end gap-1.5" style={{ color: colors.accent }}>
                              <span>Spot: ₹{item.priceInr >= 100000 ? `${(item.priceInr / 100000).toFixed(2)}L` : item.priceInr.toLocaleString('en-IN')}</span>
                              <span>· {allocationPct}%</span>
                            </div>
                          </div>

                          <ChevronRight className="w-4 h-4 hidden md:block text-slate-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs border rounded-2xl border-dashed" style={{ color: colors.textTertiary, borderColor: colors.borderDim }}>
                  No crypto holdings in this tab yet. Set up a daily habit in <strong style={{ color: colors.textPrimary }}>Invest</strong> or deposit funds to start accumulating fractional crypto.
                </div>
              )}

              {/* Footer Custody Note */}
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400" style={{ color: colors.textTertiary }}>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Non-Custodial · Direct Spot Execution Engine</span>
                </div>
                <span className="hidden sm:inline">Tap any asset to inspect on-chain balance & cost basis</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SpotlightCard>

      {/* ── DUAL HABITS / AUTOPAY STATUS ROW ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stable Habit Card */}
        {(activeTabFilter === 'all' || activeTabFilter === 'stable') && (
          <SpotlightCard
            spotlightColor={colors.accentTint}
            className="rounded-3xl p-6 border shadow-lg space-y-4"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" style={{ color: isStableConfigured ? colors.semanticSuccess : colors.textTertiary }} />
                <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>Stable Basket Habit</h3>
              </div>
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border tracking-wider"
                style={{
                  backgroundColor: !isStableConfigured ? colors.surface : isStableActive ? colors.mintTint : 'rgba(245, 158, 11, 0.1)',
                  color: !isStableConfigured ? colors.textTertiary : isStableActive ? colors.semanticSuccess : colors.semanticWarning,
                  borderColor: !isStableConfigured ? colors.borderDim : isStableActive ? colors.borderMint : 'rgba(245, 158, 11, 0.3)',
                }}
              >
                {!isStableConfigured ? 'NOT CONFIGURED' : isStableActive ? 'AUTOPAY ACTIVE' : 'PAUSED'}
              </span>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
              85% USDT / 15% BTC. <em>"A disciplined, stable way to start."</em>
            </p>

            {isStableConfigured ? (
              <div className="p-4 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <div>
                  <span className="text-xs block" style={{ color: colors.textTertiary }}>Daily SIP Rate</span>
                  <span className="text-2xl font-extrabold font-mono" style={{ color: colors.textPrimary }}>
                    ₹{prototypeState.habits.stable.dailyAmount}/day
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
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
                    onClick={() => setActiveTab('invest')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: colors.accentTint, color: colors.accent }}
                  >
                    Adjust →
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <div>
                  <span className="text-xs block" style={{ color: colors.textTertiary }}>Min Allocation</span>
                  <span className="text-lg font-bold font-mono" style={{ color: colors.textPrimary }}>From ₹10/day</span>
                </div>
                <button
                  onClick={() => setActiveTab('invest')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  + Setup Habit →
                </button>
              </div>
            )}

            <div className="text-[11px] font-mono flex items-center justify-between" style={{ color: colors.textSecondary }}>
              <span>Batch Buy: <strong>09:00 AM Daily</strong></span>
              <span>Min: <strong>₹10/day</strong></span>
            </div>
          </SpotlightCard>
        )}

        {/* Growth Habit Card */}
        {(activeTabFilter === 'all' || activeTabFilter === 'growth') && (
          <SpotlightCard
            spotlightColor={colors.accentTint}
            className="rounded-3xl p-6 border shadow-lg space-y-4"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: isGrowthConfigured ? colors.accent : colors.textTertiary }} />
                <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>Growth Basket Habit</h3>
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
              70% BTC / 20% ETH / 10% SOL. <em>"Long-term crypto, built a little every day."</em>
            </p>

            {isGrowthConfigured ? (
              <div className="p-4 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <div>
                  <span className="text-xs block" style={{ color: colors.textTertiary }}>Daily SIP Rate</span>
                  <span className="text-2xl font-extrabold font-mono" style={{ color: colors.textPrimary }}>
                    ₹{prototypeState.habits.growth.dailyAmount}/day
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
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
                    onClick={() => setActiveTab('invest')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: colors.accentTint, color: colors.accent }}
                  >
                    Adjust →
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <div>
                  <span className="text-xs block" style={{ color: colors.textTertiary }}>Min Allocation</span>
                  <span className="text-lg font-bold font-mono" style={{ color: colors.textPrimary }}>From ₹30/day</span>
                </div>
                <button
                  onClick={() => setActiveTab('invest')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  + Setup Habit →
                </button>
              </div>
            )}

            <div className="text-[11px] font-mono flex items-center justify-between" style={{ color: colors.textSecondary }}>
              <span>Batch Buy: <strong>09:00 AM Daily</strong></span>
              <span>Min: <strong>₹30/day</strong></span>
            </div>
          </SpotlightCard>
        )}
      </div>

      {/* ── STREAK & HABIT WEEKLY TRACKER ─────────────────────── */}
      <FadeIn delay={0.12}>
        <StreakWeeklyTracker onQuickDeposit={() => setDepositOpen(true)} />
      </FadeIn>

      {/* ── DAILY DEBITS & ACTIVITY LEDGER ────────────────────── */}
      <SpotlightCard
        spotlightColor={colors.purpleTint}
        className="rounded-3xl p-6 border shadow-lg space-y-4"
        style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: colors.accent }} />
            <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>
              Daily Debits & Auto-Buys ({activeTabFilter.toUpperCase()})
            </h3>
          </div>
          <span className="text-xs font-mono" style={{ color: colors.textTertiary }}>
            {filteredActivity.length} Executions
          </span>
        </div>

        {filteredActivity.length > 0 ? (
          <div className="divide-y" style={{ borderColor: colors.borderDim }}>
            {filteredActivity.slice(0, 15).map((entry) => {
              const isWd = entry.type === 'withdrawal' || entry.amount < 0;
              const isDep = entry.type === 'deposit';

              const fillsSummary = entry.fills && entry.fills.length > 0
                ? entry.fills.map((f) => `${Math.abs(f.units).toFixed(f.asset === 'USDT' ? 2 : 6)} ${f.asset}`).join(', ')
                : `${Math.abs(entry.amount)} INR`;

              return (
                <div key={entry.id} className="py-3.5 flex items-center justify-between text-xs hover:bg-white/[0.02] px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-xl flex-shrink-0"
                      style={{
                        backgroundColor: isWd ? 'rgba(244, 63, 94, 0.12)' : isDep ? colors.accentTint : colors.mintTint,
                        color: isWd ? '#FB7185' : isDep ? colors.accent : colors.semanticSuccess,
                      }}
                    >
                      {isWd ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold flex items-center gap-2" style={{ color: colors.textPrimary }}>
                        <span>
                          {entry.basketId === 'stable' ? 'Stable Basket' : 'Growth Basket'}{' '}
                          {isWd ? 'Withdrawal' : isDep ? 'Instant Top-Up' : 'Daily SIP'}
                        </span>
                        <span
                          className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold"
                          style={{
                            backgroundColor: isWd ? 'rgba(244, 63, 94, 0.15)' : colors.accentTint,
                            color: isWd ? '#FB7185' : colors.accent,
                          }}
                        >
                          {isWd ? 'IMPS SETTLED' : isDep ? 'INSTANT SPOT' : 'AUTOPAY'}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono mt-0.5" style={{ color: colors.textSecondary }}>
                        {entry.date} · {isWd ? `Liquidated: ${fillsSummary}` : `Credited: ${fillsSummary}`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div
                      className="font-bold text-sm"
                      style={{ color: isWd ? '#FB7185' : colors.textPrimary }}
                    >
                      {isWd ? '-' : '+'}₹{Math.abs(entry.amount).toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px]" style={{ color: colors.textTertiary }}>
                      {isWd ? 'Bank Payout' : isDep ? 'Lump-Sum' : 'Daily 8 AM SIP'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs border rounded-2xl border-dashed" style={{ color: colors.textTertiary, borderColor: colors.borderDim }}>
            No transaction records in this tab yet. Top up or activate your habit to accumulate daily fills!
          </div>
        )}
      </SpotlightCard>

      {/* ── EDUCATIONAL GUIDES FEED ───────────────────────────── */}
      <div className="rounded-3xl p-6 border shadow-lg space-y-4" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: colors.accent }} />
            <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>Educational Knowledge Feed</h3>
          </div>
          <span className="text-xs font-semibold" style={{ color: colors.textTertiary }}>Micro-Lessons</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EDUCATIONAL_GUIDES.map((guide) => (
            <SpotlightCard
              key={guide.id}
              spotlightColor={colors.purpleTint}
              onClick={() => setSelectedGuide(guide)}
              className="p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between"
              style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}
            >
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                  <span style={{ color: colors.accent }}>{guide.category}</span>
                  <span className="font-mono" style={{ color: colors.textTertiary }}>{guide.readTime}</span>
                </div>
                <h4 className="text-xs font-bold mb-1.5 leading-snug" style={{ color: colors.textPrimary }}>{guide.title}</h4>
                <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: colors.textSecondary }}>{guide.summary}</p>
              </div>
              <span className="text-[11px] font-bold inline-flex items-center gap-1 mt-3" style={{ color: colors.accent }}>
                Read Guide <ArrowRight className="w-3 h-3" />
              </span>
            </SpotlightCard>
          ))}
        </div>
      </div>

      {/* Guide Details Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl space-y-4" style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase" style={{ color: colors.accent }}>{selectedGuide.category}</span>
                <h3 className="text-lg font-bold mt-1" style={{ color: colors.textPrimary }}>{selectedGuide.title}</h3>
              </div>
              <button onClick={() => setSelectedGuide(null)} className="p-1 hover:opacity-80 transition-opacity" style={{ color: colors.textTertiary }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs md:text-sm leading-relaxed pt-2 border-t" style={{ color: colors.textSecondary, borderColor: colors.borderDim }}>
              {selectedGuide.content}
            </p>
            <button
              onClick={() => setSelectedGuide(null)}
              className="w-full py-3 rounded-xl font-bold text-xs shadow-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: colors.primary, color: colors.primaryText }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── ASSET DETAIL INSPECTION MODAL ────────────────────── */}
      {selectedAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-lg rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-none"
            style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b" style={{ borderColor: colors.borderDim }}>
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl border flex items-center justify-center font-extrabold text-base font-mono shadow-sm flex-shrink-0"
                  style={{
                    backgroundColor: selectedAssetModal.meta.bg,
                    borderColor: selectedAssetModal.meta.border,
                    color: selectedAssetModal.meta.color,
                  }}
                >
                  {selectedAssetModal.coin}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold" style={{ color: colors.textPrimary }}>
                      {selectedAssetModal.label} ({selectedAssetModal.coin})
                    </h3>
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold uppercase"
                      style={{
                        backgroundColor: selectedAssetModal.meta.bg,
                        borderColor: selectedAssetModal.meta.border,
                        color: selectedAssetModal.meta.color,
                      }}
                    >
                      {selectedAssetModal.meta.tokenStandard}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5 font-mono" style={{ color: colors.textSecondary }}>
                    {selectedAssetModal.meta.network}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAssetModal(null)}
                className="p-1.5 rounded-xl hover:opacity-80 transition-opacity"
                style={{ color: colors.textTertiary }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Asset Description */}
            <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
              {selectedAssetModal.meta.desc}
            </p>

            {/* Large Token Balance Card */}
            <div
              className="p-5 rounded-2xl border text-center space-y-1.5"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.borderDim,
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: colors.textTertiary }}>
                Total Wallet Balance
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono" style={{ color: colors.textPrimary }}>
                {selectedAssetModal.units === 0
                  ? `0.00 ${selectedAssetModal.coin}`
                  : selectedAssetModal.coin === 'BTC'
                  ? `${selectedAssetModal.units.toFixed(8)} BTC`
                  : selectedAssetModal.coin === 'ETH'
                  ? `${selectedAssetModal.units.toFixed(6)} ETH`
                  : selectedAssetModal.coin === 'SOL'
                  ? `${selectedAssetModal.units.toFixed(4)} SOL`
                  : `${selectedAssetModal.units.toFixed(2)} USDT`}
              </div>
              <div className="flex items-center justify-center gap-2 font-mono text-xs" style={{ color: colors.accent }}>
                <span className="font-bold">
                  ₹{selectedAssetModal.inrValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {selectedAssetModal.usdValue > 0 && (
                  <span style={{ color: colors.textTertiary }}>
                    (≈ ${selectedAssetModal.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD)
                  </span>
                )}
              </div>
            </div>

            {/* 1-Week Performance Trajectory Card */}
            {selectedAssetModal.weekSeries && (
              <div
                className="p-4 rounded-2xl border space-y-2"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[11px] font-sans font-bold flex items-center gap-1.5" style={{ color: colors.textPrimary }}>
                    <Activity className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                    1-Week Trajectory (Sun – Sat)
                  </span>
                  <span
                    className="font-bold text-[11px]"
                    style={{
                      color:
                        selectedAssetModal.investedInr <= 0
                          ? '#64748B'
                          : selectedAssetModal.gainRupees >= 0
                          ? colors.semanticSuccess
                          : colors.semanticDanger,
                    }}
                  >
                    {selectedAssetModal.investedInr <= 0
                      ? 'No Investment'
                      : `${selectedAssetModal.gainRupees >= 0 ? '+' : ''}₹${selectedAssetModal.gainRupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${selectedAssetModal.gainRupees >= 0 ? '+' : ''}${selectedAssetModal.gainPercentage}%)`}
                  </span>
                </div>

                <div className="pt-1 w-full flex justify-center overflow-hidden">
                  <MiniLineChart
                    series={selectedAssetModal.weekSeries}
                    width={360}
                    height={50}
                    interactive={true}
                    className="w-full max-w-full"
                  />
                </div>
              </div>
            )}

            {/* Financial Intelligence Grid */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Current Spot Price</span>
                <strong className="text-sm block mt-0.5" style={{ color: colors.textPrimary }}>
                  ₹{Math.round(selectedAssetModal.priceInr).toLocaleString('en-IN')}
                </strong>
                <span className="text-[10px]" style={{ color: colors.textTertiary }}>
                  (${Math.round(selectedAssetModal.priceUsd).toLocaleString('en-US')})
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Total Invested Basis</span>
                <strong className="text-sm block mt-0.5" style={{ color: colors.textPrimary }}>
                  ₹{selectedAssetModal.investedInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
                <span className="text-[10px]" style={{ color: colors.textTertiary }}>
                  From UPI AutoPay
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Average Buy Price</span>
                <strong className="text-sm block mt-0.5" style={{ color: colors.textPrimary }}>
                  ₹{Math.round(selectedAssetModal.avgBuyPriceInr).toLocaleString('en-IN')}
                </strong>
                <span className="text-[10px]" style={{ color: colors.textTertiary }}>
                  DCA Rupee-Cost Avg
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Net Returns (P&L)</span>
                <strong
                  className="text-sm block mt-0.5"
                  style={{ color: selectedAssetModal.gainRupees >= 0 ? colors.semanticSuccess : colors.semanticDanger }}
                >
                  {selectedAssetModal.gainRupees >= 0 ? '+' : ''}₹{selectedAssetModal.gainRupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
                <span
                  className="text-[10px] font-bold"
                  style={{ color: selectedAssetModal.gainRupees >= 0 ? colors.semanticSuccess : colors.semanticDanger }}
                >
                  ({selectedAssetModal.gainPercentage >= 0 ? '+' : ''}{selectedAssetModal.gainPercentage}%)
                </span>
              </div>
            </div>

            {/* Custody, Settlement & Tax Compliance Card */}
            <div className="p-4 rounded-2xl border text-xs space-y-2.5 font-mono" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex items-center gap-2 pb-2 border-b font-sans font-bold" style={{ borderColor: colors.borderDim, color: colors.textPrimary }}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Custody & Settlement Protocol</span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span style={{ color: colors.textSecondary }}>Basket Source:</span>
                <span className="font-bold" style={{ color: colors.accent }}>{selectedAssetModal.meta.basketName}</span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span style={{ color: colors.textSecondary }}>Custody Architecture:</span>
                <span className="text-emerald-400 font-bold">100% Non-Custodial (Zero Keys Held)</span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span style={{ color: colors.textSecondary }}>Execution Protocol:</span>
                <span style={{ color: colors.textPrimary }}>Direct Spot Batch Engine (09:00 AM)</span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span style={{ color: colors.textSecondary }}>Order Liquidity:</span>
                <span style={{ color: colors.accent }}>Instant 24/7 Liquidity / Zero Lock-in</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedAssetModal(null);
                  setActiveTab('invest');
                }}
                className="py-3.5 px-4 rounded-2xl font-bold text-xs shadow-md transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <span>Adjust Daily SIP in Invest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setSelectedAssetModal(null);
                  setWithdrawOpen(true);
                }}
                className="py-3.5 px-4 rounded-2xl font-bold text-xs border transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textPrimary }}
              >
                <span>Instant Bank Payout</span>
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
