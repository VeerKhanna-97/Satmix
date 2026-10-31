import React from 'react';
import {
  ArrowRight,
  Home,
  Shield,
  HelpCircle,
  ChevronRight,
  Calculator,
  Compass,
  Terminal,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../marketing/Header';
import { Footer } from '../marketing/Footer';
import { SpotlightCard, FadeIn } from '../ui';

export const NotFoundPage: React.FC = () => {
  const { colors, themeMode, setViewMode, setAuthSubView, isAuthenticated } = useApp();

  const handleLaunchApp = () => {
    if (isAuthenticated) {
      setViewMode('app');
    } else {
      setAuthSubView('login');
      setViewMode('auth');
    }
  };

  const handleStartQuiz = () => {
    setAuthSubView('quiz');
    setViewMode('auth');
  };

  const handleScrollToSection = (sectionId: string) => {
    setViewMode('marketing');
    window.setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans selection:bg-white selection:text-black transition-colors"
      style={{ backgroundColor: colors.bg, color: colors.textPrimary }}
    >
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full flex flex-col justify-center relative">
        {/* Ambient Radial Mesh Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-25"
          style={{
            background: `radial-gradient(circle, ${colors.accent} 0%, rgba(93, 23, 235, 0.35) 45%, transparent 75%)`,
          }}
        />

        {/* Breadcrumb Navigation */}
        <FadeIn delay={0.04} direction="down">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-mono font-medium">
            <button
              type="button"
              onClick={() => setViewMode('marketing')}
              className="hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer"
              style={{ color: colors.textSecondary }}
            >
              <span>Satmix</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 opacity-40 text-neutral-400" />
            <span className="text-neutral-400">Status</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-40 text-neutral-400" />
            <span
              className="font-bold px-1.5 py-0.5 rounded border text-[11px] [font-variant-numeric:tabular-nums]"
              style={{
                backgroundColor: colors.redTint || 'rgba(239, 68, 68, 0.1)',
                borderColor: 'rgba(239, 68, 68, 0.25)',
                color: colors.semanticDanger || '#EF4444',
              }}
              aria-current="page"
            >
              404 // ROUTE_NOT_FOUND
            </span>
          </nav>
        </FadeIn>

        {/* Main 404 Terminal Card */}
        <FadeIn delay={0.1} direction="up">
          <SpotlightCard
            spotlightColor={colors.accentTint}
            className="rounded-[32px] p-6 sm:p-10 lg:p-12 border shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85)] text-center space-y-8 backdrop-blur-xl relative overflow-hidden"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            }}
          >
            {/* Top Security Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LEDGER HEALTHY • CAPITAL UNAFFECTED</span>
            </div>

            {/* Central Typography & Metric Header */}
            <div className="space-y-3">
              <div className="relative inline-block select-none">
                <span
                  className="block text-7xl sm:text-8xl lg:text-9xl font-black font-mono tracking-tighter leading-none [font-variant-numeric:tabular-nums]"
                  style={{
                    background:
                      themeMode === 'dark'
                        ? 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 50%, #3F3F46 100%)'
                        : 'linear-gradient(180deg, #18181B 0%, #52525B 50%, #A1A1AA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  404
                </span>
                <span
                  className="absolute -top-1 -right-3 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 uppercase tracking-widest"
                >
                  Unindexed
                </span>
              </div>

              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display"
                style={{ color: colors.textPrimary }}
              >
                This route does not exist on the ledger.
              </h1>

              <p
                className="text-sm sm:text-base max-w-lg mx-auto leading-relaxed"
                style={{ color: colors.textSecondary }}
              >
                The page you requested has been moved, reallocated, or was never minted. Your daily micro-saving mandates and custody balances remain completely secure.
              </p>
            </div>

            {/* Diagnostic Code Snippet */}
            <div
              className="max-w-md mx-auto p-4 rounded-2xl border text-left font-mono text-[11px] leading-relaxed select-all"
              style={{
                backgroundColor: themeMode === 'dark' ? '#090B0E' : '#F1F5F9',
                borderColor: colors.borderDim,
                color: colors.textSecondary,
              }}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Routing Diagnostics
                </span>
                <span>Satmix Core v5.0</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">STATUS:</span>
                  <span className="text-rose-400">ERR_HTTP_404_NOT_FOUND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">RESOLVER:</span>
                  <span className="text-white">satmix.in/edge-router</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">PORTFOLIO:</span>
                  <span className="text-emerald-400">100% SECURE (NO IMPACT)</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setViewMode('marketing')}
                className="w-full sm:w-auto h-12 px-7 rounded-xl font-semibold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(93,23,235,0.25)] flex items-center justify-center gap-2 transition-[transform,background-color] duration-150 ease-out active:scale-[0.96] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </button>

              <button
                type="button"
                onClick={handleLaunchApp}
                className="w-full sm:w-auto h-12 px-6 rounded-xl font-semibold text-sm border transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/5 active:scale-[0.96] flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                  color: colors.textPrimary,
                }}
              >
                <span>Launch Web App</span>
                <ArrowRight className="w-4 h-4" style={{ color: colors.accent }} />
              </button>
            </div>

            {/* Direct Routing Matrix Grid */}
            <div className="pt-8 border-t text-left" style={{ borderColor: colors.borderDim }}>
              <span
                className="text-xs font-bold uppercase tracking-wider block mb-3.5 text-center font-mono"
                style={{ color: colors.textTertiary }}
              >
                Verified Destinations
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Risk Assessment Quiz */}
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  className="p-3.5 rounded-xl border text-left flex items-start gap-3 hover:border-emerald-500/30 transition-colors group cursor-pointer active:scale-[0.98]"
                  style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      2-Minute Quiz
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                      Assess risk tolerance & pick your starting basket
                    </div>
                  </div>
                </button>

                {/* 2. Compound Calculator */}
                <button
                  type="button"
                  onClick={() => handleScrollToSection('calc-section')}
                  className="p-3.5 rounded-xl border text-left flex items-start gap-3 hover:border-purple-500/30 transition-colors group cursor-pointer active:scale-[0.98]"
                  style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                      Growth Calculator
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                      Model 1-year daily savings from ₹10/day
                    </div>
                  </div>
                </button>

                {/* 3. Security & Custody FAQ */}
                <button
                  type="button"
                  onClick={() => handleScrollToSection('faq-section')}
                  className="p-3.5 rounded-xl border text-left flex items-start gap-3 hover:border-amber-500/30 transition-colors group cursor-pointer active:scale-[0.98]"
                  style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Custody & FAQs
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                      Non-custodial execution & UPI mandate safety
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </SpotlightCard>
        </FadeIn>
      </main>

      <Footer />
    </div>
  );
};

export default NotFoundPage;
