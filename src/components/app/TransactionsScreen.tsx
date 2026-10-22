import React, { useState, useMemo } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Layers,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TransactionsScreen: React.FC = () => {
  const { prototypeState, tabMetrics, themeMode } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'withdrawal'>('all');

  const isDark = themeMode === 'dark';
  const activities = prototypeState.activity || [];

  // Metrics calculation
  const totalVolume = useMemo(() => {
    return activities.reduce((sum, act) => sum + Math.abs(act.amount), 0);
  }, [activities]);

  const totalCount = activities.length;
  const buyCount = activities.filter((act) => act.type !== 'withdrawal' && act.amount > 0).length;
  const sellCount = activities.filter((act) => act.type === 'withdrawal' || act.amount < 0).length;
  const avgSize = totalCount > 0 ? Math.round(totalVolume / totalCount) : 0;

  const filteredActivities = useMemo(() => {
    if (filterType === 'buy') return activities.filter((a) => a.type !== 'withdrawal' && a.amount > 0);
    if (filterType === 'withdrawal') return activities.filter((a) => a.type === 'withdrawal' || a.amount < 0);
    return activities;
  }, [activities, filterType]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* ── TOP 4 METRIC CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Volume */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <span className="absolute top-4 right-4 text-3xl font-mono opacity-5 pointer-events-none select-none text-white font-bold">₹</span>
          <span className="text-[11px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
            Total Volume
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-white">
            ₹{totalVolume.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-cyan-500/10 text-cyan-400">
            <span>Cumulative Inflows</span>
          </div>
        </div>

        {/* Card 2: Transactions Count */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <Receipt className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-white" />
          <span className="text-[11px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
            Transactions
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-white">
            {totalCount}
          </div>
          <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-emerald-500/10 text-emerald-400">
            <span>{buyCount} Auto-Deposits</span>
          </div>
        </div>

        {/* Card 3: Avg Size */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <Calendar className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-white" />
          <span className="text-[11px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
            Avg. Size
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-white">
            ₹{avgSize.toLocaleString('en-IN')}
          </div>
          <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-emerald-500/10 text-emerald-400">
            <span>Per Execution</span>
          </div>
        </div>

        {/* Card 4: Buy / Sell Ratio */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <Layers className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-white" />
          <span className="text-[11px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
            Buy/Sell Ratio
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-white">
            {buyCount}:{sellCount}
          </div>
          <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-cyan-500/10 text-cyan-400">
            <span>Disciplined Stacking</span>
          </div>
        </div>
      </div>

      {/* ── RECENT TRANSACTIONS TABLE (REFERENCE IMAGE 4) ──────── */}
      <div
        className="p-6 sm:p-8 rounded-[22px] border"
        style={{
          backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Recent Transactions
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Latest daily execution and auto-saving activity across your accounts
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/5 text-xs font-semibold">
            {(['all', 'buy', 'withdrawal'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg transition-colors capitalize ${
                  filterType === t
                    ? 'bg-cyan-500 text-black font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {t === 'all' ? 'All Activity' : t === 'buy' ? 'Deposits' : 'Withdrawals'}
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Basket / Asset</th>
                <th className="pb-3 font-semibold">Allocations</th>
                <th className="pb-3 font-semibold text-right">Amount (INR)</th>
                <th className="pb-3 font-semibold text-right">Execution Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-mono">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    No transactions match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => {
                  const isBuy = act.type !== 'withdrawal' && act.amount > 0;
                  const basketLabel = act.basketId === 'stable' ? 'Stable Mix' : 'Growth Mix';

                  return (
                    <tr key={act.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* TYPE Badge */}
                      <td className="py-3.5 pr-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isBuy
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isBuy ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          <span>{isBuy ? 'BUY' : 'WITHDRAW'}</span>
                        </span>
                      </td>

                      {/* Basket / Asset */}
                      <td className="py-3.5 pr-4">
                        <strong className="text-neutral-200 font-bold font-sans text-xs sm:text-sm block">
                          {basketLabel}
                        </strong>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {act.type === 'deposit' ? 'Daily Auto-Save' : 'Manual Transaction'}
                        </span>
                      </td>

                      {/* Allocations Breakdown */}
                      <td className="py-3.5 pr-4 text-neutral-400 text-[11px]">
                        {act.fills && act.fills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {act.fills.map((f) => (
                              <span key={f.asset} className="text-neutral-300">
                                {f.asset}: <strong className="text-neutral-200">₹{Math.round(f.inr)}</strong>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span>Direct Execution</span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 pr-4 text-right">
                        <span
                          className={`text-sm sm:text-base font-bold tabular-nums ${
                            isBuy ? 'text-white' : 'text-rose-400'
                          }`}
                        >
                          {isBuy ? '+' : '-'}₹{Math.abs(act.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 text-right text-neutral-400 text-[11px] tabular-nums">
                        {act.date} <span className="text-neutral-600">09:00</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
