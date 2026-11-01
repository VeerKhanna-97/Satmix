import React, { useState, useEffect, useRef } from 'react';
import {
  Moon,
  Sun,
  ArrowRight,
  Compass,
  Calculator,
  HelpCircle,
  Shield,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScrollProgress } from '../ui';

// Helper to calculate absolute document top offset reliably across any parent positioning
const getElementDocumentTop = (element: HTMLElement): number => {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return Math.round(rect.top + scrollTop);
};

// High-precision requestAnimationFrame smooth scroll controller
// Immune to browser compositor cancellation, dynamic re-renders, and sticky element height shifts
const smoothScrollTo = (targetY: number, onComplete?: () => void) => {
  const startY = window.pageYOffset || document.documentElement.scrollTop;
  const distance = targetY - startY;

  if (Math.abs(distance) < 2) {
    window.scrollTo(0, targetY);
    onComplete?.();
    return;
  }

  // Adaptive calibrated duration: minimum 450ms, maximum 850ms based on travel distance
  const duration = Math.min(850, Math.max(450, Math.round(Math.abs(distance) * 0.2)));
  const startTime = performance.now();

  // Premium cubic ease-in-out curve
  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let animId: number;
  let finished = false;

  const endAnimation = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(animId);
    window.removeEventListener('wheel', cancelOnUser);
    window.removeEventListener('touchstart', cancelOnUser);
    onComplete?.();
  };

  const cancelOnUser = () => {
    endAnimation();
  };

  window.addEventListener('wheel', cancelOnUser, { passive: true });
  window.addEventListener('touchstart', cancelOnUser, { passive: true });

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, Math.round(startY + distance * eased));

    if (progress < 1 && !finished) {
      animId = requestAnimationFrame(animate);
    } else {
      window.scrollTo(0, targetY);
      endAnimation();
    }
  };

  animId = requestAnimationFrame(animate);
};

