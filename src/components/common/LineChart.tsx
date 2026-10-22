// ============================================================
// FILE: src/components/common/LineChart.tsx
// PURPOSE: Unified Financial Portfolio Trajectory Line Chart
//          Fritsch-Carlson Monotone Spline with Dynamic Scrubber,
//          Period Color Semantics, Compounding Projection & Benchmark Overlays
// ============================================================

import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { ChartSeriesResult, ChartDataPoint, BenchmarkSeries } from '../../utils/chartSeries';
import { TrendingUp, TrendingDown, Calendar, Sparkles } from 'lucide-react';

interface LineChartProps {
  series?: ChartSeriesResult;
  benchmarkSeries?: BenchmarkSeries | null;
  investedData?: number[];
  valueData?: number[];
  height?: number;
  showLegend?: boolean;
  showAxisLabels?: boolean;
  interactive?: boolean;
  className?: string;
  onHoverPoint?: (pt: ChartDataPoint | null) => void;
}

/**
 * Generate smooth monotonic SVG cubic Bézier path from array of coordinate points.
 * Implements Fritsch-Carlson Monotone Cubic Spline interpolation with bounded control points.
 * Guarantees zero overshoot/undershoot, preventing curves from ever dipping below baseline
 * or exceeding local plateaus.
 */
