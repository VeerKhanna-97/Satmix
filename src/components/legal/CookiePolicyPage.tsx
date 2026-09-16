import React from 'react';
import { ArrowLeft, ChevronRight, Cookie, ShieldCheck, Lock, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../marketing/Header';
import { Footer } from '../marketing/Footer';

export const CookiePolicyPage: React.FC = () => {
  const { colors, setViewMode, cookieConsent, setCookieConsent } = useApp();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.bg, color: colors.textPrimary }}>
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold" style={{ color: colors.textTertiary }}>
          <button
            onClick={() => setViewMode('marketing')}
            className="hover:opacity-80 transition-opacity flex items-center gap-1"
            style={{ color: colors.textSecondary }}
          >
            <span>Home</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="opacity-80">Legal</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
          <span className="font-bold" style={{ color: colors.accent }} aria-current="page">Cookie Policy</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[11px] font-semibold font-mono tracking-wider border" style={{ backgroundColor: colors.accentTint, borderColor: colors.borderAccent, color: colors.accent }}>
            <Cookie className="w-3.5 h-3.5" />
            <span>PRIVACY FIRST COOKIE GOVERNANCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            Cookie Policy & Consent Settings
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            Last Updated: August 15, 2026 · Effective Date: August 15, 2026
          </p>
          <p className="text-xs sm:text-sm leading-relaxed max-w-3xl pt-1" style={{ color: colors.textSecondary }}>
            This Cookie Policy explains how Satmix ("we", "us") utilizes cookies, local storage objects, and session technologies on our website and web application in compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>.
          </p>
        </div>

        {/* Interactive Consent Settings Panel */}
        <div className="p-6 sm:p-7 rounded-2xl border mb-10 space-y-5" style={{ backgroundColor: colors.cardHigh, borderColor: colors.borderAccent }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Your Live Cookie Preferences</h2>
              <p className="text-xs" style={{ color: colors.textSecondary }}>Current status: {cookieConsent === 'all' ? 'All Cookies Accepted' : cookieConsent === 'essential' ? 'Essential Cookies Only' : 'Choice Pending'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCookieConsent('essential')}
                className="px-4 py-2 rounded-xl text-xs font-bold border transition-all"
                style={{
                  backgroundColor: cookieConsent === 'essential' ? colors.purpleTint : colors.surface,
                  color: cookieConsent === 'essential' ? colors.accent : colors.textSecondary,
                  borderColor: cookieConsent === 'essential' ? colors.accent : colors.cardBorder,
                }}
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={() => setCookieConsent('all')}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                style={{
                  backgroundColor: cookieConsent === 'all' ? colors.primary : colors.surface,
                  color: cookieConsent === 'all' ? colors.primaryText : colors.textPrimary,
                  border: `1px solid ${cookieConsent === 'all' ? 'transparent' : colors.cardBorder}`,
                }}
              >
                Accept All
              </button>
            </div>
          </div>
        </div>

        {/* Policy Details */}
        <div className="space-y-8 text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
          {/* Section 1: What Are Cookies */}
          <section className="p-6 rounded-2xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>1. What Technologies We Use</h2>
            <p>
              We use lightweight, privacy-respecting browser local storage and first-party session cookies. These enable secure session logins, store your dark/light theme choice, maintain your portfolio calculation state, and keep you authenticated without repeatedly prompting for PINs on the same device.
            </p>
          </section>

          {/* Section 2: Cookie Classification */}
          <section className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>2. Categorization of Storage & Cookies</h2>

            <div className="space-y-3">
              {/* Category A: Essential */}
              <div className="p-4 rounded-xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" style={{ color: colors.accent }} />
                    <strong className="text-xs" style={{ color: colors.textPrimary }}>A. Strictly Necessary / Essential (Always Active)</strong>
                  </div>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                    style={{ backgroundColor: colors.purpleTint, color: colors.accent, borderColor: colors.borderPurple }}
                  >
                    REQUIRED
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                  Required for core platform operations: encrypted PIN session hashes, UPI mandate status, and theme preferences. Cannot be disabled without breaking functionality.
                </p>
              </div>

              {/* Category B: Performance & Error Telemetry */}
              <div className="p-4 rounded-xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4" style={{ color: colors.accent }} />
                    <strong className="text-xs" style={{ color: colors.textPrimary }}>B. Functional & Performance Telemetry (Optional)</strong>
                  </div>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                    style={{ backgroundColor: colors.purpleTint, color: colors.accent, borderColor: colors.borderPurple }}
                  >
                    USER CONTROLLED
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                  Measures page load speeds, API error rates, and calculator usage patterns in an aggregate, anonymized format without tracking across third-party websites.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Zero Third-Party Advertising Guarantee */}
          <section className="p-6 rounded-2xl border space-y-3" style={{ backgroundColor: colors.purpleTint, borderColor: colors.borderPurple }}>
            <div className="flex items-center gap-2.5" style={{ color: colors.accent }}>
              <ShieldCheck className="w-5 h-5" />
              <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>3. Zero Advertising Trackers Guarantee</h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              Satmix strictly guarantees that <strong>we do not use behavioral advertising trackers, data broker pixels (e.g. Meta Pixel, TikTok Pixel), or commercial ad networks</strong>. Your browsing and investing activity is never sold, leased, or transmitted to third-party marketing companies.
            </p>
          </section>

          {/* Section 4: Contact Details */}
          <section className="p-6 rounded-2xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>4. Questions & Policy Inquiries</h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              For questions regarding our privacy practices or cookie policies, reach out directly through our verified WhatsApp Community and official LinkedIn channels.
            </p>
          </section>

          {/* Action Back to Top / Home */}
          <div className="pt-6 flex items-center justify-between">
            <button
              onClick={() => setViewMode('marketing')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs border hover:opacity-80 transition-opacity"
              style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <button
              onClick={() => setViewMode('privacy')}
              className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
              style={{ color: colors.accent }}
            >
              <span>View Privacy Policy</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
