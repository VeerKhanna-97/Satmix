import React from 'react';
import {
  Wallet,
  Zap,
  TrendingUp,
  Layers,
  ArrowLeftRight,
  Settings,
  Moon,
  Sun,
  ArrowLeft,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardScreen } from './DashboardScreen';
import { TransactionsScreen } from './TransactionsScreen';
import { BasketsScreen } from './BasketsScreen';
import { InvestScreen } from './InvestScreen';
import { ProfileScreen } from './ProfileScreen';
import { TutorialModal } from '../auth/TutorialModal';
import { motion, AnimatePresence } from 'motion/react';

export const AppShell: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setViewMode,
    themeMode,
    toggleTheme,
    colors,
    user,
    tutorialOpen,
    completeTutorial,
  } = useApp();

  const tabs = [
    { id: 'dashboard' as const, label: 'Portfolio', icon: Wallet },
    { id: 'invest' as const, label: 'Strategy & Growth', icon: TrendingUp },
    { id: 'baskets' as const, label: 'Baskets', icon: Layers },
    { id: 'profile' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] md:pb-12 relative overflow-hidden" style={{ backgroundColor: colors.bg }}>
      {/* Background Ambient Glow */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none opacity-5 animate-ambient-glow"
        style={{ background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)` }}
      />

      {/* ── TOP NAV BAR (MERIDIAN FINTECH STYLE) ────────────────── */}
      <header
        className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors"
        style={{
          backgroundColor: themeMode === 'dark' ? 'rgba(9, 10, 14, 0.92)' : 'rgba(248, 250, 252, 0.92)',
          borderColor: colors.borderDim,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand + Marketing return */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('marketing')}
              className="text-xs font-semibold hover:opacity-80 flex items-center gap-1 transition-opacity"
              style={{ color: colors.textSecondary }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Website</span>
            </button>

            <div className="w-px h-5 hidden sm:block" style={{ backgroundColor: colors.borderDim }} />

            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setActiveTab('dashboard')}>
              <div className="w-8 h-8 rounded-xl overflow-hidden border flex items-center justify-center transition-transform duration-300 group-hover:scale-105" style={{ borderColor: colors.borderDim }}>
                <img src="/assets/images/satmix-logo.jpg" alt="Satmix Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-lg tracking-tight" style={{ color: colors.textPrimary }}>Satmix App</span>
            </div>
          </div>

          {/* Desktop Tab Selector with Satmix Purple Underline Glow */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-xs sm:text-sm font-medium">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 py-2 transition-colors duration-200 select-none cursor-pointer ${
                    isActive ? 'text-white font-bold' : 'text-neutral-400 hover:text-neutral-200 font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-neutral-400'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-3 left-0 right-0 h-[2px] rounded-full bg-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.9)]"
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Header: Theme & User Avatar */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border hover:opacity-80 transition-opacity"
              style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
              aria-label="Toggle Theme"
            >
              {themeMode === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-9 h-9 rounded-xl border-2 flex items-center justify-center font-bold text-xs font-mono transition-transform hover:scale-105 shadow-sm"
              style={{ backgroundColor: colors.purpleTint, borderColor: colors.accent, color: colors.accent }}
            >
              {user?.initials || 'VK'}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT AREA WITH SMOOTH FADE TRANSITIONS ────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 flex-1 w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14, scale: 0.99 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.99,
              transition: { duration: 0.15, ease: [0.32, 0, 0.67, 0] },
            }}
          >
            {activeTab === 'dashboard' && <DashboardScreen />}
            {(activeTab === 'invest' || (activeTab as string) === 'performance') && <InvestScreen />}
            {activeTab === 'baskets' && <BasketsScreen />}
            {activeTab === 'transactions' && <ProfileScreen defaultSection="transactions" />}
            {activeTab === 'profile' && <ProfileScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── MOBILE FLOATING NAVIGATION DOCK ─── */}
      <nav
        className="md:hidden fixed bottom-[max(0.75rem,env(safe-area-inset-bottom,12px))] left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-[calc(100vw-16px)]"
        role="navigation"
        aria-label="Mobile Navigation"
      >
        <div
          className="flex items-center gap-0.5 p-1 sm:p-1.5 rounded-full border backdrop-blur-2xl transition-all duration-300 shadow-2xl"
          style={{
            backgroundColor: themeMode === 'dark' ? 'rgba(14, 16, 23, 0.94)' : 'rgba(255, 255, 255, 0.94)',
            borderColor: colors.cardBorder,
            boxShadow: themeMode === 'dark'
              ? '0 12px 36px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)'
              : '0 12px 36px -4px rgba(15, 23, 42, 0.14), 0 0 0 1px rgba(15, 23, 42, 0.05)',
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full transition-all duration-200 select-none active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 cursor-pointer"
                style={{
                  color: isActive ? '#8B5CF6' : colors.textSecondary,
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMobileDockPill"
                    className="absolute inset-0 rounded-full shadow-md z-0 bg-purple-500/15 border border-purple-500/30"
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`text-[11px] sm:text-[12px] tracking-tight ${isActive ? 'font-bold text-purple-400 inline' : 'font-semibold hidden sm:inline'}`}>
                    {tab.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── 4-STEP FIRST-RUN TUTORIAL MODAL ────────────────── */}
      <TutorialModal isOpen={tutorialOpen} onFinish={completeTutorial} />
    </div>
  );
};
