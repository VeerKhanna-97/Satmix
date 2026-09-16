import React, { useState } from 'react';
import {
  Shield,
  CreditCard,
  TrendingUp,
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
  Rocket,
  Wallet,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateTaxStatement, downloadCsvFile } from '../../utils/taxGenerator';
import { ACHIEVEMENTS } from '../../data/mockData';
import { SpotlightCard, CountUp, Magnet, FadeIn, ShinyText } from '../ui';
import { motion } from 'motion/react';

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
    transactions,
    logout,
    themeMode,
    toggleTheme,
    colors,
    triggerConfetti,
  } = useApp();

  const [reminderToggle, setReminderToggle] = useState(true);
  const [biometricToggle, setBiometricToggle] = useState(true);

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
    triggerConfetti();
  };

  const handleDownloadCsv = () => {
    if (!taxStatementData || !user) return;
    downloadCsvFile(`Satmix_Tax_Statement_${selectedFy.replace(/\s+/g, '_')}_${user.name.replace(/\s+/g, '_')}.csv`, taxStatementData.csvContent);
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
      if (a.id === 'a1') isUnlocked = streakDays >= 7; // Streak Master
      if (a.id === 'a3') isUnlocked = transactions.some((t) => (t.basketName.toLowerCase().includes('calm') || t.basketName.toLowerCase().includes('safe')) && t.status === 'SUCCESS');
      if (a.id === 'a4') isUnlocked = transactions.some((t) => t.basketName.toLowerCase().includes('growth') && t.status === 'SUCCESS');
      if (a.id === 'a5') isUnlocked = portfolioSummary.totalInvested >= 10000;
      return { ...a, unlocked: isUnlocked };
    });
  }, [streakDays, transactions, portfolioSummary.totalInvested]);

  const handleDownloadTds = () => {
    if (!user) return;
    const tdsContent = `SATMIX 1% TDS CERTIFICATE (UNDER SECTION 194S)\n` +
      `PAN: ${user.panNumberMasked}\n` +
      `Deductor: Satmix Technologies India Pvt Ltd (TAN: BLRS99281F)\n` +
      `Financial Year: ${selectedFy}\n` +
      `Total TDS Deducted: ₹${Math.round(portfolioSummary.totalInvested * 0.01)}\n` +
      `Status: Deposited with Income Tax Department (TRACES Form 16A Compliant)\n`;
    downloadCsvFile(`Satmix_TDS_Certificate_${selectedFy.replace(/\s+/g, '_')}.txt`, tdsContent);
    triggerConfetti();
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-16">
      {/* ── USER HEADER CARD ──────────────────────────────────── */}
      <FadeIn delay={0.05}>
        <SpotlightCard
          spotlightColor="rgba(99, 102, 241, 0.15)"
          className="rounded-3xl p-7 sm:p-9 border shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <div className="w-20 h-20 rounded-full border-2 flex items-center justify-center text-2xl font-extrabold font-mono" style={{ backgroundColor: colors.surface, borderColor: colors.accent, color: colors.accent }}>
            {user?.initials || 'VK'}
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-extrabold" style={{ color: colors.textPrimary }}>{user?.name || 'Veer Khanna'}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border font-mono w-fit mx-auto sm:mx-0 tracking-wider" style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}>
                <CheckCircle2 className="w-3 h-3" /> TIER-1 KYC VERIFIED
              </span>
            </div>

            <p className="text-xs font-mono" style={{ color: colors.textSecondary }}>
              {user?.email || 'veer@satmix.in'} · {user?.phone || '+91 98765 43210'}
            </p>

            <div className="pt-2 text-xs flex flex-wrap items-center justify-center sm:justify-start gap-4" style={{ color: colors.textSecondary }}>
              <span>Masked PAN: <strong className="font-mono" style={{ color: colors.textPrimary }}>{user?.panNumberMasked || 'ABCDE****F'}</strong></span>
              <span>Bank: <strong style={{ color: colors.textPrimary }}>{user?.bankName || 'HDFC Bank'} ({user?.bankAccountMasked || '•••• 4129'})</strong></span>
            </div>
          </div>
        </SpotlightCard>
      </FadeIn>

      {/* ── 4-METRIC FINANCIAL SNAPSHOT ───────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <SpotlightCard
          spotlightColor={colors.primaryTint}
          className="rounded-2xl p-4 border"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <div className="flex items-center gap-1.5 text-xs font-sans mb-1" style={{ color: colors.textSecondary }}>
            <CreditCard className="w-3.5 h-3.5" /> Total Saved
          </div>
          <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>
            <CountUp to={portfolioSummary.totalInvested} prefix="₹" duration={1.2} />
          </div>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor={colors.mintTint}
          className="rounded-2xl p-4 border"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <div className="flex items-center gap-1.5 text-xs font-sans mb-1" style={{ color: colors.semanticSuccess }}>
            <TrendingUp className="w-3.5 h-3.5" /> Net Return
          </div>
          <div className="text-lg font-bold" style={{ color: colors.semanticSuccess }}>
            +{portfolioSummary.totalReturnsPercentage}%
          </div>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor={colors.accentTint}
          className="rounded-2xl p-4 border"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <div className="flex items-center gap-1.5 text-xs font-sans mb-1" style={{ color: colors.accent }}>
            <Flame className="w-3.5 h-3.5 fill-current" /> Active Streak
          </div>
          <div className="text-lg font-bold" style={{ color: colors.accent }}>
            <CountUp to={streakDays} suffix=" Days" duration={1} />
          </div>
          <div className="text-[10px] mt-1 font-mono" style={{ color: colors.textTertiary }}>
            Best: {streakState.longestStreak}d · 🛡️ {streakState.freezeShieldsAvailable}/2
          </div>
        </SpotlightCard>

        <SpotlightCard
          spotlightColor={colors.primaryTint}
          className="rounded-2xl p-4 border"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          <div className="flex items-center gap-1.5 text-xs font-sans mb-1" style={{ color: colors.textSecondary }}>
            <Shield className="w-3.5 h-3.5" /> Daily SIP
          </div>
          <div className="text-lg font-bold" style={{ color: colors.textPrimary }}>₹{dailyAmount}/day</div>
        </SpotlightCard>
      </div>

      {/* ── MY CRYPTO ASSET INVENTORY & WALLET BALANCES ─────────── */}
      <SpotlightCard
        spotlightColor={colors.accentTint}
        className="rounded-3xl p-6 sm:p-7 border shadow-lg space-y-4"
        style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      >
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: colors.borderDim }}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl border" style={{ backgroundColor: colors.accentTint, borderColor: colors.borderAccent, color: colors.accent }}>
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>
                My Crypto Asset Inventory
              </h3>
              <p className="text-[11px] font-mono" style={{ color: colors.textSecondary }}>
                Non-custodial spot execution via CoinDCX API · Linked: {user?.bankName || 'HDFC Bank'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-xs font-bold font-mono px-3 py-1.5 rounded-xl border transition-opacity hover:opacity-80"
            style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.accent }}
          >
            Open Dashboard →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              coin: 'BTC',
              name: 'Bitcoin',
              units: tabMetrics.holdings.BTC.units,
              inrValue: tabMetrics.holdings.BTC.inrValue,
              color: '#F7931A',
              bg: 'rgba(247, 147, 26, 0.1)',
              border: 'rgba(247, 147, 26, 0.25)',
              formatted: tabMetrics.holdings.BTC.units === 0 ? '0.00 BTC' : `${tabMetrics.holdings.BTC.units.toFixed(8)} BTC`,
            },
            {
              coin: 'ETH',
              name: 'Ethereum',
              units: tabMetrics.holdings.ETH.units,
              inrValue: tabMetrics.holdings.ETH.inrValue,
              color: '#627EEA',
              bg: 'rgba(98, 126, 234, 0.1)',
              border: 'rgba(98, 126, 234, 0.25)',
              formatted: tabMetrics.holdings.ETH.units === 0 ? '0.00 ETH' : `${tabMetrics.holdings.ETH.units.toFixed(6)} ETH`,
            },
            {
              coin: 'SOL',
              name: 'Solana',
              units: tabMetrics.holdings.SOL.units,
              inrValue: tabMetrics.holdings.SOL.inrValue,
              color: '#14F195',
              bg: 'rgba(20, 241, 149, 0.1)',
              border: 'rgba(20, 241, 149, 0.25)',
              formatted: tabMetrics.holdings.SOL.units === 0 ? '0.00 SOL' : `${tabMetrics.holdings.SOL.units.toFixed(4)} SOL`,
            },
            {
              coin: 'USDT',
              name: 'Tether USD',
              units: tabMetrics.holdings.USDT.units,
              inrValue: tabMetrics.holdings.USDT.inrValue,
              color: '#26A17B',
              bg: 'rgba(38, 161, 123, 0.1)',
              border: 'rgba(38, 161, 123, 0.25)',
              formatted: `${tabMetrics.holdings.USDT.units.toFixed(2)} USDT`,
            },
          ].map((asset) => (
            <div
              key={asset.coin}
              className="p-3.5 rounded-2xl border flex flex-col justify-between"
              style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs font-mono"
                    style={{ backgroundColor: asset.bg, borderColor: asset.border, color: asset.color }}
                  >
                    {asset.coin}
                  </span>
                  <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>
                    {asset.name}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold font-mono truncate" style={{ color: colors.accent }}>
                  {asset.formatted}
                </div>
                <div className="text-[11px] font-mono mt-0.5" style={{ color: colors.textSecondary }}>
                  ₹{asset.inrValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SpotlightCard>

      {/* ── GAMIFICATION & XP PROGRESS ────────────────────────── */}
      <SpotlightCard
        spotlightColor={colors.accentTint}
        className="rounded-3xl p-6 border shadow-lg space-y-4"
        style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: colors.accent }} />
            <div>
              <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>Gamification: Level {userLevel} Investor</h3>
              <span className="text-[11px] font-mono" style={{ color: colors.textSecondary }}>
                {totalXp} / {nextLevelXp} XP ({levelProgressPct}%)
              </span>
            </div>
          </div>
          <span className="text-xs font-bold font-mono" style={{ color: colors.accent }}>
            Next: Level {userLevel + 1}
          </span>
        </div>

        <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: colors.surface }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: colors.accent, width: `${levelProgressPct}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${levelProgressPct}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          {dynamicAchievements.map((a) => (
            <div
              key={a.id}
              className="p-3 rounded-2xl border text-center space-y-1.5 transition-all hover:scale-[1.03]"
              style={{
                backgroundColor: a.unlocked ? colors.accentTint : colors.surface,
                borderColor: a.unlocked ? colors.borderAccent : colors.borderDim,
                opacity: a.unlocked ? 1 : 0.6,
              }}
            >
              <div className="w-7 h-7 mx-auto rounded-xl flex items-center justify-center" style={{ backgroundColor: colors.surface }}>
                {a.unlocked ? <Award className="w-4 h-4" style={{ color: colors.accent }} /> : <Lock className="w-3.5 h-3.5" style={{ color: colors.textTertiary }} />}
              </div>
              <div className="text-[11px] font-bold leading-tight truncate" style={{ color: colors.textPrimary }}>{a.title}</div>
              <div className="text-[9px] line-clamp-1" style={{ color: colors.textSecondary }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </SpotlightCard>

      {/* ── ACTIVE HABITS MANAGEMENT ──────────────────────────── */}
      <SpotlightCard
        spotlightColor={colors.accentTint}
        className="rounded-3xl p-6 border shadow-lg space-y-4"
        style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: colors.accent }} />
            <div>
              <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>Daily Investment Habits</h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>Manage your active AutoPay habits, pause, or adjust daily amounts.</p>
            </div>
          </div>
          <button onClick={() => setActiveTab('invest')} className="text-xs font-bold hover:underline" style={{ color: colors.accent }}>
            + Setup New →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Calm Habit */}
          <div className="p-4 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>Calm Basket</span>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono"
                  style={{
                    backgroundColor: !prototypeState.habits.stable.paused ? colors.mintTint : colors.surface,
                    color: !prototypeState.habits.stable.paused ? colors.semanticSuccess : colors.textTertiary,
                    border: `1px solid ${!prototypeState.habits.stable.paused ? colors.borderMint : colors.borderDim}`,
                  }}
                >
                  {!prototypeState.habits.stable.paused ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                85% USDT / 15% BTC · Daily SIP: <strong style={{ color: colors.textPrimary }}>₹{prototypeState.habits.stable.dailyAmount}/day</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => toggleHabitPause('stable')}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all"
                style={{
                  backgroundColor: !prototypeState.habits.stable.paused ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  borderColor: !prototypeState.habits.stable.paused ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                  color: !prototypeState.habits.stable.paused ? colors.semanticDanger : colors.semanticSuccess,
                }}
              >
                {!prototypeState.habits.stable.paused ? 'Pause Habit' : 'Resume Habit'}
              </button>
              <button
                onClick={() => setActiveTab('invest')}
                className="py-2 px-3 rounded-xl text-xs font-bold"
                style={{ backgroundColor: colors.accentTint, color: colors.accent }}
              >
                Adjust
              </button>
            </div>
          </div>

          {/* Growth Habit */}
          <div className="p-4 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4" style={{ color: colors.accent }} />
                  <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>Growth Basket</span>
                </div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono"
                  style={{
                    backgroundColor: !prototypeState.habits.growth.paused ? colors.accentTint : colors.surface,
                    color: !prototypeState.habits.growth.paused ? colors.accent : colors.textTertiary,
                    border: `1px solid ${!prototypeState.habits.growth.paused ? colors.borderAccent : colors.borderDim}`,
                  }}
                >
                  {!prototypeState.habits.growth.paused ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                70% BTC / 20% ETH / 10% SOL · Daily SIP: <strong style={{ color: colors.textPrimary }}>₹{prototypeState.habits.growth.dailyAmount}/day</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => toggleHabitPause('growth')}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all"
                style={{
                  backgroundColor: !prototypeState.habits.growth.paused ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  borderColor: !prototypeState.habits.growth.paused ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                  color: !prototypeState.habits.growth.paused ? colors.semanticDanger : colors.semanticSuccess,
                }}
              >
                {!prototypeState.habits.growth.paused ? 'Pause Habit' : 'Resume Habit'}
              </button>
              <button
                onClick={() => setActiveTab('invest')}
                className="py-2 px-3 rounded-xl text-xs font-bold"
                style={{ backgroundColor: colors.accentTint, color: colors.accent }}
              >
                Adjust
              </button>
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* ── TAX COMPLIANCE & STATEMENTS (LATEST FY) ───────────── */}
      <SpotlightCard
        spotlightColor={colors.accentTint}
        className="rounded-3xl p-6 border shadow-lg space-y-4"
        style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: colors.accent }} />
            <div>
              <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>Tax Reports & Compliance Center</h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>Indian Section 115BBH (30% Tax) & Section 194S (1% TDS) compliant.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* FY 2025-26 Statement Generator */}
          <div className="p-4 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>FY 2025-26 Tax Statement</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono" style={{ backgroundColor: colors.accentTint, color: colors.accent, border: `1px solid ${colors.borderAccent}` }}>CURRENT</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                Full annual capital gains statement, trade logs, and TDS reconciliation report.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Magnet strength={0.15} className="w-full block">
                <button
                  onClick={() => handleGenerateTaxStatement('FY 2025-26')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  Generate Statement
                </button>
              </Magnet>
            </div>
          </div>

          {/* FY 2026-27 Statement Generator */}
          <div className="p-4 rounded-2xl border flex flex-col justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>FY 2026-27 (Upcoming)</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono" style={{ backgroundColor: colors.accentTint, color: colors.accent, border: `1px solid ${colors.borderAccent}` }}>PROJECTION</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                Estimated year-to-date TDS credits and capital gains forecast.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Magnet strength={0.15} className="w-full block">
                <button
                  onClick={() => handleGenerateTaxStatement('FY 2026-27')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  Generate Statement
                </button>
              </Magnet>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t" style={{ borderColor: colors.borderDim }}>
          <span style={{ color: colors.textSecondary }}>Need Form 16A / TDS Certificates?</span>
          <button onClick={handleDownloadTds} className="font-bold hover:underline inline-flex items-center gap-1" style={{ color: colors.accent }}>
            <Download className="w-3.5 h-3.5" /> Download 1% TDS Certificate
          </button>
        </div>
      </SpotlightCard>

      {/* ── SETTINGS & CONTROLS ───────────────────────────────── */}
      <SpotlightCard
        spotlightColor="rgba(255, 255, 255, 0.05)"
        className="rounded-3xl p-6 border shadow-lg space-y-4"
        style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      >
        <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>App Preferences & Security</h3>

        <div className="divide-y" style={{ borderColor: colors.borderDim }}>
          {/* Theme Toggle */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.surface, color: colors.textSecondary }}>
                {themeMode === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>Theme Mode</div>
                <div className="text-[11px]" style={{ color: colors.textSecondary }}>{themeMode === 'dark' ? 'Dark Mode (Titanium Obsidian)' : 'Light Mode (Pure Porcelain)'}</div>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors hover:opacity-80"
              style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
            >
              Switch to {themeMode === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          {/* Daily Reminders */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.surface, color: colors.textSecondary }}>
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>Daily Deposit Notifications</div>
                <div className="text-[11px]" style={{ color: colors.textSecondary }}>Get daily AutoPay transaction status via SMS / App</div>
              </div>
            </div>
            <button
              onClick={() => setReminderToggle(!reminderToggle)}
              className={`w-11 h-6 rounded-full transition-colors relative ${reminderToggle ? 'bg-amber-600' : 'bg-gray-700'}`}
              style={{ backgroundColor: reminderToggle ? colors.accent : undefined }}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${reminderToggle ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          {/* Biometric */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.surface, color: colors.textSecondary }}>
                <Fingerprint className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>Biometric App Lock</div>
                <div className="text-[11px]" style={{ color: colors.textSecondary }}>Require FaceID / Fingerprint for PIN authentication</div>
              </div>
            </div>
            <button
              onClick={() => setBiometricToggle(!biometricToggle)}
              className={`w-11 h-6 rounded-full transition-colors relative ${biometricToggle ? 'bg-amber-600' : 'bg-gray-700'}`}
              style={{ backgroundColor: biometricToggle ? colors.accent : undefined }}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${biometricToggle ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          {/* First-Run Tutorial Guide Replay */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.surface, color: colors.textSecondary }}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>First-Run Tutorial Guide</div>
                <div className="text-[11px]" style={{ color: colors.textSecondary }}>Replay the 4-step onboarding walk-through</div>
              </div>
            </div>
            <button
              onClick={replayTutorial}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors hover:opacity-90"
              style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}
            >
              Replay Tutorial
            </button>
          </div>

          {/* WhatsApp Beta Community */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.surface, color: colors.textSecondary }}>
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>Satmix Founders WhatsApp Beta</div>
                <div className="text-[11px]" style={{ color: colors.textSecondary }}>Join 350+ private beta members & founders</div>
              </div>
            </div>
            <a
              href="https://chat.whatsapp.com/KWW9pIYhZOF3GlcsNvs7Jw"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors hover:opacity-90 inline-flex items-center gap-1"
              style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
            >
              Join Group →
            </a>
          </div>

          {/* Support Ticket */}
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl" style={{ backgroundColor: colors.surface, color: colors.textSecondary }}>
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>Founder Concierge & Support</div>
                <div className="text-[11px]" style={{ color: colors.textSecondary }}>Direct contact with Veer, Sheiden & Shashank</div>
              </div>
            </div>
            <button
              onClick={() => setSupportOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors hover:opacity-90"
              style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}
            >
              Open Ticket
            </button>
          </div>
        </div>
      </SpotlightCard>

      {/* ── LOGOUT BUTTON ─────────────────────────────────────── */}
      <Magnet strength={0.1} className="w-full block">
        <button
          onClick={logout}
          className="w-full py-4 px-6 rounded-2xl font-bold text-xs tracking-wider border border-rose-500/30 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Secure Session Logout</span>
        </button>
      </Magnet>

      {/* Tax Statement Modal */}
      {taxModalOpen && taxStatementData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl p-6 sm:p-8 border shadow-2xl space-y-5" style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold uppercase font-mono" style={{ color: colors.accent }}>Official Indian Web3 Tax Statement</span>
                <h3 className="text-xl font-extrabold mt-1" style={{ color: colors.textPrimary }}>{taxStatementData.statement.financialYear} ({taxStatementData.statement.assessmentYear})</h3>
              </div>
              <button onClick={() => setTaxModalOpen(false)} className="p-1 hover:opacity-80 transition-opacity" style={{ color: colors.textSecondary }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tax Details Grid */}
            <div className="p-4 rounded-2xl border space-y-3 font-mono text-xs" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex justify-between">
                <span className="font-sans" style={{ color: colors.textSecondary }}>Taxpayer Name:</span>
                <strong style={{ color: colors.textPrimary }}>{user?.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-sans" style={{ color: colors.textSecondary }}>Permanent Account Number:</span>
                <strong className="font-mono" style={{ color: colors.accent }}>{user?.panNumberMasked}</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-sans" style={{ color: colors.textSecondary }}>Total Transaction Volume:</span>
                <strong style={{ color: colors.textPrimary }}>₹{taxStatementData.statement.totalVolume.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-sans" style={{ color: colors.textSecondary }}>Realized Gains (Section 115BBH):</span>
                <strong style={{ color: colors.semanticSuccess }}>₹{taxStatementData.statement.realizedGains.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-sans" style={{ color: colors.textSecondary }}>Tax Payable @ 30%:</span>
                <strong className="text-rose-500">₹{taxStatementData.statement.taxPayable115BBH.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="font-sans" style={{ color: colors.textSecondary }}>TDS Deducted @ 1% u/s 194S:</span>
                <strong style={{ color: colors.accent }}>₹{taxStatementData.statement.tdsDeducted194S.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadCsv}
                className="flex-1 py-3.5 rounded-xl font-bold text-xs shadow-xl flex items-center justify-center gap-2"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <Download className="w-4 h-4" /> Download Official CSV Statement
              </button>
              <button
                onClick={() => setTaxModalOpen(false)}
                className="px-5 py-3.5 rounded-xl font-semibold text-xs border"
                style={{ borderColor: colors.cardBorder, color: colors.textSecondary }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {supportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl p-6 border shadow-2xl space-y-4" style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Founder Concierge Chat</h3>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Direct message to Veer Khanna, Sheiden Borges & team</p>
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
                  className="w-full p-3.5 rounded-2xl text-xs border focus:outline-none focus:ring-1"
                  style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                />
                <button
                  onClick={() => {
                    setSupportSent(true);
                    triggerConfetti();
                  }}
                  disabled={!supportMsg.trim()}
                  className="w-full py-3 rounded-xl font-bold text-xs disabled:opacity-40"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  Send Message
                </button>
              </div>
            ) : (
              <div className="p-4 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 mx-auto" style={{ color: colors.accent }} />
                <h4 className="font-bold text-sm" style={{ color: colors.textPrimary }}>Ticket Submitted!</h4>
                <p className="text-xs" style={{ color: colors.textSecondary }}>Our engineering team has received your message and will respond promptly.</p>
                <button
                  onClick={() => {
                    setSupportSent(false);
                    setSupportMsg('');
                    setSupportOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-xs"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
