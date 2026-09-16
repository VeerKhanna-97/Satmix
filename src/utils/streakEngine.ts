// ============================================================
// FILE: src/utils/streakEngine.ts
// PURPOSE: Deterministic Streak Calculation Engine & Gamification Tiers
// ============================================================

import { Transaction, StreakState, StreakStatus, StreakMilestone, DayHistoryItem } from '../types';

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 1,
    title: 'Ignition',
    badgeName: 'First Step',
    rewardXp: 25,
    perkDescription: 'Automated wealth journey begun',
    iconName: 'zap',
  },
  {
    days: 3,
    title: 'Momentum',
    badgeName: 'Habit Starter',
    rewardXp: 50,
    perkDescription: 'Overcame starting friction',
    iconName: 'flame',
  },
  {
    days: 7,
    title: 'Streak Master',
    badgeName: 'Bronze Flame',
    rewardXp: 150,
    perkDescription: '1 full week of continuous DCA',
    iconName: 'award',
  },
  {
    days: 14,
    title: 'Fortified',
    badgeName: 'Shield Earned',
    rewardXp: 300,
    perkDescription: 'Unlocked +1 Streak Freeze Shield',
    iconName: 'shield',
  },
  {
    days: 21,
    title: 'Habit Formed',
    badgeName: 'Silver Flame',
    rewardXp: 500,
    perkDescription: 'Scientific 21-day habit threshold reached',
    iconName: 'sparkles',
  },
  {
    days: 30,
    title: 'Monthly Titan',
    badgeName: 'Gold Flame',
    rewardXp: 1000,
    perkDescription: '1 Month of automated financial discipline',
    iconName: 'crown',
  },
  {
    days: 100,
    title: 'Centurion',
    badgeName: 'Platinum Crown',
    rewardXp: 5000,
    perkDescription: 'Top 1% elite disciplined investor tier',
    iconName: 'trophy',
  },
];

/**
 * Format a Date object or ISO timestamp into 'YYYY-MM-DD'
 */
