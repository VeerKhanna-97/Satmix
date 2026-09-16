import React from 'react';
import { Home, Layers, TrendingUp, User, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DashboardScreen } from './DashboardScreen';
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
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'baskets', label: 'Baskets', icon: Layers },
    { id: 'invest', label: 'Invest', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col transition-colors pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] md:pb-12 relative overflow-hidden" style={{ backgroundColor: colors.bg }}>
      {/* Background Accent Glow */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[180px] pointer-events-none opacity-5 animate-ambient-glow"
        style={{ background: 'radial-gradient(circle, #F7931A 0%, transparent 70%)' }}
      />

      {/* ── TOP NAV BAR ───────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors"
        style={{
          backgroundColor: themeMode === 'dark' ? 'rgba(9, 10, 14, 0.88)' : 'rgba(248, 250, 252, 0.88)',
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
                <img src="/src/assets/images/satmix-logo.jpg" alt="Satmix Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-extrabold text-lg tracking-tight" style={{ color: colors.textPrimary }}>Satmix App</span>
            </div>
          </div>

          {/* Desktop Tab Selector with Shared Animated Indicator */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-colors"
                  style={{
                    color: isActive ? colors.primaryText : colors.textSecondary,
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeDesktopTabPill"
                      className="absolute inset-0 rounded-xl shadow-md z-0"
                      style={{ backgroundColor: colors.primary }}
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </span>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex-1 w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'dashboard' && <DashboardScreen />}
            {activeTab === 'baskets' && <BasketsScreen />}
            {activeTab === 'invest' && <InvestScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── MOBILE BOTTOM TAB BAR ─── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl px-4 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] flex items-center justify-around"
        style={{
          backgroundColor: themeMode === 'dark' ? 'rgba(18, 20, 28, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: colors.borderDim,
        }}
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all"
          style={{ color: activeTab === 'dashboard' ? colors.accent : colors.textTertiary }}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] tracking-tight font-medium">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('baskets')}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all"
          style={{ color: activeTab === 'baskets' ? colors.accent : colors.textTertiary }}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] tracking-tight font-medium">Baskets</span>
        </button>

        {/* Center Promoted Invest Action */}
        <button
          onClick={() => setActiveTab('invest')}
          className="flex flex-col items-center -mt-6"
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-2 transition-transform active:scale-95"
            style={{
              backgroundColor: activeTab === 'invest' ? colors.primary : colors.surface,
              borderColor: activeTab === 'invest' ? colors.accent : colors.cardBorder,
              color: activeTab === 'invest' ? colors.primaryText : colors.textPrimary,
            }}
          >
            <TrendingUp className="w-5 h-5" />
          </div>
          <span
            className="text-[10px] font-bold mt-1"
            style={{ color: activeTab === 'invest' ? colors.accent : colors.textTertiary }}
          >
            Invest
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all"
          style={{ color: activeTab === 'profile' ? colors.accent : colors.textTertiary }}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight font-medium">Profile</span>
        </button>
      </nav>
      {/* ── 4-STEP FIRST-RUN TUTORIAL MODAL ────────────────── */}
      <TutorialModal isOpen={tutorialOpen} onFinish={completeTutorial} />
    </div>
  );
};
