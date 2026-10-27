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
    tagline: 'Peace of mind with dollar-backed stability and mild Bitcoin upside.',
    disclosure: 'Not a fixed deposit or bank account. Digital assets fluctuate in value.',
    accentColorKey: 'mint',
    tintColorKey: 'mintTint',
    icon: 'shield',
    returnRange: 'Capital Protection',
    historicalCagr: 'Low Risk',
    growthRate: 0.08,
    volatility: 'Low Price Swings',
    rebalance: 'Hands-Free',
    custodyPartner: 'Protected Storage',
    minDailyAmount: 10,
    chips: [10, 20, 30, 50, 100],
    allocation: [
      { label: 'Digital US Dollars', ticker: 'USDT', pct: 85, colorKey: 'mint', color: '#26a17b', desc: 'Stays stable ~₹88-90, protects savings from drops' },
      { label: 'Bitcoin', ticker: 'BTC', pct: 15, colorKey: 'gold', color: '#f7931b', desc: 'World’s top digital asset for long-term growth' },
    ],
  },
  {
    id: 'growth',
    name: 'Growth Basket',
    riskLabel: 'Growth',
    riskTier: 'Aggressive',
    tagline: 'Higher upside designed to build wealth through the top 3 digital assets.',
    disclosure: 'Market prices swing up and down. Best for long-term saving (1+ years).',
    accentColorKey: 'gold',
    tintColorKey: 'goldTint',
    icon: 'trending-up',
    returnRange: 'Higher Upside',
    historicalCagr: 'Growth Focus',
    growthRate: 0.28,
    volatility: 'Higher Ups & Downs',
    rebalance: 'Hands-Free',
    custodyPartner: 'Protected Storage',
    minDailyAmount: 30,
    chips: [30, 50, 100, 250, 500],
    allocation: [
      { label: 'Bitcoin', ticker: 'BTC', pct: 70, colorKey: 'gold', color: '#f7931b', desc: 'The foundation of digital wealth' },
      { label: 'Ethereum', ticker: 'ETH', pct: 20, colorKey: 'blue', color: '#ffffff', desc: 'Powering digital applications worldwide' },
      { label: 'Solana', ticker: 'SOL', pct: 10, colorKey: 'purple', color: '#9945fe', desc: 'Ultra-fast global payments network' },
    ],
  },
];

export const getBasketById = (id: BasketId): Basket => {
  return BASKETS.find((b) => b.id === id) || BASKETS[0];
};
