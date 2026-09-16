import React from 'react';
import { useApp } from '../../context/AppContext';

interface AllocBarProps {
  label: string;
  pct: number;
  color: string;
  amountFormatted?: string;
}

export const AllocBar: React.FC<AllocBarProps> = ({ label, pct, color, amountFormatted }) => {
  const { colors } = useApp();

  return (
    <div className="flex items-center gap-3 py-2.5 border-b last:border-b-0" style={{ borderColor: colors.borderDim }}>
      <div className="w-32 md:w-36 text-xs font-semibold truncate" style={{ color: colors.textSecondary }}>
        {label}
      </div>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.surface }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="w-12 text-right text-xs font-bold font-mono" style={{ color: colors.textPrimary }}>
        {pct}%
      </div>
      {amountFormatted && (
        <div className="w-20 text-right text-xs font-semibold font-mono" style={{ color: colors.textSecondary }}>
          {amountFormatted}
        </div>
      )}
    </div>
  );
};
