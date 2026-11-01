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
  const { prototypeState, tabMetrics, themeMode, colors } = useApp();
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
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.12)',
            boxShadow: !isDark ? '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)' : undefined,
          }}
        >
          <span className="absolute top-4 right-4 text-3xl font-mono opacity-5 pointer-events-none select-none text-slate-900 dark:text-white font-bold">₹</span>
          <span className={`text-[11px] font-bold uppercase tracking-wider block font-mono ${
            !isDark ? 'text-slate-500' : 'text-neutral-400'
          }`}>
            Total Volume
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums" style={{ color: colors.textPrimary }}>
            ₹{totalVolume.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono border ${
            !isDark
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
          }`}>
            <span>Cumulative Inflows</span>
          </div>
        </div>

        {/* Card 2: Transactions Count */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.12)',
            boxShadow: !isDark ? '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)' : undefined,
          }}
        >
          <Receipt className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-slate-900 dark:text-white" />
          <span className={`text-[11px] font-bold uppercase tracking-wider block font-mono ${
            !isDark ? 'text-slate-500' : 'text-neutral-400'
          }`}>
            Transactions
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums" style={{ color: colors.textPrimary }}>
            {totalCount}
          </div>
          <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono border ${
            !isDark
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-emerald-500/10 text-emerald-400 border-transparent'
          }`}>
            <span>{buyCount} Auto-Deposits</span>
          </div>
        </div>

        {/* Card 3: Avg Size */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.12)',
            boxShadow: !isDark ? '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)' : undefined,
          }}
        >
          <Calendar className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-slate-900 dark:text-white" />
          <span className={`text-[11px] font-bold uppercase tracking-wider block font-mono ${
            !isDark ? 'text-slate-500' : 'text-neutral-400'
          }`}>
            Avg. Size
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums" style={{ color: colors.textPrimary }}>
            ₹{avgSize.toLocaleString('en-IN')}
          </div>
          <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono border ${
            !isDark
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-emerald-500/10 text-emerald-400 border-transparent'
          }`}>
            <span>Per Execution</span>
          </div>
        </div>

        {/* Card 4: Buy / Sell Ratio */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.12)',
            boxShadow: !isDark ? '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)' : undefined,
          }}
        >
          <Layers className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-slate-900 dark:text-white" />
          <span className={`text-[11px] font-bold uppercase tracking-wider block font-mono ${
            !isDark ? 'text-slate-500' : 'text-neutral-400'
          }`}>
            Buy/Sell Ratio
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums" style={{ color: colors.textPrimary }}>
            {buyCount}:{sellCount}
          </div>
          <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono border ${
            !isDark
              ? 'bg-purple-50 text-purple-700 border-purple-200'
              : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
          }`}>
            <span>Disciplined Stacking</span>
          </div>
        </div>
      </div>

      {/* ── RECENT TRANSACTIONS TABLE (REFERENCE IMAGE 4) ──────── */}
      <div
        className="p-6 sm:p-8 rounded-[22px] border transition-all duration-300"
        style={{
          backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.12)',
          boxShadow: !isDark ? '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)' : undefined,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight" style={{ color: colors.textPrimary }}>
              Recent Transactions
            </h3>
            <p className={`text-xs mt-0.5 ${!isDark ? 'text-slate-500' : 'text-neutral-400'}`}>
              Latest daily execution and auto-saving activity across your accounts
            </p>
          </div>

          {/* Filter Pills */}
          <div className={`flex items-center gap-1.5 p-1 rounded-xl border text-xs font-semibold ${
            !isDark
              ? 'bg-slate-100 border-slate-200'
              : 'bg-black/[0.04] dark:bg-white/[0.04] border-black/5 dark:border-white/5'
          }`}>
            {(['all', 'buy', 'withdrawal'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg transition-colors capitalize cursor-pointer ${
                  filterType === t
                    ? 'bg-[#5D17EB] text-white font-bold shadow-xs'
                    : (!isDark
                        ? 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                        : 'text-neutral-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white')
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
              <tr className={`border-b text-[10px] font-mono uppercase tracking-wider ${
                !isDark
                  ? 'border-slate-200 text-slate-500'
                  : 'border-slate-200 dark:border-white/[0.08] text-neutral-400'
              }`}>
                <th className="pb-3 font-bold">Type</th>
                <th className="pb-3 font-bold">Basket / Asset</th>
                <th className="pb-3 font-bold">Allocations</th>
                <th className="pb-3 font-bold text-right">Amount (INR)</th>
                <th className="pb-3 font-bold text-right">Execution Date</th>
              </tr>
            </thead>
            <tbody className={`divide-y font-mono ${!isDark ? 'divide-slate-100' : 'divide-slate-100 dark:divide-white/[0.04]'}`}>
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
                    <tr key={act.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                      {/* TYPE Badge */}
                      <td className="py-3.5 pr-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            isBuy
                              ? (!isDark
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20')
                              : (!isDark
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20')
                          }`}
                        >
                          {isBuy ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          <span>{isBuy ? 'BUY' : 'WITHDRAW'}</span>
                        </span>
                      </td>

                      {/* Basket / Asset */}
                      <td className="py-3.5 pr-4">
                        <strong className={`font-bold font-sans text-xs sm:text-sm block ${
                          !isDark ? 'text-slate-900' : 'text-slate-800 dark:text-neutral-200'
                        }`}>
                          {basketLabel}
                        </strong>
                        <span className={`text-[10px] font-mono ${!isDark ? 'text-slate-500 font-medium' : 'text-neutral-500'}`}>
                          {act.type === 'deposit' ? 'Daily Auto-Save' : 'Manual Transaction'}
                        </span>
                      </td>

                      {/* Allocations Breakdown */}
                      <td className={`py-3.5 pr-4 text-[11px] ${!isDark ? 'text-slate-600' : 'text-neutral-400'}`}>
                        {act.fills && act.fills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {act.fills.map((f) => (
                              <span key={f.asset} className={!isDark ? 'text-slate-600' : 'text-slate-600 dark:text-neutral-300'}>
                                {f.asset}: <strong className={!isDark ? 'text-slate-900 font-bold' : 'text-slate-800 dark:text-neutral-200'}>₹{Math.round(f.inr)}</strong>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className={!isDark ? 'text-slate-500' : undefined}>Direct Execution</span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 pr-4 text-right">
                        <span
                          className={`text-sm sm:text-base font-bold tabular-nums ${
                            isBuy
                              ? (!isDark ? 'text-slate-950' : (isDark ? 'text-white' : 'text-slate-900'))
                              : (!isDark ? 'text-rose-600' : 'text-rose-500 dark:text-rose-400')
                          }`}
                        >
                          {isBuy ? '+' : '-'}₹{Math.abs(act.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Date */}
                      <td className={`py-3.5 text-right text-[11px] tabular-nums ${!isDark ? 'text-slate-500' : 'text-neutral-400'}`}>
                        {act.date} <span className={!isDark ? 'text-slate-400 font-medium' : 'text-neutral-600'}>09:00</span>
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
