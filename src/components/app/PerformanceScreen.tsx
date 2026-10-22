import React, { useMemo } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  BarChart3,
  PieChart,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';

export const PerformanceScreen: React.FC = () => {
  const { tabMetrics, liveCoins, themeMode, colors } = useApp();

  const isDark = themeMode === 'dark';
  const streakCount = tabMetrics.streakDays || 37;

  // Monthly Returns vs Benchmark historical simulation data
  const monthlyData = useMemo(() => [
    { month: 'Jan', portfolio: 3.2, benchmark: 2.7 },
    { month: 'Feb', portfolio: -1.4, benchmark: -0.6 },
    { month: 'Mar', portfolio: 4.8, benchmark: 3.1 },
    { month: 'Apr', portfolio: 2.9, benchmark: 2.1 },
    { month: 'May', portfolio: -0.5, benchmark: -1.2 },
    { month: 'Jun', portfolio: 5.4, benchmark: 4.2 },
    { month: 'Jul', portfolio: 1.8, benchmark: 1.4 },
    { month: 'Aug', portfolio: 3.6, benchmark: 2.8 },
    { month: 'Sep', portfolio: -2.3, benchmark: -2.7 },
    { month: 'Oct', portfolio: 5.1, benchmark: 3.5 },
    { month: 'Nov', portfolio: 2.4, benchmark: 1.7 },
    { month: 'Dec', portfolio: 4.0, benchmark: 3.3 },
  ], []);

  // Performance Attribution breakdown by asset
  const attributionList = useMemo(() => [
    { name: 'Bitcoin (BTC)', sector: 'Store of Value', contribution: +8.2, color: '#06B6D4', width: '82%' },
    { name: 'Ethereum (ETH)', sector: 'Smart Contracts', contribution: +3.1, color: '#06B6D4', width: '31%' },
    { name: 'Solana (SOL)', sector: 'High-Speed L1', contribution: +2.4, color: '#06B6D4', width: '24%' },
    { name: 'Digital Dollars (USDT)', sector: 'Yield & Dollar Stability', contribution: +1.8, color: '#06B6D4', width: '18%' },
    { name: 'Slippage & Network Gas', sector: 'On-Chain Execution Spread', contribution: -0.7, color: '#EF4444', width: '10%' },
  ], []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* ── TOP 4 METRIC CARDS ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: YTD Return */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <TrendingUp className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-white" />
          <span className="text-[11px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
            YTD Return
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-white">
            18.42%
          </div>
          <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-emerald-500/10 text-emerald-400">
            <span>↗ +18.42%</span>
            <span className="text-neutral-400 font-normal">vs start</span>
          </div>
        </div>

        {/* Card 2: 1Y Return */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <ArrowUpRight className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-white" />
          <span className="text-[11px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
            1Y Return (CAGR)
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-white">
            24.87%
          </div>
          <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-emerald-500/10 text-emerald-400">
            <span>↗ +24.87%</span>
            <span className="text-neutral-400 font-normal">annualized</span>
          </div>
        </div>

        {/* Card 3: Alpha */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <Zap className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-white" />
          <span className="text-[11px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
            Alpha
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-white">
            3.61%
          </div>
          <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-cyan-500/10 text-cyan-400">
            <span>vs FD 7.0%</span>
          </div>
        </div>

        {/* Card 4: Habit Consistency / Win Rate */}
        <div
          className="relative overflow-hidden p-5 sm:p-6 rounded-[22px] border transition-all duration-300"
          style={{
            backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <CheckCircle2 className="absolute top-4 right-4 w-12 h-12 opacity-5 pointer-events-none text-white" />
          <span className="text-[11px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
            Habit Consistency
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums text-white">
            100%
          </div>
          <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-emerald-500/10 text-emerald-400">
            <span>{streakCount} of {streakCount} Days Saved</span>
          </div>
        </div>
      </div>

      {/* ── MONTHLY RETURNS VS BENCHMARK CLUSTERED BAR CHART ─── */}
      <div
        className="p-6 sm:p-8 rounded-[22px] border"
        style={{
          backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Monthly Returns vs Benchmark
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Portfolio outperformance by month vs traditional benchmarks
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-neutral-300 font-semibold">Portfolio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
              <span className="text-neutral-400">Benchmark (FD 7%)</span>
            </div>
          </div>
        </div>

        {/* SVG Clustered Bar Chart Container */}
        <div className="w-full h-64 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            {[-3, 0, 3, 6, 9].map((val) => {
              // Range: -3 to 9 (span 12)
              const yPos = 220 - ((val + 3) / 12) * 200;
              return (
                <g key={val}>
                  <line
                    x1="40"
                    y1={yPos}
                    x2="790"
                    y2={yPos}
                    stroke={val === 0 ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.06)'}
                    strokeDasharray={val === 0 ? 'none' : '4 4'}
                    strokeWidth="1"
                  />
                  <text
                    x="30"
                    y={yPos + 4}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-neutral-500"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Zero Axis */}
            {(() => {
              const zeroY = 220 - (3 / 12) * 200; // 170
              return (
                <line
                  x1="40"
                  y1={zeroY}
                  x2="790"
                  y2={zeroY}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="1.5"
                />
              );
            })()}

            {/* Monthly Bar Clusters */}
            {monthlyData.map((d, i) => {
              const clusterWidth = 55;
              const xStart = 55 + i * 60;
              const barWidth = 14;
              const zeroY = 220 - (3 / 12) * 200; // y at 0% = 170

              // Portfolio bar
              const portHeight = Math.abs(d.portfolio / 12) * 200;
              const portY = d.portfolio >= 0 ? zeroY - portHeight : zeroY;
              const portColor = d.portfolio >= 0 ? '#06B6D4' : '#14F195';

              // Benchmark bar
              const benchHeight = Math.abs(d.benchmark / 12) * 200;
              const benchY = d.benchmark >= 0 ? zeroY - benchHeight : zeroY;
              const benchColor = d.benchmark >= 0 ? '#475569' : '#334155';

              return (
                <g key={d.month} className="group cursor-pointer">
                  {/* Hover Hit Target */}
                  <rect
                    x={xStart - 4}
                    y="10"
                    width={clusterWidth}
                    height="210"
                    fill="transparent"
                    className="hover:fill-white/[0.02] transition-colors"
                  />

                  {/* Portfolio Bar */}
                  <rect
                    x={xStart}
                    y={portY}
                    width={barWidth}
                    height={Math.max(2, portHeight)}
                    rx="3"
                    fill={d.portfolio >= 0 ? '#06B6D4' : '#EF4444'}
                    className="transition-all hover:brightness-110"
                  />

                  {/* Benchmark Bar */}
                  <rect
                    x={xStart + barWidth + 3}
                    y={benchY}
                    width={barWidth}
                    height={Math.max(2, benchHeight)}
                    rx="3"
                    fill={d.benchmark >= 0 ? '#64748B' : '#475569'}
                    className="transition-all hover:brightness-110"
                  />

                  {/* Month Label */}
                  <text
                    x={xStart + barWidth}
                    y="235"
                    textAnchor="middle"
                    className="text-[11px] font-mono fill-neutral-400 group-hover:fill-white font-semibold transition-colors"
                  >
                    {d.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ── PERFORMANCE ATTRIBUTION SECTION (REFERENCE IMAGE 3) ─── */}
      <div
        className="p-6 sm:p-8 rounded-[22px] border"
        style={{
          backgroundColor: isDark ? 'rgba(13, 16, 24, 0.75)' : '#FFFFFF',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Performance Attribution
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Contribution by asset category & macro strategy
          </p>
        </div>

        {/* Horizontal Progress Bars */}
        <div className="space-y-4">
          {attributionList.map((item) => {
            const isPos = item.contribution >= 0;
            return (
              <div key={item.name} className="flex items-center justify-between gap-4 py-2">
                {/* Sector / Asset Name */}
                <div className="w-40 sm:w-56 flex-shrink-0">
                  <span className="text-xs sm:text-sm font-semibold text-neutral-200 block truncate">
                    {item.name}
                  </span>
                  <span className="text-[10px] text-neutral-500 block">
                    {item.sector}
                  </span>
                </div>

                {/* Horizontal Bar Track */}
                <div className="flex-1 h-3 rounded-full bg-white/[0.04] overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.width }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: isPos ? '#06B6D4' : '#EF4444',
                      boxShadow: isPos ? '0 0 10px rgba(6, 182, 212, 0.4)' : 'none',
                    }}
                  />
                </div>

                {/* Percentage Value */}
                <div className="w-16 text-right font-mono text-xs sm:text-sm font-bold tabular-nums flex-shrink-0" style={{ color: isPos ? '#06B6D4' : '#EF4444' }}>
                  {isPos ? '+' : ''}{item.contribution.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
