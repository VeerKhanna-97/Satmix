import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityEntry } from '../types';

export interface SatmixAssetHolding {
  asset: 'BTC' | 'ETH' | 'SOL' | 'USDT';
  label: string;
  icon: string;
  tag: string;
  color: string;
  units: number;
  averageBuyPriceINR: number;
  currentPriceINR: number;
  investedINR: number;
  currentValueINR: number;
  unrealizedPnLINR: number;
  unrealizedROI: number;
  allocationPct: number;
  change24h: number;
}

export interface PortfolioMetrics {
  totalCurrentValueINR: number;
  totalInvestedINR: number;
  totalUnrealizedPnLINR: number;
  totalROI: number;
  activeTokensCount: number;
}

export interface UseSatmixPortfolioResult {
  holdings: SatmixAssetHolding[];
  metrics: PortfolioMetrics;
  loading: boolean;
  refresh: () => Promise<void>;
}

const ASSET_META: Record<
  'BTC' | 'ETH' | 'SOL' | 'USDT',
  { label: string; icon: string; tag: string; color: string }
> = {
  BTC: {
    label: 'Bitcoin',
    icon: '/currencies/Bitcoin cursor.png',
    tag: 'Store of Value',
    color: '#f7931b',
  },
  ETH: {
    label: 'Ethereum',
    icon: '/currencies/ethereum-eth-logo.png',
    tag: 'Smart Contracts',
    color: '#627eea',
  },
  SOL: {
    label: 'Solana',
    icon: '/currencies/Solana.png',
    tag: 'High Throughput',
    color: '#9945fe',
  },
  USDT: {
    label: 'Tether USD',
    icon: '/currencies/USDT.png',
    tag: 'Capital Guard',
    color: '#26a17b',
  },
};

/**
 * Custom hook mapping raw ledger transactions and live market feeds
 * into high-density derived portfolio metrics and per-asset Mark-to-Market holdings.
 */
export function useSatmixPortfolio(
  activityLedger?: ActivityEntry[],
  filter?: 'all' | 'stable' | 'growth'
): UseSatmixPortfolioResult {
  const {
    prototypeState,
    livePrices,
    liveCoins,
    isPricesLoading,
    activeTabFilter,
    triggerAccrual,
    tabMetrics,
  } = useApp();

  const activeFilter = filter || activeTabFilter;
  const ledger = activityLedger || prototypeState.activity;

  const { holdings, metrics } = useMemo(() => {
    // If ledger is the canonical prototype activity and filter matches activeTabFilter,
    // we leverage tabMetrics for instant zero-drift parity.
    const isCanonical =
      (!activityLedger || activityLedger === prototypeState.activity) &&
      activeFilter === activeTabFilter;

    const coins: ('BTC' | 'ETH' | 'SOL' | 'USDT')[] = ['BTC', 'ETH', 'SOL', 'USDT'];

    let computedHoldings: SatmixAssetHolding[] = [];
    let totalInvested = 0;
    let totalValue = 0;

    if (isCanonical && tabMetrics) {
      totalInvested = tabMetrics.totalInvested;
      totalValue = tabMetrics.marketValue;

      computedHoldings = coins.map((coin) => {
        const detail = tabMetrics.holdings[coin];
        const meta = ASSET_META[coin];
        const coinMarket = liveCoins.find((c) => c.symbol === coin);
        const alloc = totalValue > 0 ? (detail.inrValue / totalValue) * 100 : 0;

        return {
          asset: coin,
          label: meta.label,
          icon: meta.icon,
          tag: meta.tag,
          color: meta.color,
          units: detail.units || 0,
          averageBuyPriceINR: detail.avgBuyPriceInr || 0,
          currentPriceINR: detail.priceInr || livePrices[coin] || 0,
          investedINR: detail.investedInr || 0,
          currentValueINR: detail.inrValue || 0,
          unrealizedPnLINR: detail.gainRupees || 0,
          unrealizedROI: detail.gainPercentage || 0,
          allocationPct: Math.round(alloc * 10) / 10,
          change24h: coinMarket?.changePercent24Hr || 0,
        };
      });
    } else {
      // Derive directly from the supplied ledger
      const filteredLedger = ledger.filter(
        (act) => activeFilter === 'all' || act.basketId === activeFilter
      );

      const assetMap: Record<
        'BTC' | 'ETH' | 'SOL' | 'USDT',
        { units: number; investedInr: number }
      > = {
        BTC: { units: 0, investedInr: 0 },
        ETH: { units: 0, investedInr: 0 },
        SOL: { units: 0, investedInr: 0 },
        USDT: { units: 0, investedInr: 0 },
      };

      filteredLedger.forEach((entry) => {
        if (entry.fills && entry.fills.length > 0) {
          entry.fills.forEach((fill) => {
            const assetKey = fill.asset as 'BTC' | 'ETH' | 'SOL' | 'USDT';
            if (assetMap[assetKey]) {
              assetMap[assetKey].units += fill.units;
              assetMap[assetKey].investedInr += fill.inr;
            }
          });
        }
      });

      computedHoldings = coins.map((coin) => {
        const meta = ASSET_META[coin];
        const coinMarket = liveCoins.find((c) => c.symbol === coin);
        const data = assetMap[coin];
        const spotPrice = livePrices[coin] || 0;
        const safeUnits = Math.max(0, data.units);
        const safeInvested = Math.max(0, data.investedInr);
        const currentValue = safeUnits * spotPrice;
        const avgBuy = safeUnits > 0 ? safeInvested / safeUnits : 0;
        const pnl = currentValue - safeInvested;
        const roi = safeInvested > 0 ? (pnl / safeInvested) * 100 : 0;

        totalInvested += safeInvested;
        totalValue += currentValue;

        return {
          asset: coin,
          label: meta.label,
          icon: meta.icon,
          tag: meta.tag,
          color: meta.color,
          units: safeUnits,
          averageBuyPriceINR: avgBuy,
          currentPriceINR: spotPrice,
          investedINR: safeInvested,
          currentValueINR: currentValue,
          unrealizedPnLINR: pnl,
          unrealizedROI: Math.round(roi * 100) / 100,
          allocationPct: 0, // Will be computed after totalValue
          change24h: coinMarket?.changePercent24Hr || 0,
        };
      });

      // Compute allocation percentages
      computedHoldings.forEach((h) => {
        h.allocationPct =
          totalValue > 0 ? Math.round(((h.currentValueINR / totalValue) * 100) * 10) / 10 : 0;
      });
    }

    const netPnL = totalValue - totalInvested;
    const netROI = totalInvested > 0 ? (netPnL / totalInvested) * 100 : 0;
    const activeCount = computedHoldings.filter((h) => h.units > 0).length;

    const computedMetrics: PortfolioMetrics = {
      totalCurrentValueINR: totalValue,
      totalInvestedINR: totalInvested,
      totalUnrealizedPnLINR: netPnL,
      totalROI: Math.round(netROI * 100) / 100,
      activeTokensCount: activeCount,
    };

    return {
      holdings: computedHoldings,
      metrics: computedMetrics,
    };
  }, [ledger, livePrices, liveCoins, activeFilter, activeTabFilter, tabMetrics, activityLedger, prototypeState.activity]);

  return {
    holdings,
    metrics,
    loading: isPricesLoading,
    refresh: async () => {
      triggerAccrual();
    },
  };
}
