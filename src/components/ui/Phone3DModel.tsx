import React, { useState } from 'react';
import {
  TrendingUp,
  ArrowUpRight,
  IndianRupee,
  Plus,
  Wallet,
  Layers,
  Settings,
  MessageSquare,
  Sun,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Phone3DModelProps {
  className?: string;
  onOpenApp?: () => void;
}

export const Phone3DModel: React.FC<Phone3DModelProps> = ({ className = '', onOpenApp }) => {
  const { colors, setViewMode, setAuthSubView, isAuthenticated } = useApp();

  // Horizon filter state (interactive)
  const [horizon, setHorizon] = useState<'1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
  const [activeMix, setActiveMix] = useState<'all' | 'stable' | 'growth'>('all');

  const handleClickAction = () => {
    if (onOpenApp) {
      onOpenApp();
    } else if (isAuthenticated) {
      setViewMode('app');
    } else {
      setAuthSubView('login');
      setViewMode('auth');
    }
  };

  return (
    <div className={`relative flex items-center justify-center select-none max-w-full overflow-hidden sm:overflow-visible ${className}`}>
      {/* Ambient Radial Backlight Glow */}
      <div
        className="absolute w-[300px] min-[360px]:w-[340px] sm:w-[380px] h-[600px] sm:h-[660px] rounded-full blur-[90px] opacity-25 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${colors.accent} 0%, rgba(93, 23, 235, 0.3) 40%, transparent 70%)`,
        }}
      />

      {/* ── PHONE CHASSIS (Completely Flat / Front-Facing with Zero Tilt) ── */}
      <div
        onClick={handleClickAction}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClickAction();
          }
        }}
        aria-label="Open Satmix WebApp Dashboard"
        className="relative cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 rounded-[48px] active:scale-[0.99] transition-transform duration-200"
      >
        {/* Left Side: Volume Buttons */}
        <div className="absolute -left-[4px] top-[135px] w-[4px] h-[44px] rounded-l-sm bg-[#2A2C38] border-l border-y border-white/20 shadow-xs pointer-events-none z-30" />
        <div className="absolute -left-[4px] top-[190px] w-[4px] h-[44px] rounded-l-sm bg-[#2A2C38] border-l border-y border-white/20 shadow-xs pointer-events-none z-30" />

        {/* Right Side: Power Button */}
        <div className="absolute -right-[4px] top-[165px] w-[4px] h-[60px] rounded-r-sm bg-[#2A2C38] border-r border-y border-white/20 shadow-xs pointer-events-none z-30" />

        {/* ── TITANIUM OUTER BEZEL (Crisp Frontal Phone Silhouette) ── */}
        <div
          className="relative w-[300px] min-[360px]:w-[325px] sm:w-[350px] h-[650px] min-[360px]:h-[685px] sm:h-[715px] rounded-[48px] p-[8px] sm:p-[10px] bg-gradient-to-b from-[#383B4A] via-[#1D1F2A] to-[#11121A] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.18),0_0_40px_rgba(93,23,235,0.25)]"
        >
          {/* Inner Display Ring (Concentric: 48px - 8px = 40px) */}
          <div className="relative w-full h-full rounded-[40px] bg-black p-[2.5px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden">
            
            {/* The OLED Screen Surface */}
            <div className="relative w-full h-full rounded-[37px] bg-[#090A0E] flex flex-col justify-between overflow-hidden font-sans text-slate-100">
              
              {/* Dynamic Island Pill */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none">
                <div className="w-24 sm:w-26 h-5 sm:h-5.5 rounded-full bg-black flex items-center justify-between px-3 shadow-sm border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-[#111] border border-white/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#1b2559]" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0d1b2a] border border-purple-500/30" />
                </div>
              </div>

              {/* ── PHONE SCREEN CONTENT (Matching the New Cleaner Dashboard View) ── */}
              <div className="flex-1 flex flex-col justify-start px-3 sm:px-3.5 pt-9 sm:pt-10 pb-16 overflow-y-auto no-scrollbar space-y-3 select-none">
                
                {/* 1. App Top Bar */}
                <div className="flex items-center justify-between pb-0.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClickAction}
                      className="p-1 rounded-lg text-white/70 hover:text-white transition-colors"
                      aria-label="Back"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="w-7 h-7 rounded-xl overflow-hidden bg-gradient-to-br from-[#7C3AED] to-[#5D17EB] flex items-center justify-center shadow-md p-0.5 border border-white/20">
                      <img src="/assets/images/satmix-logo.jpg" alt="Satmix Logo" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">Satmix App</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-7 h-7 rounded-xl bg-[#5D17EB]/20 border border-[#8B5CF6]/50 flex items-center justify-center font-bold text-[10px] font-mono text-purple-300">
                      VK
                    </div>
                  </div>
                </div>

                {/* 2. CARD 1: Total Balance Master Card with Watermark & 2-Column Split */}
                <div className="relative overflow-hidden rounded-[22px] bg-[#0B0F15] border border-white/[0.08] p-4 sm:p-4.5 shadow-lg">
                  {/* Large Indian Rupee Watermark */}
                  <IndianRupee
                    className="absolute top-2 right-2 w-16 h-16 opacity-[0.08] pointer-events-none select-none text-white"
                    strokeWidth={1.5}
                  />

                  <div className="relative z-10">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider block font-mono text-neutral-400">
                      TOTAL BALANCE
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 text-white tabular-nums">
                      ₹2,127.79
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold font-mono mt-1 text-rose-400">
                      <span>↘ -5.43%</span>
                      <span className="text-neutral-400 font-normal">vs last month</span>
                    </div>
                  </div>

                  {/* Hairline Divider */}
                  <div className="w-full h-px my-3 bg-white/[0.06]" />

                  {/* 2-Column Sub-Metrics Grid */}
                  <div className="grid grid-cols-2 divide-x divide-white/[0.06] relative z-10">
                    {/* Column 1: Today's P&L */}
                    <div className="pr-3">
                      <span className="text-[9px] font-semibold uppercase tracking-wider font-mono text-neutral-400 block">
                        TODAY'S P&L
                      </span>
                      <div className="text-base font-extrabold font-mono text-rose-500 mt-0.5 tabular-nums">
                        -₹122.21
                      </div>
                      <div className="text-[10px] font-bold font-mono text-rose-400 mt-0.5">
                        ↘ -0.65%
                      </div>
                    </div>

                    {/* Column 2: Total Return */}
                    <div className="pl-3.5">
                      <span className="text-[9px] font-semibold uppercase tracking-wider font-mono text-neutral-400 block">
                        TOTAL RETURN
                      </span>
                      <div className="text-base font-extrabold font-mono text-white mt-0.5 tabular-nums">
                        -5.4%
                      </div>
                      <div className="text-[10px] font-bold font-mono text-rose-400 mt-0.5">
                        ↘ -5.4%
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. CARD 2: Portfolio Value Card with Trajectory Curve, Mix Switcher & Inline Actions */}
                <div className="rounded-[22px] bg-[#0B0F15] border border-white/[0.08] p-4 sm:p-4.5 shadow-lg space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight">Portfolio Value</h4>
                      <p className="text-[11px] text-neutral-400 font-medium">Last 30 days</p>
                      <div className="flex items-center gap-1 text-[10.5px] font-bold text-emerald-400 mt-1">
                        <TrendingUp className="w-3 h-3 flex-shrink-0" />
                        <span>1M Performance Trajectory</span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold text-[11px] font-mono">
                      <TrendingUp className="w-3 h-3 flex-shrink-0" />
                      <span>+96.80%</span>
                    </div>
                  </div>

                  {/* High-Fidelity SVG Trajectory Chart */}
                  <div className="relative w-full h-24 sm:h-28 pt-1">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 280 85" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="purpleTrajectoryGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Dashed reference guide line */}
                      <line x1="0" y1="72" x2="280" y2="15" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeDasharray="3 3" />

                      {/* Area gradient under trajectory */}
                      <path
                        d="M 0 72 Q 70 60 140 40 T 280 18 L 280 85 L 0 85 Z"
                        fill="url(#purpleTrajectoryGrad)"
                      />

                      {/* Glowing Violet Trajectory Curve */}
                      <path
                        d="M 0 72 Q 70 60 140 40 T 280 18"
                        fill="none"
                        stroke="#A855F7"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Date Axis */}
                  <div className="flex justify-between text-[9px] font-mono text-neutral-400 px-1 pt-0.5">
                    <span>28 Sept</span>
                    <span>13 Oct</span>
                    <span>27 Oct</span>
                  </div>

                  {/* Mix Switcher Tabs (All Mixes, Stable Mix, Growth Mix) */}
                  <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setActiveMix('all'); }}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeMix === 'all'
                          ? 'bg-[#5D17EB] text-white shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      All Mixes
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setActiveMix('stable'); }}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeMix === 'stable'
                          ? 'bg-[#5D17EB] text-white shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Stable Mix
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setActiveMix('growth'); }}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeMix === 'growth'
                          ? 'bg-[#5D17EB] text-white shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Growth Mix
                    </button>
                  </div>

                  {/* Time Horizon Pills + Action Buttons in the EXACT SAME Row */}
                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    {/* Time Horizon Pills */}
                    <div className="h-7 flex items-center gap-0.5 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono">
                      {(['1W', '1M', '3M', '1Y', 'ALL'] as const).map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setHorizon(h); }}
                          className={`h-full px-1.5 rounded-md font-bold flex items-center justify-center transition-all ${
                            horizon === h
                              ? 'bg-[#5D17EB]/20 text-[#A78BFA] border border-[#8B5CF6]/40'
                              : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          {h}
                        </button>
                      ))}
                    </div>

                    {/* Inline Quick Action Buttons: Add & Withdraw */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={handleClickAction}
                        className="h-7 px-2.5 rounded-lg font-bold text-[11px] bg-[#5D17EB] hover:bg-[#6D28D9] text-white flex items-center gap-1 shadow-sm active:scale-[0.96] transition-all"
                      >
                        <Plus className="w-3 h-3" strokeWidth={2.5} />
                        <span>Add</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleClickAction}
                        className="h-7 px-2.5 rounded-lg font-bold text-[11px] bg-black/40 border border-white/20 text-white flex items-center gap-1 active:scale-[0.96] transition-all hover:bg-white/10"
                      >
                        <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
                        <span>Withdraw</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. CARD 3: Asset Allocation Preview Card */}
                <div className="rounded-[22px] bg-[#0B0F15] border border-white/[0.08] p-4 shadow-lg opacity-90">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-white">Asset Allocation</h4>
                      <p className="text-[10.5px] text-neutral-400">Current distribution</p>
                    </div>
                    <span className="text-[10.5px] font-mono font-bold text-neutral-400">4 Assets</span>
                  </div>
                </div>
              </div>

              {/* ── FUSED FLOATING BOTTOM NAVIGATION DOCK ── */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-fit pointer-events-auto">
                <div className="flex items-center gap-1 p-1 rounded-full border border-white/10 bg-[#0B0F15]/95 backdrop-blur-2xl shadow-2xl">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#5D17EB]/20 border border-[#8B5CF6]/40 text-purple-300 font-bold text-[10px]">
                    <Wallet className="w-3 h-3" />
                    <span>Portfolio</span>
                  </div>
                  <div className="p-1 text-neutral-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1 text-neutral-400">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-1 text-neutral-400">
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-px h-3.5 bg-white/10 mx-0.5" />
                  <div className="flex items-center gap-1 px-1.5 py-1 text-purple-400 text-[10px] font-semibold">
                    <MessageSquare className="w-3 h-3" />
                    <span>Feedback</span>
                  </div>
                </div>
              </div>

              {/* ── HOME INDICATOR BAR ── */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-white/20 pointer-events-none z-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phone3DModel;
