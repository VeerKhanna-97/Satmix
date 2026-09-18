// ============================================================
// FILE: src/utils/chartSeries.ts
// PURPOSE: Time-Series Generator for Portfolio Performance Curves
//          Multi-Timeframe Profit/Loss Divisions & Custom Date Range View
// ============================================================

import { Transaction, BasketId, CryptoCoin, PortfolioSummary, ActivityEntry } from '../types';
import { toDateKey, getStartOfWeek, shiftDateKey, getDaysDifference } from './streakEngine';
import { HoldingDetail } from './prototypeEngine';

export type ChartTimeframe = '1W' | '1M' | '3M' | '1Y' | 'ALL' | 'CUSTOM';

export interface ChartCustomRange {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export type SegmentStatus = 'profit' | 'loss' | 'neutral';

export interface ChartSegment {
  id: string;
  label: string; // e.g. 'Sun', 'Week 1', 'Oct 2026'
  startIndex: number;
  endIndex: number;
  status: SegmentStatus;
  isProfit: boolean;
  gain: number;
  gainPercentage: number;
  granularity: 'day' | 'week' | 'month';
}

export interface ChartDataPoint {
  date: string; // e.g. '04 Sep'
  fullDate: string; // e.g. 'Fri, 04 Sep 2026'
  timestamp: number;
  label: string;
  invested: number;
  value: number;
  gain: number;
  gainPercentage: number;
  segmentId?: string;
}

export interface ChartSeriesResult {
  points: ChartDataPoint[];
  segments: ChartSegment[];
  minVal: number;
  maxVal: number;
  timeframe: ChartTimeframe;
  isProjection: boolean;
  totalGains: number;
  gainPercentage: number;
  customRange?: ChartCustomRange;
  granularity: 'day' | 'week' | 'month';
}

/**
 * Helper to compute division segments from an array of ChartDataPoints
 */
function buildChartSegments(
  points: ChartDataPoint[],
  granularity: 'day' | 'week' | 'month',
  targetChunkCount?: number,
  isProjection: boolean = false
): ChartSegment[] {
  if (points.length === 0) return [];

  const segments: ChartSegment[] = [];

  if (granularity === 'day') {
    // 1 segment per data point (e.g. 7 daily divisions in 1W)
    points.forEach((pt, idx) => {
      const isZeroInvested = !isProjection && pt.invested <= 0 && pt.value <= 0;
      let status: SegmentStatus = 'neutral';
      if (!isZeroInvested) {
        status = pt.gain >= 0 ? 'profit' : 'loss';
      }
      const isProfit = status === 'profit';
      const dayName = pt.fullDate.split(',')[0] || pt.label;
      const seg: ChartSegment = {
        id: `seg-day-${idx}`,
        label: dayName,
        startIndex: idx,
        endIndex: idx,
        status,
        isProfit,
        gain: pt.gain,
        gainPercentage: pt.gainPercentage,
        granularity: 'day',
      };
      pt.segmentId = seg.id;
      segments.push(seg);
    });
    return segments;
  }

  // Determine chunk size for grouping points
  let numChunks = targetChunkCount || (granularity === 'week' ? 4 : 12);
  numChunks = Math.min(numChunks, points.length);
  numChunks = Math.max(1, numChunks);

  const chunkSize = points.length / numChunks;

  for (let c = 0; c < numChunks; c++) {
    const startIndex = Math.floor(c * chunkSize);
    const endIndex = c === numChunks - 1 ? points.length - 1 : Math.floor((c + 1) * chunkSize) - 1;

    if (startIndex > endIndex || startIndex >= points.length) continue;

    const slice = points.slice(startIndex, endIndex + 1);
    const maxInvested = Math.max(...slice.map((p) => p.invested), 0);
    const maxValue = Math.max(...slice.map((p) => p.value), 0);
    const isZeroInvested = !isProjection && maxInvested <= 0 && maxValue <= 0;

    const sumGain = slice.reduce((acc, p) => acc + p.gain, 0);
    const avgGain = Math.round((sumGain / (slice.length || 1)) * 100) / 100;
    const sumGainPct = slice.reduce((acc, p) => acc + p.gainPercentage, 0);
    const avgGainPct = Number((sumGainPct / (slice.length || 1)).toFixed(2));

    let status: SegmentStatus = 'neutral';
    if (!isZeroInvested) {
      status = avgGain >= 0 ? 'profit' : 'loss';
    }
    const isProfit = status === 'profit';

    const firstDate = slice[0]?.date || '';
    const lastDate = slice[slice.length - 1]?.date || '';
    const label =
      granularity === 'week'
        ? `W${c + 1} (${firstDate}${firstDate !== lastDate ? ` - ${lastDate}` : ''})`
        : `M${c + 1} (${firstDate}${firstDate !== lastDate ? ` - ${lastDate}` : ''})`;

    const seg: ChartSegment = {
      id: `seg-${granularity}-${c}`,
      label,
      startIndex,
      endIndex,
      status,
      isProfit,
      gain: avgGain,
      gainPercentage: avgGainPct,
      granularity,
    };

    slice.forEach((p) => {
      p.segmentId = seg.id;
    });

    segments.push(seg);
  }

  return segments;
}

/**
 * Generate time-series data for the portfolio performance chart
 */
export function generateChartSeries(
  timeframe: ChartTimeframe,
  transactions: Transaction[],
  portfolioSummary: PortfolioSummary,
  activeBasketId: BasketId,
  liveCoins: CryptoCoin[] = [],
  customRange?: ChartCustomRange
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

  // Custom Range calculations
  let effectiveStartDateKey = todayKey;
  let effectiveEndDateKey = todayKey;
  let customDiffDays = 30;
  let customGranularity: 'day' | 'week' | 'month' = 'week';

  if (timeframe === 'CUSTOM') {
    const rawStart = customRange?.startDate || shiftDateKey(todayKey, -30);
    const rawEnd = customRange?.endDate || todayKey;
    effectiveStartDateKey = rawStart <= rawEnd ? rawStart : rawEnd;
    effectiveEndDateKey = rawStart <= rawEnd ? rawEnd : rawStart;

    customDiffDays = Math.max(1, getDaysDifference(effectiveEndDateKey, effectiveStartDateKey) + 1);
    if (customDiffDays <= 14) {
      customGranularity = 'day';
    } else if (customDiffDays <= 90) {
      customGranularity = 'week';
    } else {
      customGranularity = 'month';
    }
  }

  // 1. If Zero-state (new user), generate an illustrative DCA compounding projection curve
  if (isZero) {
    const points: ChartDataPoint[] = [];
    let granularity: 'day' | 'week' | 'month' = 'week';
    let targetChunkCount: number | undefined;

    if (timeframe === '1W') {
      granularity = 'day';
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
    } else if (timeframe === 'CUSTOM') {
      granularity = customGranularity;
      const numSamples = granularity === 'day' ? customDiffDays : Math.min(30, customDiffDays);
      const sampleIntervalDays = (customDiffDays - 1) / (numSamples - 1 || 1);
      const simulatedDailySip = 50;

      for (let i = 0; i < numSamples; i++) {
        const dayOffset = Math.round(i * sampleIntervalDays);
        const sampleDateKey = shiftDateKey(effectiveStartDateKey, dayOffset);
        const [y, m, d] = sampleDateKey.split('-').map(Number);
        const dObj = new Date(y, m - 1, d, 12, 0, 0);

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
          timestamp: dObj.getTime(),
          label: dObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
          invested: roundedInv,
          value: roundedVal,
          gain,
          gainPercentage,
        });
      }

      if (granularity === 'week') targetChunkCount = Math.min(12, Math.max(2, Math.round(customDiffDays / 7)));
      if (granularity === 'month') targetChunkCount = Math.min(12, Math.max(2, Math.round(customDiffDays / 30)));
    } else {
      const projectionDays =
        timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : timeframe === '1Y' ? 365 : 180;
      granularity = timeframe === '1M' || timeframe === '3M' ? 'week' : 'month';
      targetChunkCount = timeframe === '1M' ? 4 : timeframe === '3M' ? 12 : 12;

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

    const segments = buildChartSegments(points, granularity, targetChunkCount, true);
    const allValues = points.flatMap((p) => [p.value, p.invested]);
    const minVal = Math.min(...allValues, 0);
    const maxVal = Math.max(...allValues, 100);
    const lastPoint = points[points.length - 1];

    return {
      points,
      segments,
      minVal,
      maxVal,
      timeframe,
      isProjection: true,
      totalGains: lastPoint?.gain || 0,
      gainPercentage: lastPoint?.gainPercentage || 0,
      customRange: timeframe === 'CUSTOM' ? { startDate: effectiveStartDateKey, endDate: effectiveEndDateKey } : undefined,
      granularity,
    };
  }

