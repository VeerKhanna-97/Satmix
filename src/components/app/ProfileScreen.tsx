import React, { useState } from 'react';
import {
  User,
  Shield,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Zap,
  CheckCircle2,
  FileText,
  Download,
  Moon,
  Sun,
  Bell,
  Fingerprint,
  MessageSquare,
  LogOut,
  X,
  Award,
  Lock,
  Flame,
  Sparkles,
  ChevronDown,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Mail,
  Phone,
  Eye,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateTaxStatement, downloadCsvFile } from '../../utils/taxGenerator';
import { ACHIEVEMENTS } from '../../data/mockData';
import { SpotlightCard, CountUp } from '../ui';
import { motion, AnimatePresence } from 'motion/react';
import { BasketCurrencyIcons } from '../common/BasketCurrencyIcons';

type SettingsSection = 'profile' | 'notifications' | 'security' | 'display' | 'tax' | 'concierge';

export const ProfileScreen: React.FC = () => {
  const {
    user,
    prototypeState,
    portfolioSummary,
    tabMetrics,
    streakDays,
    streakState,
    dailyAmount,
    toggleHabitPause,
    replayTutorial,
    setActiveTab,
    selectedBasketId,
    setSelectedBasketId,
    transactions,
    logout,
    themeMode,
    toggleTheme,
    colors,
    updateUserProfile,
    triggerConfetti,
  } = useApp();

  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [reminderToggle, setReminderToggle] = useState(true);
  const [biometricToggle, setBiometricToggle] = useState(true);
  const [smsAlertsToggle, setSmsAlertsToggle] = useState(true);
  const [inventoryExpanded, setInventoryExpanded] = useState(true);

  // Contact Addition Modal State (Link Email or Mobile Number)
  const [addContactModal, setAddContactModal] = useState<'email' | 'phone' | null>(null);
  const [contactInputValue, setContactInputValue] = useState('');
  const [contactInputError, setContactInputError] = useState('');
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [contactSuccessMsg, setContactSuccessMsg] = useState('');

  const hasEmail = Boolean(user?.email && user.email.trim());
  const hasPhone = Boolean(user?.phone && user.phone.trim());

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactInputError('');

    if (addContactModal === 'email') {
      const emailTrim = contactInputValue.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailTrim || !emailRegex.test(emailTrim)) {
        setContactInputError('Please enter a valid email address.');
        return;
      }
      setIsSavingContact(true);
      try {
        updateUserProfile({ email: emailTrim });
        triggerConfetti();
        setContactSuccessMsg('Email linked successfully.');
        setTimeout(() => {
          setAddContactModal(null);
          setContactInputValue('');
          setContactSuccessMsg('');
        }, 1100);
      } catch (err) {
        setContactInputError('Failed to save email. Please try again.');
      } finally {
        setIsSavingContact(false);
      }
    } else if (addContactModal === 'phone') {
      const cleanDigits = contactInputValue.replace(/\D/g, '').slice(-10);
      if (cleanDigits.length !== 10) {
        setContactInputError('Please enter a valid 10-digit mobile number.');
        return;
      }
      const formattedPhone = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`;
      setIsSavingContact(true);
      try {
        updateUserProfile({ phone: formattedPhone });
        triggerConfetti();
        setContactSuccessMsg('Mobile number linked successfully.');
        setTimeout(() => {
          setAddContactModal(null);
          setContactInputValue('');
          setContactSuccessMsg('');
        }, 1100);
      } catch (err) {
        setContactInputError('Failed to save mobile number. Please try again.');
      } finally {
        setIsSavingContact(false);
      }
    }
  };

  // Tax Statement State
  const [taxModalOpen, setTaxModalOpen] = useState(false);
  const [selectedFy, setSelectedFy] = useState<'FY 2025-26' | 'FY 2026-27'>('FY 2025-26');
  const [taxStatementData, setTaxStatementData] = useState<any>(null);

  // Support state
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportMsg, setSupportMsg] = useState('');
  const [supportSent, setSupportSent] = useState(false);

  const handleGenerateTaxStatement = (fy: 'FY 2025-26' | 'FY 2026-27') => {
    setSelectedFy(fy);
    if (!user) return;
    const result = generateTaxStatement(user, transactions, fy);
    setTaxStatementData(result);
    setTaxModalOpen(true);
  };

  const handleDownloadCsv = () => {
    if (!taxStatementData || !user) return;
    downloadCsvFile(`Satmix_Account_Statement_${selectedFy.replace(/\s+/g, '_')}_${user.name.replace(/\s+/g, '_')}.csv`, taxStatementData.csvContent);
  };

  // Dynamic Gamification & Achievements calculation
  const totalXp = React.useMemo(() => {
    let xp = 200; // Base onboarding XP
    xp += streakDays * 50; // +50 XP per active streak day
    xp += Math.min(3000, Math.floor(portfolioSummary.totalInvested / 10)); // +1 XP per ₹10 invested
    return xp;
  }, [streakDays, portfolioSummary.totalInvested]);

  const userLevel = Math.max(1, Math.floor(totalXp / 1000) + 1);
  const nextLevelXp = userLevel * 1000;
  const currentLevelBaseXp = (userLevel - 1) * 1000;
  const levelProgressPct = Math.min(100, Math.round(((totalXp - currentLevelBaseXp) / 1000) * 100));

  const dynamicAchievements = React.useMemo(() => {
    return ACHIEVEMENTS.map((a) => {
      let isUnlocked = a.unlocked;
      if (a.id === 'a1') isUnlocked = streakDays >= 7;
      if (a.id === 'a3') isUnlocked = transactions.some((t) => (t.basketName.toLowerCase().includes('safe') || t.basketName.toLowerCase().includes('stable')) && t.status === 'SUCCESS');
      if (a.id === 'a4') isUnlocked = transactions.some((t) => t.basketName.toLowerCase().includes('growth') && t.status === 'SUCCESS');
      if (a.id === 'a5') isUnlocked = portfolioSummary.totalInvested >= 10000;
      return { ...a, unlocked: isUnlocked };
    });
  }, [streakDays, transactions, portfolioSummary.totalInvested]);

  const handleDownloadLedger = () => {
    if (!user) return;
    const ledgerContent = `SATMIX ANNUAL TRANSACTION LEDGER\n` +
      `Account Holder: ${user.name}\n` +
      `Linked Bank: ${user.bankName || 'HDFC Bank'} (${user.bankAccountMasked || '•••• 4129'})\n` +
      `Financial Year: ${selectedFy}\n` +
      `Total Invested: ₹${portfolioSummary.totalInvested.toLocaleString('en-IN')}\n` +
      `Current Portfolio Value: ₹${portfolioSummary.currentValue.toLocaleString('en-IN')}\n` +
      `Status: Reconciled & Verified On-Chain\n`;
    downloadCsvFile(`Satmix_Transaction_Ledger_${selectedFy.replace(/\s+/g, '_')}.txt`, ledgerContent);
  };

  const isStableConfigured = prototypeState.habits.stable?.setupAt !== null;
  const isStableActive = isStableConfigured && !prototypeState.habits.stable.paused;
  const stableDailyRate =
    !prototypeState.habits.stable?.dailyAmount ||
    prototypeState.habits.stable.dailyAmount === 50 ||
    prototypeState.habits.stable.dailyAmount < 10
      ? 10
      : prototypeState.habits.stable.dailyAmount;

  const isGrowthConfigured = prototypeState.habits.growth?.setupAt !== null;
  const isGrowthActive = isGrowthConfigured && !prototypeState.habits.growth.paused;
  const growthDailyRate =
    !prototypeState.habits.growth?.dailyAmount ||
    prototypeState.habits.growth.dailyAmount === 50 ||
    prototypeState.habits.growth.dailyAmount < 30
      ? 30
      : prototypeState.habits.growth.dailyAmount;

  const totalActiveDailySip =
    (isStableActive ? stableDailyRate : 0) +
    (isGrowthActive ? growthDailyRate : 0);

  const navItems = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'display' as const, label: 'Display', icon: Moon },
    { id: 'tax' as const, label: 'Tax & Reports', icon: FileText },
    { id: 'concierge' as const, label: 'Concierge', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* ── TOP HEADER BANNER ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b" style={{ borderColor: colors.borderDim }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.textPrimary }}>
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: colors.textSecondary }}>
            Manage your personal profile, notifications, security credentials, and annual reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="text-[11px] font-bold font-mono px-3 py-1 rounded-lg border flex items-center gap-1.5"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
              color: colors.accent,
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            EARLY ACCESS
          </span>
        </div>
      </div>

      {/* ── 2-COLUMN INSTITUTIONAL LAYOUT ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Menu */}
        <div className="md:col-span-4 lg:col-span-3 space-y-2">
          {/* Mobile horizontal scrolling pill-bar / Desktop vertical stack */}
          <div
            className="rounded-[20px] p-2 sm:p-2.5 border flex md:flex-col overflow-x-auto gap-1.5 [-webkit-overflow-scrolling:touch] no-scrollbar"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ease-out active:scale-[0.98] text-left cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-neutral-400'}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] hidden md:block" />
                  )}
                </button>
              );
            })}

            <div className="h-px w-full my-1 border-t hidden md:block" style={{ borderColor: colors.borderDim }} />

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all active:scale-[0.98] text-left cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span className="flex-1">Sign Out</span>
            </button>
          </div>

          {/* Quick Streak & Level mini-card */}
          <div
            className="rounded-[20px] p-4 border space-y-3 hidden md:block"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold" style={{ color: colors.textSecondary }}>Habit Streak</span>
              <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" /> {streakDays} Days
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold" style={{ color: colors.textSecondary }}>Investor Tier</span>
              <span className="font-mono font-bold text-cyan-400">Level {userLevel}</span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: colors.surface }}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          {/* PROFILE TAB */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              {/* Personal Information Card */}
              <SpotlightCard
                spotlightColor="rgba(6, 182, 212, 0.08)"
                className="rounded-[22px] p-6 sm:p-7 border shadow-xl relative overflow-hidden"
                style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b" style={{ borderColor: colors.borderDim }}>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-2xl border-2 flex items-center justify-center font-extrabold text-xl font-mono shadow-md"
                      style={{ backgroundColor: colors.accentTint, borderColor: colors.accent, color: colors.accent }}
                    >
                      {user?.initials || 'VK'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                          {user?.name || 'Investor'}
                        </h2>
                        <span
                          className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.cardBorder,
                            color: colors.textTertiary,
                          }}
                        >
                          EARLY ACCESS
                        </span>
                      </div>
                      <p className="text-xs font-mono mt-0.5" style={{ color: colors.textSecondary }}>
                        User ID: SATMIX-EA-{user?.name ? user.name.slice(0, 3).toUpperCase() : 'INV'}-2026
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSupportOpen(true)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-[0.96] hover:bg-white/[0.04]"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    >
                      Contact Support
                    </button>
                  </div>
                </div>

                {/* Form Fields Grid matching Image 5 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                  {/* Full Name */}
                  <div className="p-4 rounded-xl border space-y-1.5" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                    <label className="text-[11px] font-mono font-medium block" style={{ color: colors.textSecondary }}>
                      Full Legal Name
                    </label>
                    <div className="font-semibold text-sm" style={{ color: colors.textPrimary }}>
                      {user?.name || 'Veer Khanna'}
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="p-4 rounded-xl border space-y-1.5" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono font-medium" style={{ color: colors.textSecondary }}>
                        Email Address
                      </label>
                      {!hasEmail && (
                        <button
                          type="button"
                          onClick={() => {
                            setContactInputValue('');
                            setContactInputError('');
                            setContactSuccessMsg('');
                            setAddContactModal('email');
                          }}
                          className="text-[11px] font-bold hover:underline cursor-pointer"
                          style={{ color: colors.accent }}
                        >
                          + Add Email
                        </button>
                      )}
                    </div>
                    <div className="font-semibold text-sm truncate" style={{ color: colors.textPrimary }}>
                      {hasEmail ? user?.email : <span className="text-neutral-500 font-normal italic">No email linked</span>}
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="p-4 rounded-xl border space-y-1.5" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono font-medium" style={{ color: colors.textSecondary }}>
                        Phone Number
                      </label>
                      {!hasPhone && (
                        <button
                          type="button"
                          onClick={() => {
                            setContactInputValue('');
                            setContactInputError('');
                            setContactSuccessMsg('');
                            setAddContactModal('phone');
                          }}
                          className="text-[11px] font-bold hover:underline cursor-pointer"
                          style={{ color: colors.accent }}
                        >
                          + Add Mobile
                        </button>
                      )}
                    </div>
                    <div className="font-semibold text-sm font-mono tabular-nums" style={{ color: colors.textPrimary }}>
                      {hasPhone ? user?.phone : <span className="text-neutral-500 font-normal italic font-sans">No phone linked</span>}
                    </div>
                  </div>

                  {/* KYC Verification Status */}
                  <div className="p-4 rounded-xl border space-y-1.5" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                    <label className="text-[11px] font-mono font-medium block" style={{ color: colors.textSecondary }}>
                      Identity Verification (KYC)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>
                        Early Access Tier
                      </span>
                    </div>
                    <p className="text-[10px] font-mono leading-tight mt-1" style={{ color: colors.textTertiary }}>
                      Full KYC verification will be conducted via Digilocker/UIDAI upon official public launch.
                    </p>
                  </div>
                </div>
              </SpotlightCard>

              {/* Active Daily Habits Summary */}
              <SpotlightCard
                spotlightColor="rgba(6, 182, 212, 0.08)"
                className="rounded-[22px] p-6 border shadow-xl space-y-4"
                style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>
                        Active Investment Habits
                      </h3>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        AutoPay SIP schedules executing daily at 8:00 AM IST
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('invest')}
                    className="text-xs font-bold font-mono px-3 py-1.5 rounded-xl border transition-all active:scale-[0.96] hover:bg-white/[0.04]"
                    style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.accent }}
                  >
                    + Setup New →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Stable Basket */}
                  <div className="p-4 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <BasketCurrencyIcons basketId="stable" size="sm" />
                          <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>Stable Basket</span>
                        </div>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono"
                          style={{
                            backgroundColor: !isStableConfigured ? colors.card : isStableActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                            color: !isStableConfigured ? colors.textTertiary : isStableActive ? '#10B981' : '#F59E0B',
                            border: `1px solid ${!isStableConfigured ? colors.borderDim : isStableActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                          }}
                        >
                          {!isStableConfigured ? 'NOT CONFIGURED' : isStableActive ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                        85% USDT / 15% BTC · {isStableConfigured ? <>Daily SIP: <strong style={{ color: colors.textPrimary }}>₹{stableDailyRate}/day</strong></> : 'Min: ₹10/day'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      {isStableConfigured ? (
                        <>
                          <button
                            onClick={() => toggleHabitPause('stable')}
                            className="flex-1 h-8 px-3 rounded-xl text-xs font-bold border transition-all active:scale-[0.98]"
                            style={{
                              backgroundColor: isStableActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              borderColor: isStableActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                              color: isStableActive ? colors.semanticDanger : colors.semanticSuccess,
                            }}
                          >
                            {isStableActive ? 'Pause' : 'Resume'}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBasketId('stable');
                              setActiveTab('invest');
                            }}
                            className="h-8 px-3 rounded-xl text-xs font-bold border transition-all active:scale-[0.98]"
                            style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}
                          >
                            Adjust
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedBasketId('stable');
                            setActiveTab('invest');
                          }}
                          className="w-full h-8 px-3 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
                          style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                        >
                          + Setup Habit
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Growth Basket */}
                  <div className="p-4 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <BasketCurrencyIcons basketId="growth" size="sm" />
                          <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>Growth Basket</span>
                        </div>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono"
                          style={{
                            backgroundColor: !isGrowthConfigured ? colors.card : isGrowthActive ? 'rgba(6, 182, 212, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                            color: !isGrowthConfigured ? colors.textTertiary : isGrowthActive ? '#22D3EE' : '#F59E0B',
                            border: `1px solid ${!isGrowthConfigured ? colors.borderDim : isGrowthActive ? 'rgba(6, 182, 212, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                          }}
                        >
                          {!isGrowthConfigured ? 'NOT CONFIGURED' : isGrowthActive ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                        70% BTC / 20% ETH / 10% SOL · {isGrowthConfigured ? <>Daily SIP: <strong style={{ color: colors.textPrimary }}>₹{growthDailyRate}/day</strong></> : 'Min: ₹30/day'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      {isGrowthConfigured ? (
                        <>
                          <button
                            onClick={() => toggleHabitPause('growth')}
                            className="flex-1 h-8 px-3 rounded-xl text-xs font-bold border transition-all active:scale-[0.98]"
                            style={{
                              backgroundColor: isGrowthActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              borderColor: isGrowthActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                              color: isGrowthActive ? colors.semanticDanger : colors.semanticSuccess,
                            }}
                          >
                            {isGrowthActive ? 'Pause' : 'Resume'}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBasketId('growth');
                              setActiveTab('invest');
                            }}
                            className="h-8 px-3 rounded-xl text-xs font-bold border transition-all active:scale-[0.98]"
                            style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}
                          >
                            Adjust
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedBasketId('growth');
                            setActiveTab('invest');
                          }}
                          className="w-full h-8 px-3 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
                          style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                        >
                          + Setup Habit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </SpotlightCard>

              {/* Asset Inventory */}
              <SpotlightCard
                spotlightColor="rgba(6, 182, 212, 0.08)"
                className="rounded-[22px] p-6 border shadow-xl space-y-4"
                style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
              >
                <div
                  onClick={() => setInventoryExpanded((prev) => !prev)}
                  className="flex items-center justify-between cursor-pointer select-none"
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <div>
                      <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>
                        Custodial Asset Balances
                      </h3>
                      <p className="text-xs" style={{ color: colors.textSecondary }}>
                        Spot holdings reconciled in real-time
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${inventoryExpanded ? 'rotate-180' : ''}`} style={{ color: colors.textSecondary }} />
                </div>

                {inventoryExpanded && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {[
                      { coin: 'BTC', name: 'Bitcoin', units: tabMetrics.holdings.BTC.units, inr: tabMetrics.holdings.BTC.inrValue, icon: '/currencies/bitcoin.png' },
                      { coin: 'ETH', name: 'Ethereum', units: tabMetrics.holdings.ETH.units, inr: tabMetrics.holdings.ETH.inrValue, icon: '/currencies/ethereum-eth-logo.png' },
                      { coin: 'SOL', name: 'Solana', units: tabMetrics.holdings.SOL.units, inr: tabMetrics.holdings.SOL.inrValue, icon: '/currencies/Solana.png' },
                      { coin: 'USDT', name: 'Tether USD', units: tabMetrics.holdings.USDT.units, inr: tabMetrics.holdings.USDT.inrValue, icon: '/currencies/USDT.png' },
                    ].map((item) => (
                      <div key={item.coin} className="p-3.5 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                        <div className="flex items-center gap-2 mb-2">
                          <img src={item.icon} alt={item.coin} className="w-5 h-5 object-contain" />
                          <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>{item.coin}</span>
                        </div>
                        <div>
                          <div className="font-mono text-xs font-bold truncate" style={{ color: colors.accent }}>
                            {item.units === 0 ? '0.00' : item.coin === 'USDT' ? item.units.toFixed(2) : item.units.toFixed(6)} {item.coin}
                          </div>
                          <div className="font-mono text-[11px] tabular-nums mt-0.5" style={{ color: colors.textSecondary }}>
                            ₹{item.inr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SpotlightCard>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeSection === 'notifications' && (
            <SpotlightCard
              spotlightColor="rgba(6, 182, 212, 0.08)"
              className="rounded-[22px] p-6 border shadow-xl space-y-5"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
            >
              <div>
                <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  Notification Preferences
                </h2>
                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                  Configure alerts for daily habit executions, streak freezes, and account security
                </p>
              </div>

              <div className="divide-y" style={{ borderColor: colors.borderDim }}>
                <div className="py-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>Daily AutoPay Debits</div>
                    <div className="text-[11px]" style={{ color: colors.textSecondary }}>Push notification when your daily ₹{totalActiveDailySip || dailyAmount} SIP executes at 8 AM</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReminderToggle(!reminderToggle)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${reminderToggle ? 'bg-cyan-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${reminderToggle ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>SMS / WhatsApp Alerts</div>
                    <div className="text-[11px]" style={{ color: colors.textSecondary }}>Real-time banking transaction alerts and mandate confirmation receipts</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSmsAlertsToggle(!smsAlertsToggle)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${smsAlertsToggle ? 'bg-cyan-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${smsAlertsToggle ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </SpotlightCard>
          )}

          {/* SECURITY TAB */}
          {activeSection === 'security' && (
            <SpotlightCard
              spotlightColor="rgba(6, 182, 212, 0.08)"
              className="rounded-[22px] p-6 border shadow-xl space-y-5"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
            >
              <div>
                <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  Security & Biometrics
                </h2>
                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                  Protect your portfolio balance and transaction approvals
                </p>
              </div>

              <div className="divide-y" style={{ borderColor: colors.borderDim }}>
                <div className="py-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>Biometric Authentication</div>
                    <div className="text-[11px]" style={{ color: colors.textSecondary }}>Require FaceID / TouchID when confirming withdrawals or modifying habits</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBiometricToggle(!biometricToggle)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${biometricToggle ? 'bg-cyan-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${biometricToggle ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>First-Run Tutorial Guide</div>
                    <div className="text-[11px]" style={{ color: colors.textSecondary }}>Replay the interactive 5-step onboarding walkthrough</div>
                  </div>
                  <button
                    type="button"
                    onClick={replayTutorial}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-[0.96] hover:bg-white/[0.04]"
                    style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}
                  >
                    Replay Tutorial
                  </button>
                </div>
              </div>
            </SpotlightCard>
          )}

          {/* DISPLAY TAB */}
          {activeSection === 'display' && (
            <SpotlightCard
              spotlightColor="rgba(6, 182, 212, 0.08)"
              className="rounded-[22px] p-6 border shadow-xl space-y-5"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
            >
              <div>
                <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  Display & Visual Appearance
                </h2>
                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                  Customize the interface theme and typography rhythm
                </p>
              </div>

              <div className="divide-y" style={{ borderColor: colors.borderDim }}>
                <div className="py-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>Active Theme</div>
                    <div className="text-[11px]" style={{ color: colors.textSecondary }}>
                      {themeMode === 'dark' ? 'Titanium Obsidian (Dark Mode)' : 'Pure Porcelain (Light Mode)'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-[0.96] hover:opacity-80"
                    style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                  >
                    Switch to {themeMode === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>

                <div className="py-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>Financial Numerals</div>
                    <div className="text-[11px]" style={{ color: colors.textSecondary }}>Strict monospaced tabular numbers for zero layout jitter</div>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ALWAYS ACTIVE
                  </span>
                </div>
              </div>
            </SpotlightCard>
          )}

          {/* TAX & REPORTS TAB */}
          {activeSection === 'tax' && (
            <SpotlightCard
              spotlightColor="rgba(6, 182, 212, 0.08)"
              className="rounded-[22px] p-6 border shadow-xl space-y-5"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                    Tax & Account Statements
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                    Annual trade summaries, TDS breakdowns, and verified ledgers
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadLedger}
                  className="font-bold text-xs hover:underline inline-flex items-center gap-1.5"
                  style={{ color: colors.accent }}
                >
                  <Download className="w-3.5 h-3.5" /> Full Ledger
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>FY 2025-26 Statement</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">CURRENT</span>
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                      Reconciled capital gains, TDS (1% Sec 194S), and transaction history.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGenerateTaxStatement('FY 2025-26')}
                    className="w-full mt-4 h-9 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
                    style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                  >
                    Generate Statement
                  </button>
                </div>

                <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>FY 2026-27 Forecast</span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold text-neutral-400 bg-white/[0.04] border border-white/[0.08]">PROJECTION</span>
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                      Projected asset accumulation and upcoming tax year estimates.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGenerateTaxStatement('FY 2026-27')}
                    className="w-full mt-4 h-9 rounded-xl text-xs font-bold border transition-all active:scale-[0.98] hover:bg-white/[0.04]"
                    style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                  >
                    Generate Forecast
                  </button>
                </div>
              </div>
            </SpotlightCard>
          )}

          {/* CONCIERGE TAB */}
          {activeSection === 'concierge' && (
            <SpotlightCard
              spotlightColor="rgba(6, 182, 212, 0.08)"
              className="rounded-[22px] p-6 border shadow-xl space-y-5"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
            >
              <div>
                <h2 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                  Founder Concierge & Community
                </h2>
                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                  Direct line to Veer Khanna and the Satmix core engineering team
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <div>
                    <h3 className="font-bold text-xs" style={{ color: colors.textPrimary }}>Beta WhatsApp Group</h3>
                    <p className="text-[11px] mt-1 leading-relaxed" style={{ color: colors.textSecondary }}>
                      Join 350+ private beta testers. Discuss roadmap, product updates, and features.
                    </p>
                  </div>
                  <a
                    href="https://chat.whatsapp.com/KWW9pIYhZOF3GlcsNvs7Jw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-4 h-9 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] hover:bg-white/[0.04]"
                    style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                  >
                    Join Beta Community →
                  </a>
                </div>

                <div className="p-4 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <div>
                    <h3 className="font-bold text-xs" style={{ color: colors.textPrimary }}>Direct Support Ticket</h3>
                    <p className="text-[11px] mt-1 leading-relaxed" style={{ color: colors.textSecondary }}>
                      Report any edge-case issue or suggest custom basket allocations.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSupportOpen(true)}
                    className="w-full mt-4 h-9 rounded-xl text-xs font-bold transition-all active:scale-[0.98]"
                    style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                  >
                    Open Support Ticket
                  </button>
                </div>
              </div>
            </SpotlightCard>
          )}
        </div>
      </div>

      {/* ── ACCOUNT STATEMENT MODAL ───────────────────────────── */}
      {taxModalOpen && taxStatementData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          style={{ WebkitBackdropFilter: 'blur(16px)' }}
        >
          <div className="w-full max-w-xl rounded-3xl p-5 sm:p-8 border shadow-2xl space-y-5 [-webkit-tap-highlight-color:transparent]" style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold uppercase font-mono" style={{ color: colors.accent }}>Verified Annual Statement</span>
                <h3 className="text-xl font-extrabold mt-1" style={{ color: colors.textPrimary }}>{taxStatementData.statement.financialYear}</h3>
              </div>
              <button onClick={() => setTaxModalOpen(false)} className="p-1 hover:opacity-80 transition-opacity cursor-pointer" style={{ color: colors.textSecondary }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl border space-y-2.5 sm:space-y-3 font-mono text-xs" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex flex-wrap sm:flex-nowrap justify-between gap-1">
                <span className="font-sans" style={{ color: colors.textSecondary }}>Account Holder:</span>
                <strong style={{ color: colors.textPrimary }}>{user?.name}</strong>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap justify-between gap-1">
                <span className="font-sans" style={{ color: colors.textSecondary }}>Linked Bank Account:</span>
                <strong className="font-mono tabular-nums" style={{ color: colors.accent }}>{user?.bankName || 'HDFC Bank'} ({user?.bankAccountMasked || '•••• 4129'})</strong>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap justify-between gap-1">
                <span className="font-sans" style={{ color: colors.textSecondary }}>Total Transaction Volume:</span>
                <strong className="tabular-nums" style={{ color: colors.textPrimary }}>₹{taxStatementData.statement.totalVolume.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap justify-between gap-1">
                <span className="font-sans" style={{ color: colors.textSecondary }}>Total Deposits & Purchases:</span>
                <strong className="tabular-nums" style={{ color: colors.semanticSuccess }}>₹{taxStatementData.statement.totalDeposits.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap justify-between gap-1">
                <span className="font-sans" style={{ color: colors.textSecondary }}>Total Withdrawals:</span>
                <strong className="tabular-nums" style={{ color: colors.textPrimary }}>₹{taxStatementData.statement.totalWithdrawals.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap justify-between gap-1">
                <span className="font-sans" style={{ color: colors.textSecondary }}>Net Portfolio Balance:</span>
                <strong className="tabular-nums" style={{ color: colors.accent }}>₹{taxStatementData.statement.netPortfolioValue.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
              <button
                onClick={handleDownloadCsv}
                className="w-full sm:flex-1 h-11 px-4 sm:px-5 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.96] touch-manipulation cursor-pointer"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <Download className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Download Official CSV Statement</span>
              </button>
              <button
                onClick={() => setTaxModalOpen(false)}
                className="w-full sm:w-auto h-11 px-5 rounded-xl font-semibold text-xs border transition-all hover:bg-white/5 active:scale-[0.96] touch-manipulation cursor-pointer"
                style={{ borderColor: colors.cardBorder, color: colors.textSecondary }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUPPORT TICKET MODAL ──────────────────────────────── */}
      {supportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          style={{ WebkitBackdropFilter: 'blur(12px)' }}
        >
          <div className="w-full max-w-md rounded-3xl p-5 sm:p-6 border shadow-2xl space-y-4 [-webkit-tap-highlight-color:transparent]" style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Founder Concierge Chat</h3>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Direct message to Veer Khanna & team</p>
              </div>
              <button onClick={() => setSupportOpen(false)} className="p-1 hover:opacity-80 transition-opacity" style={{ color: colors.textSecondary }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl border flex items-center justify-between text-xs" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <span style={{ color: colors.textSecondary }}>Prefer WhatsApp?</span>
              <a
                href="https://chat.whatsapp.com/KWW9pIYhZOF3GlcsNvs7Jw"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:underline"
                style={{ color: colors.accent }}
              >
                Join Beta WhatsApp →
              </a>
            </div>

            {!supportSent ? (
              <div className="space-y-3">
                <textarea
                  rows={4}
                  value={supportMsg}
                  onChange={(e) => setSupportMsg(e.target.value)}
                  placeholder="Tell us what you need help with, any suggestions for new crypto baskets, or mandate feedback..."
                  className="w-full p-3.5 rounded-2xl text-[16px] sm:text-xs border focus:outline-none focus:ring-1 transition-all touch-manipulation"
                  style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                />
                <button
                  onClick={() => setSupportSent(true)}
                  disabled={!supportMsg.trim()}
                  className="w-full py-3 rounded-xl font-bold text-xs disabled:opacity-40 cursor-pointer active:scale-[0.98]"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  Send Message
                </button>
              </div>
            ) : (
              <div className="p-4 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 mx-auto" style={{ color: colors.accent }} />
                <h4 className="font-bold text-sm" style={{ color: colors.textPrimary }}>Ticket Submitted!</h4>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Our team has received your message and will respond promptly.</p>
                <button
                  onClick={() => {
                    setSupportSent(false);
                    setSupportMsg('');
                    setSupportOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-xs cursor-pointer active:scale-[0.98]"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ADD EMAIL / MOBILE NUMBER MODAL ───────────────────── */}
      {addContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md [-webkit-backdrop-filter:blur(12px)] animate-fade-in">
          <div
            className="w-full max-w-md rounded-3xl p-6 sm:p-7 border shadow-2xl space-y-4 [-webkit-tap-highlight-color:transparent]"
            style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase font-mono mb-1" style={{ color: colors.accent }}>
                  {addContactModal === 'email' ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                  <span>{addContactModal === 'email' ? 'Link Email Address' : 'Link Mobile Number'}</span>
                </div>
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                  {addContactModal === 'email' ? 'Add Email to Account' : 'Add Mobile Number'}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                  {addContactModal === 'email'
                    ? 'Receive daily habit statements and secure recovery notices.'
                    : 'Required for UPI AutoPay execution notifications and habit alerts.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddContactModal(null)}
                className="p-1 hover:opacity-80 transition-opacity cursor-pointer"
                style={{ color: colors.textSecondary }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {contactSuccessMsg ? (
              <div className="p-5 text-center space-y-2 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderMint }}>
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                <h4 className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                  {contactSuccessMsg}
                </h4>
              </div>
            ) : (
              <form onSubmit={handleSaveContact} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-semibold mb-1.5" style={{ color: colors.textSecondary }}>
                    {addContactModal === 'email' ? 'Email Address' : '10-Digit Mobile Number'}
                  </label>
                  {addContactModal === 'email' ? (
                    <input
                      type="email"
                      value={contactInputValue}
                      onChange={(e) => {
                        setContactInputValue(e.target.value);
                        setContactInputError('');
                      }}
                      placeholder="e.g. name@example.com"
                      autoFocus
                      required
                      className="w-full h-11 px-3.5 rounded-xl text-base sm:text-xs border font-sans focus:outline-none focus:ring-2 focus:ring-[#5D17EB]/40"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: contactInputError ? colors.semanticDanger : colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className="h-11 px-3 rounded-xl border flex items-center justify-center font-mono text-xs font-bold"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.cardBorder,
                          color: colors.textSecondary,
                        }}
                      >
                        +91
                      </span>
                      <input
                        type="tel"
                        value={contactInputValue}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setContactInputValue(digits);
                          setContactInputError('');
                        }}
                        placeholder="98765 43210"
                        autoFocus
                        required
                        className="flex-1 h-11 px-3.5 rounded-xl text-base sm:text-xs border font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#5D17EB]/40"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: contactInputError ? colors.semanticDanger : colors.cardBorder,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  )}
                  {contactInputError && (
                    <p className="text-[11px] mt-1.5 font-sans" style={{ color: colors.semanticDanger }}>
                      {contactInputError}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={isSavingContact || !contactInputValue.trim()}
                    className="flex-1 h-11 px-5 rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.96] disabled:opacity-40 cursor-pointer"
                    style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                  >
                    {isSavingContact ? 'Saving...' : addContactModal === 'email' ? 'Save Email' : 'Save Mobile Number'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddContactModal(null)}
                    className="h-11 px-4 rounded-xl font-semibold text-xs border transition-all duration-150 hover:bg-white/5 active:scale-[0.96] cursor-pointer"
                    style={{ borderColor: colors.cardBorder, color: colors.textSecondary }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};