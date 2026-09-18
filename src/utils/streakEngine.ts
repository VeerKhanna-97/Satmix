// ============================================================
// FILE: src/utils/streakEngine.ts
// PURPOSE: Deterministic Streak Calculation Engine & Gamification Tiers
//          Fixed Sunday-to-Saturday Calendar Week with Accurate Month Mapping
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
 * Format a Date object or ISO timestamp into local 'YYYY-MM-DD' key
 */
export function toDateKey(date: Date | string | number): string {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
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
 * Add or subtract days from a YYYY-MM-DD date string with local calendar precision
 */
export function shiftDateKey(dateKey: string, daysOffset: number): string {
  const parts = dateKey.split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() + daysOffset);
    return toDateKey(d);
  }
  const d = new Date(dateKey);
  d.setDate(d.getDate() + daysOffset);
  return toDateKey(d);
}

/**
 * Difference in days between two date keys (d1 - d2)
 */
export function getDaysDifference(dateKey1: string, dateKey2: string): number {
  const [y1, m1, d1] = dateKey1.split('-').map(Number);
  const [y2, m2, d2] = dateKey2.split('-').map(Number);
  const dateObj1 = new Date(y1, m1 - 1, d1);
  const dateObj2 = new Date(y2, m2 - 1, d2);
  const diffTime = dateObj1.getTime() - dateObj2.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get the Sunday (00:00:00 local time) of the calendar week for any given date
 */
export function getStartOfWeek(date: Date | string | number = new Date()): Date {
  let d: Date;
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [y, m, day] = date.split('-').map(Number);
    d = new Date(y, m - 1, day, 0, 0, 0, 0);
  } else {
    d = new Date(date);
    d.setHours(0, 0, 0, 0);
  }
  const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  d.setDate(d.getDate() - dayOfWeek);
  return d;
}

/**
 * Generate accurate 7-day Sunday-to-Saturday calendar week items
 */
export function getCurrentCalendarWeek(
  historyMap: Record<
    string,
    { invested: boolean; amount: number; txId?: string; frozenWithShield?: boolean }
  >,
  todayDate: Date = new Date()
): DayHistoryItem[] {
  const todayKey = toDateKey(todayDate);
  const sunday = getStartOfWeek(todayDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weeklyHistory: DayHistoryItem[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    d.setHours(0, 0, 0, 0);

    const dKey = toDateKey(d);
    const dayLabel = dayNames[i];
    const dayNumber = d.getDate();
    const monthLabel = monthNames[d.getMonth()];
    const fullDate = d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const isToday = dKey === todayKey;
    const isFuture = dKey > todayKey;
    const isInvested = Boolean(historyMap[dKey]?.invested);
    const isFrozen = Boolean(historyMap[dKey]?.frozenWithShield);

    weeklyHistory.push({
      date: dKey,
      dayLabel,
      dayNumber,
      monthLabel,
      fullDate,
      completed: isInvested,
      isToday,
      isFuture,
      frozenWithShield: isFrozen,
      amount: historyMap[dKey]?.amount,
    });
  }

  return weeklyHistory;
}

/**
 * Calculate the comprehensive streak state given a user's transactions and existing streak data
 */
export function calculateStreakState(
  transactions: Transaction[],
  savedStreakState?: Partial<StreakState> | null
): StreakState {
  const todayDate = new Date();
  const todayKey = toDateKey(todayDate);
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

  // 4. Generate Standard Sunday-to-Saturday Calendar Week
  const weeklyHistory = getCurrentCalendarWeek(historyMap, todayDate);

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
  const weeklyHistory = getCurrentCalendarWeek({}, new Date());

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

