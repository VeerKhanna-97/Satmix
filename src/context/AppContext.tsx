// ============================================================
// FILE: src/context/AppContext.tsx
// PURPOSE: Central State Management, Canonical Prototype State Engine (v6),
//          Coinbase spot prices, dual concurrent habits, and live MTM accounting.
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  BasketId,
  UpiMandate,
  Transaction,
  PortfolioSummary,
  CryptoCoin,
  FeedbackItem,
  StreakState,
  PrototypeState,
} from '../types';
import { DARK_COLORS, LIGHT_COLORS } from '../theme/colors';
import { hashPin, verifyPin } from '../utils/crypto';
import {
  createInitialPrototypeState,
  loadPrototypeState,
  savePrototypeState,
  accrueMissingDays,
  fetchCoinbaseSpotPrices,
  calculateTabMetrics,
  executeOneTimeDeposit,
  executeWithdrawal,
  TabPortfolioMetrics,
  LiveCoinPrices,
  FALLBACK_LIVE_PRICES,
  formatDateKey,
} from '../utils/prototypeEngine';
import { fetchLiveCryptoPrices, FALLBACK_COINS } from '../utils/pricing';
import { calculateStreakState, createEmptyStreakState } from '../utils/streakEngine';
import { getBasketById } from '../data/baskets';

export type ViewMode = 'marketing' | 'auth' | 'app' | 'privacy' | 'terms' | 'refund' | 'cookies' | 'thank-you' | '404';
export type AppTab = 'dashboard' | 'performance' | 'baskets' | 'transactions' | 'invest' | 'profile';
export type DeviceFrame = 'full' | 'mobile';
export type CookieConsentChoice = 'all' | 'essential' | null;

interface AppContextType {
  // Theme & Layout
  themeMode: 'dark' | 'light';
  toggleTheme: () => void;
  colors: typeof DARK_COLORS;
  deviceFrame: DeviceFrame;
  setDeviceFrame: (frame: DeviceFrame) => void;

  // Cookie Governance (DPDP Act 2023)
  cookieConsent: CookieConsentChoice;
  setCookieConsent: (choice: 'all' | 'essential') => void;

  // View Navigation
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  authSubView: 'login' | 'signup' | 'quiz';
  setAuthSubView: (view: 'login' | 'signup' | 'quiz') => void;

  // Canonical Prototype State (satmix-prototype-v6)
  prototypeState: PrototypeState;
  activeTabFilter: 'all' | 'stable' | 'growth';
  setActiveTabFilter: (tab: 'all' | 'stable' | 'growth') => void;
  tabMetrics: TabPortfolioMetrics;
  livePrices: LiveCoinPrices;
  isPricesLoading: boolean;

  // Tutorial
  tutorialOpen: boolean;
  setTutorialOpen: (open: boolean) => void;
  completeTutorial: () => void;
  replayTutorial: () => void;

  // Authentication & Users
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  submitQuiz: (answers: Record<string, string>, score: number, suggestedBasket: BasketId) => void;
  completeOnboardingQuiz: (chosenBasket: BasketId) => void;
  logout: () => void;
  updateUserProfile: (updated: Partial<UserProfile>) => void;
  registeredUsersCount: number;

  // Strategy & Dual Habits Management
  selectedBasketId: BasketId;
  setSelectedBasketId: (id: BasketId) => void;
  dailyAmount: number;
  setDailyAmount: (amount: number) => void;
  setupHabit: (basketId: BasketId, amount: number) => Promise<boolean>;
  toggleHabitPause: (basketId: BasketId) => void;
  updateHabitAmount: (basketId: BasketId, amount: number) => void;

  // UPI Mandate & Simulation Legacy Bridges
  upiMandate: UpiMandate;
  setupUpiMandate: (amount: number, vpa: string, bankName: string) => Promise<boolean>;
  toggleUpiMandate: () => void;
  portfolioSummary: PortfolioSummary;
  streakDays: number;
  streakState: StreakState;
  transactions: Transaction[];
  executeOneTimeDeposit: (basketId: BasketId, amount: number, paymentMethod: string) => Promise<boolean>;
  simulateDeposit: (amount: number, paymentMethod: string, targetBasket?: BasketId) => Promise<boolean>;
  simulateWithdrawal: (amount: number, targetBasket?: 'all' | 'stable' | 'growth') => Promise<{ success: boolean; tx?: Transaction; error?: string }>;

  // Live Market
  liveCoins: CryptoCoin[];

