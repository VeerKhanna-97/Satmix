import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Moon,
  Sun,
  Menu,
  X,
  ArrowRight,
  Shield,
  Calendar,
  CalendarRange,
  CheckSquare,
  Zap,
  LayoutGrid,
  Calculator,
  BookOpen,
  Info,
  Users,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Magnet, ScrollProgress } from '../ui';

export const Header: React.FC = () => {
  const { themeMode, toggleTheme, colors, isAuthenticated, setViewMode, setAuthSubView, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);

          const sections = ['faq-section', 'about-section', 'baskets-section', 'calc-section'];
          const scrollPos = window.scrollY + 160;

          for (const sectionId of sections) {
            const el = document.getElementById(sectionId);
            if (el && el.offsetTop <= scrollPos) {
              setActiveSection(sectionId);
              ticking = false;
              return;
            }
          }
          setActiveSection('home');
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

  const handleFeatureClick = () => {
    setActiveDropdown(null);
    if (isAuthenticated) {
      setViewMode('app');
    } else {
      setAuthSubView('signup');
      setViewMode('auth');
    }
  };

  return (
    <>
      <ScrollProgress color={colors.accent} className="!fixed !top-0 !left-0 !right-0 !bottom-auto z-50" />
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center pointer-events-none ${
          isScrolled ? 'pt-2.5 sm:pt-3.5 px-3 sm:px-6' : 'pt-0 px-0'
        }`}
      >
        {/* Transforming Navbar Capsule / Island */}
        <div
          className={`pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[max-width,border-radius,box-shadow,height,background-color] flex items-center justify-between relative ${
            isScrolled
              ? 'w-full max-w-5xl lg:max-w-6xl h-14 px-3.5 sm:px-5 rounded-2xl sm:rounded-full border backdrop-blur-xl'
              : 'w-full max-w-full h-16 rounded-none border-b border-t-0 border-x-0 backdrop-blur-md'
          }`}
          style={{
            backgroundColor: themeMode === 'dark'
              ? (isScrolled ? 'rgba(10, 12, 18, 0.85)' : 'rgba(9, 10, 16, 0.80)')
              : (isScrolled ? 'rgba(255, 255, 255, 0.90)' : 'rgba(248, 250, 252, 0.85)'),
            borderColor: isScrolled
              ? (themeMode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)')
              : colors.borderDim,
            boxShadow: isScrolled
              ? (themeMode === 'dark'
                  ? '0 16px 36px -10px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)'
                  : '0 12px 30px -10px rgba(0, 0, 0, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)')
              : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(10px)',
          }}
        >
          {/* Inner Content Grid */}
          <div
            className={`w-full h-full flex items-center justify-between transition-all duration-300 ${
              isScrolled ? 'px-1 sm:px-2' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
            }`}
          >
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setViewMode('marketing')}>
              <div
                className={`overflow-hidden shadow-sm flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${
                  isScrolled ? 'w-8 h-8 rounded-lg' : 'w-9 h-9 rounded-xl'
                }`}
                style={{ borderColor: colors.borderDim }}
              >
                <img src="/assets/images/satmix-logo.jpg" alt="Satmix Logo" className="w-full h-full object-cover" />
              </div>
              <span
                className={`font-extrabold tracking-tight transition-all duration-300 ${
                  isScrolled ? 'text-lg' : 'text-xl'
                }`}
                style={{ color: colors.textPrimary }}
              >
                Satmix
              </span>
            </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button type="button" onClick={() => setViewMode('marketing')} className="hover:opacity-100 transition-colors relative py-1 group" style={{ color: activeSection === 'home' ? colors.textPrimary : colors.textSecondary }}>
            <span>Home</span>
            <span className={`absolute -bottom-0.5 left-0 h-px transition-all duration-300 ${activeSection === 'home' ? 'w-full' : 'w-0 group-hover:w-full'}`} style={{ backgroundColor: colors.accent }} />
          </button>

          {/* ── 1. FEATURES MEGA DROPDOWN (Website 3.0 exact content with Website 4.0 aesthetics) ── */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('features')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              aria-expanded={activeDropdown === 'features'}
              onClick={() => setActiveDropdown(prev => prev === 'features' ? null : 'features')}
              className="flex items-center gap-1.5 hover:opacity-100 transition-colors py-1 relative group cursor-pointer"
              style={{ color: activeDropdown === 'features' ? colors.textPrimary : colors.textSecondary }}
            >
              <span>Features</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180' : ''}`} style={{ color: activeDropdown === 'features' ? colors.accent : 'inherit' }} />
              <span className={`absolute -bottom-0.5 left-0 h-px transition-all duration-300 ${activeDropdown === 'features' ? 'w-full' : 'w-0 group-hover:w-full'}`} style={{ backgroundColor: colors.accent }} />
            </button>

            {activeDropdown === 'features' && (
              <div
                className="absolute top-full -left-44 mt-2 w-[780px] p-4 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border backdrop-blur-2xl animate-fade-in z-50 before:absolute before:-top-4 before:left-0 before:right-0 before:h-4"
                style={{
                  backgroundColor: themeMode === 'dark' ? 'rgba(18, 20, 28, 0.96)' : 'rgba(255, 255, 255, 0.98)',
                  borderColor: colors.cardBorder,
                }}
              >
                <div className="grid grid-cols-5 gap-3">
                  {/* Column 1: Daily Saving */}
                  <div
                    onClick={handleFeatureClick}
                    className="p-3 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] flex flex-col justify-between"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.borderDim,
                    }}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs mb-1" style={{ color: colors.textPrimary }}>Daily Saving</h4>
                      <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                        Automatic, effortless saving per day. Start with just ₹10.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold mt-3 inline-flex items-center gap-1" style={{ color: colors.accent }}>
                      Explore <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>

                  {/* Column 2: Weekly Saving */}
                  <div
                    onClick={handleFeatureClick}
                    className="p-3 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] flex flex-col justify-between"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.borderDim,
                    }}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: colors.textPrimary }}>
                        <CalendarRange className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs mb-1" style={{ color: colors.textPrimary }}>Weekly Saving</h4>
                      <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                        Automatic, effortless saving per week. Start with just ₹50.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold mt-3 inline-flex items-center gap-1" style={{ color: colors.accent }}>
                      Explore <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>

                  {/* Column 3: Monthly Saving */}
                  <div
                    onClick={handleFeatureClick}
                    className="p-3 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] flex flex-col justify-between"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.borderDim,
                    }}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}>
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs mb-1" style={{ color: colors.textPrimary }}>Monthly Saving</h4>
                      <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                        Automatic, effortless saving per month. Start with just ₹100.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 mt-3 inline-flex items-center gap-1">
                      Explore <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>

                  {/* Column 4: Instant Saving */}
                  <div
                    onClick={handleFeatureClick}
                    className="p-3 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] flex flex-col justify-between"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.borderDim,
                    }}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(56, 189, 248, 0.12)', color: '#38BDF8' }}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs mb-1" style={{ color: colors.textPrimary }}>Instant Saving</h4>
                      <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                        Save any amount anytime as per your needs.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-sky-400 mt-3 inline-flex items-center gap-1">
                      Explore <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>

                  {/* Column 5: Curated Baskets */}
                  <div
                    onClick={handleFeatureClick}
                    className="p-3 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.02] flex flex-col justify-between"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.borderDim,
                    }}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                        <LayoutGrid className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs mb-1" style={{ color: colors.textPrimary }}>Curated Baskets</h4>
                      <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                        Stable & Growth automated micro-portfolios.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold mt-3 inline-flex items-center gap-1" style={{ color: colors.accent }}>
                      Explore <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── 2. RESOURCES DROPDOWN (Website 3.0 exact content with Website 4.0 aesthetics) ── */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('resources')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              aria-expanded={activeDropdown === 'resources'}
              onClick={() => setActiveDropdown(prev => prev === 'resources' ? null : 'resources')}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity py-2 cursor-pointer"
              style={{ color: activeDropdown === 'resources' ? colors.textPrimary : colors.textSecondary }}
            >
              <span>Resources</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} style={{ color: activeDropdown === 'resources' ? colors.accent : 'inherit' }} />
            </button>

            {activeDropdown === 'resources' && (
              <div
                className="absolute top-full -left-12 mt-2 w-[420px] p-3 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border backdrop-blur-2xl animate-fade-in z-50 before:absolute before:-top-4 before:left-0 before:right-0 before:h-4"
                style={{
                  backgroundColor: themeMode === 'dark' ? 'rgba(18, 20, 28, 0.96)' : 'rgba(255, 255, 255, 0.98)',
                  borderColor: colors.cardBorder,
                }}
              >
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Column 1: Compound Calculator */}
                  <a
                    href="#calc-section"
                    onClick={() => { setViewMode('marketing'); setActiveDropdown(null); }}
                    className="p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between no-underline block"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.borderDim,
                    }}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                        <Calculator className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs mb-1" style={{ color: colors.textPrimary }}>Calculator</h4>
                      <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                        Projections & compounding schedules.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold mt-2.5 inline-flex items-center gap-1 font-mono" style={{ color: colors.accent }}>
                      Calculate <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </a>

                  {/* Column 2: Knowledge Hub */}
                  <a
                    href="#baskets-section"
                    onClick={() => { setViewMode('marketing'); setActiveDropdown(null); }}
                    className="p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between no-underline block"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.borderDim,
                    }}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: colors.textPrimary }}>
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs mb-1" style={{ color: colors.textPrimary }}>Knowledge Hub</h4>
                      <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                        Guides on strategy & asset safety.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold mt-2.5 inline-flex items-center gap-1 font-mono" style={{ color: colors.accent }}>
                      Learn More <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ── 3. ABOUT US DROPDOWN ── */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('about')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              aria-expanded={activeDropdown === 'about'}
              onClick={() => setActiveDropdown(prev => prev === 'about' ? null : 'about')}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity py-2 cursor-pointer"
              style={{ color: activeDropdown === 'about' ? colors.textPrimary : colors.textSecondary }}
            >
              <span>About us</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180' : ''}`} style={{ color: activeDropdown === 'about' ? colors.accent : 'inherit' }} />
            </button>

            {activeDropdown === 'about' && (
              <div
                className="absolute top-full -left-12 mt-2 w-[420px] p-3 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border backdrop-blur-2xl animate-fade-in z-50 before:absolute before:-top-4 before:left-0 before:right-0 before:h-4"
                style={{
                  backgroundColor: themeMode === 'dark' ? 'rgba(18, 20, 28, 0.96)' : 'rgba(255, 255, 255, 0.98)',
                  borderColor: colors.cardBorder,
                }}
              >
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Column 1: About Satmix */}
                  <a
                    href="#about-section"
                    onClick={() => { setViewMode('marketing'); setActiveDropdown(null); }}
                    className="p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between no-underline block"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.borderDim,
                    }}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                        <Info className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs mb-1" style={{ color: colors.textPrimary }}>About Satmix</h4>
                      <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                        Story, mission and vision.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold mt-2.5 inline-flex items-center gap-1 font-mono" style={{ color: colors.accent }}>
                      Our Story <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </a>

                  {/* Column 2: Leaders */}
                  <a
                    href="#about-section"
                    onClick={() => { setViewMode('marketing'); setActiveDropdown(null); }}
                    className="p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between no-underline block"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.borderDim,
                    }}
                  >
                    <div>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', color: colors.textPrimary }}>
                        <Users className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs mb-1" style={{ color: colors.textPrimary }}>Leaders</h4>
                      <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                        Meet the founding team.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold mt-2.5 inline-flex items-center gap-1 font-mono" style={{ color: colors.accent }}>
                      Founders <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </a>
                </div>
              </div>
            )}
          </div>

          <a
            href="#faq-section"
            onClick={() => setViewMode('marketing')}
            className="hover:opacity-100 transition-colors relative py-1 group"
            style={{ color: activeSection === 'faq-section' ? colors.textPrimary : colors.textSecondary }}
          >
            <span>FAQ</span>
            <span
              className={`absolute -bottom-0.5 left-0 h-px transition-all duration-300 ${
                activeSection === 'faq-section' ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
              style={{ backgroundColor: colors.accent }}
            />
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/[0.05] active:scale-[0.98] flex items-center justify-center select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
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
              className="inline-flex items-center gap-2 h-8 sm:h-9 px-3.5 rounded-full font-semibold text-xs tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.3)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
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
                className="hidden sm:inline-flex items-center justify-center h-8 sm:h-9 px-3.5 rounded-full font-semibold text-xs transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/[0.05] hover:border-white/20 active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{ backgroundColor: colors.surface, color: colors.textPrimary, border: `1px solid ${colors.cardBorder}` }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleSignUpClick}
                className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-4 rounded-full font-semibold text-xs tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.3)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/[0.05] active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>
    </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto animate-fade-in pointer-events-auto transition-all duration-300 ${
            isScrolled
              ? 'w-[calc(100%-1.5rem)] max-w-md mx-auto mt-2 rounded-2xl shadow-2xl backdrop-blur-2xl'
              : 'w-full border-t-0 border-x-0 border-b backdrop-blur-xl'
          }`}
          style={{
            backgroundColor: themeMode === 'dark' ? 'rgba(15, 17, 26, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            borderColor: isScrolled
              ? (themeMode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)')
              : colors.borderDim,
            boxShadow: isScrolled
              ? '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
              : 'none',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                setViewMode('marketing');
                setMobileMenuOpen(false);
              }}
              className="text-left w-full py-2 px-3 rounded-xl font-bold text-sm hover:bg-white/5"
              style={{ color: colors.textPrimary }}
            >
              Home
            </button>

            {/* Mobile Features List */}
            <div className="space-y-1.5 pl-2">
              <span className="text-[10px] font-bold uppercase tracking-wider block px-2" style={{ color: colors.textTertiary }}>Features</span>
              <div
                onClick={() => { handleFeatureClick(); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>Daily Saving</div>
                  <div className="text-[10px]" style={{ color: colors.textSecondary }}>Start with just ₹10/day</div>
                </div>
              </div>

              <div
                onClick={() => { handleFeatureClick(); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primaryTint, color: colors.textPrimary }}>
                  <CalendarRange className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>Weekly Saving</div>
                  <div className="text-[10px]" style={{ color: colors.textSecondary }}>Start with just ₹50/week</div>
                </div>
              </div>

              <div
                onClick={() => { handleFeatureClick(); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', color: colors.semanticWarning }}>
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>Monthly Saving</div>
                  <div className="text-[10px]" style={{ color: colors.textSecondary }}>Start with just ₹100/month</div>
                </div>
              </div>

              <div
                onClick={() => { handleFeatureClick(); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(56, 189, 248, 0.12)', color: colors.semanticInfo }}>
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>Instant Saving</div>
                  <div className="text-[10px]" style={{ color: colors.textSecondary }}>Save any amount anytime</div>
                </div>
              </div>

              <div
                onClick={() => { handleFeatureClick(); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                  <LayoutGrid className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>Curated Baskets</div>
                  <div className="text-[10px]" style={{ color: colors.textSecondary }}>Stable & Growth portfolios</div>
                </div>
              </div>
            </div>

            {/* Mobile Resources List */}
            <div className="space-y-1.5 pl-2 pt-2 border-t" style={{ borderColor: colors.borderDim }}>
              <span className="text-[10px] font-bold uppercase tracking-wider block px-2" style={{ color: colors.textTertiary }}>Resources</span>
              <a
                href="#calc-section"
                onClick={() => { setViewMode('marketing'); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl border flex items-center gap-3 no-underline transition-colors"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                  <Calculator className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>Compound Calculator</div>
                  <div className="text-[10px]" style={{ color: colors.textSecondary }}>Calculate future wealth projections</div>
                </div>
              </a>

              <a
                href="#baskets-section"
                onClick={() => { setViewMode('marketing'); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl border flex items-center gap-3 no-underline transition-colors"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primaryTint, color: colors.textPrimary }}>
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>Knowledge Hub</div>
                  <div className="text-[10px]" style={{ color: colors.textSecondary }}>Comprehensive guides & asset safety</div>
                </div>
              </a>
            </div>

            {/* Mobile About Us List */}
            <div className="space-y-1.5 pl-2 pt-2 border-t" style={{ borderColor: colors.borderDim }}>
              <span className="text-[10px] font-bold uppercase tracking-wider block px-2" style={{ color: colors.textTertiary }}>About us</span>
              <a
                href="#about-section"
                onClick={() => { setViewMode('marketing'); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl border flex items-center gap-3 no-underline transition-colors"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                  <Info className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>About Satmix</div>
                  <div className="text-[10px]" style={{ color: colors.textSecondary }}>Story, mission and vision</div>
                </div>
              </a>

              <a
                href="#about-section"
                onClick={() => { setViewMode('marketing'); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl border flex items-center gap-3 no-underline transition-colors"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primaryTint, color: colors.textPrimary }}>
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>Leaders</div>
                  <div className="text-[10px]" style={{ color: colors.textSecondary }}>Meet the founding team</div>
                </div>
              </a>
            </div>

            <a
              href="#faq-section"
              onClick={() => { setViewMode('marketing'); setMobileMenuOpen(false); }}
              className="py-2 px-3 rounded-xl font-bold text-sm block hover:bg-white/5"
              style={{ color: colors.textSecondary }}
            >
              FAQ
            </a>

            <div className="flex flex-wrap items-center gap-2.5 px-3 pt-2 text-xs font-semibold" style={{ color: colors.textTertiary }}>
              <button
                type="button"
                onClick={() => { setViewMode('privacy'); setMobileMenuOpen(false); }}
                className="hover:opacity-80"
              >
                Privacy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setViewMode('terms'); setMobileMenuOpen(false); }}
                className="hover:opacity-80"
              >
                Terms
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setViewMode('refund'); setMobileMenuOpen(false); }}
                className="hover:opacity-80"
              >
                Refunds
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => { setViewMode('cookies'); setMobileMenuOpen(false); }}
                className="hover:opacity-80"
              >
                Cookies
              </button>
            </div>
          </div>

          <div className="pt-2 border-t flex flex-col gap-2" style={{ borderColor: colors.borderDim }}>
            <button
              type="button"
              onClick={() => {
                handleLaunchApp();
                setMobileMenuOpen(false);
              }}
              className="w-full h-11 px-5 rounded-xl font-bold text-sm text-center shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-all hover:brightness-105 active:scale-[0.98] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              style={{ backgroundColor: colors.primary, color: colors.primaryText }}
            >
              {isAuthenticated ? 'Open Dashboard' : 'Sign In / Register'}
            </button>
          </div>
        </div>
      )}
    </header>
  </>
  );
};
