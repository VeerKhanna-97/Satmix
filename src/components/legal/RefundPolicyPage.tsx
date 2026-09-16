import React from 'react';
import { ArrowLeft, ChevronRight, RefreshCw, Clock, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../marketing/Header';
import { Footer } from '../marketing/Footer';

export const RefundPolicyPage: React.FC = () => {
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
          <span className="font-bold" style={{ color: colors.accent }} aria-current="page">Refund Policy</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[11px] font-semibold font-mono tracking-wider border" style={{ backgroundColor: colors.accentTint, borderColor: colors.borderAccent, color: colors.accent }}>
            <RefreshCw className="w-3.5 h-3.5" />
            <span>ZERO LOCK-IN POLICY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            Last Updated: August 15, 2026 · Effective Date: August 15, 2026
          </p>
          <p className="text-xs sm:text-sm leading-relaxed max-w-3xl pt-1" style={{ color: colors.textSecondary }}>
            At Satmix Technologies ("Satmix"), we are committed to complete financial transparency and liquidity. Because digital asset investments represent real-time market purchases, this policy clarifies our instant withdrawal rights, cancellation procedures for automated UPI mandates, and fee reversal protocols.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
          {/* Section 1: Zero Lock-in & Instant Bank Withdrawal */}
          <section className="p-6 rounded-2xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.purpleTint, color: colors.accent }}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>1. Zero Lock-in Period & 24/7 Instant Liquidity</h2>
            </div>
            <p>
              Unlike traditional lock-in savings instruments or fixed deposits, Satmix does not impose any holding period. You have the unconditional right to liquidate your crypto basket holdings and withdraw funds to your verified Indian bank account at any time, 24 hours a day, 7 days a week.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <strong className="text-xs block" style={{ color: colors.textPrimary }}>Instant IMPS Disbursals</strong>
                <span className="text-xs mt-1 block" style={{ color: colors.textSecondary }}>Payouts are disbursed electronically via NPCI IMPS rails into your linked bank account.</span>
              </div>
              <div className="p-3.5 rounded-xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <strong className="text-xs block" style={{ color: colors.textPrimary }}>0% Exit Load</strong>
                <span className="text-xs mt-1 block" style={{ color: colors.textSecondary }}>Satmix charges zero platform penalty or exit load fees when you withdraw capital.</span>
              </div>
            </div>
          </section>

          {/* Section 2: UPI AutoPay Mandate Cancellation */}
          <section className="p-6 rounded-2xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.purpleTint, color: colors.accent }}>
                <RefreshCw className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>2. Daily UPI AutoPay Mandate Cancellation & Pauses</h2>
            </div>
            <p>
              Your daily micro-investment is powered by an NPCI-approved UPI AutoPay e-mandate. You have total autonomy to control this mandate:
            </p>
            <ul className="space-y-2 pl-4 list-disc" style={{ accentColor: colors.accent }}>
              <li>
                <strong style={{ color: colors.textPrimary }}>Instant Pause / Revocation:</strong> You can pause or cancel your daily recurring mandate with one tap in the Satmix Web App (Profile → Mandate Settings).
              </li>
              <li>
                <strong style={{ color: colors.textPrimary }}>Bank-Level Revocation:</strong> You may also revoke the mandate directly through your UPI application (Google Pay, PhonePe, Paytm, BHIM) or net banking portal.
              </li>
              <li>
                <strong style={{ color: colors.textPrimary }}>No Cancellation Penalties:</strong> Pausing or revoking an active mandate carries zero penalty fees from Satmix.
              </li>
            </ul>
          </section>

          {/* Section 3: Tax Deductions on Liquidation (Sec 194S) */}
          <section className="p-6 rounded-2xl border space-y-3" style={{ backgroundColor: colors.redTint, borderColor: colors.semanticDanger }}>
            <div className="flex items-center gap-2.5" style={{ color: colors.semanticDanger }}>
              <AlertCircle className="w-5 h-5" />
              <h2 className="text-lg font-bold">3. Statutory Tax Deductions (Section 194S 1% TDS)</h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              Under Indian Income Tax Law (Section 194S), a mandatory 1% Tax Deducted at Source (TDS) is deducted on the gross liquidation value of Virtual Digital Assets. Because this amount is deposited directly with the Government of India and credited to your Form 26AS / PAN tax ledger, <strong>TDS amounts cannot be refunded or reversed by Satmix</strong>. You can claim credit or refunds for this TDS when filing your annual Income Tax Return (ITR).
            </p>
          </section>

          {/* Section 4: Failed Transactions & Auto-Reversals */}
          <section className="p-6 rounded-2xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>4. Failed Debits & Automatic Reversal TAT</h2>
            <p>
              In the rare event that funds are debited from your bank account but an inter-bank network error prevents unit allocation:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc" style={{ accentColor: colors.accent }}>
              <li>The transaction is automatically identified by our reconciliation ledger within 2 hours.</li>
              <li>If units cannot be allocated at the exact market rate, the full debited amount is reversed to your source bank account within standard banking turnaround time (usually 24 to 72 business hours as per NPCI guidelines).</li>
            </ul>
          </section>

          {/* Section 5: Support & Grievance Contact */}
          <section className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: colors.cardHigh, borderColor: colors.borderAccent }}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.purpleTint, color: colors.accent }}>
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>5. Payout Support & Grievance Redressal</h2>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Contact our dedicated support team for withdrawal inquiries</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border space-y-2 text-xs font-mono" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div><strong style={{ color: colors.textPrimary }}>Entity:</strong> Satmix Technologies</div>
              <div><strong style={{ color: colors.textPrimary }}>Address:</strong> Bengaluru, Karnataka 560029, India</div>
              <div><strong style={{ color: colors.textPrimary }}>Payout Support:</strong> <a href="mailto:support@satmix.app" className="hover:underline font-medium" style={{ color: colors.accent }}>support@satmix.app</a> (24 business hours response guarantee)</div>
              <div><strong style={{ color: colors.textPrimary }}>Grievance Escalation:</strong> <a href="mailto:grievance@satmix.app" className="hover:underline font-medium" style={{ color: colors.accent }}>grievance@satmix.app</a></div>
            </div>
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
              <span>View Terms of Use</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
