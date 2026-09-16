// ============================================================
// FILE: src/utils/prototypeEngine.ts
// PURPOSE: Canonical Satmix Prototype Engine (v6)
//          Implements Coinbase live spot prices, unit allocations,
//          accrueMissingDays (up to 30 days catch-up on open),
//          and Mark-to-Market (MTM) portfolio accounting.
// ============================================================

import {
  PrototypeState,
  BasketId,
  ActivityEntry,
  ActivityFill,
  ValueHistoryPoint,
} from '../types';
import { BASKETS, getBasketById } from '../data/baskets';

export const PROTOTYPE_STORAGE_KEY = 'satmix-prototype-v6';

export interface LiveCoinPrices {
  BTC: number;
  ETH: number;
  SOL: number;
  USDT: number;
  USD_INR: number;
}

export const RETAIL_MARKUP_MULTIPLIER = 1.025; // 2.5% retail markup accounting for 1% TDS (Sec 194S), slippage, and platform spread

export const FALLBACK_LIVE_PRICES: LiveCoinPrices = {
  BTC: Math.round(8460000 * RETAIL_MARKUP_MULTIPLIER),
  ETH: Math.round(249500 * RETAIL_MARKUP_MULTIPLIER),
  SOL: Math.round(17400 * RETAIL_MARKUP_MULTIPLIER),
  USDT: Number((87.85 * RETAIL_MARKUP_MULTIPLIER).toFixed(2)),
  USD_INR: Number((87.85 * RETAIL_MARKUP_MULTIPLIER).toFixed(2)),
};

/**
 * Creates a clean initial PrototypeState.
 */
export function createInitialPrototypeState(): PrototypeState {
  return {
    sessionUserId: null,
    users: [],
    tutorialDone: false,
    quizCompleted: false,
    quizAnswers: {},
    quizScore: null,
    suggestedBasketId: null,
    setupBasketId: null,
    habits: {
      stable: {
        setupAt: null,
        dailyAmount: 10,
        paused: true,
        streakStartedAt: null,
        holdings: { BTC: 0, ETH: 0, SOL: 0, USDT: 0 },
      },
      growth: {
        setupAt: null,
        dailyAmount: 30,
        paused: true,
        streakStartedAt: null,
        holdings: { BTC: 0, ETH: 0, SOL: 0, USDT: 0 },
      },
    },
    activity: [],
    notifications: {
      habitReminders: true,
      productUpdates: true,
      communityTips: false,
    },
    virtualBalanceInr: 50000, // Simulation reserve only — hidden in UI
    valueHistory: [],
    lastAccruedDate: null,
    lastPricesAt: null,
  };
}

/**
 * Loads PrototypeState from localStorage (satmix-prototype-v6).
 */
export function loadPrototypeState(): PrototypeState {
  try {
    const raw = localStorage.getItem(PROTOTYPE_STORAGE_KEY);
    if (!raw) return createInitialPrototypeState();
    const parsed = JSON.parse(raw);
    return {
      ...createInitialPrototypeState(),
      ...parsed,
      habits: {
        stable: {
          ...createInitialPrototypeState().habits.stable,
          ...(parsed.habits?.stable || {}),
        },
        growth: {
          ...createInitialPrototypeState().habits.growth,
          ...(parsed.habits?.growth || {}),
        },
      },
    };
  } catch (err) {
    console.error('Failed to parse prototype state:', err);
    return createInitialPrototypeState();
  }
}

/**
 * Persists PrototypeState to localStorage (satmix-prototype-v6).
 */
