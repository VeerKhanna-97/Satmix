// ============================================================
// FILE: src/utils/pricing.ts
// PURPOSE: Live crypto price engine & dynamic time-weighted portfolio returns
// ============================================================

import { CryptoCoin, Transaction, PortfolioSummary, BasketId } from '../types';
import { fetchCoinbaseSpotPrices, LiveCoinPrices, RETAIL_MARKUP_MULTIPLIER } from './prototypeEngine';

export const FALLBACK_COINS: CryptoCoin[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', priceUsd: 96250 * RETAIL_MARKUP_MULTIPLIER, priceInr: 8460000 * RETAIL_MARKUP_MULTIPLIER, changePercent24Hr: 2.85 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', priceUsd: 2840 * RETAIL_MARKUP_MULTIPLIER, priceInr: 249500 * RETAIL_MARKUP_MULTIPLIER, changePercent24Hr: 1.42 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', priceUsd: 198 * RETAIL_MARKUP_MULTIPLIER, priceInr: 17400 * RETAIL_MARKUP_MULTIPLIER, changePercent24Hr: 5.64 },
  { id: 'tether', symbol: 'USDT', name: 'Tether USD', priceUsd: 1.0 * RETAIL_MARKUP_MULTIPLIER, priceInr: Number((87.85 * RETAIL_MARKUP_MULTIPLIER).toFixed(2)), changePercent24Hr: 0.02 },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', priceUsd: 2.45 * RETAIL_MARKUP_MULTIPLIER, priceInr: 215 * RETAIL_MARKUP_MULTIPLIER, changePercent24Hr: 3.1 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', priceUsd: 0.78 * RETAIL_MARKUP_MULTIPLIER, priceInr: 68.5 * RETAIL_MARKUP_MULTIPLIER, changePercent24Hr: -0.4 },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', priceUsd: 0.24 * RETAIL_MARKUP_MULTIPLIER, priceInr: 21.1 * RETAIL_MARKUP_MULTIPLIER, changePercent24Hr: 4.8 },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', priceUsd: 6.8 * RETAIL_MARKUP_MULTIPLIER, priceInr: 598 * RETAIL_MARKUP_MULTIPLIER, changePercent24Hr: -1.2 },
];

