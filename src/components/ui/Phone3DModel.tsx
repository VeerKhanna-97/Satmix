import React, { useState, useRef } from 'react';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Sun,
  Flame,
  MessageSquare,
  ChevronLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Phone3DModelProps {
  className?: string;
  onOpenApp?: () => void;
}

export const Phone3DModel: React.FC<Phone3DModelProps> = ({ className = '', onOpenApp }) => {
  const { colors, setViewMode } = useApp();
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

  // Dynamic profitable datasets based on selected mix
  const mixMetrics = {
    all: {
      total: '₹14,850.40',
      pnl: '+₹2,450.40 (+19.76%)',
      invested: '₹12,400',
      profit: '+₹2,450',
      habits: '3 Active',
    },
    stable: {
      total: '₹8,620.00',
      pnl: '+₹620.00 (+7.75%)',
      invested: '₹8,000',
      profit: '+₹620',
      habits: '1 Active',
    },
    growth: {
      total: '₹6,230.40',
      pnl: '+₹1,830.40 (+41.60%)',
      invested: '₹4,400',
      profit: '+₹1,830',
      habits: '2 Active',
    },
  }[activeMix];

  // Upward trajectory points for the profitable compounding curve
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
          background: `radial-gradient(circle, ${colors.accent} 0%, rgba(16, 185, 129, 0.3) 40%, transparent 70%)`,
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
          className="absolute -right-[5px] top-[170px] w-[5px] h-[65px] rounded-r-sm bg-[#2A2C38] border-r border-y border-white/20 shadow-xs"
          style={{ transform: 'translateZ(-2px)' }}
        />

        {/* ── TITANIUM OUTER BEZEL ─────────────────────────────── */}
        <div
          className="relative w-[310px] sm:w-[335px] h-[640px] sm:h-[665px] rounded-[50px] p-[10px] bg-gradient-to-b from-[#2E313E] via-[#1A1C24] to-[#121319] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.12),inset_0_1px_1px_rgba(255,255,255,0.2)]"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Inner Display Ring */}
          <div className="relative w-full h-full rounded-[42px] bg-black p-[3px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden">
            {/* The OLED Screen Surface */}
            <div className="relative w-full h-full rounded-[39px] bg-[#0A0B10] flex flex-col justify-between overflow-hidden font-sans">
              
              {/* ── TOP DYNAMIC ISLAND NOTCH ───────────────────── */}
              <div className="absolute top-2.5 left-0 right-0 z-30 flex justify-center pointer-events-none">
                <div className="w-28 h-6 rounded-full bg-black flex items-center justify-between px-3.5 shadow-sm border border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#1b2559]" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#0d1b2a] border border-blue-500/30" />
                </div>
              </div>

              {/* ── PHONE SCREEN CONTENT (SCROLLABLE REPLICA OF APP) ─ */}
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
                        className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center whitespace-nowrap cursor-pointer ${
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
                        className={`py-1 px-2.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
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
                  <RefreshCw className="w-3 h-3 text-emerald-400" />
                  <span>Live Rates · Compounding Active</span>
                </div>

                {/* ── TAB 1: OVERVIEW SCREEN (PROFITABLE SAVINGS DASHBOARD) ── */}
                {activeTab === 'overview' && (
                  <div className="p-4 rounded-2xl bg-[#0F111A] border border-white/10 shadow-lg space-y-3.5 animate-fade-in">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-white/40 block">
                        YOUR TOTAL SAVINGS
                      </span>
                      <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                        <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
                          {mixMetrics.total}
                        </span>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] font-mono text-[10px] font-bold tabular-nums">
                          <TrendingUp className="w-3 h-3 flex-shrink-0" />
                          <span>{mixMetrics.pnl}</span>
                        </div>
                      </div>
                    </div>

                    {/* 2 Primary Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleClickAction}
                        className="h-9 px-3 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                      >
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        <span>+ Add Money</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleClickAction}
                        className="h-9 px-3 rounded-xl bg-white/[0.06] border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform cursor-pointer"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Withdraw</span>
                      </button>
                    </div>

                    {/* 3 Metric Mini Row */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center font-mono">
                      <div>
                        <span className="text-[9px] text-white/40 font-sans block">Total Invested</span>
                        <span className="text-xs font-bold text-white mt-0.5 block tabular-nums">{mixMetrics.invested}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-white/40 font-sans block">Total Profit / Loss</span>
                        <span className="text-xs font-bold text-[#34D399] mt-0.5 block tabular-nums">{mixMetrics.profit}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-white/40 font-sans block">Daily Habits</span>
                        <span className="text-xs font-bold text-[#A78BFA] mt-0.5 block">{mixMetrics.habits}</span>
                      </div>
                    </div>

                    {/* Live Valuation Trajectory Chart (Profitable Upward Curve) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <div className="flex items-center gap-1 text-[#34D399] font-bold">
                          <TrendingUp className="w-3 h-3 text-[#34D399]" />
                          <span>Live Valuation Trajectory</span>
                        </div>
                        <span className="text-white/40">Divisions: Weekly</span>
                      </div>

                      {/* SVG Curve showing profitable green compounding */}
                      <div className="relative w-full h-20 pt-1">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 280 70" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="phoneChartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                            </linearGradient>
                            <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
                              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10B981" floodOpacity="0.35" />
                            </filter>
                          </defs>

                          {/* Grid guidelines */}
                          <line x1="0" y1="20" x2="280" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                          <line x1="0" y1="45" x2="280" y2="45" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                          {/* Area Fill */}
                          <path
                            d={`${chartPoints.path} L 280 70 L 0 70 Z`}
                            fill="url(#phoneChartGrad)"
                          />

                          {/* Upward Stroke Line */}
                          <path
                            d={chartPoints.path}
                            fill="none"
                            stroke="#34D399"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            filter="url(#greenGlow)"
                          />

                          {/* Active Compounding Point */}
                          <circle
                            cx="280"
                            cy={chartPoints.endY}
                            r="3.5"
                            fill="#34D399"
                            stroke="#0F111A"
                            strokeWidth="1.5"
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

                    {/* Performance View Horizon Switcher */}
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
                              className={`flex-1 py-1 rounded text-center transition-all cursor-pointer ${
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
                )}

                {/* ── TAB 2: HOLDINGS SCREEN (WHERE YOUR MONEY IS) ── */}
                {activeTab === 'holdings' && (
                  <div className="p-4 rounded-2xl bg-[#0F111A] border border-white/10 shadow-lg space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">Asset Breakdown</span>
                      <span className="text-[10px] font-mono font-bold text-[#34D399]">+₹2,450.40 Gain</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { name: 'Bitcoin (BTC)', alloc: '52.8%', val: '₹7,840.00', pnl: '+24.8%', icon: '₿', color: '#F7931A' },
                        { name: 'Tether USD (USDT)', alloc: '28.1%', val: '₹4,180.00', pnl: 'Pegged $1.00', icon: '₮', color: '#26A17B' },
                        { name: 'Ethereum (ETH)', alloc: '12.4%', val: '₹1,840.40', pnl: '+18.2%', icon: 'Ξ', color: '#627EEA' },
                        { name: 'Solana (SOL)', alloc: '6.7%', val: '₹990.00', pnl: '+39.4%', icon: '◎', color: '#9945FE' },
                      ].map((asset) => (
                        <div key={asset.name} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs"
                              style={{ backgroundColor: `${asset.color}20`, color: asset.color }}
                            >
                              {asset.icon}
                            </div>
                            <div>
                              <div className="font-bold text-xs text-white">{asset.name}</div>
                              <div className="text-[10px] font-mono text-white/40">{asset.alloc} allocation</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-bold text-xs text-white tabular-nums">{asset.val}</div>
                            <div className="text-[10px] font-mono text-[#34D399] font-semibold">{asset.pnl}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── TAB 3: HABITS SCREEN (DAILY HABITS & STREAKS) ── */}
                {activeTab === 'habits' && (
                  <div className="p-4 rounded-2xl bg-[#0F111A] border border-white/10 shadow-lg space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">Active Daily Habits</span>
                      <span className="text-[10px] font-mono font-bold text-[#F59E0B]">🔥 34d Streak</span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { name: 'Morning Wealth AutoPay', mix: 'Stable Mix (85/15)', time: '8:00 AM Daily', amount: '₹100/day', streak: '34d' },
                        { name: 'Crypto Upside Habit', mix: 'Growth Mix (70/20/10)', time: '8:00 AM Daily', amount: '₹50/day', streak: '34d' },
                        { name: 'Weekend Accelerator', mix: 'Growth Mix', time: 'Saturday 9:00 AM', amount: '₹50/wk', streak: '5w' },
                      ].map((habit) => (
                        <div key={habit.name} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-xs text-white">{habit.name}</div>
                            <div className="text-[10px] font-mono text-white/40">{habit.mix} · {habit.time}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-bold text-xs text-white tabular-nums">{habit.amount}</div>
                            <div className="text-[10px] font-mono text-[#F59E0B] font-bold">🔥 {habit.streak}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

// Helper hook for smooth upward compounding chart coordinates
function useMemoChartPoints(horizon: string) {
  return React.useMemo(() => {
    switch (horizon) {
      case '1W':
        return {
          path: 'M 0 54 Q 60 46 120 38 T 200 28 T 280 16',
          endY: 16,
        };
      case '3M':
        return {
          path: 'M 0 60 Q 70 50 140 34 T 210 20 T 280 10',
          endY: 10,
        };
      case '1Y':
        return {
          path: 'M 0 64 Q 80 48 150 28 T 230 16 T 280 6',
          endY: 6,
        };
      case 'ALL':
        return {
          path: 'M 0 66 Q 90 42 170 20 T 240 10 T 280 4',
          endY: 4,
        };
      case '1M':
      default:
        return {
          path: 'M 0 58 Q 70 48 135 34 T 205 24 T 280 12',
          endY: 12,
        };
    }
  }, [horizon]);
}

export default Phone3DModel;