function pointsToSmoothPath(
  points: { x: number; y: number }[],
  options?: { minY?: number; maxY?: number }
): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)} L ${points[1].x.toFixed(2)},${points[1].y.toFixed(2)}`;
  }

  const n = points.length;
  const dx: number[] = [];
  const dy: number[] = [];
  const slopes: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    const deltaX = points[i + 1].x - points[i].x;
    const deltaY = points[i + 1].y - points[i].y;
    dx.push(deltaX);
    dy.push(deltaY);
    slopes.push(deltaX === 0 ? 0 : deltaY / deltaX);
  }

  // 1. Initial tangent slope estimation at each point
  const m: number[] = new Array(n).fill(0);
  m[0] = slopes[0];
  m[n - 1] = slopes[n - 2];

  for (let i = 1; i < n - 1; i++) {
    const s0 = slopes[i - 1];
    const s1 = slopes[i];
    if (s0 * s1 <= 0 || Math.abs(s0) < 1e-7 || Math.abs(s1) < 1e-7) {
      m[i] = 0;
    } else {
      m[i] = (s0 + s1) / 2;
    }
  }

  // 2. Fritsch-Carlson monotonicity check & adjustment
  for (let i = 0; i < n - 1; i++) {
    if (Math.abs(slopes[i]) < 1e-7) {
      m[i] = 0;
      m[i + 1] = 0;
    } else {
      const alpha = m[i] / slopes[i];
      const beta = m[i + 1] / slopes[i];
      if (alpha < 0) m[i] = 0;
      if (beta < 0) m[i + 1] = 0;
      const mag = alpha * alpha + beta * beta;
      if (mag > 9) {
        const tau = 3 / Math.sqrt(mag);
        m[i] = tau * alpha * slopes[i];
        m[i + 1] = tau * beta * slopes[i];
      }
    }
  }

  // 3. Convert tangents to Bézier control points with segment bounding box clamping
  let path = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;

  const minY = options?.minY ?? -Infinity;
  const maxY = options?.maxY ?? Infinity;

  for (let i = 0; i < n - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const deltaX = dx[i];

    const cp1x = p1.x + deltaX / 3;
    let cp1y = p1.y + (m[i] * deltaX) / 3;

    const cp2x = p2.x - deltaX / 3;
    let cp2y = p2.y - (m[i + 1] * deltaX) / 3;

    const segMinY = Math.min(p1.y, p2.y);
    const segMaxY = Math.max(p1.y, p2.y);

    cp1y = Math.max(segMinY, Math.min(segMaxY, cp1y));
    cp2y = Math.max(segMinY, Math.min(segMaxY, cp2y));

    cp1y = Math.max(minY, Math.min(maxY, cp1y));
    cp2y = Math.max(minY, Math.min(maxY, cp2y));

    path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }

  return path;
}

export const LineChart: React.FC<LineChartProps> = ({
  series,
  benchmarkSeries,
  investedData,
  valueData,
  height = 140,
  showLegend = true,
  showAxisLabels = true,
  interactive = true,
  className = '',
  onHoverPoint,
}) => {
  const { colors } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = 600;
  const paddingX = 12;
  const paddingTop = 16;
  const paddingBottom = showAxisLabels ? 22 : 12;
  const usableHeight = Math.max(20, height - paddingTop - paddingBottom);
  const usableWidth = width - paddingX * 2;

  // Normalized data points computation
  const dataPoints = useMemo<ChartDataPoint[]>(() => {
    if (series && series.points && series.points.length > 0) {
      return series.points;
    }
    if (valueData && valueData.length > 0) {
      const invArray = investedData || valueData.map((v) => v * 0.9);
      return valueData.map((val, idx) => {
        const inv = invArray[idx] || 0;
        const gain = Math.round((val - inv) * 100) / 100;
        const gainPct = inv > 0 ? Number(((gain / inv) * 100).toFixed(2)) : 0;
        return {
          date: `P${idx + 1}`,
          fullDate: `Point ${idx + 1}`,
          timestamp: Date.now() + idx * 86400000,
          label: `Point ${idx + 1}`,
          invested: inv,
          value: val,
          gain,
          gainPercentage: gainPct,
        };
      });
    }
    return [];
  }, [series, valueData, investedData]);

  // Determine period return and visual semantics
  const firstPoint = dataPoints[0];
  const lastPoint = dataPoints[dataPoints.length - 1];
  const periodGain = series?.horizonGain ?? (lastPoint && firstPoint ? lastPoint.value - firstPoint.value : 0);
  const isPeriodProfit = periodGain >= 0;
  const isProjection = series?.isProjection ?? false;

  const strokeColor = isProjection ? '#A78BFA' : isPeriodProfit ? '#10B981' : '#EF4444';
  const gradientId = isProjection ? 'chartGradientPurple' : isPeriodProfit ? 'chartGradientGreen' : 'chartGradientRed';

  // Coordinate projection and monotonic Bézier paths
  const { valCoords, invCoords, smoothValPath, smoothAreaPath, smoothInvPath, minVal, maxVal } = useMemo(() => {
    if (dataPoints.length === 0) {
      return {
        valCoords: [],
        invCoords: [],
        smoothValPath: '',
        smoothAreaPath: '',
        smoothInvPath: '',
        minVal: 0,
        maxVal: 100,
      };
    }

    const allValues = dataPoints.flatMap((d) => [d.value, d.invested]);
    if (benchmarkSeries?.points) {
      allValues.push(...benchmarkSeries.points.map((p) => p.value));
    }

    let min = Math.min(...allValues);
    let max = Math.max(...allValues);

    if (min === max) {
      min = Math.max(0, min - 10);
      max = max + 10;
    }

    const range = max - min || 1;
    const stepX = dataPoints.length > 1 ? usableWidth / (dataPoints.length - 1) : usableWidth;

    const valCoords = dataPoints.map((d, i) => {
      const x = paddingX + (dataPoints.length > 1 ? i * stepX : usableWidth / 2);
      const y = paddingTop + usableHeight - ((d.value - min) / range) * usableHeight;
      return { x, y };
    });

    const invCoords = dataPoints.map((d, i) => {
      const x = paddingX + (dataPoints.length > 1 ? i * stepX : usableWidth / 2);
      const y = paddingTop + usableHeight - ((d.invested - min) / range) * usableHeight;
      return { x, y };
    });

    const groundY = paddingTop + usableHeight;
    const smoothVal = pointsToSmoothPath(valCoords, { minY: paddingTop, maxY: groundY });
    const smoothInv = pointsToSmoothPath(invCoords, { minY: paddingTop, maxY: groundY });

    const firstPt = valCoords[0] || { x: 0, y: height };
    const lastPt = valCoords[valCoords.length - 1] || { x: width, y: height };
    const smoothArea = `${smoothVal} L ${lastPt.x.toFixed(2)},${groundY.toFixed(2)} L ${firstPt.x.toFixed(2)},${groundY.toFixed(2)} Z`;

    return {
      valCoords,
      invCoords,
      smoothValPath: smoothVal,
      smoothAreaPath: smoothArea,
      smoothInvPath: smoothInv,
      minVal: min,
      maxVal: max,
    };
  }, [dataPoints, benchmarkSeries, usableHeight, usableWidth, paddingX, paddingTop, height, width]);

  // Optional benchmark comparison curve
  const benchmarkCoords = useMemo(() => {
    if (!benchmarkSeries || !benchmarkSeries.points || benchmarkSeries.points.length === 0) return null;
    const n = benchmarkSeries.points.length;
    const range = maxVal - minVal || 1;
    const stepX = n > 1 ? usableWidth / (n - 1) : usableWidth;

    const coords = benchmarkSeries.points.map((pt, i) => {
      const x = paddingX + (n > 1 ? i * stepX : usableWidth / 2);
      const y = paddingTop + usableHeight - ((pt.value - minVal) / range) * usableHeight;
      return { x, y };
    });

    const groundY = paddingTop + usableHeight;
    const path = pointsToSmoothPath(coords, { minY: paddingTop, maxY: groundY });
    return { coords, path };
  }, [benchmarkSeries, maxVal, minVal, usableWidth, usableHeight, paddingX, paddingTop]);

  // Interactive mouse/touch scrubber handling with mobile touch-pan-y safety
  const handlePointerMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (!interactive || !containerRef.current || dataPoints.length === 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const relativeX = clientX - rect.left;
      const svgX = (relativeX / rect.width) * width;
      const clampedX = Math.max(paddingX, Math.min(width - paddingX, svgX));
      const normalizedRatio = usableWidth > 0 ? (clampedX - paddingX) / usableWidth : 0;

      const nearestIdx = Math.round(normalizedRatio * (dataPoints.length - 1));
      const safeIdx = Math.max(0, Math.min(dataPoints.length - 1, nearestIdx));
      setHoverIndex(safeIdx);
      if (onHoverPoint) {
        onHoverPoint(dataPoints[safeIdx]);
      }
    },
    [interactive, dataPoints, usableWidth, paddingX, width, onHoverPoint]
  );

  const handlePointerLeave = useCallback(() => {
    setHoverIndex(null);
    if (onHoverPoint) {
      onHoverPoint(null);
    }
  }, [onHoverPoint]);

  const activePoint = hoverIndex !== null ? dataPoints[hoverIndex] : null;
  const activeCoord = hoverIndex !== null ? valCoords[hoverIndex] : null;
  const activeBenchmarkCoord = hoverIndex !== null && benchmarkCoords ? benchmarkCoords.coords[hoverIndex] : null;
  const activeBenchmarkPoint = hoverIndex !== null && benchmarkSeries ? benchmarkSeries.points[hoverIndex] : null;

  // X-Axis Date markers
  const startDateLabel = dataPoints[0]?.date || '';
  const midDateLabel = dataPoints[Math.floor(dataPoints.length / 2)]?.date || '';
  const endDateLabel = dataPoints[dataPoints.length - 1]?.date || '';

  return (
    <div className={`w-full relative flex flex-col justify-between select-none ${className}`}>
      {/* ── 1. ACTIVE HOVER SCRUBBER BANNER TOOLTIP ── */}
      {interactive && (
        <div className="h-7 mb-2 flex items-center justify-between text-xs px-1 font-mono transition-all">
          {activePoint ? (
            <div className="flex items-center justify-between w-full flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-sans text-[11px]" style={{ color: colors.textSecondary }}>
                  <Calendar className="w-3 h-3" style={{ color: colors.accent }} />
                  {activePoint.fullDate}
                </span>

                {isProjection ? (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider bg-purple-500/15 border border-purple-500/30 text-purple-400">
                    Systematic Target
                  </span>
                ) : (
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider border"
                    style={{
                      backgroundColor: activePoint.gain >= 0 ? colors.mintTint : colors.redTint,
                      borderColor: activePoint.gain >= 0 ? colors.borderMint : 'rgba(239, 68, 68, 0.3)',
                      color: activePoint.gain >= 0 ? colors.semanticSuccess : colors.semanticDanger,
                    }}
                  >
                    {activePoint.gain >= 0 ? '+' : '-'}₹{Math.abs(activePoint.gain).toFixed(2)} ({activePoint.gainPercentage >= 0 ? '+' : '-'}{Math.abs(activePoint.gainPercentage).toFixed(2)}%)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span>
                  <strong style={{ color: colors.textPrimary }}>₹{activePoint.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  <span className="text-[10px] ml-1" style={{ color: colors.textTertiary }}>({isProjection ? 'Projected' : 'Valuation'})</span>
                </span>
                {benchmarkSeries && activeBenchmarkPoint && (
                  <span className="hidden sm:inline" style={{ color: benchmarkSeries.color }}>
                    vs {benchmarkSeries.type.toUpperCase()}: <strong>₹{activeBenchmarkPoint.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full text-[11px]" style={{ color: colors.textSecondary }}>
              <span className="flex items-center gap-1.5 font-sans">
                {isProjection ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>₹50/Day Compounding Target Cone</span>
                  </>
                ) : (
                  <>
                    {isPeriodProfit ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span>{series?.timeframe ? `${series.timeframe} Performance Trajectory` : 'Portfolio Trajectory'}</span>
                  </>
                )}
              </span>

              <div className="flex items-center gap-2">
                {benchmarkSeries && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border" style={{ backgroundColor: `${benchmarkSeries.color}15`, borderColor: `${benchmarkSeries.color}30`, color: benchmarkSeries.color }}>
                    Comparing {benchmarkSeries.label}
                  </span>
                )}
                <span className="text-[10px] font-mono hidden sm:inline" style={{ color: colors.textTertiary }}>
                  Scrub across timeline
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── 2. SVG FINANCIAL CHART WITH CONTINUOUS SMOOTH CURVE & GRADIENT FILL ── */}
      <div
        ref={containerRef}
        className="w-full relative overflow-hidden cursor-crosshair"
        style={{ height: `${height}px`, touchAction: 'pan-y' }}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerLeave}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full pointer-events-none overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Green Profit Area Gradient */}
            <linearGradient id="chartGradientGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#10B981" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>

            {/* Red Loss Area Gradient */}
            <linearGradient id="chartGradientRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#EF4444" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
            </linearGradient>

            {/* Purple Projection Cone Gradient */}
            <linearGradient id="chartGradientPurple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.22" />
              <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
            </linearGradient>

            {/* Glow Filters */}
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#10B981" floodOpacity="0.35" />
            </filter>
            <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#EF4444" floodOpacity="0.35" />
            </filter>
            <filter id="glowPurple" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#8B5CF6" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={width - paddingX}
            y2={paddingTop}
            stroke={colors.borderDim}
            strokeDasharray="3 3"
            strokeOpacity="0.6"
          />
          <line
            x1={paddingX}
            y1={paddingTop + usableHeight / 2}
            x2={width - paddingX}
            y2={paddingTop + usableHeight / 2}
            stroke={colors.borderDim}
            strokeDasharray="3 3"
            strokeOpacity="0.6"
          />
          <line
            x1={paddingX}
            y1={paddingTop + usableHeight}
            x2={width - paddingX}
            y2={paddingTop + usableHeight}
            stroke={colors.borderDim}
            strokeOpacity="0.8"
          />

          {/* Continuous Area Gradient Fill */}
          {smoothAreaPath && (
            <path
              d={smoothAreaPath}
              fill={`url(#${gradientId})`}
              className="transition-all duration-300"
            />
          )}

          {/* Invested Cost-Basis Line (Dashed Slate) */}
          {smoothInvPath && (
            <path
              d={smoothInvPath}
              fill="none"
              stroke="#64748B"
              strokeWidth="1.6"
              strokeDasharray="4 4"
              opacity="0.8"
            />
          )}

          {/* Optional Benchmark Comparison Curve */}
          {benchmarkCoords && (
            <path
              d={benchmarkCoords.path}
              fill="none"
              stroke={benchmarkSeries?.color || '#F59E0B'}
              strokeWidth="1.8"
              strokeDasharray="3 3"
              strokeLinecap="round"
              opacity="0.85"
            />
          )}

          {/* Main Continuous Trajectory Curve */}
          {smoothValPath && (
            <path
              d={smoothValPath}
              fill="none"
              stroke={strokeColor}
              strokeWidth={isProjection ? 2 : 2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={isProjection ? '5 4' : undefined}
              filter={isProjection ? 'url(#glowPurple)' : isPeriodProfit ? 'url(#glowGreen)' : 'url(#glowRed)'}
            />
          )}

          {/* Scrubber Crosshair & Active Point Indicators */}
          {activeCoord && activePoint && (
            <g>
              <line
                x1={activeCoord.x}
                y1={paddingTop}
                x2={activeCoord.x}
                y2={paddingTop + usableHeight}
                stroke={colors.textSecondary}
                strokeWidth="1.2"
                strokeDasharray="2 2"
                strokeOpacity="0.75"
              />

              {/* Invested Baseline Node */}
              {invCoords[hoverIndex!] && (
                <circle
                  cx={invCoords[hoverIndex!].x}
                  cy={invCoords[hoverIndex!].y}
                  r="3"
                  fill="#64748B"
                  stroke={colors.card}
                  strokeWidth="1.5"
                />
              )}

              {/* Benchmark Node */}
              {activeBenchmarkCoord && benchmarkSeries && (
                <circle
                  cx={activeBenchmarkCoord.x}
                  cy={activeBenchmarkCoord.y}
                  r="3.5"
                  fill={benchmarkSeries.color}
                  stroke={colors.card}
                  strokeWidth="1.5"
                />
              )}

              {/* Main Valuation Node with Pulsing Ring */}
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="6.5"
                fill={strokeColor}
                fillOpacity="0.25"
                className="animate-ping"
              />
              <circle
                cx={activeCoord.x}
                cy={activeCoord.y}
                r="4.5"
                fill={strokeColor}
                stroke={colors.card}
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* X-Axis Horizontal Date Labels */}
        {showAxisLabels && dataPoints.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 text-[10px] font-mono pointer-events-none" style={{ color: colors.textTertiary }}>
            <span>{startDateLabel}</span>
            <span>{midDateLabel}</span>
            <span>{endDateLabel}</span>
          </div>
        )}
      </div>

      {/* ── 3. DUAL-LINE & BENCHMARK LEGEND ── */}
      {showLegend && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-semibold mt-2 px-1 border-t pt-2.5" style={{ borderColor: colors.borderDim, color: colors.textSecondary }}>
          <div className="flex items-center gap-3.5 flex-wrap">
            {/* Main Valuation Line */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: strokeColor }} />
              <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>
                {isProjection ? '₹50/Day Projection' : 'Portfolio Value'}
              </span>
            </div>

            {/* Invested Cost basis */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full border-t border-dashed" style={{ borderColor: colors.textTertiary }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>Invested Basis</span>
            </div>

            {/* Benchmark Overlay */}
            {benchmarkSeries && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full border-t border-dashed" style={{ borderColor: benchmarkSeries.color }} />
                <span className="text-xs font-mono font-bold" style={{ color: benchmarkSeries.color }}>
                  {benchmarkSeries.label}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono" style={{ color: colors.textTertiary }}>
            <span>Range: ₹{Math.round(minVal).toLocaleString('en-IN')} - ₹{Math.round(maxVal).toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