  // 2. Real User Portfolio with actual transactions
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
  let granularity: 'day' | 'week' | 'month' = 'week';
  let targetChunkCount: number | undefined;

  if (timeframe === '1W') {
    // ── FIXED SUNDAY-TO-SATURDAY CALENDAR WEEK (7 DIVISIONS) ───────
    granularity = 'day';
    const sunday = getStartOfWeek(now);

    for (let i = 0; i < 7; i++) {
      const dObj = new Date(sunday);
      dObj.setDate(sunday.getDate() + i);
      dObj.setHours(12, 0, 0, 0);

      const sampleDateKey = toDateKey(dObj);
      const isPastOrToday = sampleDateKey <= todayKey;
      const isToday = sampleDateKey === todayKey;

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

        if (isToday) {
          runningInvested = portfolioSummary.totalInvested;
          runningValue = portfolioSummary.currentValue;
        }
      } else if (!isPastOrToday) {
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
  } else if (timeframe === 'CUSTOM') {
    // ── CUSTOM DATE RANGE VIEW ────────────────────────────────────
    granularity = customGranularity;
    const numSamples = granularity === 'day' ? customDiffDays : Math.min(35, customDiffDays);
    const intervalDays = (customDiffDays - 1) / (numSamples - 1 || 1);

    for (let i = 0; i < numSamples; i++) {
      const isLast = i === numSamples - 1;
      const dayOffsetFromStart = Math.round(i * intervalDays);
      const sampleDateKey = shiftDateKey(effectiveStartDateKey, dayOffsetFromStart);
      const [y, m, d] = sampleDateKey.split('-').map(Number);
      const dObj = new Date(y, m - 1, d, 12, 0, 0);

      const isPastOrToday = sampleDateKey <= todayKey;
      const isToday = sampleDateKey === todayKey;

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

            const marketWave = (Math.sin((daysSinceTx * 1.2)) * 0.015 + Math.cos((daysSinceTx * 0.6)) * 0.01) * (1 + marketAdjustment);
            const convergence = 1 - progress;
            const pointMultiplier = Math.max(0.01, 1 + (progress * overallReturnRatio) + (marketWave * convergence));

            runningValue += tx.amount * pointMultiplier;
          }
        });

