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
import { Footer } from './components/marketing/Footer';
import { FloatingActionDock } from './components/marketing/FloatingActionDock';
import { AuthModal } from './components/auth/AuthModal';
import { RiskQuiz } from './components/auth/RiskQuiz';
import { AppShell } from './components/app/AppShell';
import { PrivacyPolicyPage } from './components/legal/PrivacyPolicyPage';
import { TermsConditionsPage } from './components/legal/TermsConditionsPage';
import { RefundPolicyPage } from './components/legal/RefundPolicyPage';
import { CookiePolicyPage } from './components/legal/CookiePolicyPage';
import { ThankYouPage } from './components/legal/ThankYouPage';
import { NotFoundPage } from './components/legal/NotFoundPage';
import { CookieBanner } from './components/common/CookieBanner';
import { TesterBar } from './components/tester/TesterBar';
import { CustomCursor, FloatingScrollbar } from './components/ui';

export function AppContent() {
  const { viewMode, authSubView, colors } = useApp();

  return (
    <div className="min-h-screen font-sans selection:bg-white selection:text-black transition-colors relative" style={{ backgroundColor: colors.bg, color: colors.textPrimary }}>
      {/* Interactive Custom Bitcoin Cursor (Desktop/Laptop with fine pointer) */}
      <CustomCursor />
      {/* Futuristic Floating Bitcoin Scrollbar (Zero Track Background) */}
      <FloatingScrollbar />
      {/* 1. MARKETING VIEW */}
      {viewMode === 'marketing' && (
        <>
          <Ticker />
          <Header />
          <main>
            <Hero />
            <TrustStrip />
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

      {/* 2. AUTHENTICATION / QUIZ VIEW */}
      {viewMode === 'auth' && (
        <>
          {authSubView === 'quiz' ? <RiskQuiz /> : <AuthModal />}
        </>
      )}

      {/* 3. AUTHENTICATED WEB APP VIEW (satmix mobile app clone) */}
      {viewMode === 'app' && <AppShell />}

      {/* 4. PRIVACY POLICY PAGE (DPDP ACT 2023 COMPLIANT) */}
      {viewMode === 'privacy' && <PrivacyPolicyPage />}

      {/* 5. TERMS & CONDITIONS PAGE (LEGAL IMMUNITY & JURISDICTION) */}
      {viewMode === 'terms' && <TermsConditionsPage />}

      {/* 6. REFUND & CANCELLATION POLICY PAGE */}
      {viewMode === 'refund' && <RefundPolicyPage />}

      {/* 7. COOKIE POLICY & PREFERENCES PAGE */}
      {viewMode === 'cookies' && <CookiePolicyPage />}

      {/* 8. THANK YOU / CONFIRMATION PAGE */}
      {viewMode === 'thank-you' && <ThankYouPage />}

      {/* 9. CUSTOM 404 ERROR PAGE */}
      {viewMode === '404' && <NotFoundPage />}

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
