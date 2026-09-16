// ============================================================
// FILE: src/utils/chartSeries.ts
// PURPOSE: Time-Series Generator for Portfolio Performance Curves
//          Synthesizes real transactions, DCA compounding, and live market delta
// ============================================================

import { Transaction, BasketId, CryptoCoin, PortfolioSummary } from '../types';

export type ChartTimeframe = '1W' | '1M' | '3M' | '1Y' | 'ALL';

export interface ChartDataPoint {
  date: string; // e.g. '04 Sep'
  fullDate: string; // e.g. 'Fri, 04 Sep 2026'
  timestamp: number;
  label: string;
  invested: number;
  value: number;
  gain: number;
  gainPercentage: number;
}

export interface ChartSeriesResult {
  points: ChartDataPoint[];
  minVal: number;
  maxVal: number;
  timeframe: ChartTimeframe;
  isProjection: boolean;
  totalGains: number;
  gainPercentage: number;
}

/**
 * Generate time-series data for the portfolio performance chart
 */
export function generateChartSeries(
  timeframe: ChartTimeframe,
  transactions: Transaction[],
  portfolioSummary: PortfolioSummary,
  activeBasketId: BasketId,
  liveCoins: CryptoCoin[] = []
): ChartSeriesResult {
  const isZero = portfolioSummary.totalInvested <= 0;
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Basket annual rate (8% for Stable, 28% for Growth)
  const annualRate = activeBasketId === 'stable' ? 0.08 : 0.28;
  const dailyRate = annualRate / 365;

  const btcChange = liveCoins.find((c) => c.symbol === 'BTC')?.changePercent24Hr || 1.5;
  const solChange = liveCoins.find((c) => c.symbol === 'SOL')?.changePercent24Hr || 3.0;
  const marketAdjustment = (activeBasketId === 'stable' ? btcChange * 0.4 : (btcChange * 0.3 + solChange * 0.7)) / 100;

  // 1. If Zero-state (new user), generate an illustrative DCA compounding projection curve
  if (isZero) {
    const projectionDays =
      timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : timeframe === '1Y' ? 365 : 180;

    const numSamples = timeframe === '1W' ? 7 : 30;
    const sampleIntervalDays = projectionDays / (numSamples - 1);
    const simulatedDailySip = 50;

    const points: ChartDataPoint[] = [];

    for (let i = 0; i < numSamples; i++) {
      const dayOffset = Math.round(i * sampleIntervalDays);
      const targetTime = now - (projectionDays - dayOffset) * dayMs;
      const dObj = new Date(targetTime);

      const daysInvested = dayOffset + 1;
      const simInvested = daysInvested * simulatedDailySip;

      // Future value of daily micro-SIP: FV = PMT * [((1 + r)^n - 1) / r]
      let simValue = simInvested;
      if (dailyRate > 0) {
        simValue = simulatedDailySip * ((Math.pow(1 + dailyRate, daysInvested) - 1) / dailyRate);
      }
      // Add subtle market sentiment curve
      const noise = (Math.sin(i * 0.6) * 0.015) + (marketAdjustment * 0.02 * (i / numSamples));
      simValue = simValue * (1 + noise);

      const roundedVal = Math.round(simValue * 100) / 100;
      const roundedInv = Math.round(simInvested * 100) / 100;
      const gain = Math.round((roundedVal - roundedInv) * 100) / 100;
      const gainPercentage = roundedInv > 0 ? Number(((gain / roundedInv) * 100).toFixed(2)) : 0;

      points.push({
        date: dObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        fullDate: dObj.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: targetTime,
        label: `Day ${daysInvested}`,
        invested: roundedInv,
        value: roundedVal,
        gain,
        gainPercentage,
      });
    }

    const allValues = points.flatMap((p) => [p.value, p.invested]);
    const minVal = Math.min(...allValues, 0);
    const maxVal = Math.max(...allValues, 100);

    const lastPoint = points[points.length - 1];

    return {
      points,
      minVal,
      maxVal,
      timeframe,
      isProjection: true,
      totalGains: lastPoint.gain,
      gainPercentage: lastPoint.gainPercentage,
    };
  }

  // 2. Real User Portfolio with actual transactions
  let numDays = 30;
  let sampleCount = 30;

  switch (timeframe) {
    case '1W':
      numDays = 7;
      sampleCount = 7;
      break;
    case '1M':
      numDays = 30;
      sampleCount = 30;
      break;
    case '3M':
      numDays = 90;
      sampleCount = 30;
      break;
    case '1Y':
      numDays = 365;
      sampleCount = 52;
      break;
    case 'ALL':
    default: {
      const sorted = [...transactions]
        .filter((t) => t.status === 'SUCCESS' && t.isoTimestamp)
        .sort((a, b) => new Date(a.isoTimestamp).getTime() - new Date(b.isoTimestamp).getTime());

      if (sorted.length > 0) {
        const firstTime = new Date(sorted[0].isoTimestamp).getTime();
        const diffDays = Math.max(7, Math.ceil((now - firstTime) / dayMs));
        numDays = diffDays;
        sampleCount = Math.min(60, Math.max(7, diffDays));
      } else {
        numDays = 30;
        sampleCount = 30;
      }
      break;
    }
  }

  const startTime = now - numDays * dayMs;
  const intervalMs = (now - startTime) / (sampleCount - 1 || 1);

  // Chronologically sorted success transactions
  const validTx = [...transactions]
    .filter((t) => t.status === 'SUCCESS')
    .sort((a, b) => {
      const tA = new Date(a.isoTimestamp || 0).getTime();
      const tB = new Date(b.isoTimestamp || 0).getTime();
      return tA - tB;
    });

  const points: ChartDataPoint[] = [];

  for (let i = 0; i < sampleCount; i++) {
    const sampleTimestamp = i === sampleCount - 1 ? now : startTime + i * intervalMs;
    const dObj = new Date(sampleTimestamp);

    // Filter transactions up to this sample point
    const txUpToNow = validTx.filter((t) => {
      const txTime = new Date(t.isoTimestamp || 0).getTime();
      return txTime <= sampleTimestamp;
    });

    let runningInvested = 0;
    let runningValue = 0;

    txUpToNow.forEach((tx) => {
      if (tx.type === 'WITHDRAWAL') {
        if (runningValue > 0) {
          const grossWd = Math.min(runningValue, tx.amount);
          const prop = Math.min(1, grossWd / runningValue);
          runningInvested = Math.max(0, runningInvested - runningInvested * prop);
          runningValue = Math.max(0, runningValue - grossWd);
        } else {
          runningInvested = Math.max(0, runningInvested - tx.amount);
          runningValue = 0;
        }
      } else {
        runningInvested += tx.amount;
        const txTime = new Date(tx.isoTimestamp || 0).getTime();
        const elapsedSec = Math.max(0, Math.floor((sampleTimestamp - txTime) / 1000));
        const secondRate = annualRate / (365 * 24 * 3600);
        const factor = Math.pow(1 + secondRate, elapsedSec) + (marketAdjustment * 0.04);
        runningValue += tx.amount * Math.max(1, factor);
      }
    });

    // If it's the last point, align strictly with live portfolio summary
    if (i === sampleCount - 1) {
      runningInvested = portfolioSummary.totalInvested;
      runningValue = portfolioSummary.currentValue;
    }

    const roundedVal = Math.round(runningValue * 100) / 100;
    const roundedInv = Math.round(runningInvested * 100) / 100;
    const gain = Math.round((roundedVal - roundedInv) * 100) / 100;
    const gainPercentage = roundedInv > 0 ? Number(((gain / roundedInv) * 100).toFixed(2)) : 0;

    points.push({
      date: dObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      fullDate: dObj.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
      timestamp: sampleTimestamp,
      label: dObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      invested: roundedInv,
      value: roundedVal,
      gain,
      gainPercentage,
    });
  }

  const allValues = points.flatMap((p) => [p.value, p.invested]);
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 100);

  const finalPoint = points[points.length - 1];

  return {
    points,
    minVal,
    maxVal,
    timeframe,
    isProjection: false,
    totalGains: finalPoint?.gain || 0,
    gainPercentage: finalPoint?.gainPercentage || 0,
  };
}
