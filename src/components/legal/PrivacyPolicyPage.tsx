import React from 'react';
import { ArrowLeft, ChevronRight, Lock, Building, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../marketing/Header';
import { Footer } from '../marketing/Footer';

export const PrivacyPolicyPage: React.FC = () => {
  const { colors, setViewMode } = useApp();

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
          <span className="font-bold" style={{ color: colors.accent }} aria-current="page">Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            Last Updated: August 15, 2026 · Effective Date: August 15, 2026
          </p>
          <p className="text-xs sm:text-sm leading-relaxed max-w-3xl pt-1" style={{ color: colors.textSecondary }}>
            Satmix ("we", "us", or "our") is dedicated to protecting your privacy. This policy explains how we process and safeguard your personal data when you use our website, web application, and automated micro-investing software under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and the <strong>Information Technology Act, 2000</strong>.
          </p>
        </div>

        {/* Content Card */}
        <div className="space-y-8 text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
          {/* Section 1: Custody & Technology Architecture */}
          <section className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.purpleTint, color: colors.accent }}>
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>1. Technology Architecture & Institutional Custody</h2>
            </div>
            <p>
              Satmix provides automated technology workflows for daily Rupee Cost Averaging into digital asset baskets. Digital asset holdings are safeguarded with compliant, registered institutional custodial partners. Satmix does not directly store your fiat deposits, bank passwords, or UPI PINs. All recurring fiat debits are handled directly through authorized NPCI UPI AutoPay rails via your bank.
            </p>
          </section>

          {/* Section 2: Data We Collect */}
          <section className="p-6 rounded-3xl border space-y-4" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.purpleTint, color: colors.accent }}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>2. Data We Collect (Strict Data Minimization)</h2>
            </div>
            <p>
              Under our commitment to data minimization, we collect only data strictly necessary to provide our software services:
            </p>
            <ul className="space-y-2.5 pl-4 list-disc" style={{ accentColor: colors.accent }}>
              <li>
                <strong style={{ color: colors.textPrimary }}>Account Identification:</strong> Full Name, verified 10-digit Indian Mobile Number, and Email Address.
              </li>
              <li>
                <strong style={{ color: colors.textPrimary }}>Security Credentials:</strong> Client-side cryptographic SHA-256 hash of your 4-digit security PIN. We NEVER store or transmit your raw numeric PIN.
              </li>
              <li>
                <strong style={{ color: colors.textPrimary }}>Financial Identifiers:</strong> Masked bank account identifier (last 4 digits only) and Virtual Payment Address (UPI VPA) solely for routing AutoPay mandate references and IMPS payouts.
              </li>
              <li>
                <strong style={{ color: colors.textPrimary }}>Technical & Usage Logs:</strong> IP address, browser user agent, device operating system, and anonymized interaction metrics for error tracing and security threat prevention.
              </li>
            </ul>
            <div className="p-3.5 rounded-2xl border text-xs font-semibold" style={{ backgroundColor: colors.redTint, borderColor: colors.semanticDanger, color: colors.semanticDanger }}>
              Zero Collection Guarantee: Satmix NEVER requests or stores credit/debit card numbers, CVVs, net-banking passwords, or UPI PINs.
            </div>
          </section>

          {/* Section 3: Purpose of Processing */}
          <section className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>3. Legal Basis & Purpose of Data Processing</h2>
            <p>We process your data exclusively for lawful purposes with your explicit consent:</p>
            <ul className="space-y-2 pl-4 list-disc" style={{ accentColor: colors.accent }}>
              <li>Authenticating your account session and preventing unauthorized access.</li>
              <li>Facilitating recurring daily UPI e-mandate registration with NPCI-regulated banking gateways.</li>
              <li>Calculating real-time portfolio performance, streaks, and comprehensive transaction statements.</li>
              <li>Responding to your customer support requests and notifying you of critical system updates.</li>
            </ul>
          </section>

          {/* Section 4: Data Retention & Security */}
          <section className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>4. Data Storage, Encryption & Retention</h2>
            <p>
              Your data is encrypted both in transit (TLS 1.3 with 256-bit AES encryption) and at rest. We retain account records only for as long as your account remains active or as required by applicable statutory accounting and financial recordkeeping standards. You may request permanent deletion of your account and personal data at any time.
            </p>
          </section>

          {/* Section 5: Rights of Data Principals */}
          <section className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>5. Your Rights as a Data Principal (DPDP Act 2023)</h2>
            <p>Under the DPDP Act 2023, you have the following enforceable rights:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <strong className="text-xs block" style={{ color: colors.textPrimary }}>Right to Access Information</strong>
                <span className="text-xs mt-1 block" style={{ color: colors.textSecondary }}>Request a copy of personal data processed by Satmix.</span>
              </div>
              <div className="p-3 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <strong className="text-xs block" style={{ color: colors.textPrimary }}>Right to Correction & Erasure</strong>
                <span className="text-xs mt-1 block" style={{ color: colors.textSecondary }}>Rectify inaccurate data or request complete account deletion.</span>
              </div>
              <div className="p-3 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <strong className="text-xs block" style={{ color: colors.textPrimary }}>Right to Withdraw Consent</strong>
                <span className="text-xs mt-1 block" style={{ color: colors.textSecondary }}>Withdraw consent for ongoing data processing at any time.</span>
              </div>
              <div className="p-3 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <strong className="text-xs block" style={{ color: colors.textPrimary }}>Right to Grievance Redressal</strong>
                <span className="text-xs mt-1 block" style={{ color: colors.textSecondary }}>Direct access to our dedicated Grievance Officer.</span>
              </div>
            </div>
          </section>

          {/* Section 6: Privacy Inquiries */}
          <section className="p-6 sm:p-7 rounded-3xl border space-y-4" style={{ backgroundColor: colors.cardHigh, borderColor: colors.borderAccent }}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.purpleTint, color: colors.accent }}>
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>6. Privacy Inquiries & Communications</h2>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Reach our team regarding data rights and privacy queries</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              Satmix is built with privacy-first principles. We do not sell, rent, or monetize your personal information. For any data protection questions or rights requests, you can connect directly with the team via our verified WhatsApp Community or official LinkedIn channels.
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
              onClick={() => setViewMode('terms')}
              className="inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
              style={{ color: colors.accent }}
            >
              <span>View Terms & Conditions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