        if (isToday || (isLast && sampleDateKey >= todayKey)) {
          runningInvested = portfolioSummary.totalInvested;
          runningValue = portfolioSummary.currentValue;
        }
      } else if (!isPastOrToday) {
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

    if (granularity === 'week') targetChunkCount = Math.min(12, Math.max(2, Math.round(customDiffDays / 7)));
    if (granularity === 'month') targetChunkCount = Math.min(12, Math.max(2, Math.round(customDiffDays / 30)));
  } else {
    // ── MULTI-DAY / MULTI-MONTH TIMEFRAMES (1M, 3M, 1Y, ALL) ────────
    let numDays = 30;
    let sampleCount = 30;

    switch (timeframe) {
      case '1M':
        numDays = 30;
        sampleCount = 30;
        granularity = 'week';
        targetChunkCount = 4;
        break;
      case '3M':
        numDays = 90;
        sampleCount = 30;
        granularity = 'week';
        targetChunkCount = 12;
        break;
      case '1Y':
        numDays = 365;
        sampleCount = 52;
        granularity = 'month';
        targetChunkCount = 12;
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
        granularity = numDays <= 90 ? 'week' : 'month';
        targetChunkCount = Math.min(12, Math.max(3, Math.round(numDays / (granularity === 'week' ? 7 : 30))));
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

  const segments = buildChartSegments(points, granularity, targetChunkCount);
  const allValues = points.flatMap((p) => [p.value, p.invested]);
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 100);
  const finalPoint = points[points.length - 1];

  return {
    points,
    segments,
    minVal,
    maxVal,
    timeframe,
    isProjection: false,
    totalGains: finalPoint?.gain || 0,
    gainPercentage: finalPoint?.gainPercentage || 0,
    customRange: timeframe === 'CUSTOM' ? { startDate: effectiveStartDateKey, endDate: effectiveEndDateKey } : undefined,
    granularity,
  };
}