export const Header: React.FC = () => {
  const { themeMode, toggleTheme, colors, isAuthenticated, viewMode, setViewMode, setAuthSubView, user } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const prevScrolledRef = useRef(false);
  const prevSectionRef = useRef('home');

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
    resetStepOne = false
  ) => {
    e.preventDefault();

    const performScroll = () => {
      const el = document.getElementById(sectionId);
      if (!el) return;

      const docTop = getElementDocumentTop(el);

      // Sticky screen math:
      // For #steps-animation, the sticky timeline locks to viewport top when scrollY hits docTop.
      // Do not subtract header offset, otherwise the viewport halts before the sticky lock occurs.
      // For standard static sections, subtract 72px headerOffset so the fixed header leaves clean breathing room.
      const isStickySection = sectionId === 'steps-animation';
      const headerOffset = isStickySection ? 0 : 72;
      const targetY = Math.max(0, docTop - headerOffset);

      // Lock scroll-triggered component re-renders inside StepsSection during transit
      (window as unknown as { __satmixNavigating?: boolean }).__satmixNavigating = true;

      if (resetStepOne) {
        window.dispatchEvent(new CustomEvent('satmix:reset-steps-to-one'));
      }

      smoothScrollTo(targetY, () => {
        (window as unknown as { __satmixNavigating?: boolean }).__satmixNavigating = false;
        if (resetStepOne) {
          window.dispatchEvent(new CustomEvent('satmix:reset-steps-to-one'));
        }
      });
    };

    if (viewMode !== 'marketing') {
      setViewMode('marketing');
      window.setTimeout(performScroll, 120);
    } else {
      performScroll();
    }
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          const scrolled = currentScroll > 20;
          if (scrolled !== prevScrolledRef.current) {
            prevScrolledRef.current = scrolled;
            setIsScrolled(scrolled);
          }

          // Active section check in reverse order (bottom to top)
          const sections = ['faq-section', 'about-section', 'calc-section', 'steps-animation'];
          const scrollPos = currentScroll + 200;

          for (const sectionId of sections) {
            const el = document.getElementById(sectionId);
            if (el) {
              const docTop = getElementDocumentTop(el);
              if (docTop <= scrollPos) {
                if (sectionId !== prevSectionRef.current) {
                  prevSectionRef.current = sectionId;
                  setActiveSection(sectionId);
                }
                ticking = false;
                return;
              }
            }
          }

          if (prevSectionRef.current !== 'home') {
            prevSectionRef.current = 'home';
            setActiveSection('home');
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunchApp = () => {
    if (isAuthenticated) {
      setViewMode('app');
    } else {
      setAuthSubView('login');
      setViewMode('auth');
    }
  };

  const handleSignUpClick = () => {
    setAuthSubView('signup');
    setViewMode('auth');
  };


  return (
    <>
      <ScrollProgress color={colors.accent} className="!fixed !top-0 !left-0 !right-0 !bottom-auto z-50" />
      <header
        className={`sticky top-0 z-40 w-full transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col items-center pointer-events-none ${
          isScrolled ? 'pt-2.5 sm:pt-3.5 px-3 sm:px-6' : 'pt-0 px-0'
        }`}
      >
        {/* Transforming Navbar Squircle Capsule / Island */}
        <div
          className={`pointer-events-auto transition-[max-width,border-radius,box-shadow,height,background-color,border-color,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[max-width,border-radius,box-shadow,height,background-color] flex items-center justify-between relative ${
            isScrolled
              ? 'w-full max-w-5xl lg:max-w-6xl h-14 px-3.5 sm:px-5 rounded-[24px] sm:rounded-[28px] border backdrop-blur-xl'
              : 'w-full max-w-full h-16 rounded-[0px] border-b border-t-0 border-x-0 backdrop-blur-md'
          }`}
          style={{
            backgroundColor: themeMode === 'dark'
              ? (isScrolled ? 'rgba(10, 12, 18, 0.82)' : 'rgba(9, 10, 16, 0.80)')
              : (isScrolled ? 'rgba(255, 255, 255, 0.90)' : 'rgba(248, 250, 252, 0.85)'),
            borderColor: isScrolled
              ? (themeMode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)')
              : colors.borderDim,
            boxShadow: isScrolled
              ? (themeMode === 'dark'
                  ? '0 20px 48px -12px rgba(0, 0, 0, 0.70), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)'
                  : '0 16px 36px -12px rgba(0, 0, 0, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.95)')
              : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(10px)',
          }}
        >
          {/* Inner Content Grid */}
          <div
            className={`w-full h-full flex items-center justify-between transition-[padding,max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isScrolled ? 'px-1 sm:px-2' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
            }`}
          >
            {/* Brand Logo (Always acts as Home) */}
            <div
              className="flex items-center gap-2.5 cursor-pointer group select-none"
              onClick={() => {
                setViewMode('marketing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="Satmix Home"
            >
              <div
                className={`overflow-hidden shadow-sm flex items-center justify-center border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${
                  isScrolled ? 'w-8 h-8 rounded-[11px]' : 'w-9 h-9 rounded-[14px]'
                }`}
                style={{ borderColor: colors.borderDim }}
              >
                <img src="/assets/images/satmix-logo.jpg" alt="Satmix Logo" className="w-full h-full object-cover" />
              </div>
              <span
                className={`font-extrabold tracking-tight transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] font-display ${
                  isScrolled ? 'text-lg' : 'text-xl'
                }`}
                style={{ color: colors.textPrimary }}
              >
                Satmix
              </span>
            </div>

            {/* ── STREAMLINED DESKTOP NAVIGATION (4 Direct Anchors, Zero Mega-Menu Bloat) ── */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
              {/* 1. How It Works */}
              <a
                href="#steps-animation"
                onClick={(e) => handleNavClick(e, 'steps-animation', true)}
                className="hover:opacity-100 transition-colors relative py-1 group select-none cursor-pointer"
                style={{ color: activeSection === 'steps-animation' ? colors.textPrimary : colors.textSecondary }}
              >
                <span>How It Works</span>
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
                    activeSection === 'steps-animation' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-70'
                  }`}
                  style={{ backgroundColor: colors.accent || '#A855F7' }}
                />
              </a>

              {/* 2. Calculator */}
              <a
                href="#calc-section"
                onClick={(e) => handleNavClick(e, 'calc-section')}
                className="hover:opacity-100 transition-colors relative py-1 group select-none cursor-pointer"
                style={{ color: activeSection === 'calc-section' ? colors.textPrimary : colors.textSecondary }}
              >
                <span>Calculator</span>
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
                    activeSection === 'calc-section' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-70'
                  }`}
                  style={{ backgroundColor: colors.accent || '#A855F7' }}
                />
              </a>

              {/* 3. About us */}
              <a
                href="#about-section"
                onClick={(e) => handleNavClick(e, 'about-section')}
                className="hover:opacity-100 transition-colors relative py-1 group select-none cursor-pointer"
                style={{ color: activeSection === 'about-section' ? colors.textPrimary : colors.textSecondary }}
              >
                <span>About us</span>
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
                    activeSection === 'about-section' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-70'
                  }`}
                  style={{ backgroundColor: colors.accent || '#A855F7' }}
                />
              </a>

              {/* 4. FAQ */}
              <a
                href="#faq-section"
                onClick={(e) => handleNavClick(e, 'faq-section')}
                className="hover:opacity-100 transition-colors relative py-1 group select-none cursor-pointer"
                style={{ color: activeSection === 'faq-section' ? colors.textPrimary : colors.textSecondary }}
              >
                <span>FAQ</span>
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
                    activeSection === 'faq-section' ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-70'
                  }`}
                  style={{ backgroundColor: colors.accent || '#A855F7' }}
                />
              </a>
            </nav>

            {/* Right CTA Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-[16px] sm:rounded-[18px] border transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/[0.05] active:scale-[0.98] flex items-center justify-center select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 cursor-pointer"
                style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                aria-label="Toggle Theme"
              >
                {themeMode === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>

              {/* Auth Button */}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLaunchApp}
                  className="inline-flex items-center gap-2 h-8 sm:h-9 px-3.5 rounded-[18px] sm:rounded-[20px] font-semibold text-xs tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.3)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 cursor-pointer"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  <span>Go to App</span>
                  <span className="w-5 h-5 rounded-full bg-black/10 dark:bg-black/20 flex items-center justify-center text-[10px] font-mono">
                    {user?.initials || 'VK'}
                  </span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLaunchApp}
                    className="hidden sm:inline-flex items-center justify-center h-8 sm:h-9 px-3.5 rounded-[18px] sm:rounded-[20px] font-semibold text-xs transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/[0.05] hover:border-white/20 active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 cursor-pointer"
                    style={{ backgroundColor: colors.surface, color: colors.textPrimary, border: `1px solid ${colors.cardBorder}` }}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={handleSignUpClick}
                    className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-4 rounded-[18px] sm:rounded-[20px] font-semibold text-xs tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.3)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 cursor-pointer"
                    style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                  >
                    <span>Launch App</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
</header>
    </>
  );
};

export default Header;
