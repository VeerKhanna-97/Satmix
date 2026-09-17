// ============================================================
// FILE: src/types/index.ts
// PURPOSE: Core domain contracts and models for Satmix 4.0
// ============================================================

export type BasketId = 'stable' | 'growth';

export interface AssetAllocation {
  label: string;
  ticker: string;
  pct: number;
  colorKey: 'gold' | 'violet' | 'blue' | 'mint' | 'purple' | 'primary';
  desc: string;
}

export interface Basket {
  id: BasketId;
  name: string;
  riskLabel: string;
  riskTier: 'Conservative' | 'Aggressive';
  tagline: string;
  disclosure?: string;
  accentColorKey: 'mint' | 'blue' | 'gold';
  tintColorKey: 'mintTint' | 'blueTint' | 'goldTint' | 'purpleTint';
  icon: string;
  returnRange: string;
  historicalCagr: string;
  growthRate: number; // baseline growth rate
  volatility: string;
  rebalance: string;
  custodyPartner: string;
  minDailyAmount: number;
  chips: number[];
  allocation: AssetAllocation[];
}

export interface PrototypeUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string; // SHA-256 hashed locally for client-side security
  createdAt: string;
}

export interface HabitConfig {
  setupAt: string | null;
  dailyAmount: number;
  paused: boolean;
  streakStartedAt: string | null;
  holdings: {
    BTC: number;
    ETH: number;
    SOL: number;
    USDT: number;
  };
}

export interface ActivityFill {
  asset: string;
  inr: number;
  units: number;
  priceInr: number;
}

export interface ActivityEntry {
  id: string;
  date: string;
  amount: number;
  basketId: BasketId;
  status: 'recorded';
  fills?: ActivityFill[];
}

export interface ValueHistoryPoint {
  date: string;
  marketValueInr: number;
  investedInr: number;
}

export interface PrototypeState {
  sessionUserId: string | null;
  users: PrototypeUser[];
  tutorialDone: boolean;
  quizCompleted: boolean;
  quizAnswers: Record<string, string>;
  quizScore: number | null; // 0 to 6
  suggestedBasketId: BasketId | null;
  setupBasketId: BasketId | null;
  habits: {
    stable: HabitConfig;
    growth: HabitConfig;
  };
  activity: ActivityEntry[];
  notifications: {
    habitReminders: boolean;
    productUpdates: boolean;
    communityTips: boolean;
  };
  virtualBalanceInr: number;
  valueHistory: ValueHistoryPoint[];
  lastAccruedDate: string | null;
  lastPricesAt: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  memberSince: string;
  kycStatus: 'VERIFIED_TIER_1' | 'PENDING' | 'UNVERIFIED';
  panNumberMasked: string;
  bankName: string;
  bankAccountMasked: string;
  vpa: string;
  pinHash: string; // SHA-256 hash for secure authentication
}

export interface UpiMandate {
  id: string;
  bankName: string;
  accountLast4: string;
  vpa: string;
  dailyAmount: number;
  status: 'ACTIVE' | 'PAUSED' | 'NONE';
  executionTime: string;
  maxCapPerDay: number;
  umnNumber: string;
  createdAt: string;
  nextExecutionDate: string;
}

export interface Transaction {
  id: string;
  type: 'DAILY_SIP' | 'ONE_TIME' | 'WITHDRAWAL' | 'REFERRAL_BONUS';
  title: string;
  basketName: string;
  amount: number;
  status: 'SUCCESS' | 'PROCESSING' | 'FAILED';
  timestamp: string; // e.g. "Today, 08:00 AM"
  isoTimestamp: string; // ISO string for time-weighted valuation
  utrNumber: string;
  paymentMethod: string;
  assetSplit?: { [ticker: string]: number }; // In INR
}

export interface PortfolioSummary {
  currentValue: number;
  totalInvested: number;
  totalReturnsRupees: number;
  totalReturnsPercentage: number;
  oneDayChangeRupees: number;
  oneDayChangePercentage: number;
  averageMonthlyReturn: number;
}

export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  priceUsd: number;
  priceInr: number;
  changePercent24Hr: number;
}

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  category: 'UX' | 'Payments' | 'Baskets' | 'Bugs' | 'Feature Request' | 'General';
  comment: string;
  timestamp: string;
}

export interface TaxStatement {
  assessmentYear: string;
  financialYear: string;
  totalVolume: number;
  totalDeposits: number;
  totalWithdrawals: number;
  netPortfolioValue: number;
  realizedGains: number;
  transactionsCount: number;
  generatedAt: string;
}

export type StreakStatus = 'ACTIVE' | 'AT_RISK' | 'FROZEN' | 'INACTIVE';

export interface StreakMilestone {
  days: number;
  title: string;
  badgeName: string;
  rewardXp: number;
  perkDescription: string;
  iconName: string;
}

export interface DayHistoryItem {
  date: string; // 'YYYY-MM-DD'
  dayLabel: string; // 'Sun', 'Mon', 'Tue', ...
  dayNumber: number; // 1-31
  completed: boolean;
  isToday: boolean;
  isFuture: boolean;
  frozenWithShield?: boolean;
  amount?: number;
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  status: StreakStatus;
  freezeShieldsAvailable: number;
  freezeUsedDates: string[];
  totalInvestedDays: number;
  nextMilestone: {
    days: number;
    title: string;
    rewardXp: number;
    remainingDays: number;
    progressPercentage: number;
  };
  weeklyHistory: DayHistoryItem[];
  history: {
    [dateKey: string]: {
      invested: boolean;
      amount: number;
      txId?: string;
      frozenWithShield?: boolean;
    };
  };
}

