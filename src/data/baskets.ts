// ============================================================
// FILE: src/data/baskets.ts
// PURPOSE: Authoritative Satmix investment baskets
// ============================================================

import { Basket, BasketId } from '../types';

export const BASKETS: Basket[] = [
  {
    id: 'stable',
    name: 'Stable Basket',
    riskLabel: 'Stable',
    riskTier: 'Conservative',
    tagline: 'A calmer way to start.',
    disclosure: 'Not an FD. Not a savings account.',
    accentColorKey: 'mint',
    tintColorKey: 'mintTint',
    icon: 'shield',
    returnRange: 'Capital Guard',
    historicalCagr: 'Calm Entry',
    growthRate: 0.08,
    volatility: 'Low Volatility',
    rebalance: 'Zero Churn',
    custodyPartner: 'Direct Spot Execution',
    minDailyAmount: 10,
    chips: [10, 20, 30, 50, 100],
    allocation: [
      { label: 'Tether USD', ticker: 'USDT', pct: 85, colorKey: 'mint', desc: 'USD-pegged stable reserve' },
      { label: 'Bitcoin', ticker: 'BTC', pct: 15, colorKey: 'gold', desc: 'Store of value' },
    ],
  },
  {
    id: 'growth',
    name: 'Growth Basket',
    riskLabel: 'Growth',
    riskTier: 'Aggressive',
    tagline: 'Long-term crypto, built a little every day.',
    disclosure: 'Market volatility applies. Long-term accumulation.',
    accentColorKey: 'gold',
    tintColorKey: 'goldTint',
    icon: 'trending-up',
    returnRange: 'Market Upside',
    historicalCagr: 'Long-Term Core',
    growthRate: 0.28,
    volatility: 'Market Swings',
    rebalance: 'Zero Churn',
    custodyPartner: 'Direct Spot Execution',
    minDailyAmount: 30,
    chips: [30, 50, 100, 250, 500],
    allocation: [
      { label: 'Bitcoin', ticker: 'BTC', pct: 70, colorKey: 'gold', desc: 'Market leader & foundation' },
      { label: 'Ethereum', ticker: 'ETH', pct: 20, colorKey: 'blue', desc: 'Smart contract layer' },
      { label: 'Solana', ticker: 'SOL', pct: 10, colorKey: 'purple', desc: 'High-throughput payments' },
    ],
  },
];

export const getBasketById = (id: BasketId): Basket => {
  return BASKETS.find((b) => b.id === id) || BASKETS[0];
};
