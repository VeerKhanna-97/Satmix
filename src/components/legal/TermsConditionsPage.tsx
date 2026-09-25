import React from 'react';
import { Scale, ArrowLeft, ChevronRight, AlertTriangle, ShieldCheck, Landmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Header } from '../marketing/Header';
import { Footer } from '../marketing/Footer';

export const TermsConditionsPage: React.FC = () => {
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
          <span className="font-bold" style={{ color: colors.accent }} aria-current="page">Terms & Conditions</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            Terms & Conditions of Use
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            Last Updated: August 15, 2026 · Effective Date: August 15, 2026
          </p>
          <p className="text-xs sm:text-sm leading-relaxed max-w-3xl pt-1" style={{ color: colors.textSecondary }}>
            Please read these Terms and Conditions ("Terms") carefully. By accessing or using the website, applications, or automated workflows provided by Satmix ("we", "us"), you agree to be bound by these Terms. If you do not agree, do not access or use our services.
          </p>
        </div>

        {/* Content Card */}
        <div className="space-y-8 text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
          {/* Section 1: Technology Platform & Custody Disclaimer */}
          <section className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.purpleTint, color: colors.accent }}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>1. Nature of Software: Automated Technology & Execution Platform</h2>
            </div>
            <p>
              Satmix operates strictly as a <strong>financial software and technological infrastructure layer</strong>. Satmix is <strong>NOT</strong>:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc" style={{ accentColor: colors.accent }}>
              <li>A registered investment adviser (RIA) under the Securities and Exchange Board of India (SEBI).</li>
              <li>A Portfolio Management Service (PMS), mutual fund, broker-dealer, or bank.</li>
              <li>A direct custodian of fiat deposits or banking funds; digital asset custody is facilitated via compliant institutional custodial partners.</li>
            </ul>
            <p>
              All strategies, indices, and asset weightings displayed on the platform are educational and systematic algorithmic templates. Satmix does not provide personalized investment, financial, or legal advice.
            </p>
          </section>

          {/* Section 2: Crypto Asset Risk Disclaimer */}
          <section className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: colors.redTint, borderColor: colors.semanticDanger }}>
            <div className="flex items-center gap-2.5" style={{ color: colors.semanticDanger }}>
              <AlertTriangle className="w-5 h-5" />
              <h2 className="text-lg font-bold">2. High-Risk Digital Asset Volatility Warning</h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              Cryptocurrencies, tokens, and digital assets are highly speculative, unregulated in many jurisdictions, and subject to extreme market volatility. The value of your investment may fluctuate violently, and you may lose a significant portion or the entirety of your capital. Historical compound annual growth rates (CAGR) and simulation calculators are hypothetical estimates and do not guarantee future returns.
            </p>
          </section>

          {/* Section 3: Absolute Limitation of Liability & Founder Immunity */}
          <section className="p-6 sm:p-7 rounded-3xl border space-y-4" style={{ backgroundColor: colors.cardHigh, borderColor: colors.borderAccent }}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.redTint, color: colors.semanticDanger }}>
                <Scale className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>3. Absolute Limitation of Liability & Founder Legal Immunity</h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE INDIAN LAW, IN NO EVENT SHALL <strong>SATMIX</strong>, NOR ITS FOUNDERS (INCLUDING BUT NOT LIMITED TO <strong>SHEIDEN BORGES, VEER KHANNA, AND SHASHANK JAJODIA</strong>), DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, AFFILIATES, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, REVENUE, DATA, GOODWILL, MARKET LOSSES, CRYPTO DEPRECIATION, OR DOWNTIME ARISING OUT OF OR IN CONNECTION WITH THE USE OR INABILITY TO USE THE SERVICE.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed">
              SATMIX’S TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS OF ANY KIND ARISING UNDER OR RELATED TO THESE TERMS SHALL BE CAPPED AT AND NOT EXCEED THE TOTAL FEES ACTUALLY PAID BY YOU TO SATMIX FOR USE OF THE SOFTWARE PLATFORM IN THE THIRTY (30) DAYS PRECEDING THE CLAIM, OR ₹0 (ZERO RUPEES) IF NO SOFTWARE FEES WERE PAID.
            </p>
          </section>

          {/* Section 4: User Indemnification */}
          <section className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>4. Comprehensive User Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Satmix, its founders (Sheiden Borges, Veer Khanna, Shashank Jajodia), officers, directors, contractors, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, debts, and legal expenses arising from:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-xs sm:text-sm" style={{ accentColor: colors.accent }}>
              <li>Your use of and access to the Satmix platform and automated UPI AutoPay workflows.</li>
              <li>Your violation of any provision of these Terms or any applicable law, rule, or regulation in your jurisdiction.</li>
              <li>Your failure to declare, pay, or report applicable taxes or statutory dues in your jurisdiction.</li>
              <li>Any financial loss incurred due to digital asset market fluctuations or third-party banking downtimes.</li>
            </ul>
          </section>

          {/* Section 5: UPI AutoPay Mandates & Withdrawals */}
          <section className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>5. Automated UPI AutoPay Mandates & Bank Disbursals</h2>
            <p>
              By configuring a daily micro-savings amount, you authorize Satmix to initiate recurring electronic UPI AutoPay debits through your selected bank and UPI gateway. You acknowledge that:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-xs sm:text-sm" style={{ accentColor: colors.accent }}>
              <li>You may pause, modify, or cancel your UPI e-mandate at any time through the application with immediate effect.</li>
              <li>Withdrawals are processed via standard NPCI IMPS/NEFT banking rails into your verified bank account without exit load penalties.</li>
              <li>Satmix is not responsible for delays caused by inter-bank settlement failures, NPCI server maintenance, or incorrect user VPAs.</li>
            </ul>
          </section>

          {/* Section 6: Tax & Regulatory Governance */}
          <section className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>6. Regulatory & Tax Governance</h2>
            <p>
              Users remain solely responsible for understanding and fulfilling any applicable tax reporting and regulatory filing obligations in their jurisdiction. Satmix provides automated portfolio tracking and statement generation tools for informational convenience only.
            </p>
          </section>

          {/* Section 7: Governing Law & Bengaluru Arbitration */}
          <section className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.purpleTint, color: colors.accent }}>
                <Landmark className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>7. Governing Law & Exclusive Jurisdiction (Bengaluru)</h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any dispute, controversy, or claim arising out of or relating to these Terms shall be resolved exclusively through final and binding arbitration in accordance with the <strong>Arbitration and Conciliation Act, 1996</strong>.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed">
              The seat and venue of arbitration shall be <strong>Bengaluru, Karnataka, India</strong>. The arbitration shall be conducted in English by a sole arbitrator appointed mutually by the parties. The courts in Bengaluru, Karnataka shall have exclusive jurisdiction over any ancillary legal proceedings.
            </p>
          </section>

          {/* Section 8: Support & Community Contact */}
          <section className="p-6 rounded-3xl border space-y-3" style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}>
            <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>8. Inquiries & Community Support</h2>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
              For questions regarding these Terms or the platform, users can reach out directly via our verified WhatsApp Community and official LinkedIn channels.
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
