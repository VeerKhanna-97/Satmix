import React from 'react';
import { Zap, Flame, Shield, Award, Check, AlertCircle, Sparkles, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpotlightCard, Magnet, CountUp } from '../ui';

interface StreakWeeklyTrackerProps {
  onQuickDeposit?: () => void;
  className?: string;
}

export const StreakWeeklyTracker: React.FC<StreakWeeklyTrackerProps> = ({ onQuickDeposit, className = '' }) => {
  const { colors, streakState, upiMandate, setActiveTab } = useApp();

  const {
    currentStreak,
    status,
    freezeShieldsAvailable,
    nextMilestone,
    weeklyHistory,
  } = streakState;

  // Status Styling Helpers
  const getStatusBadge = () => {
    switch (status) {
      case 'ACTIVE':
        return {
          label: 'Streak Active',
          bg: colors.accentTint,
          border: colors.borderAccent,
          text: colors.accent,
          icon: Flame,
          iconColor: colors.accent,
        };
      case 'AT_RISK':
        return {
          label: 'At Risk · Invest Today',
          bg: 'rgba(239, 68, 68, 0.12)',
          border: 'rgba(239, 68, 68, 0.35)',
          text: '#F87171',
          icon: AlertCircle,
          iconColor: '#EF4444',
        };
      case 'FROZEN':
        return {
          label: 'Shield Protected',
          bg: 'rgba(6, 182, 212, 0.12)',
          border: 'rgba(6, 182, 212, 0.35)',
          text: '#22D3EE',
          icon: Shield,
          iconColor: '#06B6D4',
        };
      case 'INACTIVE':
      default:
        return {
          label: 'Start Your Streak',
          bg: 'rgba(148, 163, 184, 0.1)',
          border: 'rgba(148, 163, 184, 0.2)',
          text: '#94A3B8',
          icon: Zap,
          iconColor: '#94A3B8',
        };
    }
  };

  const statusInfo = getStatusBadge();
  const StatusIcon = statusInfo.icon;

  return (
    <SpotlightCard
      spotlightColor={colors.accentTint}
      className={`rounded-3xl p-5 sm:p-6 border shadow-xl backdrop-blur-md transition-all ${className}`}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
      }}
    >
      {/* ── 1. HEADER ROW: Streak Count & Status ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: colors.borderDim }}>
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-inner transition-transform duration-300 hover:scale-110"
            style={{
              backgroundColor: currentStreak > 0 ? colors.accentTint : 'rgba(148, 163, 184, 0.1)',
              borderColor: currentStreak > 0 ? colors.borderAccent : colors.cardBorder,
              color: currentStreak > 0 ? colors.accent : '#94A3B8',
            }}
          >
            {currentStreak >= 7 ? (
              <Flame className="w-6 h-6 animate-pulse fill-current" />
            ) : currentStreak > 0 ? (
              <Zap className="w-5 h-5 fill-current" />
            ) : (
              <Zap className="w-5 h-5" style={{ color: colors.textTertiary }} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
                <CountUp to={currentStreak} duration={1} /> Day Streak
              </h4>
              <span
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border font-mono"
                style={{
                  backgroundColor: statusInfo.bg,
                  borderColor: statusInfo.border,
                  color: statusInfo.text,
                }}
              >
                <StatusIcon className="w-3 h-3" style={{ color: statusInfo.iconColor }} />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
              {status === 'ACTIVE'
                ? 'Daily micro-investing discipline on autopilot'
                : status === 'AT_RISK'
                ? 'Invest ₹10 today before 11:59 PM to save your streak'
                : status === 'FROZEN'
                ? 'Streak freeze shield automatically consumed'
                : 'Activate AutoPay or deposit ₹10 to begin'}
            </p>
          </div>
        </div>

        {/* Shield Counter & Quick Deposit */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <div
            className="px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5"
            style={{
              backgroundColor: freezeShieldsAvailable > 0 ? 'rgba(6, 182, 212, 0.1)' : 'rgba(148, 163, 184, 0.08)',
              borderColor: freezeShieldsAvailable > 0 ? 'rgba(6, 182, 212, 0.25)' : colors.borderDim,
              color: freezeShieldsAvailable > 0 ? '#22D3EE' : '#94A3B8',
            }}
            title="Earn 1 Streak Freeze Shield every 14 days of unbroken investing (Max 2)"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{freezeShieldsAvailable}/2 Shields</span>
          </div>

          {(status === 'AT_RISK' || status === 'INACTIVE') && (
            <Magnet strength={10}>
              <button
                onClick={onQuickDeposit || (() => setActiveTab('invest'))}
                className="px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Quick ₹10</span>
              </button>
            </Magnet>
          )}
        </div>
      </div>

      {/* ── 2. 7-DAY CIRCULAR CALENDAR TRACKER ── */}
      <div className="py-4">
        <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
          {weeklyHistory.map((day) => {
            return (
              <div key={day.date} className="flex flex-col items-center gap-1.5">
                <span
                  className="text-[10px] sm:text-xs font-bold uppercase font-mono"
                  style={{
                    color: day.isToday ? colors.accent : colors.textTertiary,
                  }}
                >
                  {day.dayLabel}
                </span>

                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border text-xs font-bold transition-all duration-300 ${
                    day.completed
                      ? 'scale-105'
                      : day.frozenWithShield
                      ? 'shadow-md shadow-cyan-500/10'
                      : day.isToday
                      ? 'ring-1 animate-pulse'
                      : 'opacity-60'
                  }`}
                  style={{
                    backgroundColor: day.completed
                      ? colors.accentTint
                      : day.frozenWithShield
                      ? 'rgba(6, 182, 212, 0.18)'
                      : day.isToday
                      ? colors.surface
                      : colors.surface,
                    borderColor: day.completed
                      ? colors.borderAccent
                      : day.frozenWithShield
                      ? 'rgba(6, 182, 212, 0.4)'
                      : day.isToday
                      ? colors.accent
                      : colors.borderDim,
                    color: day.completed
                      ? colors.accent
                      : day.frozenWithShield
                      ? '#22D3EE'
                      : day.isToday
                      ? colors.textPrimary
                      : colors.textTertiary,
                  }}
                >
                  {day.completed ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : day.frozenWithShield ? (
                    <Shield className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <span className="text-xs font-mono">{day.dayNumber}</span>
                  )}
                </div>

                {day.isToday && (
                  <span className="text-[9px] font-bold uppercase tracking-wider font-mono" style={{ color: colors.accent }}>
                    Today
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. NEXT MILESTONE PROGRESS BAR ── */}
      <div className="pt-3 border-t" style={{ borderColor: colors.borderDim }}>
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 font-bold" style={{ color: colors.textPrimary }}>
            <Award className="w-3.5 h-3.5" style={{ color: colors.accent }} />
            <span>Next Milestone: Day {nextMilestone.days} ({nextMilestone.title})</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-[11px]" style={{ color: colors.accent }}>
            <Sparkles className="w-3 h-3" style={{ color: colors.accent }} />
            <span>+{nextMilestone.rewardXp} XP</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.surface }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ backgroundColor: colors.accent, width: `${nextMilestone.progressPercentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-1.5 text-[11px]" style={{ color: colors.textSecondary }}>
          <span>
            {nextMilestone.remainingDays > 0
              ? `${nextMilestone.remainingDays} more day${nextMilestone.remainingDays > 1 ? 's' : ''} to reach ${nextMilestone.title}`
              : 'Milestone Achieved!'}
          </span>
          <span className="font-mono font-semibold" style={{ color: colors.textPrimary }}>{nextMilestone.progressPercentage}%</span>
        </div>
      </div>
    </SpotlightCard>
  );
};
