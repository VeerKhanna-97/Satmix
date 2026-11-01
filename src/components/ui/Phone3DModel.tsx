import React from 'react';
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
  Moon,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Phone3DModelProps {
  className?: string;
  onOpenApp?: () => void;
}

export const Phone3DModel: React.FC<Phone3DModelProps> = ({ className = '', onOpenApp }) => {
  const { colors, themeMode, setViewMode, setAuthSubView, isAuthenticated } = useApp();
  const isLight = themeMode === 'light';

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
      {/* Ambient Radial Backlight Glow & Grounded Depth */}
      <div
        className="absolute w-[320px] min-[360px]:w-[360px] sm:w-[400px] h-[620px] sm:h-[680px] rounded-full blur-[90px] pointer-events-none transition-all duration-700"
        style={{
          background: isLight
            ? 'radial-gradient(circle, rgba(139, 92, 246, 0.28) 0%, rgba(93, 23, 235, 0.14) 45%, transparent 70%)'
            : `radial-gradient(circle, ${colors.accent} 0%, rgba(93, 23, 235, 0.3) 40%, transparent 70%)`,
          opacity: isLight ? 0.45 : 0.25,
        }}
      />

      {/* ── PHONE CHASSIS (Front-Facing with 3D Beveled Depth & Pure Static Display) ── */}
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
        {/* Left Side: Tactile Volume Buttons */}
        <div
          className={`absolute -left-[4px] top-[135px] w-[4px] h-[44px] rounded-l-sm border-l border-y shadow-xs pointer-events-none z-30 transition-colors duration-300 ${
            isLight ? 'bg-[#CBD5E1] border-white/80' : 'bg-[#2A2C38] border-white/20'
          }`}
        />
        <div
          className={`absolute -left-[4px] top-[190px] w-[4px] h-[44px] rounded-l-sm border-l border-y shadow-xs pointer-events-none z-30 transition-colors duration-300 ${
            isLight ? 'bg-[#CBD5E1] border-white/80' : 'bg-[#2A2C38] border-white/20'
          }`}
        />

        {/* Right Side: Power Button */}
        <div
          className={`absolute -right-[4px] top-[165px] w-[4px] h-[60px] rounded-r-sm border-r border-y shadow-xs pointer-events-none z-30 transition-colors duration-300 ${
            isLight ? 'bg-[#CBD5E1] border-white/80' : 'bg-[#2A2C38] border-white/20'
          }`}
        />

        {/* ── TITANIUM OUTER BEZEL (Crisp Frontal Phone Silhouette with Specular Depth) ── */}
        <div
          className="relative w-[300px] min-[360px]:w-[325px] sm:w-[350px] h-[650px] min-[360px]:h-[685px] sm:h-[715px] rounded-[48px] p-[8px] sm:p-[10px] transition-all duration-500"
          style={{
            background: isLight
              ? 'linear-gradient(180deg, #E2E8F0 0%, #CBD5E1 45%, #94A3B8 100%)'
              : 'linear-gradient(180deg, #383B4A 0%, #1D1F2A 50%, #11121A 100%)',
            boxShadow: isLight
              ? '0 32px 75px -15px rgba(15, 23, 42, 0.24), 0 12px 24px -6px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.95), 0 0 45px rgba(139, 92, 246, 0.18)'
              : '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.18), 0 0 40px rgba(93, 23, 235, 0.25)',
          }}
        >
          {/* Inner Display Ring (Concentric: 48px - 8px = 40px) */}
          <div
            className="relative w-full h-full rounded-[40px] p-[2.5px] overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: isLight ? '#CBD5E1' : '#000000',
              boxShadow: isLight ? 'inset 0 0 0 1px rgba(0, 0, 0, 0.12)' : 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* The Screen Surface (OLED in Dark Mode · Crisp Surface in Light Mode) */}
            <div
              className="relative w-full h-full rounded-[37px] flex flex-col justify-between overflow-hidden font-sans transition-colors duration-300"
              style={{
                backgroundColor: isLight ? '#F8FAFC' : '#090A0E',
                color: isLight ? '#0F172A' : '#F8FAFC',
              }}
            >
              {/* Dynamic Island Pill (Authentic deep black pill) */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-none">
                <div className="w-24 sm:w-26 h-5 sm:h-5.5 rounded-full bg-black flex items-center justify-between px-3 shadow-sm border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#111] border border-white/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#1b2559]" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0d1b2a] border border-purple-500/30" />
                </div>
              </div>

              {/* ── PHONE SCREEN CONTENT (Exact replica matching active theme) ── */}
              <div className="flex-1 flex flex-col justify-start px-3 sm:px-3.5 pt-9 sm:pt-10 pb-16 overflow-hidden space-y-3 select-none pointer-events-none">
                
                {/* 1. App Top Bar */}
                <div className="flex items-center justify-between pb-0.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-lg ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                    <div className="w-7 h-7 rounded-xl overflow-hidden bg-gradient-to-br from-[#7C3AED] to-[#5D17EB] flex items-center justify-center shadow-md p-0.5 border border-white/20">
                      <img src="/assets/images/satmix-logo.jpg" alt="Satmix Logo" className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <span className={`font-extrabold text-sm sm:text-base tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Satmix App
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-xl border flex items-center justify-center ${
                      isLight ? 'bg-slate-200/80 border-slate-300 text-slate-700' : 'bg-white/5 border-white/10 text-white/70'
                    }`}>
                      {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                    </div>
                    <div className="w-7 h-7 rounded-xl bg-[#5D17EB]/15 border border-[#8B5CF6]/40 flex items-center justify-center font-bold text-[10px] font-mono text-purple-600 dark:text-purple-300">
                      VK
                    </div>
                  </div>
                </div>

                {/* 2. CARD 1: Total Balance Master Card with Positive Growth P&L */}
                <div
                  className="relative overflow-hidden rounded-[22px] p-4 sm:p-4.5 border transition-all duration-300"
                  style={{
                    backgroundColor: isLight ? '#FFFFFF' : '#0B0F15',
                    borderColor: isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isLight
                      ? '0 4px 20px rgba(15, 23, 42, 0.06)'
                      : '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {/* Large Indian Rupee Watermark */}
                  <IndianRupee
                    className={`absolute top-2 right-2 w-16 h-16 pointer-events-none select-none ${
                      isLight ? 'text-slate-900 opacity-[0.16]' : 'text-white opacity-[0.15]'
                    }`}
                    strokeWidth={1.5}
                  />

                  <div className="relative z-10">
                    <span className={`text-[9.5px] font-bold uppercase tracking-wider block font-mono ${
                      isLight ? 'text-slate-500' : 'text-neutral-400'
                    }`}>
                      TOTAL BALANCE
                    </span>
                    <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight mt-1 tabular-nums ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      ₹2,185.87
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold font-mono mt-1 text-emerald-500 dark:text-emerald-400">
                      <span>↗ +12.45%</span>
                      <span className={`font-normal ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>vs last month</span>
                    </div>
                  </div>

                  {/* Hairline Divider */}
                  <div className={`w-full h-px my-3 ${isLight ? 'bg-slate-100' : 'bg-white/[0.06]'}`} />

                  {/* 2-Column Sub-Metrics Grid */}
                  <div className={`grid grid-cols-2 divide-x relative z-10 ${isLight ? 'divide-slate-100' : 'divide-white/[0.06]'}`}>
                    {/* Column 1: Today's P&L */}
                    <div className="pr-3">
                      <span className={`text-[9px] font-semibold uppercase tracking-wider font-mono block ${
                        isLight ? 'text-slate-500' : 'text-neutral-400'
                      }`}>
                        TODAY'S P&L
                      </span>
                      <div className="text-base font-extrabold font-mono text-emerald-500 dark:text-emerald-400 mt-0.5 tabular-nums">
                        +₹104.13
                      </div>
                      <div className="text-[10px] font-bold font-mono text-emerald-500 dark:text-emerald-400 mt-0.5">
                        ↗ +0.55%
                      </div>
                    </div>

                    {/* Column 2: Total Return */}
                    <div className="pl-3.5">
                      <span className={`text-[9px] font-semibold uppercase tracking-wider font-mono block ${
                        isLight ? 'text-slate-500' : 'text-neutral-400'
                      }`}>
                        TOTAL RETURN
                      </span>
                      <div className={`text-base font-extrabold font-mono mt-0.5 tabular-nums ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}>
                        +14.8%
                      </div>
                      <div className="text-[10px] font-bold font-mono text-emerald-500 dark:text-emerald-400 mt-0.5">
                        ↗ +14.8%
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. CARD 2: Portfolio Value Card with Trajectory Curve, Mix Switcher & Inline Actions */}
                <div
                  className="rounded-[22px] p-4 sm:p-4.5 border space-y-3 transition-all duration-300"
                  style={{
                    backgroundColor: isLight ? '#FFFFFF' : '#0B0F15',
                    borderColor: isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isLight
                      ? '0 4px 20px rgba(15, 23, 42, 0.06)'
                      : '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`text-sm sm:text-base font-extrabold tracking-tight ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}>
                        Portfolio Value
                      </h4>
                      <p className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        Last 30 days
                      </p>
                      <div className="flex items-center gap-1 text-[10.5px] font-bold text-emerald-500 dark:text-emerald-400 mt-1">
                        <TrendingUp className="w-3 h-3 flex-shrink-0" />
                        <span>1M Performance Trajectory</span>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 dark:text-emerald-400 font-bold text-[11px] font-mono">
                      <TrendingUp className="w-3 h-3 flex-shrink-0" />
                      <span>+94.92%</span>
                    </div>
                  </div>

                  {/* Performance Trajectory SVG */}
                  <div className="relative w-full h-24 sm:h-28 pt-1">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 280 85" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="purpleTrajectoryGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8B5CF6" stopOpacity={isLight ? 0.35 : 0.45} />
                          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Dashed reference target line */}
                      <line
                        x1="0"
                        y1="78"
                        x2="280"
                        y2="12"
                        stroke={isLight ? 'rgba(15, 23, 42, 0.18)' : 'rgba(255, 255, 255, 0.22)'}
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                      />

                      {/* Area gradient under trajectory */}
                      <path
                        d="M 0 78 L 280 18 L 280 85 L 0 85 Z"
                        fill="url(#purpleTrajectoryGrad)"
                      />

                      {/* Glowing Violet Performance Trajectory Line */}
                      <path
                        d="M 0 78 L 280 18"
                        fill="none"
                        stroke={isLight ? '#7C3AED' : '#A855F7'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Date Axis */}
                  <div className={`flex justify-between text-[9px] font-mono px-1 pt-0.5 ${
                    isLight ? 'text-slate-400' : 'text-neutral-400'
                  }`}>
                    <span>29 Sept</span>
                    <span>14 Oct</span>
                    <span>28 Oct</span>
                  </div>

                  {/* Time Horizon Pills + Action Buttons in the EXACT SAME Row */}
                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    {/* Time Horizon Pills */}
                    <div
                      className="h-7 flex items-center gap-0.5 p-0.5 rounded-lg border text-[10px] font-mono"
                      style={{
                        backgroundColor: isLight ? '#F1F5F9' : 'rgba(255, 255, 255, 0.04)',
                        borderColor: isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <span className={`h-full px-1.5 rounded-md font-bold flex items-center justify-center ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>1W</span>
                      <span className={`h-full px-1.5 rounded-md font-bold flex items-center justify-center ${
                        isLight ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-[#5D17EB]/20 text-[#A78BFA] border border-[#8B5CF6]/40'
                      }`}>1M</span>
                      <span className={`h-full px-1.5 rounded-md font-bold flex items-center justify-center ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>3M</span>
                      <span className={`h-full px-1.5 rounded-md font-bold flex items-center justify-center ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>1Y</span>
                      <span className={`h-full px-1.5 rounded-md font-bold flex items-center justify-center ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>ALL</span>
                    </div>

                    {/* Inline Quick Action Button: Withdraw */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <div className={`h-7 px-2.5 rounded-lg font-bold text-[11px] border flex items-center gap-1 ${
                        isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-black/40 border-white/20 text-white'
                      }`}>
                        <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
                        <span>Withdraw</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. CARD 3: Asset Allocation Preview Card */}
                <div
                  className="rounded-[22px] p-4 border transition-all duration-300"
                  style={{
                    backgroundColor: isLight ? '#FFFFFF' : '#0B0F15',
                    borderColor: isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                    boxShadow: isLight
                      ? '0 4px 20px rgba(15, 23, 42, 0.06)'
                      : '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>Asset Allocation</h4>
                      <p className={`text-[10.5px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Current distribution</p>
                    </div>
                    <span className={`text-[10.5px] font-mono font-bold ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>4 Assets</span>
                  </div>
                </div>
              </div>

              {/* ── FUSED FLOATING BOTTOM NAVIGATION DOCK ── */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 w-fit pointer-events-none">
                <div
                  className="flex items-center gap-1 p-1 rounded-full border backdrop-blur-2xl transition-all duration-300"
                  style={{
                    backgroundColor: isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(11, 15, 21, 0.95)',
                    borderColor: isLight ? 'rgba(15, 23, 42, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isLight
                      ? '0 12px 30px -4px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(15, 23, 42, 0.06)'
                      : '0 12px 36px -4px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                    isLight ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-[#5D17EB]/20 border border-[#8B5CF6]/40 text-purple-300'
                  }`}>
                    <Wallet className="w-3 h-3" />
                    <span>Portfolio</span>
                  </div>
                  <div className={`p-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div className={`p-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div className={`p-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <div className={`w-px h-3.5 mx-0.5 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />
                  <div className="flex items-center gap-1 px-1.5 py-1 text-purple-600 dark:text-purple-400 text-[10px] font-semibold">
                    <MessageSquare className="w-3 h-3" />
                    <span>Feedback</span>
                  </div>
                </div>
              </div>

              {/* ── HOME INDICATOR BAR ── */}
              <div className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full pointer-events-none z-50 ${
                isLight ? 'bg-slate-300' : 'bg-white/20'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phone3DModel;
