import React from 'react';
import { Cookie, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const CookieBanner: React.FC = () => {
  const { cookieConsent, setCookieConsent, setViewMode, colors } = useApp();

  if (cookieConsent !== null) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 sm:p-5 rounded-2xl border shadow-2xl backdrop-blur-xl pointer-events-auto"
        style={{
          backgroundColor: colors.cardHigh,
          borderColor: colors.cardBorder,
        }}
        role="region"
        aria-label="Cookie consent banner"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl flex-shrink-0 mt-0.5" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
            <Cookie className="w-4 h-4" />
          </div>
          <div className="space-y-2 flex-1">
            <h4 className="text-xs font-bold" style={{ color: colors.textPrimary }}>Privacy & Cookie Consent</h4>
            <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
              We use essential session storage for authentication and UPI AutoPay workflows. We do not use third-party advertising cookies. Learn more in our{' '}
              <button
                type="button"
                onClick={() => setViewMode('cookies')}
                className="hover:underline font-semibold"
                style={{ color: colors.accent }}
              >
                Cookie Policy
              </button>.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCookieConsent('essential')}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors hover:bg-white/5"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.cardBorder,
                  color: colors.textPrimary,
                }}
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={() => setCookieConsent('all')}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