export function savePrototypeState(state: PrototypeState): void {
  try {
    localStorage.setItem(PROTOTYPE_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save prototype state:', err);
  }
}

/**
 * Formats a Date object to YYYY-MM-DD string.
 */
export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Fetches real crypto market prices using the exact same API pipeline as the website ticker:
 * 1. Backend proxy (/api/ticker) to bypass CORS / browser adblockers
 * 2. CoinGecko public v3 API (bitcoin, ethereum, solana, tether in INR and USD)
 * 3. Fallback to cached reference market prices if offline
 */
export async function fetchCoinbaseSpotPrices(): Promise<LiveCoinPrices> {
  // 1. Try internal backend proxy
  try {
    const res = await fetch('/api/ticker');
    if (res.ok) {
      const json = await res.json();
      if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
        const coinMap = Object.fromEntries(json.data.map((c: any) => [c.symbol, c]));
        const btcInr = parseFloat(coinMap.BTC?.priceInr);
        const ethInr = parseFloat(coinMap.ETH?.priceInr);
        const solInr = parseFloat(coinMap.SOL?.priceInr);
        const usdtInr = parseFloat(coinMap.USDT?.priceInr);
        const fxRate = usdtInr || (btcInr / parseFloat(coinMap.BTC?.priceUsd)) || 87.85;

        if (btcInr && ethInr && solInr) {
          return {
            BTC: btcInr,
            ETH: ethInr,
            SOL: solInr,
            USDT: usdtInr || fxRate,
            USD_INR: fxRate,
          };
        }
      }
    }
  } catch {
    // Backend proxy unavailable (offline/local preview), fall back to direct CoinGecko
  }

  // 2. Direct CoinGecko Client Call (same endpoint as src/js/modules/ticker.js)
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,ripple,cardano,dogecoin,polkadot&vs_currencies=inr,usd&include_24hr_change=true'
    );
    if (res.ok) {
      const data = await res.json();
      const btcInr = Number(data.bitcoin?.inr) * RETAIL_MARKUP_MULTIPLIER;
      const ethInr = Number(data.ethereum?.inr) * RETAIL_MARKUP_MULTIPLIER;
      const solInr = Number(data.solana?.inr) * RETAIL_MARKUP_MULTIPLIER;
      const usdtInr = Number(data.tether?.inr) * RETAIL_MARKUP_MULTIPLIER;
      const fxRate = usdtInr || (btcInr && data.bitcoin?.usd ? btcInr / data.bitcoin.usd : 87.85 * RETAIL_MARKUP_MULTIPLIER);

      if (btcInr && ethInr && solInr) {
        return {
          BTC: Math.round(btcInr),
          ETH: Math.round(ethInr),
          SOL: Math.round(solInr),
          USDT: Number(usdtInr.toFixed(2)) || fxRate,
          USD_INR: Number(fxRate.toFixed(2)),
        };
      }
    }
  } catch (err) {
    console.warn('CoinGecko price fetch failed, using fallback coin prices:', err);
  }

  return FALLBACK_LIVE_PRICES;
}

/**
 * Calculates calendar days between two dates.
 */
