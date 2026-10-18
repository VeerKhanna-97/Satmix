import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Sun,
  Flame,
  MessageSquare,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';

interface Phone3DModelProps {
  className?: string;
  onOpenApp?: () => void;
}

export const Phone3DModel: React.FC<Phone3DModelProps> = ({ className = '', onOpenApp }) => {
  const { colors, themeMode, setViewMode } = useApp();
  const phoneRef = useRef<HTMLDivElement>(null);

  // Interactive internal state for the phone preview
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'habits'>('overview');
  const [activeMix, setActiveMix] = useState<'all' | 'stable' | 'growth'>('all');
  const [horizon, setHorizon] = useState<'1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');

  // Interactive 3D tilt tracking
  const [rotateX, setRotateX] = useState(4);
  const [rotateY, setRotateY] = useState(-8);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!phoneRef.current) return;
    const rect = phoneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rY = ((x - centerX) / centerX) * 14;
    const rX = -((y - centerY) / centerY) * 14;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(4);
    setRotateY(-8);
  };

  const handleClickAction = () => {
    if (onOpenApp) {
      onOpenApp();
    } else {
      setViewMode('app');
    }
  };

  // Trajectory points for the chart based on horizon
  const chartPoints = useMemoChartPoints(horizon);

  return (
    <div
      ref={phoneRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none flex items-center justify-center p-2 sm:p-4 ${className}`}
      style={{
        perspective: '1400px',
      }}
    >
      {/* ── 3D AMBIENT BACKLIGHT GLOW ────────────────────────── */}
      <div
        className="absolute w-[360px] h-[640px] rounded-full blur-[90px] opacity-25 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${colors.accent} 0%, rgba(93, 23, 235, 0.4) 40%, transparent 70%)`,
          transform: `translate3d(${rotateY * -4}px, ${rotateX * 4}px, -40px)`,
        }}
      />

      {/* ── 3D PHONE CHASSIS CONTAINER ────────────────────────── */}
      <div
        className="relative transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ── HARDWARE BUTTONS ON SIDES (3D EXTRUSIONS) ───────── */}
        {/* Left Side: Action button & Volume Rockers */}
        <div
          className="absolute -left-[5px] top-[115px] w-[5px] h-[26px] rounded-l-sm bg-[#2A2C38] border-l border-y border-white/20 shadow-xs"
          style={{ transform: 'translateZ(-2px)' }}
        />
        <div
          className="absolute -left-[5px] top-[155px] w-[5px] h-[48px] rounded-l-sm bg-[#2A2C38] border-l border-y border-white/20 shadow-xs"
          style={{ transform: 'translateZ(-2px)' }}
        />
        <div
          className="absolute -left-[5px] top-[215px] w-[5px] h-[48px] rounded-l-sm bg-[#2A2C38] border-l border-y border-white/20 shadow-xs"
          style={{ transform: 'translateZ(-2px)' }}
        />

        {/* Right Side: Power Button */}
        <div
          className="absolute -right-[5px] top-[170px] w-[5px] h-[68px] rounded-r-sm bg-[#2A2C38] border-r border-y border-white/20 shadow-xs"
          style={{ transform: 'translateZ(-2px)' }}
        />

        {/* ── OUTER TITANIUM FRAME ─────────────────────────────── */}
        <div
          className="relative w-[340px] xs:w-[360px] sm:w-[380px] h-[720px] xs:h-[750px] sm:h-[780px] rounded-[52px] p-[10px] bg-gradient-to-b from-[#3A3D4D] via-[#1E202B] to-[#12131C] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.18),0_15px_35px_rgba(0,0,0,0.6)]"
          style={{
            boxShadow:
              themeMode === 'dark'
                ? '0 30px 80px -15px rgba(0,0,0,0.95), 0 0 45px rgba(93, 23, 235, 0.25), inset 0 1px 1px rgba(255,255,255,0.3)'
                : '0 30px 80px -15px rgba(15, 23, 42, 0.35), 0 0 35px rgba(93, 23, 235, 0.2), inset 0 1px 1px rgba(255,255,255,0.4)',
          }}
        >
          {/* Inner Bezel Ring */}
          <div className="w-full h-full rounded-[44px] bg-[#000000] p-[3px] overflow-hidden relative shadow-[inset_0_0_8px_rgba(0,0,0,0.9)]">
            {/* ── SCREEN SURFACE ───────────────────────────────── */}
            <div
              className="w-full h-full rounded-[42px] overflow-hidden flex flex-col justify-between relative text-left"
              style={{
                backgroundColor: '#090A10',
                color: '#FFFFFF',
              }}
            >
              {/* Dynamic Island Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center">
                <div className="w-28 h-6 rounded-full bg-black flex items-center justify-between px-3.5 shadow-sm border border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#1b2559]" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#0d1b2a] border border-blue-500/30" />
                </div>
              </div>

              {/* ── PHONE SCREEN CONTENT (SCROLLABLE REPLICA OF IMAGE 1) ─ */}
              <div className="flex-1 overflow-y-auto px-4 pt-11 pb-6 space-y-3.5 custom-scrollbar text-xs">
                {/* 1. App Top Bar */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleClickAction}
                      className="p-1 rounded-lg hover:bg-white/10 text-white/80"
                      aria-label="Back"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="w-5 h-5 rounded-md overflow-hidden bg-white/10 flex items-center justify-center p-0.5">
                      <img src="/assets/images/satmix-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-xs" />
                    </div>
                    <span className="font-extrabold text-sm tracking-tight text-white">Satmix App</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-[#5D17EB]/20 border border-[#5D17EB]/40 flex items-center justify-center font-bold text-[10px] text-white">
                      VK
                    </div>
                  </div>
                </div>

                {/* 2. User Greeting & Streak */}
                <div className="pt-1">
                  <h2 className="text-xl font-extrabold tracking-tight text-white">Good morning, Veer</h2>
                  <p className="text-[11px] text-white/50 mt-0.5">Here is your daily crypto savings summary.</p>

                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] font-mono text-[11px] font-bold">
                    <Flame className="w-3.5 h-3.5 fill-[#F59E0B]" />
                    <span>34d Streak</span>
                  </div>
                </div>

                {/* 3. Primary Mode Tabs */}
                <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/5 text-[11px] font-bold">
                  {[
                    { id: 'overview' as const, label: 'Overview' },
                    { id: 'holdings' as const, label: 'Where Your Money Is' },
                    { id: 'habits' as const, label: 'Daily Habits & Streaks' },
                  ].map((tab) => {
                    const isTabActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center whitespace-nowrap ${
                          isTabActive ? 'bg-white text-black font-extrabold shadow-sm' : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* 4. Sub-Mix Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/5 text-[10px] font-bold">
                  {[
                    { id: 'all' as const, label: 'All Mixes' },
                    { id: 'stable' as const, label: 'Stable Mix (Safe)' },
                    { id: 'growth' as const, label: 'Growth Mix (Upside)' },
                  ].map((mix) => {
                    const isMixActive = activeMix === mix.id;
                    return (
                      <button
                        key={mix.id}
                        type="button"
                        onClick={() => setActiveMix(mix.id)}
                        className={`py-1 px-2.5 rounded-lg transition-all whitespace-nowrap ${
                          isMixActive ? 'bg-white text-black font-extrabold shadow-xs' : 'text-white/60'
                        }`}
                      >
                        {mix.label}
                      </button>
                    );
                  })}
                </div>

                {/* Live Rates ticker indicator */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 pt-0.5">
                  <RefreshCw className="w-3 h-3 text-white/50" />
                  <span>Live Rates</span>
                </div>

                {/* 5. HERO SAVINGS CARD (EXACT MATCH OF SCREENSHOT) */}
                <div className="p-4 rounded-2xl bg-[#0F111A] border border-white/10 shadow-lg space-y-3.5">
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/40 block">
                      YOUR TOTAL SAVINGS
                    </span>
                    <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                      <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                        ₹1,071.87
                      </span>
                      <div className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#F87171] font-mono text-[10px] font-bold">
                        <TrendingDown className="w-3 h-3 flex-shrink-0" />
                        <span>₹-28.13 (-2.56%)</span>
                      </div>
                    </div>
                  </div>

                  {/* 2 Primary Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleClickAction}
                      className="h-9 px-3 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      <span>+ Add Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClickAction}
                      className="h-9 px-3 rounded-xl bg-white/[0.06] border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Withdraw</span>
                    </button>
                  </div>

                  {/* 3 Metric Mini Row */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center font-mono">
                    <div>
                      <span className="text-[9px] text-white/40 font-sans block">Total Invested</span>
                      <span className="text-xs font-bold text-white mt-0.5 block">₹1,100</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 font-sans block">Total Profit / Loss</span>
                      <span className="text-xs font-bold text-[#F87171] mt-0.5 block">-₹28</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 font-sans block">Daily Habits</span>
                      <span className="text-xs font-bold text-[#A78BFA] mt-0.5 block">2 Running</span>
                    </div>
                  </div>

                  {/* 6. Live Valuation Trajectory Chart */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-1 text-[#A78BFA] font-bold">
                        <TrendingUp className="w-3 h-3" />
                        <span>Live Valuation Trajectory</span>
                      </div>
                      <span className="text-white/40">Divisions: Weekly</span>
                    </div>

                    {/* SVG Curve matching the screenshot */}
                    <div className="relative w-full h-20 pt-1">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 280 70" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="phoneChartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid guidelines */}
                        <line x1="0" y1="20" x2="280" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                        <line x1="0" y1="45" x2="280" y2="45" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                        {/* Area Fill */}
                        <path
                          d={`${chartPoints.path} L 280 70 L 0 70 Z`}
                          fill="url(#phoneChartGrad)"
                        />

                        {/* Stroke Line */}
                        <path
                          d={chartPoints.path}
                          fill="none"
                          stroke="#F87171"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* Dates Axis */}
                    <div className="flex justify-between text-[9px] font-mono text-white/30 pt-0.5">
                      <span>20 Sept</span>
                      <span>05 Oct</span>
                      <span>19 Oct</span>
                    </div>
                  </div>

                  {/* 7. Performance View Horizon Switcher */}
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[9px] font-mono text-white/40 block mb-1.5">Performance View</span>
                    <div className="flex items-center justify-between gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/5 text-[10px] font-mono">
                      {(['1W', '1M', '3M', '1Y', 'ALL'] as const).map((h) => {
                        const isHorizonActive = horizon === h;
                        return (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setHorizon(h)}
                            className={`flex-1 py-1 rounded text-center transition-all ${
                              isHorizonActive
                                ? 'bg-white text-black font-extrabold shadow-xs'
                                : 'text-white/50 hover:text-white'
                            }`}
                          >
                            {h}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 8. Bottom Action Overlay: Feedback / Reviews */}
                <div className="flex justify-end pt-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B1936] border border-[#5D17EB]/40 text-[#A78BFA] font-bold text-[11px] shadow-sm">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Feedback / Reviews</span>
                  </div>
                </div>
              </div>

              {/* ── PHONE BOTTOM HOME INDICATOR ─────────────────── */}
              <div className="h-6 w-full flex items-center justify-center pb-1">
                <div className="w-32 h-1 rounded-full bg-white/30" />
              </div>

              {/* ── GLASS SPECULAR GLARE OVERLAY ────────────────── */}
              <div
                className="absolute inset-0 pointer-events-none rounded-[42px] mix-blend-overlay opacity-30"
                style={{
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.7) 0%, transparent 60%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper hook for smooth chart coordinates
function useMemoChartPoints(horizon: string) {
  return React.useMemo(() => {
    switch (horizon) {
      case '1W':
        return {
          path: 'M 0 55 Q 60 48 120 40 T 200 32 T 280 18',
        };
      case '3M':
        return {
          path: 'M 0 62 Q 70 54 140 38 T 210 24 T 280 12',
        };
      case '1Y':
        return {
          path: 'M 0 65 Q 80 50 150 32 T 230 18 T 280 8',
        };
      case 'ALL':
        return {
          path: 'M 0 68 Q 90 45 170 26 T 240 14 T 280 6',
        };
      case '1M':
      default:
        // Matches the screenshot exact trajectory curve
        return {
          path: 'M 0 60 Q 70 50 140 36 T 210 28 T 280 15',
        };
    }
  }, [horizon]);
}

export default Phone3DModel;