  // Delights & Tester Feedback
  triggerConfetti: () => void;
  feedbackList: FeedbackItem[];
  submitFeedback: (rating: number, category: FeedbackItem['category'], comment: string) => void;
  feedbackOpen: boolean;
  setFeedbackOpen: (open: boolean) => void;
  triggerAccrual: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const FEEDBACK_DB_KEY = 'satmix_tester_feedbacks_v4';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme State
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('satmix_theme_mode') as 'dark' | 'light') || 'dark';
  });

  // Device Frame
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>('full');

  // Navigation state with URL route auto-detection
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const path = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      if (path.includes('privacy') || params.get('view') === 'privacy') return 'privacy';
      if (path.includes('terms') || params.get('view') === 'terms') return 'terms';
      if (path.includes('refund') || params.get('view') === 'refund') return 'refund';
      if (path.includes('cookies') || params.get('view') === 'cookies') return 'cookies';
      if (path.includes('thank-you') || params.get('view') === 'thank-you') return 'thank-you';
      if (path.includes('app') || params.get('view') === 'app') return 'app';
      if (params.get('view') === 'login' || params.get('view') === 'auth') return 'auth';
      return 'marketing';
    } catch {
      return 'marketing';
    }
  });
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [authSubView, setAuthSubView] = useState<'login' | 'signup' | 'quiz'>('login');

  // Canonical Prototype State (v6)
  const [prototypeState, setPrototypeState] = useState<PrototypeState>(() => loadPrototypeState());

  // Home Dashboard Tab Filter: All | Stable | Growth
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'stable' | 'growth'>('all');

  // Tutorial Modal Visibility
  const [tutorialOpen, setTutorialOpen] = useState(false);

  // Selected basket currently in view / being configured
  const [selectedBasketId, setSelectedBasketIdState] = useState<BasketId>(
    prototypeState.suggestedBasketId || 'stable'
  );
  const [dailyAmount, setDailyAmountState] = useState<number>(() => {
    const basket = prototypeState.suggestedBasketId || 'stable';
    return basket === 'growth' ? 30 : 10;
  });

  // Live Spot Prices
  const [livePrices, setLivePrices] = useState<LiveCoinPrices>(FALLBACK_LIVE_PRICES);
  const [liveCoins, setLiveCoins] = useState<CryptoCoin[]>(FALLBACK_COINS);
  const [isPricesLoading, setIsPricesLoading] = useState<boolean>(false);

  // Feedback Store & Drawer State
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(() => {
    try {
      const saved = localStorage.getItem(FEEDBACK_DB_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist prototypeState on changes
  const updateStateAndPersist = useCallback((updater: (prev: PrototypeState) => PrototypeState) => {
    setPrototypeState((prev) => {
      const next = updater(prev);
      savePrototypeState(next);
      return next;
    });
  }, []);

  // Fetch Live Prices & Trigger Accrual on Mount + Periodic (30s)
  const refreshPricesAndAccrue = useCallback(async () => {
    setIsPricesLoading(true);
    try {
      const prices = await fetchCoinbaseSpotPrices();
      setLivePrices(prices);

      const coins = await fetchLiveCryptoPrices();
      setLiveCoins(coins);

      // Trigger automatic calendar catch-up accrual
      updateStateAndPersist((currentState) => {
        const { state: accruedState } = accrueMissingDays(currentState, prices);
        return accruedState;
      });
    } catch (err) {
      console.warn('Price sync error:', err);
    } finally {
      setIsPricesLoading(false);
    }
  }, [updateStateAndPersist]);

  useEffect(() => {
    refreshPricesAndAccrue();
    const interval = setInterval(refreshPricesAndAccrue, 30000);
    return () => clearInterval(interval);
  }, [refreshPricesAndAccrue]);

  // Derived Active User (Hardened against WebKit invalid date exceptions & empty records)
  const activeUser = useMemo(() => {
    if (!prototypeState.sessionUserId) return null;
    const usersList = Array.isArray(prototypeState.users) ? prototypeState.users : [];
    const found = usersList.find((u) => u && u.id === prototypeState.sessionUserId);
    if (!found) return null;

    const safeName = (found.name || 'Investor').trim();
    const initials =
      safeName
        .split(' ')
        .filter(Boolean)
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'VK';

    let memberSince = 'Oct 2026';
    if (found.createdAt) {
      try {
        const d = new Date(found.createdAt);
        if (!isNaN(d.getTime())) {
          memberSince = d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        }
      } catch {}
    }

    const userProfile: UserProfile = {
      id: found.id,
      name: safeName,
      email: found.email || '',
      phone: found.phone || '',
      initials,
      memberSince,
      kycStatus: 'UNVERIFIED',
      panNumberMasked: '',
      bankName: 'HDFC Bank',
      bankAccountMasked: '•••• 4129',
      vpa: `${safeName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'satmix'}@okhdfcbank`,
      pinHash: found.password || '',
    };
    return userProfile;
  }, [prototypeState.sessionUserId, prototypeState.users]);

  const isAuthenticated = !!activeUser;
  // ── AUTO-SYNC ACTIVE LOCAL USER ACCOUNT TO CLOUD (MULTI-DEVICE PERSISTENCE) ──
  // Automatically syncs the active account from this machine (laptop) to Google Sheets
  // so that mobile phones and secondary devices can seamlessly log into the exact same account.
  useEffect(() => {
    if (!activeUser) return;

    const syncAccountToCloud = async () => {
      try {
        const currentUserObj = prototypeState.users.find((u) => u.id === activeUser.id);
        const passwordHash = currentUserObj?.password || 'mock_hash';

        const payload = {
          action: 'signup',
          user: {
            id: activeUser.id,
            name: activeUser.name,
            email: activeUser.email,
            phone: activeUser.phone,
            password: passwordHash,
            createdAt: currentUserObj?.createdAt || new Date().toISOString(),
          },
          userState: {
            habits: prototypeState.habits,
            activity: prototypeState.activity,
            valueHistory: prototypeState.valueHistory,
            tutorialDone: true,
            quizCompleted: true,
            suggestedBasketId: prototypeState.suggestedBasketId,
            setupBasketId: prototypeState.setupBasketId,
            savedStreak: prototypeState.savedStreak,
            virtualBalanceInr: prototypeState.virtualBalanceInr,
            lastAccruedDate: prototypeState.lastAccruedDate,
          },
        };

        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn('Auto cloud account sync note:', err);
      }
    };

    const timer = setTimeout(syncAccountToCloud, 1000);
    return () => clearTimeout(timer);
  }, [activeUser?.id, activeUser?.email, activeUser?.phone, prototypeState.habits, prototypeState.activity?.length]);


  // Theme Sync
  useEffect(() => {
    localStorage.setItem('satmix_theme_mode', themeMode);
    if (themeMode === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Cookie Consent State
  const [cookieConsent, setCookieConsentState] = useState<CookieConsentChoice>(() => {
    return (localStorage.getItem('satmix_cookie_consent_v4') as CookieConsentChoice) || null;
  });

  const setCookieConsent = useCallback((choice: 'all' | 'essential') => {
    setCookieConsentState(choice);
    localStorage.setItem('satmix_cookie_consent_v4', choice);
  }, []);

  // Confetti helper (Primary: #5D17EB, Legacy: #F7931A)
  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#5D17EB', '#E2E8F0', '#FFFFFF', '#8B5CF6', '#38BDF8'],
    });
  }, []);

  // Page Title and Meta updates
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });

    const titleMap: Record<ViewMode, string> = {
      marketing: 'Satmix : Automated Daily Crypto Micro-Investing via UPI (Start with ₹10/Day)',
      auth: 'Satmix : Secure Authentication & Risk Profile Quiz',
      app: 'Satmix Dashboard : Automated Crypto Micro-Savings & Rupee Cost Averaging',
      privacy: 'Privacy Policy : Satmix (DPDP Act 2023)',
      terms: 'Terms & Conditions : Satmix (Legal Framework)',
      refund: 'Refund & Cancellation Policy : Satmix (Zero Lock-in)',
      cookies: 'Cookie Policy & Consent Settings : Satmix',
      'thank-you': 'Early Access Confirmed : Welcome to Satmix',
      '404': '404 Page Not Found : Satmix',
    };

    document.title = titleMap[viewMode] || 'Satmix : Automated Daily Crypto Micro-Investing';
  }, [viewMode]);

  // Tab Portfolio Metrics (Calculated for current tab: All | Stable | Growth)
  const tabMetrics = useMemo(() => {
    return calculateTabMetrics(prototypeState, activeTabFilter, livePrices);
  }, [prototypeState, activeTabFilter, livePrices]);

  // Transaction Adapter (derived from activity ledger for unified views)
  const transactions: Transaction[] = useMemo(() => {
    const rawActivity = Array.isArray(prototypeState?.activity) ? prototypeState.activity : [];
    return rawActivity.map((act) => {
      const basketName = act.basketId === 'stable' ? 'Stable Basket' : 'Growth Basket';
      const isDeposit = act.type === 'deposit';
      const isWithdrawal = act.type === 'withdrawal' || act.amount < 0;

      const txType: Transaction['type'] = isWithdrawal
        ? 'WITHDRAWAL'
        : isDeposit
        ? 'ONE_TIME'
        : 'DAILY_SIP';

      const title = isWithdrawal
        ? `IMPS Bank Withdrawal (${basketName})`
        : isDeposit
        ? `Instant Top-Up (${basketName})`
        : `Daily Auto-Invest (${basketName})`;

      const displayAmount = Math.abs(act.amount);

      return {
        id: act.id,
        type: txType,
        title,
        basketName,
        amount: displayAmount,
        status: 'SUCCESS',
        timestamp: `${act.date} · ${isWithdrawal || isDeposit ? 'Completed' : '08:00 AM'}`,
        isoTimestamp: `${act.date}T08:00:00.000Z`,
        utrNumber: `50${act.id.replace(/\D/g, '').padEnd(10, '8').slice(-10)}`,
        paymentMethod: isWithdrawal
          ? `${activeUser?.bankName || 'HDFC Bank'} · ${activeUser?.bankAccountMasked || '•••• 4129'}`
          : isDeposit
          ? 'UPI Instant'
          : 'UPI AutoPay',
      };
    });
  }, [prototypeState.activity, activeUser]);

  // Legacy Portfolio Summary Adapter
  const portfolioSummary: PortfolioSummary = useMemo(() => {
    return {
      currentValue: tabMetrics.marketValue,
      totalInvested: tabMetrics.totalInvested,
      totalReturnsRupees: tabMetrics.netDeltaRupees,
      totalReturnsPercentage: tabMetrics.netDeltaPercentage,
      oneDayChangeRupees: Math.round(tabMetrics.marketValue * 0.015 * 100) / 100,
      oneDayChangePercentage: 1.5,
      averageMonthlyReturn: activeTabFilter === 'stable' ? 0.98 : 3.2,
    };
  }, [tabMetrics, activeTabFilter]);

  // Deterministic Streak State (with persisted shield usage & longest streak)
  const streakState: StreakState = useMemo(() => {
    return calculateStreakState(transactions, prototypeState.savedStreak);
  }, [transactions, prototypeState.savedStreak]);

  // Synchronize streak changes (longestStreak or used shields) into prototypeState
  useEffect(() => {
    const saved = prototypeState.savedStreak;
    const longestChanged = streakState.longestStreak > (saved?.longestStreak || 0);
    const usedChanged = streakState.freezeUsedDates.length !== (saved?.freezeUsedDates?.length || 0);
    if (longestChanged || usedChanged) {
      updateStateAndPersist((prev) => ({
        ...prev,
        savedStreak: {
          longestStreak: Math.max(streakState.longestStreak, prev.savedStreak?.longestStreak || 0),
          freezeUsedDates: streakState.freezeUsedDates,
        },
      }));
    }
  }, [streakState.longestStreak, streakState.freezeUsedDates, prototypeState.savedStreak, updateStateAndPersist]);

  const streakDays = streakState.currentStreak;

  // Selected Basket & Amount Setters
  const setSelectedBasketId = useCallback(
    (id: BasketId) => {
      setSelectedBasketIdState(id);
      updateStateAndPersist((s) => ({ ...s, setupBasketId: id }));
      setDailyAmountState((current) => {
        const defaultAmt = id === 'growth' ? 30 : 10;
        if (current < defaultAmt || current === 10 || current === 30 || current === 50) return defaultAmt;
        return current;
      });
    },
    [updateStateAndPersist]
  );

  const setDailyAmount = useCallback((amount: number) => {
    setDailyAmountState(amount);
  }, []);

  // Authentication: Sign Up with Strict Credential Capture & Authoritative Cloud Persistence
  const signUp = useCallback(
    async (name: string, email: string, password = '', phone = ''): Promise<{ success: boolean; error?: string }> => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanDigits = phone ? phone.replace(/\D/g, '').slice(0, 10) : '';

      if (!cleanDigits || cleanDigits.length !== 10) {
        return {
          success: false,
          error: 'A valid 10-digit mobile number is required to register.',
        };
      }

      // Check if account already exists in central cloud repository (Google Sheets)
      try {
        const cloudCheck = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'lookup', identifier: cleanEmail }),
        });
        if (cloudCheck.ok) {
          const cloudRes = await cloudCheck.json();
          if (cloudRes?.found) {
            return {
              success: false,
              error: 'An account with this email already exists in Satmix. Please click \'Sign In\' to access your account.',
            };
          }
        }
      } catch (err) {
        console.warn('Cloud signup check warning:', err);
      }

      // Check phone duplication in cloud
      try {
        const phoneCheck = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'lookup', identifier: cleanDigits }),
        });
        if (phoneCheck.ok) {
          const phoneRes = await phoneCheck.json();
          if (phoneRes?.found) {
            return {
              success: false,
              error: 'An account with this mobile number already exists in Satmix. Please click \'Sign In\' to access your account.',
            };
          }
        }
      } catch (err) {
        console.warn('Phone check warning:', err);
      }

      // Hash password locally with SHA-256 for cybersecurity
      const passwordHash = password ? await hashPin(password) : 'mock_hash';
      const formattedPhone = `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`;

      const newUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        email: cleanEmail,
        phone: formattedPhone,
        password: passwordHash,
        createdAt: new Date().toISOString(),
      };

      const initialUserState = {
        tutorialDone: false,
        quizCompleted: false,
        suggestedBasketId: null,
        setupBasketId: null,
        habits: {
          stable: { setupAt: null, dailyAmount: 10, paused: true, streakStartedAt: null, holdings: { BTC: 0, ETH: 0, SOL: 0, USDT: 0 } },
          growth: { setupAt: null, dailyAmount: 30, paused: true, streakStartedAt: null, holdings: { BTC: 0, ETH: 0, SOL: 0, USDT: 0 } },
        },
        activity: [],
        valueHistory: [],
        savedStreak: { longestStreak: 0, freezeUsedDates: [] },
        virtualBalanceInr: 50000,
      };

      // Await central cloud registration to guarantee cross-device persistence immediately
      try {
        await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'signup',
            user: newUser,
            userState: initialUserState,
          }),
        });

        fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: cleanEmail,
            phone: formattedPhone,
            source: 'Satmix WebApp Account Registration',
          }),
        }).catch(() => {});
      } catch (err) {
        console.warn('Cloud signup registration note:', err);
      }

      const freshBase = createInitialPrototypeState();

      updateStateAndPersist((prev) => {
        const existingUsers = Array.isArray(prev.users) ? prev.users : [];
        return {
          ...freshBase,
          sessionUserId: newUser.id,
          users: [...existingUsers.filter((u) => u && u.id !== newUser.id), newUser],
          tutorialDone: false,
          quizCompleted: false,
          suggestedBasketId: null,
          setupBasketId: null,
        };
      });

      // Route to onboarding quiz
      setViewMode('auth');
      setAuthSubView('quiz');
      setTutorialOpen(true);
      return { success: true };
    },
    [updateStateAndPersist]
  );

  // Authentication: Pure Credential-Based Cross-Device Login (Cloud Authoritative)
  const login = useCallback(
    async (identifier: string, password = ''): Promise<{ success: boolean; error?: string }> => {
      const cleanIdentifier = identifier.trim().toLowerCase();
      const isEmail = cleanIdentifier.includes('@');
      const cleanDigits = !isEmail ? cleanIdentifier.replace(/\D/g, '').slice(-10) : '';

      // 1. Authenticate against central cloud database as Primary Source of Truth
      let cloudUser: any = null;
      let cloudUserState: any = null;
      let cloudLookupCompleted = false;

      try {
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'login',
            identifier: cleanIdentifier || cleanDigits,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          cloudLookupCompleted = true;
          if (json?.found && json?.user) {
            cloudUser = json.user;
            cloudUserState = json.userState || {};
          }
        }
      } catch (err) {
        console.warn('Cloud auth lookup note (offline / network):', err);
      }

      // 2. Resolve target user (authoritative cloud record, fallback to cached accounts if offline)
      let targetUser = cloudUser;
      if (!targetUser && !cloudLookupCompleted) {
        targetUser = prototypeState.users?.find((u) => {
          const matchEmail = isEmail && u.email && u.email.toLowerCase() === cleanIdentifier;
          const matchPhone = cleanDigits && u.phone && u.phone.replace(/\D/g, '').slice(-10) === cleanDigits;
          return matchEmail || matchPhone;
        });
      }

      if (!targetUser) {
        return {
          success: false,
          error: 'No registered account found with these credentials. Please check your email or mobile number, or Sign Up.',
        };
      }

      // 3. Verify password hash if present
      if (password && targetUser.password && targetUser.password !== 'mock_hash') {
        const isMatch = await verifyPin(password, targetUser.password);
        if (!isMatch && targetUser.password !== password) {
          return {
            success: false,
            error: 'Incorrect password. Please check your credentials.',
          };
        }
      }

      // 4. Hydrate user account and portfolio state specifically for THIS credential
      const safeCreatedAt = targetUser.createdAt && !isNaN(new Date(targetUser.createdAt).getTime())
        ? targetUser.createdAt
        : new Date().toISOString();

      const hydratedUser = {
        ...targetUser,
        createdAt: safeCreatedAt,
        name: (targetUser.name || 'Investor').trim(),
        email: (targetUser.email || '').trim().toLowerCase(),
        phone: targetUser.phone || '',
      };

      const freshBase = createInitialPrototypeState();

      updateStateAndPersist((prev) => {
        const existingUsers = Array.isArray(prev.users) ? prev.users : [];
        const userExists = existingUsers.some(
          (u) => u && (u.id === hydratedUser.id || (u.email && u.email.toLowerCase() === hydratedUser.email.toLowerCase()))
        );
        const updatedUsers = userExists
          ? existingUsers.map((u) => (u && u.id === hydratedUser.id ? hydratedUser : u))
          : [...existingUsers, hydratedUser];

        // Isolate state per user credentials (prevent bleeding habits/activity from another account)
        const userHabits = cloudUserState?.habits || (prev.sessionUserId === hydratedUser.id ? prev.habits : freshBase.habits);
        const userActivity = Array.isArray(cloudUserState?.activity)
          ? cloudUserState.activity
          : (prev.sessionUserId === hydratedUser.id && Array.isArray(prev.activity) ? prev.activity : []);
        const userValueHistory = Array.isArray(cloudUserState?.valueHistory)
          ? cloudUserState.valueHistory
          : (prev.sessionUserId === hydratedUser.id && Array.isArray(prev.valueHistory) ? prev.valueHistory : []);
        const userStreak = cloudUserState?.savedStreak || (prev.sessionUserId === hydratedUser.id ? prev.savedStreak : freshBase.savedStreak);
        const userVirtualBalance = typeof cloudUserState?.virtualBalanceInr === 'number'
          ? cloudUserState.virtualBalanceInr
          : (prev.sessionUserId === hydratedUser.id ? prev.virtualBalanceInr : 50000);

        return {
          ...freshBase,
          users: updatedUsers,
          sessionUserId: hydratedUser.id,
          tutorialDone: cloudUserState?.tutorialDone ?? true,
          quizCompleted: cloudUserState?.quizCompleted ?? true,
          suggestedBasketId: cloudUserState?.suggestedBasketId || null,
          setupBasketId: cloudUserState?.setupBasketId || null,
          habits: {
            stable: {
              ...freshBase.habits.stable,
              ...(userHabits?.stable || {}),
              holdings: {
                ...freshBase.habits.stable.holdings,
                ...(userHabits?.stable?.holdings || {}),
              },
            },
            growth: {
              ...freshBase.habits.growth,
              ...(userHabits?.growth || {}),
              holdings: {
                ...freshBase.habits.growth.holdings,
                ...(userHabits?.growth?.holdings || {}),
              },
            },
          },
          activity: userActivity,
          valueHistory: userValueHistory,
          savedStreak: userStreak,
          virtualBalanceInr: userVirtualBalance,
          lastAccruedDate: cloudUserState?.lastAccruedDate || null,
        };
      });

      // Route directly into the app dashboard
      setViewMode('app');
      setActiveTab('dashboard');
      setTutorialOpen(false);

      return { success: true };
    },
    [prototypeState.users, updateStateAndPersist]
  );

  // Logout
  const logout = useCallback(() => {
    updateStateAndPersist((prev) => ({
      ...prev,
      sessionUserId: null,
    }));
    setViewMode('marketing');
    setActiveTab('dashboard');
  }, [updateStateAndPersist]);

  // Tutorial Handlers
  const completeTutorial = useCallback(() => {
    updateStateAndPersist((prev) => ({
      ...prev,
      tutorialDone: true,
    }));
    setTutorialOpen(false);
    if (!prototypeState.quizCompleted) {
      setViewMode('auth');
      setAuthSubView('quiz');
    } else {
      setViewMode('app');
      setActiveTab('dashboard');
    }
  }, [prototypeState.quizCompleted, updateStateAndPersist]);

  const replayTutorial = useCallback(() => {
    setTutorialOpen(true);
  }, []);

  // Submit 3-Question Quiz
  const submitQuiz = useCallback(
    (answers: Record<string, string>, score: number, suggestedBasket: BasketId) => {
      updateStateAndPersist((prev) => ({
        ...prev,
        quizCompleted: true,
        quizAnswers: answers,
        quizScore: score,
        suggestedBasketId: suggestedBasket,
        setupBasketId: suggestedBasket,
      }));
      setSelectedBasketIdState(suggestedBasket);
      triggerConfetti();
    },
    [updateStateAndPersist, triggerConfetti]
  );

  // Complete Onboarding Quiz & Transition to Setup
  const completeOnboardingQuiz = useCallback(
    (chosenBasket: BasketId) => {
      setSelectedBasketIdState(chosenBasket);
      updateStateAndPersist((prev) => ({
        ...prev,
        setupBasketId: chosenBasket,
      }));
      setViewMode('app');
      setActiveTab('invest');
      triggerConfetti();
    },
    [updateStateAndPersist, triggerConfetti]
  );

  // Setup Habit for a Basket
  const setupHabit = useCallback(
    async (basketId: BasketId, amount: number): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const nowIso = new Date().toISOString();
      const todayKey = formatDateKey(new Date());

      updateStateAndPersist((prev) => {
        const basketDef = getBasketById(basketId);
        const currentHabit = prev.habits[basketId];

        // Fill initial day 1 units
        const fills = basketDef.allocation.map((alloc) => {
          const inrShare = amount * (alloc.pct / 100);
          const priceInr =
            alloc.ticker === 'BTC'
              ? livePrices.BTC
              : alloc.ticker === 'ETH'
              ? livePrices.ETH
              : alloc.ticker === 'SOL'
              ? livePrices.SOL
              : livePrices.USDT;

          const units = priceInr > 0 ? inrShare / priceInr : 0;
          return {
            asset: alloc.ticker,
            inr: inrShare,
            units,
            priceInr,
          };
        });

        const newHoldings = { ...currentHabit.holdings };
        fills.forEach((f) => {
          if (f.asset === 'BTC') newHoldings.BTC = (newHoldings.BTC || 0) + f.units;
          else if (f.asset === 'ETH') newHoldings.ETH = (newHoldings.ETH || 0) + f.units;
          else if (f.asset === 'SOL') newHoldings.SOL = (newHoldings.SOL || 0) + f.units;
          else if (f.asset === 'USDT') newHoldings.USDT = (newHoldings.USDT || 0) + f.units;
        });

        const initialEntry = {
          id: `act_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
          date: todayKey,
          amount,
          basketId,
          status: 'recorded' as const,
          type: 'habit_accrual' as const,
          fills,
        };

        const updatedActivity = [initialEntry, ...prev.activity];

        const updatedHabits = {
          ...prev.habits,
          [basketId]: {
            setupAt: currentHabit?.setupAt || nowIso,
            dailyAmount: amount,
            paused: false,
            streakStartedAt: currentHabit?.streakStartedAt || nowIso,
            holdings: newHoldings,
          },
        };

        // Sync to central cloud in background
        try {
          fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'sync',
              userId: prev.sessionUserId,
              userState: {
                setupBasketId: basketId,
                habits: updatedHabits,
                quizCompleted: true,
              },
            }),
          }).catch(() => {});
        } catch {
          // Non-blocking
        }

        return {
          ...prev,
          habits: updatedHabits,
          activity: updatedActivity,
          lastAccruedDate: todayKey,
        };
      });

      triggerConfetti();
      return true;
    },
    [livePrices, updateStateAndPersist, triggerConfetti]
  );

  // Toggle Habit Pause / Resume
  const toggleHabitPause = useCallback(
    (basketId: BasketId) => {
      updateStateAndPersist((prev) => {
        const nextHabits = {
          ...prev.habits,
          [basketId]: {
            ...prev.habits[basketId],
            paused: !prev.habits[basketId].paused,
          },
        };

        try {
          fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'sync',
              userId: prev.sessionUserId,
              userState: { habits: nextHabits },
            }),
          }).catch(() => {});
        } catch {}

        return {
          ...prev,
          habits: nextHabits,
        };
      });
    },
    [updateStateAndPersist]
  );

  // Update Habit Daily Amount
  const updateHabitAmount = useCallback(
    (basketId: BasketId, amount: number) => {
      updateStateAndPersist((prev) => ({
        ...prev,
        habits: {
          ...prev.habits,
          [basketId]: {
            ...prev.habits[basketId],
            dailyAmount: amount,
          },
        },
      }));
    },
    [updateStateAndPersist]
  );

  // Legacy Mandate Bridge
  const upiMandate: UpiMandate = useMemo(() => {
    const activeHabits = [
      prototypeState.habits.stable?.setupAt && !prototypeState.habits.stable?.paused ? prototypeState.habits.stable : null,
      prototypeState.habits.growth?.setupAt && !prototypeState.habits.growth?.paused ? prototypeState.habits.growth : null,
    ].filter(Boolean);

    const hasActive = activeHabits.length > 0;
    const totalDaily = (prototypeState.habits.stable?.setupAt && !prototypeState.habits.stable?.paused ? prototypeState.habits.stable.dailyAmount : 0) +
      (prototypeState.habits.growth?.setupAt && !prototypeState.habits.growth?.paused ? prototypeState.habits.growth.dailyAmount : 0);

    return {
      id: hasActive ? 'man_stmx_active' : '',
      bankName: activeUser?.bankName || 'HDFC Bank',
      accountLast4: '4129',
      vpa: activeUser?.vpa || 'investor@okhdfcbank',
      dailyAmount: totalDaily || 10,
      status: hasActive ? 'ACTIVE' : 'NONE',
      executionTime: '08:00 AM IST',
      maxCapPerDay: Math.max(500, (totalDaily || 10) * 2),
      umnNumber: hasActive ? 'NPCI/UPI/2026/STMX99281' : '',
      createdAt: 'Today',
      nextExecutionDate: 'Tomorrow, 08:00 AM',
    };
  }, [prototypeState.habits, activeUser]);

  const setupUpiMandate = useCallback(
    async (amount: number, _vpa: string, _bankName: string): Promise<boolean> => {
      await setupHabit(selectedBasketId, amount);
      return true;
    },
    [setupHabit, selectedBasketId]
  );

  const toggleUpiMandate = useCallback(() => {
    toggleHabitPause(selectedBasketId);
  }, [toggleHabitPause, selectedBasketId]);

  // Execute One-Time Spot Top-Up (Decoupled from recurring habit settings)
  const executeOneTimeDepositAction = useCallback(
    async (basketId: BasketId, amount: number, paymentMethod: string): Promise<boolean> => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      updateStateAndPersist((prev) => {
        const { state: nextState } = executeOneTimeDeposit(prev, basketId, amount, livePrices);

        // Sync to cloud in background
        try {
          fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'sync',
              userId: prev.sessionUserId,
              userState: {
                activity: nextState.activity,
                habits: nextState.habits,
              },
            }),
          }).catch(() => {});
        } catch {}

        return nextState;
      });

      triggerConfetti();
      return true;
    },
    [livePrices, updateStateAndPersist, triggerConfetti]
  );

  const simulateDeposit = useCallback(
    async (amount: number, paymentMethod: string, targetBasket?: BasketId): Promise<boolean> => {
      const bId = targetBasket || selectedBasketId;
      return await executeOneTimeDepositAction(bId, amount, paymentMethod);
    },
    [executeOneTimeDepositAction, selectedBasketId]
  );

  // Decoupled Instant Withdrawal with Proportional Cost-Basis Accounting
  const simulateWithdrawal = useCallback(
    async (
      amount: number,
      targetBasket: 'all' | 'stable' | 'growth' = 'all'
    ): Promise<{ success: boolean; tx?: Transaction; error?: string }> => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      let executionRes: any = null;

      updateStateAndPersist((currentState) => {
        const res = executeWithdrawal(currentState, targetBasket, amount, livePrices);
        executionRes = res;
        return res.success ? res.state : currentState;
      });

      if (!executionRes?.success) {
        return { success: false, error: executionRes?.error || 'Failed to process withdrawal.' };
      }

      const actualWithdrawn = executionRes.actualWithdrawn || amount;

      // Sync to cloud in background
      try {
        fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'sync',
            userId: executionRes.state?.sessionUserId,
            userState: {
              activity: executionRes.state?.activity,
              habits: executionRes.state?.habits,
            },
          }),
        }).catch(() => {});
      } catch {}

      const tx: Transaction = {
        id: `tx_wd_${Date.now().toString().slice(-6)}`,
        type: 'WITHDRAWAL',
        title:
          targetBasket === 'all'
            ? 'INR Bank Withdrawal (All Baskets)'
            : targetBasket === 'stable'
            ? 'INR Bank Withdrawal (Stable Basket)'
            : 'INR Bank Withdrawal (Growth Basket)',
        basketName:
          targetBasket === 'stable' ? 'Stable Basket' : targetBasket === 'growth' ? 'Growth Basket' : 'All Baskets',
        amount: actualWithdrawn,
        status: 'SUCCESS',
        timestamp: 'Just now',
        isoTimestamp: new Date().toISOString(),
        utrNumber: `50${Date.now().toString().slice(-10)}`,
        paymentMethod: `${activeUser?.bankName || 'HDFC Bank'} · ${activeUser?.bankAccountMasked || '•••• 4129'}`,
      };

      return { success: true, tx };
    },
    [livePrices, updateStateAndPersist, activeUser]
  );

  // Update Profile & Sync to Central Google Sheets
  const updateUserProfile = useCallback(
    (updated: Partial<UserProfile>) => {
      if (!activeUser) return;
      updateStateAndPersist((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u.id === activeUser.id
            ? {
                ...u,
                name: updated.name !== undefined ? updated.name : u.name,
                email: updated.email !== undefined ? updated.email : u.email,
                phone: updated.phone !== undefined ? updated.phone : u.phone,
              }
            : u
        ),
      }));

      // Background sync to central cloud database / Google Sheets
      if (updated.email !== undefined || updated.phone !== undefined) {
        try {
          fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'sync',
              userId: activeUser.id,
              email: updated.email,
              phone: updated.phone,
            }),
          }).catch(() => {});
        } catch {
          // Non-blocking sync
        }
      }
    },
    [activeUser, updateStateAndPersist]
  );

  // Feedback Submission
  const submitFeedback = useCallback(
    (rating: number, category: FeedbackItem['category'], comment: string) => {
      const newFeedback: FeedbackItem = {
        id: `fb_${Date.now()}`,
        userId: activeUser?.id || 'guest',
        userName: activeUser?.name || 'Anonymous Tester',
        rating,
        category,
        comment,
        timestamp: new Date().toLocaleString('en-IN'),
      };
      const updated = [newFeedback, ...feedbackList];
      setFeedbackList(updated);
      localStorage.setItem(FEEDBACK_DB_KEY, JSON.stringify(updated));
    },
    [activeUser, feedbackList]
  );

  const colors = themeMode === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  return (
    <AppContext.Provider
      value={{
        themeMode,
        toggleTheme,
        colors,
        deviceFrame,
        setDeviceFrame,
        cookieConsent,
        setCookieConsent,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        authSubView,
        setAuthSubView,
        prototypeState,
        activeTabFilter,
        setActiveTabFilter,
        tabMetrics,
        livePrices,
        isPricesLoading,
        tutorialOpen,
        setTutorialOpen,
        completeTutorial,
        replayTutorial,
        user: activeUser,
        isAuthenticated,
        login,
        signUp,
        submitQuiz,
        completeOnboardingQuiz,
        logout,
        updateUserProfile,
        registeredUsersCount: prototypeState.users.length,
        selectedBasketId,
        setSelectedBasketId,
        dailyAmount,
        setDailyAmount,
        setupHabit,
        toggleHabitPause,
        updateHabitAmount,
        upiMandate,
        setupUpiMandate,
        toggleUpiMandate,
        portfolioSummary,
        streakDays,
        streakState,
        transactions,
        executeOneTimeDeposit: executeOneTimeDepositAction,
        simulateDeposit,
        simulateWithdrawal,
        liveCoins,
        triggerConfetti,
        feedbackList,
        submitFeedback,
        feedbackOpen,
        setFeedbackOpen,
        triggerAccrual: refreshPricesAndAccrue,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

