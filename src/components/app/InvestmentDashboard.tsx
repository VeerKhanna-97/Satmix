import React, { useTransition } from 'react';
import { useApp } from '../../context/AppContext';
import { LedgerEntry } from '../../utils/prototypeEngine';
import { useSatmixPortfolio } from '../../hooks/useSatmixPortfolio';
import { HoldingsMatrixTable } from './HoldingsMatrixTable';
import { RotateCw, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Coins } from 'lucide-react';

interface InvestmentDashboardProps {
  activityLedger?: LedgerEntry[];
  onRefresh?: () => Promise<void>;
  onSelectAsset?: (coin: 'BTC' | 'ETH' | 'SOL' | 'USDT') => void;
}

// Helper formats for clean UI display
const formatINR = (val: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);

export const InvestmentDashboard: React.FC<InvestmentDashboardProps> = ({
  activityLedger,
  onRefresh,
  onSelectAsset,
}) => {
  const { colors, themeMode, triggerAccrual } = useApp();
  const [isPending, startTransition] = useTransition();
  const { holdings, metrics, loading, refresh } = useSatmixPortfolio(activityLedger);

  const handleRefresh = () => {
    startTransition(async () => {
      if (onRefresh) {
        await onRefresh();
      } else {
        await refresh();
      }
    });
  };

  return (
    <div
      className="w-full rounded-3xl p-5 sm:p-7 border shadow-lg space-y-6 transition-all duration-300"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
      }}
    >
      {/* Top Banner: Metrics Summary & Refresh Action */}
      <header
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-5"
        style={{ borderColor: colors.borderDim }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl border flex items-center justify-center p-2 shadow-sm"
            style={{ backgroundColor: colors.accentTint, borderColor: colors.borderAccent }}
          >
            <Wallet className="w-5 h-5" style={{ color: colors.accent }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: colors.textPrimary }}>
                Portfolio Financial Matrix
              </h2>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.accent }}
              >
                LIVE MTM
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
              Real-time multi-asset aggregation from ledger fills & spot market valuations.
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isPending || loading}
          className="px-3.5 py-2 text-xs font-bold font-mono rounded-xl border flex items-center gap-2 transition-all hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.borderDim,
            color: colors.textPrimary,
          }}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isPending || loading ? 'animate-spin' : ''}`} style={{ color: colors.accent }} />
          <span>{isPending ? 'Recalculating...' : 'Refresh Spot Rates'}</span>
        </button>
      </header>

      {/* Key Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Valuation */}
        <div
          className="p-4 rounded-2xl border transition-all duration-200"
          style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[11px]" style={{ color: colors.textTertiary }}>
              Current Valuation
            </span>
            <Coins className="w-4 h-4 text-amber-500/80" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono mt-1.5 tabular-nums" style={{ color: colors.textPrimary }}>
            {formatINR(metrics.totalCurrentValueINR)}
          </div>
          <span className="text-[10px] font-mono block mt-1" style={{ color: colors.textSecondary }}>
            {metrics.activeTokensCount} active coin holding{metrics.activeTokensCount === 1 ? '' : 's'}
          </span>
        </div>

        {/* Net Cost Basis */}
        <div
          className="p-4 rounded-2xl border transition-all duration-200"
          style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[11px]" style={{ color: colors.textTertiary }}>
              Net Cost Basis
            </span>
            <Wallet className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-mono mt-1.5 tabular-nums" style={{ color: colors.textPrimary }}>
            {formatINR(metrics.totalInvestedINR)}
          </div>
          <span className="text-[10px] font-mono block mt-1" style={{ color: colors.textSecondary }}>
            Net cash settled from ledger
          </span>
        </div>

        {/* Unrealized Return */}
        <div
          className="p-4 rounded-2xl border transition-all duration-200"
          style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[11px]" style={{ color: colors.textTertiary }}>
              Unrealized Return
            </span>
            {metrics.totalUnrealizedPnLINR >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-500" />
            )}
          </div>
          <div
            className={`text-xl sm:text-2xl font-extrabold font-mono mt-1.5 tabular-nums ${
              metrics.totalUnrealizedPnLINR >= 0 ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {metrics.totalUnrealizedPnLINR >= 0 ? '+' : ''}
            {formatINR(metrics.totalUnrealizedPnLINR)}
          </div>
          <span className="text-[10px] font-mono block mt-1" style={{ color: colors.textSecondary }}>
            MTM net dollar-weighted gain
          </span>
        </div>

        {/* Portfolio ROI */}
        <div
          className="p-4 rounded-2xl border transition-all duration-200"
          style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[11px]" style={{ color: colors.textTertiary }}>
              Portfolio ROI
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div
            className={`text-xl sm:text-2xl font-extrabold font-mono mt-1.5 tabular-nums ${
              metrics.totalROI >= 0 ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {metrics.totalROI >= 0 ? '+' : ''}
            {metrics.totalROI.toFixed(2)}%
          </div>
          <span className="text-[10px] font-mono block mt-1" style={{ color: colors.textSecondary }}>
            All-time capital appreciation
          </span>
        </div>
      </div>

      {/* Ledger-Driven Asset Allocation Table */}
      <HoldingsMatrixTable holdings={holdings} onSelectAsset={onSelectAsset} />
    </div>
  );
};