function getDaysArray(startDate: Date, endDate: Date): string[] {
  const days: string[] = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    days.push(formatDateKey(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

/**
 * Accrues missing daily debits when the app opens.
 * Capped at 30 days. Runs synchronously on load without needing server cron.
 */
export function accrueMissingDays(
  state: PrototypeState,
  livePrices: LiveCoinPrices = FALLBACK_LIVE_PRICES
): { state: PrototypeState; accruedCount: number } {
  const nextState: PrototypeState = JSON.parse(JSON.stringify(state));
  let accruedCount = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const basketIds: BasketId[] = ['stable', 'growth'];

  // Map of existing recorded debits: `${date}_${basketId}` -> boolean
  const recordedMap = new Set<string>();
  nextState.activity.forEach((act) => {
    recordedMap.add(`${act.date}_${act.basketId}`);
  });

  basketIds.forEach((basketId) => {
    const habit = nextState.habits[basketId];
    if (!habit || !habit.setupAt || habit.paused) return;

    const setupDate = new Date(habit.setupAt);
    setupDate.setHours(0, 0, 0, 0);

    // Limit window to max(setupDay, today - 29 days)
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 29);

    const windowStart = setupDate > thirtyDaysAgo ? setupDate : thirtyDaysAgo;
    const daysWindow = getDaysArray(windowStart, today);

    const basketDef = getBasketById(basketId);

    daysWindow.forEach((dateKey) => {
      const recordKey = `${dateKey}_${basketId}`;
      if (recordedMap.has(recordKey)) return; // Already recorded for this day

      // Check if virtual balance can cover debit
      if (nextState.virtualBalanceInr < habit.dailyAmount) {
        return; // Skip if simulated balance insufficient
      }

      // Execute simulated debit
      nextState.virtualBalanceInr -= habit.dailyAmount;

      // Allocate fills across basket asset weights
      const fills: ActivityFill[] = [];
      basketDef.allocation.forEach((alloc) => {
        const inrShare = habit.dailyAmount * (alloc.pct / 100);
        const priceInr =
          alloc.ticker === 'BTC'
            ? livePrices.BTC
            : alloc.ticker === 'ETH'
            ? livePrices.ETH
            : alloc.ticker === 'SOL'
            ? livePrices.SOL
            : livePrices.USDT;

        const unitsBought = priceInr > 0 ? inrShare / priceInr : 0;

        // Add units to habit holdings
        if (alloc.ticker === 'BTC') habit.holdings.BTC = (habit.holdings.BTC || 0) + unitsBought;
        else if (alloc.ticker === 'ETH') habit.holdings.ETH = (habit.holdings.ETH || 0) + unitsBought;
        else if (alloc.ticker === 'SOL') habit.holdings.SOL = (habit.holdings.SOL || 0) + unitsBought;
        else if (alloc.ticker === 'USDT') habit.holdings.USDT = (habit.holdings.USDT || 0) + unitsBought;

        fills.push({
          asset: alloc.ticker,
          inr: Math.round(inrShare * 100) / 100,
          units: unitsBought,
          priceInr,
        });
      });

      const entryId = `act_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      const newEntry: ActivityEntry = {
        id: entryId,
        date: dateKey,
        amount: habit.dailyAmount,
        basketId,
        status: 'recorded',
        fills,
      };

      nextState.activity.unshift(newEntry);
      recordedMap.add(recordKey);
      accruedCount++;
    });
  });

  // Rebuild valueHistory
  nextState.lastAccruedDate = formatDateKey(today);
  nextState.lastPricesAt = new Date().toISOString();

  // Compute combined historical points
  nextState.valueHistory = buildValueHistory(nextState, livePrices);

  return { state: nextState, accruedCount };
}

/**
 * Reconstructs valueHistory tracking cumulative invested vs live Mark-to-Market.
 */
export function buildValueHistory(
  state: PrototypeState,
  livePrices: LiveCoinPrices
): ValueHistoryPoint[] {
  if (state.activity.length === 0) return [];

  // Sort activity chronologically
  const sorted = [...state.activity].sort((a, b) => a.date.localeCompare(b.date));

  const historyMap = new Map<string, { invested: number; btc: number; eth: number; sol: number; usdt: number }>();

  let cumulativeInvested = 0;
  let cumBtc = 0;
  let cumEth = 0;
  let cumSol = 0;
  let cumUsdt = 0;

  sorted.forEach((act) => {
    cumulativeInvested += act.amount;
    act.fills?.forEach((f) => {
      if (f.asset === 'BTC') cumBtc += f.units;
      else if (f.asset === 'ETH') cumEth += f.units;
      else if (f.asset === 'SOL') cumSol += f.units;
      else if (f.asset === 'USDT') cumUsdt += f.units;
    });

    historyMap.set(act.date, {
      invested: cumulativeInvested,
      btc: cumBtc,
      eth: cumEth,
      sol: cumSol,
      usdt: cumUsdt,
    });
  });

  const points: ValueHistoryPoint[] = [];
  historyMap.forEach((val, dateKey) => {
    const marketValueInr =
      val.btc * livePrices.BTC +
      val.eth * livePrices.ETH +
      val.sol * livePrices.SOL +
      val.usdt * livePrices.USDT;

    points.push({
      date: dateKey,
      investedInr: Math.round(val.invested * 100) / 100,
      marketValueInr: Math.round(marketValueInr * 100) / 100,
    });
  });

  return points;
}

export interface HoldingDetail {
  units: number;
  inrValue: number;
  usdValue: number;
  priceInr: number;
  priceUsd: number;
  investedInr: number;
  avgBuyPriceInr: number;
  gainRupees: number;
  gainPercentage: number;
}

export interface TabPortfolioMetrics {
  totalInvested: number;
  marketValue: number;
  netDeltaRupees: number;
  netDeltaPercentage: number;
  streakDays: number;
  holdings: {
    BTC: HoldingDetail;
    ETH: HoldingDetail;
    SOL: HoldingDetail;
    USDT: HoldingDetail;
  };
}

/**
 * Calculates tab-specific (All, Stable, Growth) Mark-to-Market valuation, holdings, and asset cost basis.
 */
export function calculateTabMetrics(
  state: PrototypeState,
  tab: 'all' | 'stable' | 'growth',
  livePrices: LiveCoinPrices
): TabPortfolioMetrics {
  let btcUnits = 0;
  let ethUnits = 0;
  let solUnits = 0;
  let usdtUnits = 0;
  let totalInvested = 0;

  let btcInvested = 0;
  let ethInvested = 0;
  let solInvested = 0;
  let usdtInvested = 0;

  if (tab === 'all') {
    const isStableConfigured = state.habits.stable?.setupAt !== null;
    const isGrowthConfigured = state.habits.growth?.setupAt !== null;

    btcUnits = (isStableConfigured ? state.habits.stable?.holdings?.BTC || 0 : 0) + (isGrowthConfigured ? state.habits.growth?.holdings?.BTC || 0 : 0);
    ethUnits = (isStableConfigured ? state.habits.stable?.holdings?.ETH || 0 : 0) + (isGrowthConfigured ? state.habits.growth?.holdings?.ETH || 0 : 0);
    solUnits = (isStableConfigured ? state.habits.stable?.holdings?.SOL || 0 : 0) + (isGrowthConfigured ? state.habits.growth?.holdings?.SOL || 0 : 0);
    usdtUnits = (isStableConfigured ? state.habits.stable?.holdings?.USDT || 0 : 0) + (isGrowthConfigured ? state.habits.growth?.holdings?.USDT || 0 : 0);

    totalInvested = state.activity.reduce((sum, act) => sum + act.amount, 0);

    state.activity.forEach((act) => {
      act.fills?.forEach((f) => {
        if (f.asset === 'BTC') btcInvested += f.inr;
        else if (f.asset === 'ETH') ethInvested += f.inr;
        else if (f.asset === 'SOL') solInvested += f.inr;
        else if (f.asset === 'USDT') usdtInvested += f.inr;
      });
    });
  } else {
    const habit = state.habits[tab];
    const isConfigured = habit?.setupAt !== null;

    btcUnits = isConfigured ? habit?.holdings?.BTC || 0 : 0;
    ethUnits = isConfigured ? habit?.holdings?.ETH || 0 : 0;
    solUnits = isConfigured ? habit?.holdings?.SOL || 0 : 0;
    usdtUnits = isConfigured ? habit?.holdings?.USDT || 0 : 0;

    const filtered = state.activity.filter((act) => act.basketId === tab);
    totalInvested = filtered.reduce((sum, act) => sum + act.amount, 0);

    filtered.forEach((act) => {
      act.fills?.forEach((f) => {
        if (f.asset === 'BTC') btcInvested += f.inr;
        else if (f.asset === 'ETH') ethInvested += f.inr;
        else if (f.asset === 'SOL') solInvested += f.inr;
        else if (f.asset === 'USDT') usdtInvested += f.inr;
      });
    });
  }

  const fxRate = livePrices.USD_INR > 0 ? livePrices.USD_INR : 87.85 * RETAIL_MARKUP_MULTIPLIER;

  const btcVal = btcUnits * livePrices.BTC;
  const ethVal = ethUnits * livePrices.ETH;
  const solVal = solUnits * livePrices.SOL;
  const usdtVal = usdtUnits * livePrices.USDT;

  const marketValue = Math.round((btcVal + ethVal + solVal + usdtVal) * 100) / 100;
  const netDeltaRupees = Math.round((marketValue - totalInvested) * 100) / 100;
  const netDeltaPercentage =
    totalInvested > 0 ? Number(((netDeltaRupees / totalInvested) * 100).toFixed(2)) : 0;

  // Compute streak: consecutive days count from activity
  const distinctDays = new Set(
    state.activity
      .filter((act) => (tab === 'all' ? true : act.basketId === tab))
      .map((act) => act.date)
  );

  const streakDays = distinctDays.size;

  const createDetail = (units: number, priceInr: number, invested: number): HoldingDetail => {
    const inrValue = Math.round(units * priceInr * 100) / 100;
    const usdValue = fxRate > 0 ? Math.round((inrValue / fxRate) * 100) / 100 : 0;
    const priceUsd = fxRate > 0 ? Math.round((priceInr / fxRate) * 100) / 100 : 0;
    const gainRupees = Math.round((inrValue - invested) * 100) / 100;
    const gainPercentage = invested > 0 ? Number(((gainRupees / invested) * 100).toFixed(2)) : 0;
    const avgBuyPriceInr = units > 0 ? Math.round(invested / units) : priceInr;

    return {
      units,
      inrValue,
      usdValue,
      priceInr,
      priceUsd,
      investedInr: Math.round(invested * 100) / 100,
      avgBuyPriceInr,
      gainRupees,
      gainPercentage,
    };
  };

  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    marketValue,
    netDeltaRupees,
    netDeltaPercentage,
    streakDays,
    holdings: {
      BTC: createDetail(btcUnits, livePrices.BTC, btcInvested),
      ETH: createDetail(ethUnits, livePrices.ETH, ethInvested),
      SOL: createDetail(solUnits, livePrices.SOL, solInvested),
      USDT: createDetail(usdtUnits, livePrices.USDT, usdtInvested),
    },
  };
}