/**
 * Generates a strict 1-week (Sunday to Saturday) time-series and daily segment divisions
 * for a specific sub-asset (BTC, ETH, SOL, USDT) based on recorded activity fills and live valuation.
 */
export function generateAssetWeekSeries(
  asset: 'BTC' | 'ETH' | 'SOL' | 'USDT',
  activity: ActivityEntry[],
  holdingDetail: HoldingDetail
): ChartSeriesResult {
  const now = Date.now();
  const todayKey = toDateKey(now);
  const sunday = getStartOfWeek(now);
  const points: ChartDataPoint[] = [];

  const validActivity = [...activity].filter((a) => a.status === 'recorded');

  const assetReturnRatio =
    holdingDetail.investedInr > 0
      ? (holdingDetail.inrValue - holdingDetail.investedInr) / holdingDetail.investedInr
      : 0;

  for (let i = 0; i < 7; i++) {
    const dObj = new Date(sunday);
    dObj.setDate(sunday.getDate() + i);
    dObj.setHours(12, 0, 0, 0);

    const sampleDateKey = toDateKey(dObj);
    const isPastOrToday = sampleDateKey <= todayKey;
    const isToday = sampleDateKey === todayKey;

    const pastEntries = validActivity.filter((act) => act.date <= sampleDateKey);

    let runningUnits = 0;
    let runningInvested = 0;

    pastEntries.forEach((act) => {
      act.fills?.forEach((f) => {
        if (f.asset === asset) {
          runningUnits += f.units;
          runningInvested += f.inr;
        }
      });
    });

    let runningValue = 0;

    if (isPastOrToday && runningInvested > 0 && runningUnits > 0) {
      if (isToday) {
        runningInvested = holdingDetail.investedInr;
        runningValue = holdingDetail.inrValue;
      } else {
        const daysDifference = Math.max(0, getDaysDifference(todayKey, sampleDateKey));
        const progress = Math.min(1, Math.max(0, (6 - daysDifference) / 6));
        const marketWave = Math.sin(i * 1.4) * 0.01 + Math.cos(i * 0.9) * 0.008;
        const convergence = 1 - progress;
        const multiplier = Math.max(0.01, 1 + (progress * assetReturnRatio) + (marketWave * convergence));
        runningValue = runningInvested * multiplier;
      }
    } else if (!isPastOrToday && holdingDetail.investedInr > 0) {
      runningInvested = holdingDetail.investedInr;
      runningValue = holdingDetail.inrValue;
    } else {
      runningInvested = 0;
      runningValue = 0;
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

  const segments = buildChartSegments(points, 'day');
  const allValues = points.flatMap((p) => [p.value, p.invested]);
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 10);
  const finalPoint = points[points.length - 1];

  return {
    points,
    segments,
    minVal,
    maxVal,
    timeframe: '1W',
    isProjection: false,
    totalGains: finalPoint?.gain || 0,
    gainPercentage: finalPoint?.gainPercentage || 0,
    granularity: 'day',
  };
}
