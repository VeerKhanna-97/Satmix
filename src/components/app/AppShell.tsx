import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Wallet,
  Zap,
  TrendingUp,
  Layers,
  ArrowLeftRight,
  User,
  Settings,
  Moon,
  Sun,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardScreen } from './DashboardScreen';
import { TransactionsScreen } from './TransactionsScreen';
import { BasketsScreen } from './BasketsScreen';
import { StrategyScreen } from './StrategyScreen';
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
    setFeedbackOpen,
  } = useApp();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tabs = [
    { id: 'dashboard' as const, label: 'Portfolio', icon: Wallet },
    { id: 'invest' as const, label: 'Strategy & Growth', icon: TrendingUp },
    { id: 'baskets' as const, label: 'Baskets', icon: Layers },
    { id: 'profile' as const, label: 'Account', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] md:pb-12 relative overflow-x-clip" style={{ backgroundColor: colors.bg }}>
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
                    isActive ? 'font-bold' : 'font-medium opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    color: isActive ? colors.textPrimary : colors.textSecondary,
                  }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600 dark:text-purple-400' : ''}`} style={{ color: isActive ? undefined : colors.textSecondary }} />
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
            {(activeTab === 'invest' || (activeTab as string) === 'performance' || (activeTab as string) === 'growth') && <StrategyScreen />}
            {activeTab === 'baskets' && <BasketsScreen />}
            {activeTab === 'transactions' && <ProfileScreen defaultSection="transactions" />}
            {activeTab === 'profile' && <ProfileScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── FUSED MOBILE FLOATING NAVIGATION DOCK (PORTALED DIRECTLY TO BODY TO PREVENT ANY PARENT SCROLL/TRANSFORM TRAPPING) ─── */}
      {isMounted &&
        createPortal(
          <nav
            className="md:hidden fixed bottom-[max(1rem,env(safe-area-inset-bottom,16px))] left-1/2 -translate-x-1/2 z-[999] pointer-events-auto max-w-[calc(100vw-20px)] touch-manipulation"
            role="navigation"
            aria-label="Mobile Navigation"
          >
            <div
              className="flex items-center gap-1 p-1.5 sm:p-2 rounded-full border backdrop-blur-2xl transition-all duration-300"
              style={{
                backgroundColor: themeMode === 'dark' ? 'rgba(14, 16, 23, 0.94)' : 'rgba(255, 255, 255, 0.96)',
                borderColor: themeMode === 'light' ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.10)',
                boxShadow: themeMode === 'dark'
                  ? '0 16px 40px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)'
                  : '0 16px 40px -4px rgba(15, 23, 42, 0.14), 0 2px 8px -1px rgba(15, 23, 42, 0.06)',
              }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="relative flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-full transition-all duration-100 select-none active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 cursor-pointer"
                    style={{
                      color: isActive
                        ? (themeMode === 'light' ? '#6D28D9' : '#A78BFA')
                        : (themeMode === 'light' ? '#64748B' : colors.textSecondary),
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeMobileDockPill"
                        className={`absolute inset-0 rounded-full z-0 border ${
                          themeMode === 'light'
                            ? 'bg-purple-100/90 border-purple-300/80 shadow-xs'
                            : 'bg-purple-500/15 border-purple-500/30 shadow-md'
                        }`}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 2} />
                      <span className={`text-xs tracking-tight ${
                        isActive
                          ? (themeMode === 'light' ? 'font-bold text-purple-700 inline' : 'font-bold text-purple-400 inline')
                          : 'font-semibold hidden sm:inline'
                      }`}>
                        {tab.label === 'Strategy & Growth' ? 'Growth' : tab.label}
                      </span>
                    </span>
                  </button>
                );
              })}

              {/* Fused Divider Between Tabs and Feedback */}
              <div
                className="w-px h-6 mx-0.5"
                style={{ backgroundColor: themeMode === 'light' ? 'rgba(15, 23, 42, 0.12)' : colors.borderDim }}
              />

              {/* Fused Feedback / Reviews Trigger */}
              <button
                type="button"
                onClick={() => setFeedbackOpen(true)}
                className={`relative flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-full active:scale-[0.96] transition-all duration-100 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 ${
                  themeMode === 'light'
                    ? 'text-purple-700 hover:text-purple-800 hover:bg-purple-50'
                    : 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10'
                }`}
                aria-label="Feedback and Reviews"
              >
                <MessageSquare className={`w-[18px] h-[18px] sm:w-5 sm:h-5 flex-shrink-0 ${
                  themeMode === 'light' ? 'text-purple-700' : 'text-purple-400'
                }`} />
                <span className={`text-xs font-semibold hidden min-[390px]:inline ${
                  themeMode === 'light' ? 'text-purple-700' : 'text-purple-400'
                }`}>
                  Feedback
                </span>
              </button>
            </div>
          </nav>,
          document.body
        )}

      {/* ── 4-STEP FIRST-RUN TUTORIAL MODAL ────────────────── */}
      <TutorialModal isOpen={tutorialOpen} onFinish={completeTutorial} />
    </div>
  );
};
