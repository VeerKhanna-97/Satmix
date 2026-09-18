// ============================================================
// FILE: src/utils/chartSeries.ts
// PURPOSE: Time-Series Generator for Portfolio Performance Curves
//          Fixed Sunday-to-Saturday Calendar Week Alignment & DateKey Filtering
// ============================================================

import { Transaction, BasketId, CryptoCoin, PortfolioSummary } from '../types';
import { toDateKey, getStartOfWeek, shiftDateKey, getDaysDifference } from './streakEngine';

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
  const todayKey = toDateKey(now);

  // Basket annual rate (8% for Stable, 28% for Growth)
  const annualRate = activeBasketId === 'stable' ? 0.08 : 0.28;
  const dailyRate = annualRate / 365;

  const btcChange = liveCoins.find((c) => c.symbol === 'BTC')?.changePercent24Hr || 1.5;
  const solChange = liveCoins.find((c) => c.symbol === 'SOL')?.changePercent24Hr || 3.0;
  const marketAdjustment = (activeBasketId === 'stable' ? btcChange * 0.4 : (btcChange * 0.3 + solChange * 0.7)) / 100;

  // 1. If Zero-state (new user), generate an illustrative DCA compounding projection curve
  if (isZero) {
    const points: ChartDataPoint[] = [];

    if (timeframe === '1W') {
      // Standard Sunday-to-Saturday Calendar Week Projection
      const sunday = getStartOfWeek(now);
      const simulatedDailySip = 50;

      for (let i = 0; i < 7; i++) {
        const dObj = new Date(sunday);
        dObj.setDate(sunday.getDate() + i);
        dObj.setHours(12, 0, 0, 0);

        const daysInvested = i + 1;
        const simInvested = daysInvested * simulatedDailySip;

        let simValue = simInvested;
        if (dailyRate > 0) {
          simValue = simulatedDailySip * ((Math.pow(1 + dailyRate, daysInvested) - 1) / dailyRate);
        }
        const noise = (Math.sin(i * 0.6) * 0.01) + (marketAdjustment * 0.02 * (i / 7));
        simValue = simValue * (1 + noise);

        const roundedVal = Math.round(simValue * 100) / 100;
        const roundedInv = Math.round(simInvested * 100) / 100;
        const gain = Math.round((roundedVal - roundedInv) * 100) / 100;
        const gainPercentage = roundedInv > 0 ? Number(((gain / roundedInv) * 100).toFixed(2)) : 0;

        points.push({
          date: dObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          fullDate: dObj.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
          timestamp: dObj.getTime(),
          label: dObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          invested: roundedInv,
          value: roundedVal,
          gain,
          gainPercentage,
        });
      }
    } else {
      const projectionDays =
        timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : timeframe === '1Y' ? 365 : 180;
      const numSamples = 30;
      const sampleIntervalDays = projectionDays / (numSamples - 1);
      const simulatedDailySip = 50;

      for (let i = 0; i < numSamples; i++) {
        const dayOffset = Math.round(i * sampleIntervalDays);
        const targetTime = now - (projectionDays - dayOffset) * dayMs;
        const dObj = new Date(targetTime);

        const daysInvested = dayOffset + 1;
        const simInvested = daysInvested * simulatedDailySip;

        let simValue = simInvested;
        if (dailyRate > 0) {
          simValue = simulatedDailySip * ((Math.pow(1 + dailyRate, daysInvested) - 1) / dailyRate);
        }
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
          label: dObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          invested: roundedInv,
          value: roundedVal,
          gain,
          gainPercentage,
        });
      }
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
      totalGains: lastPoint?.gain || 0,
      gainPercentage: lastPoint?.gainPercentage || 0,
    };
  }

  // 2. Real User Portfolio with actual transactions
  // Chronologically sorted success transactions
  const validTx = [...transactions]
    .filter((t) => t.status === 'SUCCESS')
    .sort((a, b) => {
      const tA = new Date(a.isoTimestamp || 0).getTime();
      const tB = new Date(b.isoTimestamp || 0).getTime();
      return tA - tB;
    });

  const overallReturnRatio = portfolioSummary.totalInvested > 0
    ? (portfolioSummary.currentValue - portfolioSummary.totalInvested) / portfolioSummary.totalInvested
    : 0;

  const points: ChartDataPoint[] = [];

  if (timeframe === '1W') {
    // ── FIXED SUNDAY-TO-SATURDAY CALENDAR WEEK ─────────────────────
    const sunday = getStartOfWeek(now);

    for (let i = 0; i < 7; i++) {
      const dObj = new Date(sunday);
      dObj.setDate(sunday.getDate() + i);
      dObj.setHours(12, 0, 0, 0);

      const sampleDateKey = toDateKey(dObj);
      const isPastOrToday = sampleDateKey <= todayKey;
      const isToday = sampleDateKey === todayKey;

      // Filter transactions executed on or before this calendar day
      const txUpToThisDay = validTx.filter((t) => {
        const txDateKey = t.isoTimestamp ? toDateKey(t.isoTimestamp) : toDateKey(t.timestamp || now);
        return txDateKey <= sampleDateKey;
      });

      let runningInvested = 0;
      let runningValue = 0;

      if (isPastOrToday && txUpToThisDay.length > 0) {
        txUpToThisDay.forEach((tx) => {
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
            const txDateKey = tx.isoTimestamp ? toDateKey(tx.isoTimestamp) : toDateKey(tx.timestamp || now);
            const daysSinceTx = Math.max(0, getDaysDifference(sampleDateKey, txDateKey));
            const totalSpanDays = Math.max(1, getDaysDifference(todayKey, txDateKey));
            const progress = Math.min(1, daysSinceTx / totalSpanDays);

            const marketWave = (Math.sin(daysSinceTx * 1.5) * 0.012 + Math.cos(daysSinceTx * 0.8) * 0.008) * (1 + marketAdjustment);
            const convergence = 1 - progress;
            const pointMultiplier = Math.max(0.01, 1 + (progress * overallReturnRatio) + (marketWave * convergence));

            runningValue += tx.amount * pointMultiplier;
          }
        });

        // Exact match on today
        if (isToday) {
          runningInvested = portfolioSummary.totalInvested;
          runningValue = portfolioSummary.currentValue;
        }
      } else if (!isPastOrToday) {
        // Upcoming future days in the week mirror the latest live portfolio status
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
        timestamp: dObj.getTime(),
        label: dObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        invested: roundedInv,
        value: roundedVal,
        gain,
        gainPercentage,
      });
    }
  } else {
    // ── MULTI-DAY / MULTI-MONTH TIMEFRAMES (1M, 3M, 1Y, ALL) ────────
    let numDays = 30;
    let sampleCount = 30;

    switch (timeframe) {
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
        if (validTx.length > 0) {
          const firstTxDateKey = validTx[0].isoTimestamp ? toDateKey(validTx[0].isoTimestamp) : todayKey;
          const diffDays = Math.max(7, getDaysDifference(todayKey, firstTxDateKey) + 1);
          numDays = diffDays;
          sampleCount = Math.min(60, Math.max(7, diffDays));
        } else {
          numDays = 30;
          sampleCount = 30;
        }
        break;
      }
    }

    const intervalDays = (numDays - 1) / (sampleCount - 1 || 1);

    for (let i = 0; i < sampleCount; i++) {
      const isLast = i === sampleCount - 1;
      const dayOffsetFromStart = Math.round(i * intervalDays);
      const sampleDateKey = shiftDateKey(todayKey, -(numDays - 1 - dayOffsetFromStart));
      const [y, m, d] = sampleDateKey.split('-').map(Number);
      const dObj = new Date(y, m - 1, d, 12, 0, 0);

      // Filter transactions on or before this sample calendar date
      const txUpToThisDay = validTx.filter((t) => {
        const txDateKey = t.isoTimestamp ? toDateKey(t.isoTimestamp) : toDateKey(t.timestamp || now);
        return txDateKey <= sampleDateKey;
      });

      let runningInvested = 0;
      let runningValue = 0;

      if (txUpToThisDay.length > 0) {
        txUpToThisDay.forEach((tx) => {
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
            const txDateKey = tx.isoTimestamp ? toDateKey(tx.isoTimestamp) : toDateKey(tx.timestamp || now);
            const daysSinceTx = Math.max(0, getDaysDifference(sampleDateKey, txDateKey));
            const totalSpanDays = Math.max(1, getDaysDifference(todayKey, txDateKey));
            const progress = Math.min(1, daysSinceTx / totalSpanDays);

            const marketWave = (Math.sin((daysSinceTx * 1.2)) * 0.015 + Math.cos((daysSinceTx * 0.6)) * 0.01) * (1 + marketAdjustment);
            const convergence = 1 - progress;
            const pointMultiplier = Math.max(0.01, 1 + (progress * overallReturnRatio) + (marketWave * convergence));

            runningValue += tx.amount * pointMultiplier;
          }
        });

        if (isLast) {
          runningInvested = portfolioSummary.totalInvested;
          runningValue = portfolioSummary.currentValue;
        }
      }

      const roundedVal = Math.round(runningValue * 100) / 100;
      const roundedInv = Math.round(runningInvested * 100) / 100;
      const gain = Math.round((roundedVal - roundedInv) * 100) / 100;
      const gainPercentage = roundedInv > 0 ? Number(((gain / roundedInv) * 100).toFixed(2)) : 0;

      points.push({
        date: dObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        fullDate: dObj.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: dObj.getTime(),
        label: dObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        invested: roundedInv,
        value: roundedVal,
        gain,
        gainPercentage,
      });
    }
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