export function toDateKey(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Add or subtract days from a YYYY-MM-DD date string
 */
export function shiftDateKey(dateKey: string, daysOffset: number): string {
  const d = new Date(dateKey);
  d.setDate(d.getDate() + daysOffset);
  return toDateKey(d);
}

/**
 * Difference in days between two date keys (d1 - d2)
 */
export function getDaysDifference(dateKey1: string, dateKey2: string): number {
  const d1 = new Date(dateKey1).getTime();
  const d2 = new Date(dateKey2).getTime();
  const diffTime = d1 - d2;
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate the comprehensive streak state given a user's transactions and existing streak data
 */
export function calculateStreakState(
  transactions: Transaction[],
  savedStreakState?: Partial<StreakState> | null
): StreakState {
  const todayKey = toDateKey(new Date());
  const yesterdayKey = shiftDateKey(todayKey, -1);

  // 1. Build a map of all unique investment days from successful transactions
  const historyMap: Record<
    string,
    { invested: boolean; amount: number; txId?: string; frozenWithShield?: boolean }
  > = {};

  transactions
    .filter((tx) => (tx.type === 'DAILY_SIP' || tx.type === 'ONE_TIME') && tx.status === 'SUCCESS')
    .forEach((tx) => {
      const dateKey = tx.isoTimestamp ? toDateKey(tx.isoTimestamp) : todayKey;
      if (!historyMap[dateKey]) {
        historyMap[dateKey] = { invested: true, amount: tx.amount, txId: tx.id };
      } else {
        historyMap[dateKey].amount += tx.amount;
      }
    });

  const uniqueInvestedDates = Object.keys(historyMap).sort();
  const totalInvestedDays = uniqueInvestedDates.length;

  if (totalInvestedDays === 0) {
    return createEmptyStreakState();
  }

  // 2. Determine freeze shields available (1 shield earned per 14 active days, cap at 2)
  const earnedShields = Math.min(2, Math.floor(totalInvestedDays / 14));
  let freezeUsedDates: string[] = savedStreakState?.freezeUsedDates || [];
  let availableShields = Math.max(0, earnedShields - freezeUsedDates.length);

  // 3. Calculate consecutive days ending at today or yesterday
  let currentStreak = 0;
  let cursorDate = todayKey;
  let status: StreakStatus = 'INACTIVE';

  const hasToday = Boolean(historyMap[todayKey]?.invested);
  const hasYesterday = Boolean(historyMap[yesterdayKey]?.invested);

  if (hasToday) {
    status = 'ACTIVE';
    cursorDate = todayKey;
  } else if (hasYesterday) {
    status = 'AT_RISK';
    cursorDate = yesterdayKey;
  } else {
    // Check if yesterday can be saved by a freeze shield
    if (availableShields > 0 && uniqueInvestedDates.length > 0) {
      const lastActive = uniqueInvestedDates[uniqueInvestedDates.length - 1];
      const gap = getDaysDifference(todayKey, lastActive);
      if (gap === 2) {
        // Missed only yesterday, freeze shield can save it
        if (!freezeUsedDates.includes(yesterdayKey)) {
          freezeUsedDates = [...freezeUsedDates, yesterdayKey];
          availableShields = Math.max(0, availableShields - 1);
        }
        historyMap[yesterdayKey] = {
          invested: false,
          amount: 0,
          frozenWithShield: true,
        };
        status = 'FROZEN';
        cursorDate = yesterdayKey;
      } else {
        status = 'INACTIVE';
      }
    } else {
      status = 'INACTIVE';
    }
  }

  // Count consecutive days backward from cursorDate
  if (status !== 'INACTIVE') {
    let checkDate = cursorDate;
    while (true) {
      if (historyMap[checkDate]?.invested || historyMap[checkDate]?.frozenWithShield) {
        currentStreak += 1;
        checkDate = shiftDateKey(checkDate, -1);
      } else {
        break;
      }
    }
  }

  const longestStreak = Math.max(currentStreak, savedStreakState?.longestStreak || currentStreak);
  const lastActiveDate = uniqueInvestedDates[uniqueInvestedDates.length - 1] || null;

  // 4. Generate 7-Day Trailing Weekly History (Past 6 days + Today)
  const weeklyHistory: DayHistoryItem[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const dKey = shiftDateKey(todayKey, -i);
    const dObj = new Date(dKey);
    const dayLabel = dayNames[dObj.getDay()];
    const dayNumber = dObj.getDate();
    const isToday = dKey === todayKey;
    const isFuture = getDaysDifference(dKey, todayKey) > 0;
    const isInvested = Boolean(historyMap[dKey]?.invested);
    const isFrozen = Boolean(historyMap[dKey]?.frozenWithShield);

    weeklyHistory.push({
      date: dKey,
      dayLabel,
      dayNumber,
      completed: isInvested,
      isToday,
      isFuture,
      frozenWithShield: isFrozen,
      amount: historyMap[dKey]?.amount,
    });
  }

  // 5. Determine Next Milestone
  const nextMilestoneItem =
    STREAK_MILESTONES.find((m) => m.days > currentStreak) ||
    STREAK_MILESTONES[STREAK_MILESTONES.length - 1];

  const prevMilestoneDays =
    STREAK_MILESTONES.slice()
      .reverse()
      .find((m) => m.days <= currentStreak)?.days || 0;

  const milestoneSpan = nextMilestoneItem.days - prevMilestoneDays;
  const progressInSpan = currentStreak - prevMilestoneDays;
  const progressPercentage =
    milestoneSpan > 0 ? Math.min(100, Math.round((progressInSpan / milestoneSpan) * 100)) : 100;

  return {
    currentStreak,
    longestStreak,
    lastActiveDate,
    status,
    freezeShieldsAvailable: availableShields,
    freezeUsedDates,
    totalInvestedDays,
    nextMilestone: {
      days: nextMilestoneItem.days,
      title: nextMilestoneItem.title,
      rewardXp: nextMilestoneItem.rewardXp,
      remainingDays: Math.max(0, nextMilestoneItem.days - currentStreak),
      progressPercentage,
    },
    weeklyHistory,
    history: historyMap,
  };
}

export function createEmptyStreakState(): StreakState {
  const todayKey = toDateKey(new Date());
  const weeklyHistory: DayHistoryItem[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const dKey = shiftDateKey(todayKey, -i);
    const dObj = new Date(dKey);
    weeklyHistory.push({
      date: dKey,
      dayLabel: dayNames[dObj.getDay()],
      dayNumber: dObj.getDate(),
      completed: false,
      isToday: dKey === todayKey,
      isFuture: false,
    });
  }

  return {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    status: 'INACTIVE',
    freezeShieldsAvailable: 0,
    freezeUsedDates: [],
    totalInvestedDays: 0,
    nextMilestone: {
      days: 1,
      title: 'Ignition',
      rewardXp: 25,
      remainingDays: 1,
      progressPercentage: 0,
    },
    weeklyHistory,
    history: {},
  };
}
