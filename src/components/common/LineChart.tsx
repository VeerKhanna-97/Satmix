import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { ChartSeriesResult, ChartDataPoint } from '../../utils/chartSeries';
import { TrendingUp, Calendar } from 'lucide-react';

interface LineChartProps {
  series?: ChartSeriesResult;
  investedData?: number[];
  valueData?: number[];
  height?: number;
  showLegend?: boolean;
  showAxisLabels?: boolean;
  interactive?: boolean;
  className?: string;
}

/**
 * Generate smooth SVG cubic Bézier path from array of coordinate points
 */
function pointsToSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : points.length - 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return path;
}

export const LineChart: React.FC<LineChartProps> = ({
  series,
  investedData,
  valueData,
  height = 140,
  showLegend = true,
  showAxisLabels = true,
  interactive = true,
  className = '',
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

    const smoothVal = pointsToSmoothPath(valCoords);
    const smoothInv = pointsToSmoothPath(invCoords);

    const firstPt = valCoords[0] || { x: 0, y: height };
    const lastPt = valCoords[valCoords.length - 1] || { x: width, y: height };
    const groundY = paddingTop + usableHeight;
    const smoothArea = `${smoothVal} L ${lastPt.x},${groundY} L ${firstPt.x},${groundY} Z`;

    return {
      valCoords,
      invCoords,
      smoothValPath: smoothVal,
      smoothAreaPath: smoothArea,
      smoothInvPath: smoothInv,
      minVal: min,
      maxVal: max,
    };
  }, [dataPoints, usableHeight, usableWidth, paddingX, paddingTop, height, width]);

  // Interactive mouse/touch scrubber handling with precise padding offset alignment
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
      setHoverIndex(Math.max(0, Math.min(dataPoints.length - 1, nearestIdx)));
    },
    [interactive, dataPoints, usableWidth, paddingX, width]
  );

  const handlePointerLeave = useCallback(() => {
    setHoverIndex(null);
  }, []);

  const activePoint = hoverIndex !== null ? dataPoints[hoverIndex] : null;
  const activeCoord = hoverIndex !== null ? valCoords[hoverIndex] : null;

  // X-Axis Date markers (Start, Mid, End)
  const startDateLabel = dataPoints[0]?.date || '';
  const midDateLabel = dataPoints[Math.floor(dataPoints.length / 2)]?.date || '';
  const endDateLabel = dataPoints[dataPoints.length - 1]?.date || '';

  return (
    <div className={`w-full relative flex flex-col justify-between select-none ${className}`}>
      {/* ── 1. ACTIVE HOVER / SCRUBBER BANNER TOOLTIP ── */}
      {interactive && (
        <div className="h-7 mb-2 flex items-center justify-between text-xs px-1 font-mono transition-all">
          {activePoint ? (
            <>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-sans text-[11px]" style={{ color: colors.textSecondary }}>
                  <Calendar className="w-3 h-3" style={{ color: colors.accent }} />
                  {activePoint.fullDate}
                </span>
              </div>
              <div className="flex items-center gap-3 font-extrabold">
                <span style={{ color: colors.textPrimary }}>
                  Val: ₹{activePoint.value.toLocaleString('en-IN')}{Number.isInteger(activePoint.value) ? '.00' : ''}
                </span>
                <span style={{ color: activePoint.gain >= 0 ? colors.semanticSuccess : colors.semanticDanger }}>
                  {activePoint.gain >= 0 ? '+' : '-'}₹{Math.abs(activePoint.gain).toFixed(2)} ({activePoint.gainPercentage >= 0 ? '+' : ''}{activePoint.gainPercentage}%)
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full text-[11px]" style={{ color: colors.textSecondary }}>
              <span className="flex items-center gap-1.5 font-sans">
                <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.accent }} />
                {series?.isProjection ? 'Projected Growth Model' : 'Live Valuation Trajectory'}
              </span>
              <span className="text-[10px] font-mono" style={{ color: colors.textTertiary }}>
                Hover or drag along the curve to inspect
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── 2. SVG FINANCIAL CHART WITH ACCURATE HTML SCRUBBER OVERLAY ── */}
      <div
        ref={containerRef}
        className="w-full relative overflow-hidden touch-none cursor-crosshair"
        style={{ height: `${height}px` }}
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
            <linearGradient id="chartGradientVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.25" />
              <stop offset="65%" stopColor="#10B981" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#059669" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Grid lines (Theme-aware) */}
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

          {/* Shaded Area under smooth trajectory */}
          {smoothAreaPath && (
            <path d={smoothAreaPath} fill="url(#chartGradientVal)" className="transition-all duration-300" />
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

          {/* Valuation Trajectory Line (Solid Curved Sovereign Pine / Emerald with Glow) */}
          {smoothValPath && (
            <path
              d={smoothValPath}
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
          )}

          {/* Interactive Vertical Dashed Crosshair */}
          {activeCoord && activePoint && (
            <line
              x1={activeCoord.x}
              y1={paddingTop}
              x2={activeCoord.x}
              y2={paddingTop + usableHeight}
              stroke="#34D399"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.85"
            />
          )}

          {/* X-Axis Date Reference Labels (SVG Text) */}
          {showAxisLabels && dataPoints.length > 1 && (
            <g className="text-[10px] font-mono select-none" fill={colors.textTertiary}>
              <text x={paddingX} y={height - 4} textAnchor="start">
                {startDateLabel}
              </text>
              <text x={width / 2} y={height - 4} textAnchor="middle">
                {midDateLabel}
              </text>
              <text x={width - paddingX} y={height - 4} textAnchor="end">
                {endDateLabel}
              </text>
            </g>
          )}
        </svg>

        {/* ── PERFECT CIRCULAR SCRUBBER DOT (HTML Overlay avoids SVG non-uniform aspect warping) ── */}
        {activeCoord && activePoint && (
          <div
            className="absolute pointer-events-none transition-transform duration-75"
            style={{
              left: `${(activeCoord.x / width) * 100}%`,
              top: `${(activeCoord.y / height) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-5 h-5 rounded-full bg-emerald-500/30 animate-ping" />
              <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 bg-white shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            </div>
          </div>
        )}
      </div>

      {/* ── 3. DUAL-LINE LEGEND ── */}
      {showLegend && (
        <div className="flex items-center justify-between text-[11px] font-semibold mt-2 px-1 border-t pt-2.5" style={{ borderColor: colors.borderDim, color: colors.textSecondary }}>
          <div className="flex items-center gap-4">
            {/* Curve 1: Portfolio Value */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold" style={{ color: colors.textPrimary }}>Portfolio Valuation</span>
            </div>

            {/* Curve 2: Total Invested (Cost basis) */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full border-t border-dashed" style={{ borderColor: colors.textTertiary }} />
              <span className="text-xs" style={{ color: colors.textSecondary }}>Invested Capital</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono" style={{ color: colors.textTertiary }}>
            <span>Range: ₹{Math.round(minVal)} - ₹{Math.round(maxVal)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
