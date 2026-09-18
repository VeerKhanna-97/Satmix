// ============================================================
// FILE: src/components/common/CustomDateRangePicker.tsx
// PURPOSE: Interactive Dual-Month Financial Date Range Picker Popover
//          Inspired by Google Flights / Institutional Booking Engines
// ============================================================

import React, { useState, useMemo, useCallback } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { toDateKey, shiftDateKey, getDaysDifference } from '../../utils/streakEngine';
import { DARK_COLORS } from '../../theme/colors';

interface CustomDateRangePickerProps {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  onChange: (startDate: string, endDate: string) => void;
  onClose?: () => void;
  colors?: typeof DARK_COLORS;
  granularity?: 'day' | 'week' | 'month';
}

const PRESET_OPTIONS = [
  { label: 'Last 7 Days', value: 7, badge: '7D' },
  { label: 'Last 14 Days', value: 14, badge: '14D' },
  { label: 'Last 30 Days', value: 30, badge: '30D' },
  { label: 'Last 90 Days', value: 90, badge: '90D' },
  { label: 'Last 180 Days', value: 180, badge: '180D' },
  { label: 'Year to Date', value: 'YTD' as const, badge: 'YTD' },
];

const WEEKDAY_NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function formatDisplayDate(dateKey: string): string {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  if (!y || !m || !d) return dateKey;
  const dObj = new Date(y, m - 1, d);
  return dObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  onClose,
  colors = DARK_COLORS,
  granularity,
}) => {
  const todayKey = useMemo(() => toDateKey(new Date()), []);

  // Internal draft selection state
  const [draftStart, setDraftStart] = useState<string>(startDate || shiftDateKey(todayKey, -30));
  const [draftEnd, setDraftEnd] = useState<string>(endDate || todayKey);
  const [activeInput, setActiveInput] = useState<'start' | 'end'>('start');
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Month navigation: base month is displayed on the left, next month on the right
  const [navMonthDate, setNavMonthDate] = useState<Date>(() => {
    const endParts = (endDate || todayKey).split('-').map(Number);
    const d = new Date(endParts[0], endParts[1] - 2, 1); // 1 month prior so end date is in view
    return d;
  });

  const handlePrevMonth = () => {
    setNavMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setNavMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const leftMonthDate = navMonthDate;
  const rightMonthDate = useMemo(
    () => new Date(navMonthDate.getFullYear(), navMonthDate.getMonth() + 1, 1),
    [navMonthDate]
  );

  // Preset selector
  const handleSelectPreset = (val: number | 'YTD') => {
    const end = todayKey;
    let start = todayKey;
    if (val === 'YTD') {
      const curYear = new Date().getFullYear();
      start = `${curYear}-01-01`;
    } else {
      start = shiftDateKey(todayKey, -val);
    }
    setDraftStart(start);
    setDraftEnd(end);
    onChange(start, end);
  };

  const handleReset = () => {
    const start = shiftDateKey(todayKey, -30);
    const end = todayKey;
    setDraftStart(start);
    setDraftEnd(end);
    setActiveInput('start');
    onChange(start, end);
  };

  // Day click handler
  const handleDateClick = (dateKey: string) => {
    if (dateKey > todayKey) return; // Disallow future dates

    if (activeInput === 'start') {
      setDraftStart(dateKey);
      if (draftEnd && dateKey > draftEnd) {
        setDraftEnd('');
      }
      setActiveInput('end');
    } else {
      if (!draftStart || dateKey < draftStart) {
        setDraftStart(dateKey);
        setDraftEnd('');
        setActiveInput('end');
      } else {
        setDraftEnd(dateKey);
        setActiveInput('start');
        onChange(draftStart, dateKey);
      }
    }
  };

  const handleApply = () => {
    const finalStart = draftStart || shiftDateKey(todayKey, -30);
    const finalEnd = draftEnd || todayKey;
    const sortedStart = finalStart <= finalEnd ? finalStart : finalEnd;
    const sortedEnd = finalStart <= finalEnd ? finalEnd : finalStart;
    onChange(sortedStart, sortedEnd);
    if (onClose) onClose();
  };

  // Render helper for a single calendar month
  const renderMonthCalendar = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const monthTitle = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Days in month
    const totalDays = new Date(year, month + 1, 0).getDate();
    // Day of week of 1st day (0 = Sunday)
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const cells: (string | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      const dayStr = String(d).padStart(2, '0');
      const monthStr = String(month + 1).padStart(2, '0');
      cells.push(`${year}-${monthStr}-${dayStr}`);
    }

    return (
      <div className="flex-1 min-w-[240px]">
        {/* Month Header */}
        <div className="text-center font-bold text-sm mb-3.5 tracking-tight" style={{ color: colors.textPrimary }}>
          {monthTitle}
        </div>

        {/* Weekday Header Row (Sunday to Saturday) */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-mono font-bold mb-2" style={{ color: colors.textTertiary }}>
          {WEEKDAY_NAMES.map((w, idx) => (
            <div key={`${w}-${idx}`} className="py-1">
              {w}
            </div>
          ))}
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-center text-xs font-mono select-none">
          {cells.map((dateKey, idx) => {
            if (!dateKey) {
              return <div key={`empty-${idx}`} className="h-8 w-8 mx-auto" />;
            }

            const dayNum = parseInt(dateKey.split('-')[2], 10);
            const isFuture = dateKey > todayKey;
            const isToday = dateKey === todayKey;

            const isStart = dateKey === draftStart;
            const isEnd = dateKey === draftEnd;

            // Range highlighting
            const effectiveEnd = draftEnd || (activeInput === 'end' ? hoveredDate : null);
            const isInRange =
              draftStart &&
              effectiveEnd &&
              dateKey > (draftStart <= effectiveEnd ? draftStart : effectiveEnd) &&
              dateKey < (draftStart <= effectiveEnd ? effectiveEnd : draftStart);

            return (
              <div
                key={dateKey}
                onClick={() => !isFuture && handleDateClick(dateKey)}
                onMouseEnter={() => !isFuture && setHoveredDate(dateKey)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`relative h-8 flex items-center justify-center transition-all ${
                  isFuture ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  isInRange
                    ? 'bg-amber-500/15 text-white'
                    : ''
                } ${
                  isStart && draftEnd
                    ? 'rounded-l-full bg-amber-500/25'
                    : isEnd && draftStart
                    ? 'rounded-r-full bg-amber-500/25'
                    : ''
                }`}
              >
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-transform duration-150 ${
                    isStart || isEnd
                      ? 'bg-white text-black font-bold shadow-md scale-105'
                      : isToday
                      ? 'border border-amber-400 font-bold'
                      : 'hover:bg-white/10'
                  }`}
                  style={{
                    color: isStart || isEnd ? '#000000' : isFuture ? colors.textDisabled : colors.textPrimary,
                  }}
                >
                  {dayNum}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const calculatedDiffDays = useMemo(() => {
    if (!draftStart || !draftEnd) return 30;
    return Math.max(1, getDaysDifference(draftEnd, draftStart) + 1);
  }, [draftStart, draftEnd]);

  const effectiveGranularity = useMemo(() => {
    if (calculatedDiffDays <= 14) return 'Daily';
    if (calculatedDiffDays <= 90) return 'Weekly';
    return 'Monthly';
  }, [calculatedDiffDays]);

  return (
    <div
      className="p-4 sm:p-6 rounded-3xl border shadow-2xl backdrop-blur-xl relative overflow-hidden animate-fade-in"
      style={{
        backgroundColor: colors.cardHigh || colors.card,
        borderColor: colors.cardBorder,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* ── TOP ACTION & INPUT BAR (GOOGLE FLIGHTS / MERCURY STYLE) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b mb-5" style={{ borderColor: colors.borderDim }}>
        {/* Presets & Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Horizon</span>
          </span>

          <div className="flex items-center gap-1 flex-wrap">
            {PRESET_OPTIONS.map((p) => (
              <button
                key={p.badge}
                type="button"
                onClick={() => handleSelectPreset(p.value)}
                className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all hover:bg-white/10 active:scale-95"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.borderDim,
                  color: colors.textSecondary,
                }}
              >
                {p.badge}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-mono font-medium flex items-center gap-1 hover:opacity-80 transition-opacity ml-1"
            style={{ color: colors.textTertiary }}
            title="Reset to 30 days"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Start / End Date Input Displays */}
        <div className="flex items-center gap-2">
          {/* Start Date Box */}
          <div
            onClick={() => setActiveInput('start')}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
              activeInput === 'start' ? 'ring-2 ring-amber-400/50 border-amber-400' : ''
            }`}
            style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
          >
            <CalendarIcon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <div className="text-left">
              <span className="block text-[9px] uppercase tracking-wider font-mono" style={{ color: colors.textTertiary }}>
                Start Date
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: colors.textPrimary }}>
                {draftStart ? formatDisplayDate(draftStart) : 'Select Start'}
              </span>
            </div>
          </div>

          {/* End Date Box */}
          <div
            onClick={() => setActiveInput('end')}
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
              activeInput === 'end' ? 'ring-2 ring-amber-400/50 border-amber-400' : ''
            }`}
            style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
          >
            <div className="text-left">
              <span className="block text-[9px] uppercase tracking-wider font-mono" style={{ color: colors.textTertiary }}>
                End Date
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: colors.textPrimary }}>
                {draftEnd ? formatDisplayDate(draftEnd) : 'Select End'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── DUAL MONTH CALENDAR VIEW (SIDE BY SIDE) ── */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrevMonth}
          className="absolute -left-1 top-0 z-10 w-7 h-7 rounded-full border flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all shadow-sm"
          style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textPrimary }}
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleNextMonth}
          className="absolute -right-1 top-0 z-10 w-7 h-7 rounded-full border flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all shadow-sm"
          style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textPrimary }}
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dual Calendar Columns */}
        <div className="flex flex-col md:flex-row gap-8 px-5">
          {renderMonthCalendar(leftMonthDate)}
          <div className="hidden md:block w-px bg-white/10" />
          {renderMonthCalendar(rightMonthDate)}
        </div>
      </div>

      {/* ── FOOTER ACTIONS & GRANULARITY SUMMARY ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t mt-5" style={{ borderColor: colors.borderDim }}>
        <div className="flex items-center gap-2">
          <span
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center gap-1.5"
            style={{
              backgroundColor: colors.accentTint,
              borderColor: colors.borderAccent,
              color: colors.accent,
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>Mode: {effectiveGranularity} ({calculatedDiffDays} Days)</span>
          </span>
          <span className="text-[11px] font-mono hidden sm:inline" style={{ color: colors.textTertiary }}>
            {draftStart && draftEnd ? `${formatDisplayDate(draftStart)} → ${formatDisplayDate(draftEnd)}` : 'Select range'}
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold hover:bg-white/5 transition-colors"
              style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textSecondary }}
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow-md flex items-center gap-1.5"
            style={{ backgroundColor: colors.primary, color: colors.primaryText }}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Horizon</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDateRangePicker;
