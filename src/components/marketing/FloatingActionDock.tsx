import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Magnet } from '../ui';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingActionDock: React.FC = () => {
  const { colors, setViewMode, setAuthSubView, isAuthenticated } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal button once scrolled past hero (approx 350px)
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunch = () => {
    if (isAuthenticated) {
      setViewMode('app');
    } else {
      setAuthSubView('signup');
      setViewMode('auth');
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Mobile Bottom Sticky CTA Bar (Strict 48px touch targets for mobile accessibility) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] sm:hidden border-t backdrop-blur-xl pointer-events-auto flex items-center gap-2.5"
            style={{
              backgroundColor: colors.cardHigh,
              borderColor: colors.cardBorder,
            }}
          >
            <a
              href="#calc-section"
              className="flex-1 min-h-[48px] py-3 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center transition-colors"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.cardBorder,
                color: colors.textPrimary,
              }}
              aria-label="Calculate Potential Crypto Growth"
            >
              Calculate
            </a>

            <button
              type="button"
              onClick={handleLaunch}
              className="flex-1 min-h-[48px] py-3 px-4 rounded-xl font-bold text-xs shadow-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
              style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              aria-label={isAuthenticated ? 'Open Satmix Dashboard' : 'Start with ₹10 a day'}
            >
              <span>{isAuthenticated ? 'Open App' : 'Start ₹10/Day'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Desktop Floating Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="hidden sm:block fixed bottom-6 right-6 z-40 pointer-events-auto"
          >
            <Magnet strength={12}>
              <button
                type="button"
                onClick={handleLaunch}
                className="px-5 py-3.5 min-h-[44px] rounded-2xl font-extrabold text-xs shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border backdrop-blur-xl group"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.primaryText,
                  borderColor: colors.borderAccent,
                  boxShadow: '0 10px 35px rgba(0, 0, 0, 0.35), 0 0 20px rgba(239, 142, 25, 0.15)',
                }}
                aria-label={isAuthenticated ? 'Open Satmix Web Dashboard' : 'Launch Satmix Web App'}
              >
                <span>{isAuthenticated ? 'Open Dashboard' : 'Launch Web App'}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </Magnet>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
