import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const Footer: React.FC = () => {
  const { colors, setViewMode, setAuthSubView } = useApp();

  return (
    <footer className="border-t pt-16 pb-16" style={{ backgroundColor: colors.bg, borderColor: colors.borderDim }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b" style={{ borderColor: colors.borderDim }}>
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl overflow-hidden border flex items-center justify-center" style={{ borderColor: colors.borderDim }}>
              <img src="/assets/images/satmix-logo.jpg" alt="Satmix Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight" style={{ color: colors.primary }}>
                Satmix
              </span>
              <p className="text-xs" style={{ color: colors.textSecondary }}>Systematic Crypto Auto-Invest from ₹10/day</p>
            </div>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/satmix.app?igsh=MW03NzVmdXM5emJsZA=="
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border hover:opacity-80 transition-opacity"
              style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>

            <a
              href="https://www.linkedin.com/company/satmix-app/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border hover:opacity-80 transition-opacity"
              style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
              aria-label="LinkedIn"
            >
              <LinkedinIcon />
            </a>

            <a
              href="https://chat.whatsapp.com/G6EDcuMTq9oBHv6uHYfqJo"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border hover:opacity-80 transition-opacity"
              style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
              aria-label="WhatsApp Community"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Business Entity, Support Promise & Grievance Info */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b text-xs" style={{ borderColor: colors.borderDim }}>
          <div>
            <span className="font-bold block mb-1" style={{ color: colors.textPrimary }}>Corporate Entity & Architecture</span>
            <p className="leading-relaxed" style={{ color: colors.textSecondary }}>
              Satmix Technologies<br />
              Bengaluru, Karnataka 560029, India<br />
              Non-Custodial DCA Engine • CoinDCX API Routing
            </p>
          </div>

          <div>
            <span className="font-bold block mb-1" style={{ color: colors.textPrimary }}>Support & Response Guarantee</span>
            <p className="leading-relaxed" style={{ color: colors.textSecondary }}>
              Inquiries addressed within <strong style={{ color: colors.textPrimary }}>24 business hours</strong>.<br />
              Direct Support: <a href="mailto:support@satmix.app" className="hover:underline font-mono font-medium" style={{ color: colors.accent }}>support@satmix.app</a><br />
              Press / Partnership: <a href="mailto:partners@satmix.app" className="hover:underline font-mono font-medium" style={{ color: colors.accent }}>partners@satmix.app</a>
            </p>
          </div>

          <div>
            <span className="font-bold block mb-1" style={{ color: colors.textPrimary }}>Grievance Redressal (DPDP Act 2023)</span>
            <p className="leading-relaxed" style={{ color: colors.textSecondary }}>
              Grievance Officer: Satmix Technologies<br />
              Email: <a href="mailto:grievance@satmix.app" className="hover:underline font-mono font-medium" style={{ color: colors.accent }}>grievance@satmix.app</a><br />
              Resolution within statutory 30-day timeline.
            </p>
          </div>
        </div>

        {/* Legal & Compliance Disclaimer */}
        <div className="pt-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ color: colors.textTertiary }}>
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} Satmix Technologies. All rights reserved. Non-Custodial Systematic Micro-Investing.</p>
            <p className="max-w-2xl text-[11px] leading-relaxed" style={{ color: colors.textTertiary }}>
              Disclaimer: Digital assets and cryptocurrencies are volatile and subject to market risk. Satmix is a non-custodial software technology layer facilitating automated spot order execution via CoinDCX API, not a SEBI-registered investment adviser or portfolio manager. VDA gains are taxed at 30% (+4% cess) under Income Tax Act Sec 115BBH with 1% TDS under Sec 194S upon redemption. Past performance does not guarantee future results.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <button
              onClick={() => setViewMode('privacy')}
              className="hover:opacity-80 transition-opacity"
              style={{ color: colors.textSecondary }}
            >
              Privacy Policy
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => setViewMode('terms')}
              className="hover:opacity-80 transition-opacity"
              style={{ color: colors.textSecondary }}
            >
              Terms & Conditions
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => setViewMode('refund')}
              className="hover:opacity-80 transition-opacity"
              style={{ color: colors.textSecondary }}
            >
              Refund Policy
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={() => setViewMode('cookies')}
              className="hover:opacity-80 transition-opacity"
              style={{ color: colors.textSecondary }}
            >
              Cookie Policy
            </button>
            <span className="opacity-40">•</span>
            <a href="#faq-section" onClick={() => setViewMode('marketing')} className="hover:opacity-80 transition-opacity" style={{ color: colors.textSecondary }}>
              FAQ
            </a>
            <span className="opacity-40">•</span>
            <button
              onClick={() => { setAuthSubView('signup'); setViewMode('auth'); }}
              className="font-bold hover:underline"
              style={{ color: colors.accent }}
            >
              Launch App →
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
