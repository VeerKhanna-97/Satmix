import React, { useState, useEffect } from 'react';
import { ArrowRight, Calculator } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingActionDock: React.FC = () => {
  const { colors, setViewMode, setAuthSubView, isAuthenticated } = useApp();
  const [visible, setVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleMenuChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ open?: boolean }>;
      setIsMenuOpen(Boolean(customEvent.detail?.open));
    };
    window.addEventListener('satmix:mobile-menu', handleMenuChange);
    return () => window.removeEventListener('satmix:mobile-menu', handleMenuChange);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Do not show if mobile menu is open
          if (document.body.dataset.mobileMenuOpen === 'true') {
            setVisible(false);
            ticking = false;
            return;
          }

          // Reveal once scrolled past the hero (~380px)
          const pastHero = window.scrollY > 380;
          
          // Auto-hide when user is near bottom footer or inside calculator section to prevent collision
          const calcEl = document.getElementById('calc-section');
          const isOverCalc =
            calcEl &&
            window.scrollY >= calcEl.offsetTop - 120 &&
            window.scrollY <= calcEl.offsetTop + calcEl.offsetHeight - 120;

          const scrollBottom =
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 160;

          setVisible(pastHero && !isOverCalc && !scrollBottom);
          ticking = false;
        });
        ticking = true;
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

  const isBodyMenuOpen = typeof document !== 'undefined' && document.body?.dataset?.mobileMenuOpen === 'true';
  const isMenuBlocked = isMenuOpen || isBodyMenuOpen;

  return (
    <AnimatePresence>
      {visible && !isMenuBlocked && (
        <>
          {/* ── MOBILE DETACHED FLOATING GLASS CAPSULE (Floats 20px above edge, never covers screen) ── */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="satmix-floating-dock fixed bottom-5 left-1/2 -translate-x-1/2 z-40 sm:hidden pointer-events-auto select-none"
            aria-label="Quick Actions"
          >
            <div className="flex items-center gap-1.5 p-1.5 rounded-full border border-white/15 bg-[#090b0e]/85 backdrop-blur-2xl shadow-[0_16px_36px_-6px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.12)]">
              {/* Secondary Quick Jump: Calculator */}
              <a
                href="#calc-section"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('calc-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-9 px-3 rounded-full text-neutral-300 hover:text-white font-medium text-xs flex items-center gap-1.5 transition-colors active:scale-[0.96]"
                aria-label="Jump to Growth Calculator"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                <span>Calc</span>
              </a>

              {/* Fine Hairline Separator */}
              <div className="w-px h-4 bg-white/15" />

              {/* Primary High-Conversion CTA */}
              <button
                type="button"
                onClick={handleLaunch}
                className="h-9 px-4 rounded-full font-semibold text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(93,23,235,0.35)] flex items-center justify-center gap-1.5 transition-[transform,background-color] duration-150 ease-out active:scale-[0.96] cursor-pointer"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                aria-label={isAuthenticated ? 'Open Satmix Dashboard' : 'Start with ₹10 a day'}
              >
                <span>{isAuthenticated ? 'Open App' : 'Start ₹10/day'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* ── DESKTOP FLOATING PILL (Bottom Right Corner) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block fixed bottom-6 right-6 z-40 pointer-events-auto select-none"
          >
            <button
              type="button"
              onClick={handleLaunch}
              className="h-11 px-5 rounded-full font-semibold text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_12px_28px_rgba(0,0,0,0.45)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.96] flex items-center gap-2 border select-none cursor-pointer group backdrop-blur-xl"
              style={{
                backgroundColor: colors.primary,
                color: colors.primaryText,
                borderColor: colors.borderAccent,
              }}
              aria-label="Launch Satmix App"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Start ₹10/day'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FloatingActionDock;
