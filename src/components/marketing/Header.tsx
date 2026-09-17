import React, { useState } from 'react';
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
import { Magnet } from '../ui';

export const Header: React.FC = () => {
  const { themeMode, toggleTheme, colors, isAuthenticated, setViewMode, setAuthSubView, user } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors"
      style={{
        backgroundColor: themeMode === 'dark' ? 'rgba(9, 10, 16, 0.85)' : 'rgba(248, 250, 252, 0.85)',
        borderColor: colors.borderDim,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setViewMode('marketing')}>
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm flex items-center justify-center border transition-transform duration-300 group-hover:scale-105" style={{ borderColor: colors.borderDim }}>
            <img src="/assets/images/satmix-logo.jpg" alt="Satmix Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold text-xl tracking-tight" style={{ color: colors.textPrimary }}>
            Satmix
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md border font-mono" style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}>
            UPI AutoPay
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button onClick={() => setViewMode('marketing')} className="hover:opacity-80 transition-opacity" style={{ color: colors.textPrimary }}>
            Home
          </button>

          {/* ── 1. FEATURES MEGA DROPDOWN (Website 3.0 exact content with Website 4.0 aesthetics) ── */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown('features')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity py-2"
              style={{ color: activeDropdown === 'features' ? colors.textPrimary : colors.textSecondary }}
            >
              <span>Features</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180' : ''}`} style={{ color: activeDropdown === 'features' ? colors.accent : 'inherit' }} />
            </button>

            {activeDropdown === 'features' && (
              <div
                className="absolute top-full -left-44 w-[780px] p-4 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border backdrop-blur-2xl animate-fade-in z-50 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
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
                        Calm & Growth automated micro-portfolios.
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
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity py-2"
              style={{ color: activeDropdown === 'resources' ? colors.textPrimary : colors.textSecondary }}
            >
              <span>Resources</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} style={{ color: activeDropdown === 'resources' ? colors.accent : 'inherit' }} />
            </button>

            {activeDropdown === 'resources' && (
              <div
                className="absolute top-full -left-12 w-[420px] p-3 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border backdrop-blur-2xl animate-fade-in z-50 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
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
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity py-2"
              style={{ color: activeDropdown === 'about' ? colors.textPrimary : colors.textSecondary }}
            >
              <span>About us</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180' : ''}`} style={{ color: activeDropdown === 'about' ? colors.accent : 'inherit' }} />
            </button>

            {activeDropdown === 'about' && (
              <div
                className="absolute top-full -left-12 w-[420px] p-3 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border backdrop-blur-2xl animate-fade-in z-50 before:absolute before:-top-3 before:left-0 before:right-0 before:h-3"
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

          <a href="#faq-section" onClick={() => setViewMode('marketing')} className="hover:opacity-80 transition-opacity" style={{ color: colors.textSecondary }}>
            FAQ
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg border transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/[0.05] active:scale-[0.98] flex items-center justify-center select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
            aria-label="Toggle Theme"
          >
            {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={handleLaunchApp}
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-lg font-semibold text-xs tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.3)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
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
                onClick={handleLaunchApp}
                className="hidden sm:inline-flex items-center justify-center h-9 px-3.5 rounded-lg font-semibold text-xs transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/[0.05] hover:border-white/20 active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{ backgroundColor: colors.surface, color: colors.textPrimary, border: `1px solid ${colors.cardBorder}` }}
              >
                Sign In
              </button>
              <button
                onClick={handleSignUpClick}
                className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg font-semibold text-xs tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_1px_3px_rgba(0,0,0,0.3)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-lg border flex items-center justify-center transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/[0.05] active:scale-[0.98] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-b px-4 pt-3 pb-6 space-y-4 max-h-[85vh] overflow-y-auto animate-fade-in"
          style={{ backgroundColor: colors.cardHigh, borderColor: colors.borderDim }}
        >
          <div className="space-y-3">
            <button
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
                  <div className="text-[10px]" style={{ color: colors.textSecondary }}>Calm & Growth portfolios</div>
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
                onClick={() => { setViewMode('privacy'); setMobileMenuOpen(false); }}
                className="hover:opacity-80"
              >
                Privacy
              </button>
              <span>•</span>
              <button
                onClick={() => { setViewMode('terms'); setMobileMenuOpen(false); }}
                className="hover:opacity-80"
              >
                Terms
              </button>
              <span>•</span>
              <button
                onClick={() => { setViewMode('refund'); setMobileMenuOpen(false); }}
                className="hover:opacity-80"
              >
                Refunds
              </button>
              <span>•</span>
              <button
                onClick={() => { setViewMode('cookies'); setMobileMenuOpen(false); }}
                className="hover:opacity-80"
              >
                Cookies
              </button>
            </div>
          </div>

          <div className="pt-2 border-t flex flex-col gap-2" style={{ borderColor: colors.borderDim }}>
            <button
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
  );
};
