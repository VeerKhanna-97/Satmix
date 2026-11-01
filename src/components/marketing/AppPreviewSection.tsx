// ============================================================
// FILE: src/components/marketing/AppPreviewSection.tsx
// PURPOSE: "Your crypto habit, in your browser."
//          - Desktop: Perspective-tilted macOS Chromium browser window
//            faithfully recreating the official Satmix App desktop dashboard:
//            * Top row: TOTAL BALANCE (large positive figure ₹48,435.14),
//              TODAY'S RETURN (+₹248.86 / +0.82%), TOTAL RETURN (+18.4% / +₹7,435.00)
//            * Middle: Left Portfolio Value chart with time toggles + Right Donut Asset Allocation (BTC, ETH, SOL, USDT)
//            * Subtabs: Where Your Money Is / Daily Habits & Streaks
//          - Mobile: Full authentic iPhone chassis (as seen in StepsSection reference)
//            showcasing the mobile version of the Satmix dashboard (large positive figure,
//            clean glowing balance, green return chips, and sleek mini breakdown)
// ============================================================

import React, { useRef } from 'react';
import {
  ArrowRight,
  Lock,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Sun,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { FadeIn } from '../ui';

export const AppPreviewSection: React.FC = () => {
  const { colors, themeMode, setViewMode, setAuthSubView, isAuthenticated } = useApp();
  const isLight = themeMode === 'light';
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Desktop Scroll perspective tilt animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  });

  const rotateX = useTransform(smoothProgress, [0, 1], [20, 0]);
  const scale = useTransform(smoothProgress, [0, 1], [0.94, 1]);
  const y = useTransform(smoothProgress, [0, 1], [50, 0]);

  const handleOpenApp = () => {
    if (isAuthenticated) {
      setViewMode('app');
    } else {
      setAuthSubView('signup');
      setViewMode('auth');
    }
  };

  return (
    <section
      id="browser-habit-section"
      className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Seamless ambient background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-15"
        style={{
          background:
            themeMode === 'dark'
              ? 'radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── 1. CENTERED SECTION HEADER ── */}
        <FadeIn delay={0.06} direction="up" className="mx-auto max-w-2xl text-center space-y-4">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.12]"
            style={{ color: colors.textPrimary }}
          >
            Your crypto habit, in your browser.
          </h2>

          <p
            className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto font-normal"
            style={{ color: colors.textSecondary }}
          >
            Satmix is a web app. Open it on your laptop or phone, no download. Every buy, fee, and receipt in one place.
          </p>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleOpenApp}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold shadow-lg transition-all duration-200 active:scale-[0.96] hover:opacity-95 cursor-pointer select-none"
              style={{
                backgroundColor: colors.primary,
                color: colors.primaryText,
              }}
            >
              <span>Open the prototype</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </FadeIn>

        {/* ── 2. DESKTOP VIEWPORT: 3D PERSPECTIVE MACOS BROWSER MOCKUP ── */}
        <div
          ref={containerRef}
          className="hidden md:block relative mx-auto mt-12 lg:mt-16 max-w-[1140px]"
          style={{ perspective: 2000 }}
        >
          <motion.div
            style={{
              rotateX,
              scale,
              y,
              transformOrigin: '50% 0%',
            }}
            className="w-full"
          >
            {/* Interactive Clickable Browser Frame */}
            <div
              onClick={handleOpenApp}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenApp();
                }
              }}
              aria-label="Open the Satmix prototype dashboard"
              className="group relative block rounded-2xl overflow-hidden border shadow-[0_45px_90px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)] cursor-pointer select-none transition-shadow duration-300 hover:shadow-[0_55px_110px_-15px_rgba(93,23,235,0.25),0_0_0_1px_rgba(255,255,255,0.16)]"
              style={{
                backgroundColor: '#090A10',
                borderColor: colors.cardBorder,
              }}
            >
              {/* macOS Window Chrome Top Bar */}
              <div
                className="flex h-11 items-center justify-between border-b px-4 select-none"
                style={{
                  backgroundColor: '#0E1018',
                  borderColor: 'rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Traffic Light Window Controls */}
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50" />
                </div>

                {/* URL Bar */}
                <div
                  className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg border text-xs font-mono w-full max-w-[340px] shadow-2xs"
                  style={{
                    backgroundColor: '#141622',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: colors.textSecondary,
                  }}
                >
                  <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span className="tracking-tight text-neutral-300 font-medium">satmix.in/app</span>
                </div>

                {/* Right Tab Controls */}
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
                  <span>Prototype Mode</span>
                </div>
              </div>

              {/* ── BROWSER CONTENT: FAITHFUL DESKTOP DASHBOARD (MATCHING SCREENSHOT) ── */}
              <div className="p-6 lg:p-8 bg-[#090A10] text-white font-sans space-y-6">
                
                {/* Dashboard Sub-Header Nav */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                      S
                    </div>
                    <span className="font-extrabold text-sm tracking-tight text-white">Satmix App</span>
                  </div>

                  {/* Top Navigation Tabs */}
                  <div className="flex items-center gap-6 text-xs font-medium">
                    <span className="text-white font-semibold flex items-center gap-1.5 border-b-2 border-emerald-400 pb-1">
                      Portfolio
                    </span>
                    <span className="text-neutral-400 hover:text-white transition-colors">Strategy & Growth</span>
                    <span className="text-neutral-400 hover:text-white transition-colors">Baskets</span>
                    <span className="text-neutral-400 hover:text-white transition-colors">Settings</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 text-xs">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 text-[10px] font-mono font-bold">
                      VK
                    </div>
                  </div>
                </div>

                {/* 3 Top KPI Cards (Positive Portfolio & Larger Figures) */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Card 1: Total Balance */}
                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Total Balance</div>
                      <div className="text-2xl lg:text-3xl font-extrabold font-mono tracking-tight mt-1 text-white">
                        ₹48,435.14
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+18.4% vs last month</span>
                      </div>
                    </div>
                    <span className="text-2xl text-neutral-600 font-serif font-light">₹</span>
                  </div>

                  {/* Card 2: Today's Return */}
                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Today's Return</div>
                      <div className="text-2xl lg:text-3xl font-extrabold font-mono tracking-tight mt-1 text-emerald-400">
                        +₹248.86
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+0.82% today</span>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-emerald-500/40" />
                  </div>

                  {/* Card 3: Total Return */}
                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex justify-between items-start">
                    <div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Total Return</div>
                      <div className="text-2xl lg:text-3xl font-extrabold font-mono tracking-tight mt-1 text-emerald-400">
                        +18.4%
                      </div>
                      <div className="text-[11px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>+₹7,540.20 all time</span>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-emerald-500/40" />
                  </div>
                </div>

                {/* Main 2-Column Dashboard Grid: Chart + Asset Allocation Donut */}
                <div className="grid grid-cols-12 gap-5">
                  {/* Left: Portfolio Value Chart (Col 8) */}
                  <div className="col-span-8 p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-extrabold tracking-tight text-white">Portfolio Value</h4>
                          <span className="text-[11px] text-neutral-400">Last 30 days performance</span>
                        </div>
                        <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>+227.16%</span>
                        </div>
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span>1M Performance Trajectory</span>
                      </div>
                    </div>

                    {/* Glowing Purple Upward Trajectory Chart */}
                    <div className="my-5 h-36 w-full relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,105 C80,95 160,85 240,75 C300,68 360,45 420,30 C460,20 480,12 500,8 L500,120 L0,120 Z"
                          fill="url(#purpleGlow)"
                        />
                        <path
                          d="M0,105 C80,95 160,85 240,75 C300,68 360,45 420,30 C460,20 480,12 500,8"
                          fill="none"
                          stroke="#A855F7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Dates on bottom axis */}
                      <div className="flex justify-between text-[9px] font-mono text-neutral-500 pt-2 border-t border-white/5">
                        <span>29 Sept</span>
                        <span>14 Oct</span>
                        <span>28 Oct</span>
                      </div>
                    </div>

                    {/* Chart Controls & Action Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold">All Mixes</span>
                        <span className="px-2.5 py-1 text-neutral-400">Stable Mix</span>
                        <span className="px-2.5 py-1 text-neutral-400">Growth Mix</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 px-2 py-1 rounded-lg bg-black/30">
                          <span>1W</span>
                          <span className="text-white font-bold bg-white/10 px-1.5 py-0.5 rounded">1M</span>
                          <span>3M</span>
                          <span>1Y</span>
                          <span>ALL</span>
                        </div>
                        <button type="button" className="h-8 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                        <button type="button" className="h-8 px-3 rounded-lg bg-white/10 hover:bg-white/15 font-semibold text-xs text-neutral-300 flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Withdraw</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Asset Allocation Donut (Col 4) */}
                  <div className="col-span-4 p-5 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-extrabold tracking-tight text-white">Asset Allocation</h4>
                        <span className="text-[10px] font-mono text-neutral-400">4 Assets</span>
                      </div>
                      <span className="text-[11px] text-neutral-400">Current distribution</span>
                    </div>

                    {/* Donut Chart with Holdings Center */}
                    <div className="my-3 flex items-center justify-center relative">
                      <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 100 100">
                        {/* Donut Background */}
                        <circle cx="50" cy="50" r="36" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                        {/* BTC: 65.8% (Orange #F7931A) */}
                        <circle cx="50" cy="50" r="36" fill="transparent" stroke="#F7931A" strokeWidth="14" strokeDasharray="149 226" strokeDashoffset="0" />
                        {/* ETH: 18.0% (Light Blue #627EEA) */}
                        <circle cx="50" cy="50" r="36" fill="transparent" stroke="#E2E8F0" strokeWidth="14" strokeDasharray="41 226" strokeDashoffset="-149" />
                        {/* SOL: 9.0% (Purple #9945FF) */}
                        <circle cx="50" cy="50" r="36" fill="transparent" stroke="#9945FF" strokeWidth="14" strokeDasharray="20 226" strokeDashoffset="-190" />
                        {/* USDT: 7.2% (Teal #26A17B) */}
                        <circle cx="50" cy="50" r="36" fill="transparent" stroke="#10B981" strokeWidth="14" strokeDasharray="16 226" strokeDashoffset="-210" />
                      </svg>
                      {/* Center Donut Label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">HOLDINGS</span>
                        <span className="text-sm font-extrabold font-mono text-white">₹48,435</span>
                      </div>
                    </div>

                    {/* Asset Breakdown List */}
                    <div className="space-y-1.5 text-xs font-mono divide-y divide-white/5">
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#F7931A]" />
                          <span className="font-semibold text-white">Bitcoin <span className="text-neutral-500 text-[10px]">(BTC)</span></span>
                        </div>
                        <div className="tabular-nums text-neutral-300">₹31,870 <span className="text-neutral-500">65.8%</span></div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-slate-200" />
                          <span className="font-semibold text-white">Ethereum <span className="text-neutral-500 text-[10px]">(ETH)</span></span>
                        </div>
                        <div className="tabular-nums text-neutral-300">₹8,718 <span className="text-neutral-500">18.0%</span></div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#9945FF]" />
                          <span className="font-semibold text-white">Solana <span className="text-neutral-500 text-[10px]">(SOL)</span></span>
                        </div>
                        <div className="tabular-nums text-neutral-300">₹4,359 <span className="text-neutral-500">9.0%</span></div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="font-semibold text-white">Digital USD <span className="text-neutral-500 text-[10px]">(USDT)</span></span>
                        </div>
                        <div className="tabular-nums text-neutral-300">₹3,488 <span className="text-neutral-500">7.2%</span></div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Hover Launch Pill */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 bg-black/40 backdrop-blur-xs">
                <span
                  className="rounded-full px-6 py-3 text-sm font-extrabold shadow-2xl flex items-center gap-2 transform transition-transform duration-300 group-hover:scale-105"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.primaryText,
                  }}
                >
                  <span>Launch Live Prototype</span>
                  <ExternalLink className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Ambient Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 left-1/2 -z-10 h-44 w-3/4 -translate-x-1/2 rounded-full blur-3xl opacity-25"
            style={{ backgroundColor: colors.accent }}
          />
        </div>

        {/* ── 3. MOBILE VIEWPORT: FULL IPHONE 3D HARDWARE MODEL (MATCHING HERO PHONE SIZE) ── */}
        <div className="block md:hidden mx-auto mt-10 w-[300px] min-[360px]:w-[325px] sm:w-[350px] max-w-full select-none">
          
          <div
            onClick={handleOpenApp}
            role="button"
            tabIndex={0}
            className="relative cursor-pointer group"
          >
            {/* Left Hardware Volume Buttons */}
            <div className="absolute -left-[4px] top-[105px] w-[4px] h-[38px] rounded-l-md bg-[#2F323A] border-l border-y border-white/10" />
            <div className="absolute -left-[4px] top-[155px] w-[4px] h-[38px] rounded-l-md bg-[#2F323A] border-l border-y border-white/10" />
            {/* Right Sleep/Power Button */}
            <div className="absolute -right-[4px] top-[125px] w-[4px] h-[54px] rounded-r-md bg-[#2F323A] border-r border-y border-white/10" />

            {/* Outer Titanium Phone Chassis (Sized to match Hero phone) */}
            <div
              className="relative w-full h-[600px] min-[360px]:h-[640px] sm:h-[680px] rounded-[50px] p-[8px] sm:p-[10px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.18)]"
              style={{
                background: 'linear-gradient(180deg, #383B4A 0%, #1D1F2A 50%, #11121A 100%)',
              }}
            >
              {/* Concentric Metallic Inner Rim */}
              <div className="relative w-full h-full rounded-[44px] p-[2px] bg-gradient-to-b from-white/15 via-white/5 to-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                
                {/* OLED Display Container */}
                <div className="relative w-full h-full rounded-[42px] bg-[#090A0E] flex flex-col justify-between overflow-hidden shadow-[inset_0_0_0_1px_rgba(0,0,0,0.8)] text-white">
                  
                  {/* iOS Status Bar + Dynamic Island */}
                  <div className="relative w-full h-8 px-6 pt-2 flex items-center justify-between text-[11px] font-semibold text-white/90 z-50 pointer-events-none">
                    <span className="font-semibold text-[11px]">9:41</span>
                    
                    {/* Dynamic Island Pill */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-2 h-4 w-[80px] rounded-full bg-black border border-white/5 flex items-center justify-between px-2.5 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#16181F] border border-white/10" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-2.5 fill-current" viewBox="0 0 17 12">
                        <rect x="0" y="8" width="2.5" height="4" rx="0.5" />
                        <rect x="4.5" y="5.5" width="2.5" height="6.5" rx="0.5" />
                        <rect x="9" y="3" width="2.5" height="9" rx="0.5" />
                        <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" />
                      </svg>
                      <div className="w-4 h-2 rounded-[3px] border border-white/80 p-[1px]">
                        <div className="h-full w-full bg-white rounded-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* In-App Browser URL Bar */}
                  <div className="w-full flex items-center justify-center gap-1 text-[8.5px] font-mono text-neutral-400 py-0.5 opacity-70 pointer-events-none">
                    <Lock className="w-2.5 h-2.5 text-neutral-400" />
                    <span>satmix.in/app</span>
                  </div>

                  {/* ── MOBILE DASHBOARD CONTENT (POSITIVE & LARGER FIGURE) ── */}
                  <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
                    
                    {/* Top Balance Header */}
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-400 font-mono">Total Savings</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                          +18.4% All Time
                        </span>
                      </div>

                      <div className="mt-1.5">
                        <div className="text-3xl font-extrabold font-mono tracking-tight text-white">
                          ₹48,435.14
                        </div>
                        <div className="text-xs text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>+₹248.86 today</span>
                        </div>
                      </div>
                    </div>

                    {/* Compact Interactive Area Chart */}
                    <div className="h-28 w-full relative my-2">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="mobPurpleGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,90 C50,85 100,75 150,65 C200,58 250,35 300,10 L300,100 L0,100 Z"
                          fill="url(#mobPurpleGlow)"
                        />
                        <path
                          d="M0,90 C50,85 100,75 150,65 C200,58 250,35 300,10"
                          fill="none"
                          stroke="#A855F7"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="flex justify-between text-[8px] font-mono text-neutral-500 pt-1">
                        <span>1 Oct</span>
                        <span>15 Oct</span>
                        <span>Today</span>
                      </div>
                    </div>

                    {/* 2-Column Asset Breakdown */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03]">
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F7931A]" />
                          <span>Bitcoin</span>
                        </div>
                        <div className="text-sm font-bold text-white mt-0.5">₹31,870</div>
                        <div className="text-[9px] text-emerald-400">+22.4%</div>
                      </div>

                      <div className="p-2.5 rounded-xl border border-white/10 bg-white/[0.03]">
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#627EEA]" />
                          <span>Ethereum</span>
                        </div>
                        <div className="text-sm font-bold text-white mt-0.5">₹8,718</div>
                        <div className="text-[9px] text-emerald-400">+14.2%</div>
                      </div>
                    </div>

                    {/* Launch App Prompt */}
                    <div className="pt-2">
                      <div className="w-full h-9 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md bg-emerald-400 text-[#090A0E] group-hover:opacity-95 transition-all">
                        <span>Open Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                  </div>

                  {/* Home Indicator Bar */}
                  <div className="w-20 h-1 rounded-full bg-white/30 mx-auto mb-1.5 pointer-events-none z-50 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] font-mono text-neutral-400 mt-3">
            Tap to open prototype in browser
          </p>
        </div>

      </div>
    </section>
  );
};

export default AppPreviewSection;
