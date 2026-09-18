// ============================================================
// FILE: src/components/common/MiniLineChart.tsx
// PURPOSE: Compact 1-Week Sub-Asset Performance Sparkline Chart
//          Fritsch-Carlson Monotone Spline with Profit/Loss Segmentation
// ============================================================

import React, { useId, useMemo, useState, useRef, useCallback } from 'react';
import { ChartSeriesResult, ChartDataPoint, ChartSegment } from '../../utils/chartSeries';

interface MiniLineChartProps {
  series: ChartSeriesResult;
  width?: number;
  height?: number;
  interactive?: boolean;
  className?: string;
}

/**
 * Monotone Cubic Spline (Fritsch-Carlson) interpolation for mini SVG curves.
 * Guarantees zero overshoot/undershoot, preventing curves from ever dipping below baseline.
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

  // 1. Tangent slopes
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

  // 2. Fritsch-Carlson adjustments
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

  // 3. Bézier control points with strict bounds
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

export const MiniLineChart: React.FC<MiniLineChartProps> = ({
  series,
  width = 160,
  height = 42,
  interactive = true,
  className = '',
}) => {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const paddingX = 4;
  const paddingTop = 4;
  const paddingBottom = 4;
  const usableHeight = Math.max(12, height - paddingTop - paddingBottom);
  const usableWidth = width - paddingX * 2;
  const groundY = paddingTop + usableHeight;

  const dataPoints: ChartDataPoint[] = series?.points || [];

  const { valCoords, smoothValPath, smoothAreaPath } = useMemo(() => {
    if (dataPoints.length === 0) {
      return { valCoords: [], smoothValPath: '', smoothAreaPath: '' };
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

    const smoothVal = pointsToSmoothPath(valCoords, { minY: paddingTop, maxY: groundY });
    const firstPt = valCoords[0] || { x: 0, y: height };
    const lastPt = valCoords[valCoords.length - 1] || { x: width, y: height };
    const smoothArea = `${smoothVal} L ${lastPt.x.toFixed(2)},${groundY.toFixed(2)} L ${firstPt.x.toFixed(2)},${groundY.toFixed(2)} Z`;

    return { valCoords, smoothValPath: smoothVal, smoothAreaPath: smoothArea };
  }, [dataPoints, usableHeight, usableWidth, paddingX, paddingTop, groundY, height, width]);

  // Segment intervals (green profit, red loss, neutral zero)
  const { greenRects, redRects, neutralRects } = useMemo(() => {
    if (dataPoints.length === 0 || !valCoords || valCoords.length === 0) {
      return { greenRects: [], redRects: [], neutralRects: [] };
    }

    const segments: ChartSegment[] = series?.segments || [];
    if (segments.length === 0) {
      const isOverallProfit = (dataPoints[dataPoints.length - 1]?.gain ?? 0) >= 0;
      const allRect = { x: paddingX, width: usableWidth };
      return {
        greenRects: isOverallProfit ? [allRect] : [],
        redRects: !isOverallProfit ? [allRect] : [],
        neutralRects: [],
      };
    }

    const green: { x: number; width: number }[] = [];
    const red: { x: number; width: number }[] = [];
    const neutral: { x: number; width: number }[] = [];

    segments.forEach((seg) => {
      let xStart = paddingX;
      if (seg.startIndex > 0 && valCoords[seg.startIndex - 1]) {
        xStart = (valCoords[seg.startIndex - 1].x + valCoords[seg.startIndex].x) / 2;
      }

      let xEnd = width - paddingX;
      if (seg.endIndex < valCoords.length - 1 && valCoords[seg.endIndex + 1]) {
        xEnd = (valCoords[seg.endIndex].x + valCoords[seg.endIndex + 1].x) / 2;
      }

      const rectWidth = Math.max(0, xEnd - xStart);
      const rect = { x: xStart, width: rectWidth };

      if (seg.status === 'neutral') {
        neutral.push(rect);
      } else if (seg.status === 'profit' || seg.isProfit) {
        green.push(rect);
      } else {
        red.push(rect);
      }
    });

    return { greenRects: green, redRects: red, neutralRects: neutral };
  }, [series?.segments, dataPoints, valCoords, paddingX, usableWidth, width]);

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

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
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
          <linearGradient id={`miniGradGreen_${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#10B981" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id={`miniGradRed_${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#EF4444" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
          </linearGradient>

          <clipPath id={`miniClipGreen_${uid}`}>
            {greenRects.map((r, i) => (
              <rect key={`gr-${i}`} x={r.x} y={0} width={r.width} height={height} />
            ))}
          </clipPath>

          <clipPath id={`miniClipRed_${uid}`}>
            {redRects.map((r, i) => (
              <rect key={`rr-${i}`} x={r.x} y={0} width={r.width} height={height} />
            ))}
          </clipPath>

          <clipPath id={`miniClipNeutral_${uid}`}>
            {neutralRects.map((r, i) => (
              <rect key={`nr-${i}`} x={r.x} y={0} width={r.width} height={height} />
            ))}
          </clipPath>
        </defs>

        {/* Baseline Divider */}
        <line
          x1={paddingX}
          y1={groundY}
          x2={width - paddingX}
          y2={groundY}
          stroke="#334155"
          strokeOpacity="0.4"
          strokeDasharray="2 2"
        />

        {/* Green Area */}
        {smoothAreaPath && greenRects.length > 0 && (
          <path
            d={smoothAreaPath}
            fill={`url(#miniGradGreen_${uid})`}
            clipPath={`url(#miniClipGreen_${uid})`}
          />
        )}

        {/* Red Area */}
        {smoothAreaPath && redRects.length > 0 && (
          <path
            d={smoothAreaPath}
            fill={`url(#miniGradRed_${uid})`}
            clipPath={`url(#miniClipRed_${uid})`}
          />
        )}

        {/* Valuation Stroke: Green */}
        {smoothValPath && greenRects.length > 0 && (
          <path
            d={smoothValPath}
            fill="none"
            stroke="#10B981"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath={`url(#miniClipGreen_${uid})`}
          />
        )}

        {/* Valuation Stroke: Red */}
        {smoothValPath && redRects.length > 0 && (
          <path
            d={smoothValPath}
            fill="none"
            stroke="#EF4444"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath={`url(#miniClipRed_${uid})`}
          />
        )}

        {/* Valuation Stroke: Neutral Pre-Investment */}
        {smoothValPath && neutralRects.length > 0 && (
          <path
            d={smoothValPath}
            fill="none"
            stroke="#64748B"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath={`url(#miniClipNeutral_${uid})`}
            opacity="0.65"
          />
        )}

        {/* Interactive Crosshair & Dot */}
        {activeCoord && activePoint && (
          <>
            <line
              x1={activeCoord.x}
              y1={paddingTop}
              x2={activeCoord.x}
              y2={groundY}
              stroke="#94A3B8"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.8"
            />
            <circle
              cx={activeCoord.x}
              cy={activeCoord.y}
              r="2.5"
              fill={activePoint.gain >= 0 ? '#10B981' : '#EF4444'}
              stroke="#0F172A"
              strokeWidth="1.5"
            />
          </>
        )}
      </svg>

      {/* Floating Hover Badge */}
      {activePoint && activeCoord && (
        <div
          className="absolute -top-6 pointer-events-none transform -translate-x-1/2 z-20 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[9px] font-mono whitespace-nowrap shadow-lg flex items-center gap-1"
          style={{ left: `${(activeCoord.x / width) * 100}%` }}
        >
          <span className="text-slate-400 font-sans">{activePoint.date}:</span>
          <span className="font-bold text-white">₹{activePoint.value.toLocaleString('en-IN')}</span>
          {activePoint.invested > 0 && (
            <span className={activePoint.gain >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              ({activePoint.gain >= 0 ? '+' : ''}{activePoint.gainPercentage}%)
            </span>
          )}
        </div>
      )}
    </div>
  );
};
