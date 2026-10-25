import React, { useState, useRef, useCallback } from 'react';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
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
  const { colors, themeMode, setViewMode, setAuthSubView, isAuthenticated } = useApp();
  const phoneRef = useRef<HTMLDivElement>(null);

  // Horizon filter state
  const [horizon, setHorizon] = useState<'1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');

  // Interactive 3D tilt state with natural homepage angle
  const [rotateX, setRotateX] = useState<number>(4);
  const [rotateY, setRotateY] = useState<number>(-8);
  const [glarePos, setGlarePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Mouse tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!phoneRef.current) return;
    const rect = phoneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = Math.max(-12, Math.min(12, ((y - centerY) / centerY) * -10));
    const rY = Math.max(-14, Math.min(14, ((x - centerX) / centerX) * 12));

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: Math.max(0, Math.min(100, (x / rect.width) * 100)),
      y: Math.max(0, Math.min(100, (y / rect.height) * 100)),
    });
  };

  const handleMouseLeave = () => {
    setRotateX(4);
    setRotateY(-8);
    setGlarePos({ x: 50, y: 50 });
  };

  // Mobile Touch tilt support (iOS Safari, Android Chrome, Opera, Brave)
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!phoneRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = phoneRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = Math.max(-10, Math.min(10, ((y - centerY) / centerY) * -8));
    const rY = Math.max(-12, Math.min(12, ((x - centerX) / centerX) * 10));

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: Math.max(0, Math.min(100, (x / rect.width) * 100)),
      y: Math.max(0, Math.min(100, (y / rect.height) * 100)),
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    setRotateX(4);
    setRotateY(-8);
    setGlarePos({ x: 50, y: 50 });
  }, []);

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

  // Trajectory points for the profitable compounding curve
  const chartPoints = useMemoChartPoints(horizon);

  return (
    <div
      className={`relative flex items-center justify-center select-none max-w-full overflow-hidden sm:overflow-visible [-webkit-tap-highlight-color:transparent] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        perspective: 1200,
        WebkitPerspective: 1200,
        touchAction: 'pan-y', // Allows smooth vertical page scrolling while enabling touch gestures
      } as React.CSSProperties}
    >
      {/* Dynamic Ambient Backlight (Responsive width to prevent horizontal overflow on <=360px viewports) */}
      <div
        className="absolute w-[280px] min-[360px]:w-[320px] sm:w-[360px] h-[580px] sm:h-[640px] rounded-full blur-[70px] sm:blur-[90px] opacity-25 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${colors.accent} 0%, rgba(16, 185, 129, 0.3) 40%, transparent 70%)`,
          transform: `translate3d(${rotateY * -3}px, ${rotateX * 3}px, 0px)`,
        }}
      />

      {/* ── 3D PHONE CHASSIS (Click redirects to prototype sign in) ── */}
      <div
        ref={phoneRef}
        onClick={handleClickAction}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClickAction();
          }
        }}
        aria-label="Open Satmix Prototype Sign In"
        className="relative transition-transform duration-200 ease-out will-change-transform cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 rounded-[48px] active:scale-[0.98]"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`,
          WebkitTransform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`,
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        } as React.CSSProperties}
      >
        {/* Left Side: Volume Buttons (Placed with positive z-index and translateZ to prevent Safari WebKit culling) */}
        <div
          className="absolute -left-[4px] top-[135px] w-[4px] h-[44px] rounded-l-sm bg-[#2A2C38] border-l border-y border-white/20 shadow-xs pointer-events-none z-30"
          style={{ transform: 'translateZ(1px)', WebkitTransform: 'translateZ(1px)' }}
        />
        <div
          className="absolute -left-[4px] top-[190px] w-[4px] h-[44px] rounded-l-sm bg-[#2A2C38] border-l border-y border-white/20 shadow-xs pointer-events-none z-30"
          style={{ transform: 'translateZ(1px)', WebkitTransform: 'translateZ(1px)' }}
        />

        {/* Right Side: Power Button */}
        <div
          className="absolute -right-[4px] top-[165px] w-[4px] h-[60px] rounded-r-sm bg-[#2A2C38] border-r border-y border-white/20 shadow-xs pointer-events-none z-30"
          style={{ transform: 'translateZ(1px)', WebkitTransform: 'translateZ(1px)' }}
        />

        {/* ── TITANIUM OUTER BEZEL (Fluid scaling for 320px–390px viewports) ── */}
        <div
          className="relative w-[285px] min-[360px]:w-[305px] sm:w-[335px] h-[600px] min-[360px]:h-[635px] sm:h-[665px] rounded-[48px] p-[8px] sm:p-[10px] bg-gradient-to-b from-[#3A3D4D] via-[#1E202B] to-[#12131C] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.18),0_15px_35px_rgba(0,0,0,0.6)]"
          style={{
            boxShadow:
              themeMode === 'dark'
                ? '0 30px 80px -15px rgba(0,0,0,0.95), 0 0 45px rgba(93, 23, 235, 0.25), inset 0 1px 1px rgba(255,255,255,0.3)'
                : '0 30px 80px -15px rgba(15, 23, 42, 0.35), 0 0 35px rgba(93, 23, 235, 0.2), inset 0 1px 1px rgba(255,255,255,0.4)',
          }}
        >
          {/* Inner Display Ring (Concentric: 48px - 8px = 40px) */}
          <div className="relative w-full h-full rounded-[40px] bg-black p-[3px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden">
            {/* The OLED Screen Surface (Concentric: 40px - 3px = 37px) */}
            <div className="relative w-full h-full rounded-[37px] bg-[#0A0B10] flex flex-col justify-between overflow-hidden font-sans">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center pointer-events-none">
                <div className="w-24 sm:w-26 h-5 sm:h-5.5 rounded-full bg-black flex items-center justify-between px-3 shadow-sm border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-[#111] border border-white/10 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#1b2559]" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0d1b2a] border border-blue-500/30" />
                </div>
              </div>

              {/* ── PHONE SCREEN CONTENT ── */}
              <div className="flex-1 flex flex-col justify-between px-3 sm:px-3.5 pt-9 sm:pt-10 pb-2 overflow-hidden text-xs select-none">
                
                {/* 1. App Top Bar */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleClickAction}
                      className="p-1 rounded-lg hover:bg-white/10 text-white/80 active:scale-[0.96] transition-transform touch-manipulation [ -webkit-tap-highlight-color: transparent ]"
                      aria-label="Back"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-4.5 h-4.5 rounded-md overflow-hidden bg-white/10 flex items-center justify-center p-0.5">
                      <img src="/assets/images/satmix-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-xs" />
                    </div>
                    <span className="font-extrabold text-xs tracking-tight text-white">Satmix App</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
                      <Sun className="w-3 h-3" />
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-[#5D17EB]/20 border border-[#5D17EB]/40 flex items-center justify-center font-bold text-[9px] text-white">
                      VK
                    </div>
                  </div>
                </div>

                {/* 2. User Greeting & Streak Badge */}
                <div className="pt-0.5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-white">Good morning, Veer</h3>
                    <p className="text-[9.5px] sm:text-[10px] text-white/50">Daily crypto savings summary</p>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] font-mono text-[9.5px] sm:text-[10px] font-bold tabular-nums [font-feature-settings:'tnum']">
                    <Flame className="w-3 h-3 fill-[#F59E0B]" />
                    <span>34d Streak</span>
                  </div>
                </div>

                {/* 3. HERO PROFITABLE SAVINGS CARD */}
                <div className="p-3 sm:p-3.5 rounded-2xl bg-[#0F111A] border border-white/10 shadow-lg space-y-2 sm:space-y-2.5">
                  <div>
                    <span className="text-[8.5px] sm:text-[9px] font-mono font-bold uppercase tracking-wider text-white/40 block">
                      YOUR TOTAL SAVINGS
                    </span>
                    <div className="flex items-baseline gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
                      <span className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight tabular-nums [font-feature-settings:'tnum']">
                        ₹14,850.40
                      </span>
                      <div className="inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] sm:text-[10px] font-bold tabular-nums [font-feature-settings:'tnum']">
                        <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                        <span>+₹2,450.40 (+19.76%)</span>
                      </div>
                    </div>
                  </div>

                  {/* 2 Primary Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={handleClickAction}
                      className="h-8 sm:h-8.5 px-2.5 sm:px-3 rounded-xl bg-white text-black font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow-sm active:scale-[0.96] transition-transform touch-manipulation [ -webkit-tap-highlight-color: transparent ]"
                    >
                      <ArrowDownLeft className="w-3 h-3" />
                      <span>+ Add Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClickAction}
                      className="h-8 sm:h-8.5 px-2.5 sm:px-3 rounded-xl bg-white/[0.06] border border-white/15 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 active:scale-[0.96] transition-transform touch-manipulation [ -webkit-tap-highlight-color: transparent ]"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                      <span>Withdraw</span>
                    </button>
                  </div>

                  {/* 3 Metric Mini Row */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-xl bg-white/[0.03] border border-white/5 text-center font-mono">
                    <div>
                      <span className="text-[8px] sm:text-[8.5px] text-white/40 font-sans block">Total Invested</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-white mt-0.5 block tabular-nums [font-feature-settings:'tnum']">₹12,400</span>
                    </div>
                    <div>
                      <span className="text-[8px] sm:text-[8.5px] text-white/40 font-sans block">Total Profit</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 mt-0.5 block tabular-nums [font-feature-settings:'tnum']">+₹2,450.00</span>
                    </div>
                    <div>
                      <span className="text-[8px] sm:text-[8.5px] text-white/40 font-sans block">Daily Habits</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#A78BFA] mt-0.5 block">2 Active</span>
                    </div>
                  </div>

                  {/* 4. Live Profitable Trajectory Chart */}
                  <div className="space-y-1 pt-0.5">
                    <div className="flex items-center justify-between text-[8.5px] sm:text-[9.5px] font-mono">
                      <div className="flex items-center gap-1 text-emerald-400 font-bold">
                        <TrendingUp className="w-2.5 h-2.5" />
                        <span>Compounding Trajectory</span>
                      </div>
                      <span className="text-white/40">Weekly DCA</span>
                    </div>

                    {/* SVG Curve */}
                    <div className="relative w-full h-14 sm:h-16 pt-0.5">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 280 65" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="phoneProfitableGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" y1="18" x2="280" y2="18" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
                        <line x1="0" y1="40" x2="280" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

                        <path
                          d={`${chartPoints.path} L 280 65 L 0 65 Z`}
                          fill="url(#phoneProfitableGrad)"
                        />

                        <path
                          d={chartPoints.path}
                          fill="none"
                          stroke="#34D399"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {/* Dates Axis */}
                    <div className="flex justify-between text-[8px] sm:text-[8.5px] font-mono text-white/30 pt-0.5 tabular-nums [font-feature-settings:'tnum']">
                      <span>16 Sept</span>
                      <span>05 Oct</span>
                      <span>19 Oct</span>
                    </div>
                  </div>

                  {/* 5. Horizon Switcher */}
                  <div className="pt-1 border-t border-white/5">
                    <div className="flex items-center justify-between gap-0.5 sm:gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/5 text-[8.5px] sm:text-[9px] font-mono">
                      {(['1W', '1M', '3M', '1Y', 'ALL'] as const).map((h) => {
                        const isHorizonActive = horizon === h;
                        return (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setHorizon(h)}
                            className={`flex-1 py-1 rounded text-center transition-all touch-manipulation [ -webkit-tap-highlight-color: transparent ] ${
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

                {/* 6. Feedback Pill */}
                <div className="flex justify-end pt-0.5">
                  <div className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-xl bg-[#1B1936] border border-[#5D17EB]/40 text-[#A78BFA] font-bold text-[9px] sm:text-[10px] shadow-sm">
                    <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span>Feedback / Reviews</span>
                  </div>
                </div>
              </div>

              {/* ── HOME INDICATOR ── */}
              <div className="h-4 w-full flex items-center justify-center pb-0.5">
                <div className="w-24 sm:w-28 h-1 rounded-full bg-white/30" />
              </div>

              {/* ── GLASS SPECULAR GLARE ── */}
              <div
                className="absolute inset-0 pointer-events-none rounded-[37px] mix-blend-overlay opacity-30"
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
        return { path: 'M 0 52 Q 60 44 120 36 T 200 24 T 280 14' };
      case '3M':
        return { path: 'M 0 58 Q 70 48 140 32 T 210 18 T 280 8' };
      case '1Y':
        return { path: 'M 0 60 Q 80 44 150 24 T 230 14 T 280 6' };
      case 'ALL':
        return { path: 'M 0 62 Q 90 40 170 18 T 240 10 T 280 4' };
      case '1M':
      default:
        return { path: 'M 0 54 Q 70 46 135 32 T 205 20 T 280 10' };
    }
  }, [horizon]);
}

export default Phone3DModel;
