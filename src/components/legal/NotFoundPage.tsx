import React from 'react';
import { ArrowRight, Home, Shield, FileText, HelpCircle, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../marketing/Header';
import { Footer } from '../marketing/Footer';
import { SpotlightCard } from '../ui';

export const NotFoundPage: React.FC = () => {
  const { colors, setViewMode, setAuthSubView } = useApp();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.bg, color: colors.textPrimary }}>
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full flex flex-col justify-center">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-semibold" style={{ color: colors.textTertiary }}>
          <button
            onClick={() => setViewMode('marketing')}
            className="hover:opacity-80 transition-opacity flex items-center gap-1"
            style={{ color: colors.textSecondary }}
          >
            <span>Home</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="opacity-80">Error</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="font-bold" style={{ color: colors.semanticDanger }} aria-current="page">404 Not Found</span>
        </nav>

        {/* 404 Container Card */}
        <SpotlightCard
          spotlightColor={colors.purpleTint}
          className="rounded-3xl p-8 sm:p-12 border shadow-2xl text-center space-y-7 backdrop-blur-xl animate-fade-in"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          {/* 404 Glyph */}
          <div className="space-y-2">
            <span
              className="inline-block text-6xl sm:text-7xl font-extrabold font-mono tracking-tight"
              style={{ color: colors.accent }}
            >
              404
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
              Page Not Found
            </h1>
            <p className="text-sm sm:text-base max-w-md mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
              The page or resource you requested doesn't exist, was moved, or requires different access permissions.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
            <button
              onClick={() => setViewMode('marketing')}
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              style={{ backgroundColor: colors.primary, color: colors.primaryText }}
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </button>

            <button
              onClick={() => {
                setAuthSubView('signup');
                setViewMode('auth');
              }}
              className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-xs border transition-all hover:bg-white/5 active:scale-[0.98] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
            >
              <span>Launch Web App</span>
              <ArrowRight className="w-4 h-4" style={{ color: colors.accent }} />
            </button>
          </div>

          {/* Quick Helpful Links Grid */}
          <div className="pt-6 border-t text-left" style={{ borderColor: colors.borderDim }}>
            <span className="text-xs font-bold uppercase tracking-wider block mb-3 text-center" style={{ color: colors.textTertiary }}>
              Helpful Destinations
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => setViewMode('privacy')}
                className="p-3 rounded-xl border text-left flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <Shield className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent }} />
                <div>
                  <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>Privacy Policy</div>
                  <div className="text-[10px]" style={{ color: colors.textTertiary }}>DPDP Act 2023</div>
                </div>
              </button>

              <button
                onClick={() => setViewMode('terms')}
                className="p-3 rounded-xl border text-left flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <FileText className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent }} />
                <div>
                  <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>Terms of Use</div>
                  <div className="text-[10px]" style={{ color: colors.textTertiary }}>Legal immunity & rules</div>
                </div>
              </button>

              <a
                href="/#faq-section"
                onClick={() => setViewMode('marketing')}
                className="p-3 rounded-xl border text-left flex items-center gap-2.5 hover:opacity-80 transition-opacity no-underline block"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <HelpCircle className="w-4 h-4 flex-shrink-0" style={{ color: colors.semanticWarning }} />
                <div>
                  <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>FAQ & Guides</div>
                  <div className="text-[10px]" style={{ color: colors.textTertiary }}>UPI AutoPay answers</div>
                </div>
              </a>
            </div>
          </div>
        </SpotlightCard>
      </main>

      <Footer />
    </div>
  );
};
