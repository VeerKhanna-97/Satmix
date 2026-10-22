import React from 'react';
import { useApp } from './context/AppContext';
import { Ticker } from './components/marketing/Ticker';
import { Header } from './components/marketing/Header';
import { Hero } from './components/marketing/Hero';
import { TrustStrip } from './components/marketing/TrustStrip';
import { StepsSection } from './components/marketing/StepsSection';
import { CalculatorSection } from './components/marketing/CalculatorSection';
import { BasketsSection } from './components/marketing/BasketsSection';
import { AboutSection } from './components/marketing/AboutSection';
import { FaqSection } from './components/marketing/FaqSection';
import { WaitlistSection } from './components/marketing/WaitlistSection';
import { Footer } from './components/marketing/Footer';
import { FloatingActionDock } from './components/marketing/FloatingActionDock';
import { CookieBanner } from './components/common/CookieBanner';
import { TesterBar } from './components/tester/TesterBar';

// Lazy-loaded dynamic code-split routes (reduces initial marketing bundle payload)
const AuthModal = React.lazy(() => import('./components/auth/AuthModal').then(m => ({ default: m.AuthModal })));
const RiskQuiz = React.lazy(() => import('./components/auth/RiskQuiz').then(m => ({ default: m.RiskQuiz })));
const AppShell = React.lazy(() => import('./components/app/AppShell').then(m => ({ default: m.AppShell })));
const PrivacyPolicyPage = React.lazy(() => import('./components/legal/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsConditionsPage = React.lazy(() => import('./components/legal/TermsConditionsPage').then(m => ({ default: m.TermsConditionsPage })));
const RefundPolicyPage = React.lazy(() => import('./components/legal/RefundPolicyPage').then(m => ({ default: m.RefundPolicyPage })));
const CookiePolicyPage = React.lazy(() => import('./components/legal/CookiePolicyPage').then(m => ({ default: m.CookiePolicyPage })));
const UnsubscribePage = React.lazy(() => import('./components/legal/UnsubscribePage').then(m => ({ default: m.UnsubscribePage })));
const ThankYouPage = React.lazy(() => import('./components/legal/ThankYouPage').then(m => ({ default: m.ThankYouPage })));
const NotFoundPage = React.lazy(() => import('./components/legal/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export function AppContent() {
  const { viewMode, authSubView, colors } = useApp();

  return (
    <div className="min-h-screen font-sans selection:bg-white selection:text-black transition-colors relative" style={{ backgroundColor: colors.bg, color: colors.textPrimary }}>
      {/* View Container with Smooth Page Transition */}
      <div key={viewMode} className="animate-fade-in">
        {/* 1. MARKETING VIEW */}
        {viewMode === 'marketing' && (
          <>
            <Ticker />
            <Header />
            <main>
              <Hero />
              <TrustStrip />
              <WaitlistSection />
              <StepsSection />
              <CalculatorSection />
              <BasketsSection />
              <AboutSection />
              <FaqSection />
            </main>
            <Footer />
            <FloatingActionDock />
          </>
        )}

        {/* 2. AUTHENTICATION / APP / LEGAL VIEWS (CODE-SPLIT DYNAMIC CHUNKS) */}
        {viewMode !== 'marketing' && (
          <React.Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center font-mono text-xs" style={{ color: colors.textSecondary }}>
                Loading Satmix...
              </div>
            }
          >
            {/* 2. AUTHENTICATION / QUIZ VIEW */}
            {viewMode === 'auth' && (
              <>
                {authSubView === 'quiz' ? <RiskQuiz /> : <AuthModal />}
              </>
            )}

            {/* 3. AUTHENTICATED WEB APP VIEW (satmix mobile app clone) */}
            {viewMode === 'app' && <AppShell />}

            {/* 4. PRIVACY POLICY PAGE (DPDP ACT 2023) */}
            {viewMode === 'privacy' && <PrivacyPolicyPage />}

            {/* 5. TERMS & CONDITIONS PAGE */}
            {viewMode === 'terms' && <TermsConditionsPage />}

            {/* 6. REFUND & CANCELLATION POLICY PAGE */}
            {viewMode === 'refund' && <RefundPolicyPage />}

            {/* 7. COOKIE POLICY & PREFERENCES PAGE */}
            {viewMode === 'cookies' && <CookiePolicyPage />}

            {/* 8. EMAIL UNSUBSCRIBE & PREFERENCES (DPDP ACT 2023) */}
            {viewMode === 'unsubscribe' && <UnsubscribePage />}

            {/* 9. THANK YOU / CONFIRMATION PAGE */}
            {viewMode === 'thank-you' && <ThankYouPage />}

            {/* 10. CUSTOM 404 ERROR PAGE */}
            {viewMode === '404' && <NotFoundPage />}
          </React.Suspense>
        )}
      </div>

      {/* Floating Feedback / Reviews (renders strictly inside Web App) */}
      <TesterBar />

      {/* Global Cookie Consent Banner (DPDP Act 2023 compliant) */}
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
