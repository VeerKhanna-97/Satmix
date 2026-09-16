import React, { useEffect } from 'react';
import { CheckCircle2, ArrowRight, Sparkles, MessageSquare, ChevronRight, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../marketing/Header';
import { Footer } from '../marketing/Footer';
import { SpotlightCard, Magnet } from '../ui';

export const ThankYouPage: React.FC = () => {
  const { colors, setViewMode, setAuthSubView, triggerConfetti } = useApp();

  useEffect(() => {
    triggerConfetti();
  }, [triggerConfetti]);

  const handleLaunchApp = () => {
    setAuthSubView('signup');
    setViewMode('auth');
  };

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
          <span className="opacity-80">Early Access</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="font-bold" style={{ color: colors.accent }} aria-current="page">Confirmation</span>
        </nav>

        {/* Thank You Card */}
        <SpotlightCard
          spotlightColor={colors.purpleTint}
          className="rounded-3xl p-8 sm:p-12 border shadow-2xl text-center space-y-7 backdrop-blur-xl animate-fade-in"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          {/* Success Badge */}
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto border shadow-xl"
            style={{
              backgroundColor: colors.purpleTint,
              borderColor: colors.borderPurple,
              color: colors.accent,
            }}
          >
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold font-mono tracking-wider border"
              style={{
                backgroundColor: colors.accentTint,
                borderColor: colors.borderAccent,
                color: colors.accent,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>VIP PRIORITY ACCESS RESERVED</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
              You're on the Satmix Early Access List!
            </h1>
            <p className="text-sm sm:text-base max-w-lg mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
              Thank you for taking the first step toward stress-free automated crypto wealth. We've recorded your details in our verified early access cohort.
            </p>
          </div>

          {/* Response Promise Callout */}
          <div
            className="p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm text-left flex items-start gap-3.5 max-w-lg mx-auto"
            style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
          >
            <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.accent }} />
            <div className="space-y-1">
              <strong className="block font-semibold" style={{ color: colors.textPrimary }}>Join Our Early Access Community</strong>
              <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                Connect directly with the founders and fellow early users in our WhatsApp Community to get updates, preview upcoming features, and share feedback.
              </p>
            </div>
          </div>

          {/* Direct CTA: Launch Interactive App */}
          <div className="space-y-3 max-w-md mx-auto pt-2">
            <Magnet strength={12} className="w-full">
              <button
                onClick={handleLaunchApp}
                className="w-full py-4 rounded-2xl font-bold text-sm shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <span>Launch Interactive Web App Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Magnet>

            <button
              onClick={() => setViewMode('marketing')}
              className="text-xs font-semibold hover:opacity-80 transition-opacity block mx-auto pt-2"
              style={{ color: colors.textTertiary }}
            >
              ← Return to Main Homepage
            </button>
          </div>

          {/* Community Links */}
          <div className="pt-6 border-t flex flex-wrap items-center justify-center gap-4 text-xs font-semibold" style={{ borderColor: colors.borderDim }}>
            <span style={{ color: colors.textTertiary }}>Join our community:</span>
            <a
              href="https://chat.whatsapp.com/G6EDcuMTq9oBHv6uHYfqJo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:underline font-medium"
              style={{ color: colors.accent }}
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp VIP
            </a>
            <span className="opacity-40">•</span>
            <a
              href="https://www.linkedin.com/company/satmix-app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium"
              style={{ color: colors.accent }}
            >
              LinkedIn
            </a>
            <span className="opacity-40">•</span>
            <a
              href="https://www.instagram.com/satmix.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium"
              style={{ color: colors.accent }}
            >
              Instagram
            </a>
          </div>
        </SpotlightCard>
      </main>

      <Footer />
    </div>
  );
};