export async function fetchLiveCryptoPrices(): Promise<CryptoCoin[]> {
  try {
    let rawList: any[] = [];

    // 1. Try internal backend proxy (already includes retail markup)
    try {
      const res = await fetch('/api/ticker');
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          rawList = json.data;
        }
      }
    } catch {
      // Backend proxy unavailable
    }

    // 2. Direct CoinGecko Client Call (same endpoint as website ticker.js)
    if (rawList.length === 0) {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether,ripple,cardano,dogecoin,polkadot&vs_currencies=inr,usd&include_24hr_change=true'
      );
      if (res.ok) {
        const data = await res.json();
        const coins = [
          { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
          { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
          { id: 'solana', symbol: 'SOL', name: 'Solana' },
          { id: 'tether', symbol: 'USDT', name: 'Tether USD' },
          { id: 'ripple', symbol: 'XRP', name: 'XRP' },
          { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
          { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
          { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
        ];
        rawList = coins.map((c) => ({
          id: c.id,
          symbol: c.symbol,
          name: c.name,
          priceUsd: (data[c.id]?.usd || 0) * RETAIL_MARKUP_MULTIPLIER,
          priceInr: (data[c.id]?.inr || 0) * RETAIL_MARKUP_MULTIPLIER,
          changePercent24Hr: data[c.id]?.usd_24h_change || 0,
        }));
      }
    }

    if (rawList.length > 0) {
      return rawList.map((c) => ({
        id: c.id,
        symbol: c.symbol,
        name: c.name || c.symbol,
        priceUsd: Number(c.priceUsd) || 0,
        priceInr: Number(c.priceInr) || 0,
        changePercent24Hr: Number((Number(c.changePercent24Hr) || 0).toFixed(2)),
      }));
    }
  } catch (err) {
    console.warn('Using fallback coins:', err);
  }
  return FALLBACK_COINS;
}

/**
 * Computes portfolio valuation dynamically based on user mock transactions
 * and live time-weighted compounding rates from transaction timestamps.
 */
export function calculateDynamicPortfolio(
  transactions: Transaction[],
  activeBasketId: BasketId,
  liveCoins: CryptoCoin[]
): PortfolioSummary {
  if (!transactions || transactions.length === 0) {
    return {
      currentValue: 0,
      totalInvested: 0,
      totalReturnsRupees: 0,
      totalReturnsPercentage: 0,
      oneDayChangeRupees: 0,
      oneDayChangePercentage: 0,
      averageMonthlyReturn: activeBasketId === 'stable' ? 0.98 : 3.2,
    };
  }

  const now = Date.now();
  let totalInvested = 0;
  let accumulatedValue = 0;

  // Basket annual baseline growth rate (8% for Stable, 28% for Growth)
  const annualRate = activeBasketId === 'stable' ? 0.08 : 0.28;
  const secondRate = annualRate / (365 * 24 * 3600);

  // Live market sentiment multiplier from BTC / ETH / SOL 24h change
  const btcChange = liveCoins.find((c) => c.symbol === 'BTC')?.changePercent24Hr || 1.5;
  const ethChange = liveCoins.find((c) => c.symbol === 'ETH')?.changePercent24Hr || 1.2;
  const solChange = liveCoins.find((c) => c.symbol === 'SOL')?.changePercent24Hr || 3.0;
  const usdtChange = 0.02;

  // Weighted 24h delta: Stable is 85% USDT + 15% BTC; Growth is 70% BTC + 20% ETH + 10% SOL
  const marketAdjustment = (
    activeBasketId === 'stable'
      ? usdtChange * 0.85 + btcChange * 0.15
      : btcChange * 0.70 + ethChange * 0.20 + solChange * 0.10
  ) / 100;

  // Sort transactions chronologically (oldest to newest) for accurate cost-basis tracking
  const sortedTx = [...transactions].sort((a, b) => {
    const timeA = new Date(a.isoTimestamp || 0).getTime();
    const timeB = new Date(b.isoTimestamp || 0).getTime();
    return timeA - timeB;
  });

  sortedTx.forEach((tx) => {
    if (tx.status !== 'SUCCESS') return;

    if (tx.type === 'WITHDRAWAL') {
      if (accumulatedValue > 0) {
        const grossWithdrawal = Math.min(accumulatedValue, tx.amount);
        const soldProportion = Math.min(1, grossWithdrawal / accumulatedValue);
        const principalReduced = totalInvested * soldProportion;
        totalInvested = Math.max(0, totalInvested - principalReduced);
        accumulatedValue = Math.max(0, accumulatedValue - grossWithdrawal);
      } else {
        totalInvested = Math.max(0, totalInvested - tx.amount);
        accumulatedValue = 0;
      }
    } else {
      totalInvested += tx.amount;

      // Elapsed time in seconds since transaction was executed
      const txTime = new Date(tx.isoTimestamp).getTime();
      const elapsedSeconds = Math.max(10, Math.floor((now - txTime) / 1000));

      // Compounded value + live market sentiment delta
      const growthFactor = Math.pow(1 + secondRate, elapsedSeconds) + (marketAdjustment * 0.05);
      const txValuation = tx.amount * Math.max(1, growthFactor);
      accumulatedValue += txValuation;
    }
  });

  const currentValue = Math.round(accumulatedValue * 100) / 100;
  const totalReturnsRupees = Math.round((currentValue - totalInvested) * 100) / 100;
  const totalReturnsPercentage = totalInvested > 0 ? Number(((totalReturnsRupees / totalInvested) * 100).toFixed(2)) : 0;
  const oneDayChangePercentage = activeBasketId === 'stable' ? Math.max(0.1, Number((btcChange * 0.5).toFixed(2))) : Math.max(0.2, Number((solChange * 0.8).toFixed(2)));
  const oneDayChangeRupees = Math.round((currentValue * (oneDayChangePercentage / 100)) * 100) / 100;

  return {
    currentValue,
    totalInvested,
    totalReturnsRupees,
    totalReturnsPercentage,
    oneDayChangeRupees,
    oneDayChangePercentage,
    averageMonthlyReturn: activeBasketId === 'stable' ? 0.98 : 3.2,
  };
}
