import React from 'react';
import { useApp } from '../../context/AppContext';

interface PageHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ badge, title, subtitle, rightElement }) => {
  const { colors } = useApp();

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        {badge && (
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider mb-2 font-mono"
            style={{
              backgroundColor: colors.accentTint,
              color: colors.accent,
              border: `1px solid ${colors.borderAccent}`,
            }}
          >
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-1 max-w-xl" style={{ color: colors.textSecondary }}>
            {subtitle}
          </p>
        )}
      </div>
      {rightElement && <div className="flex items-center gap-2">{rightElement}</div>}
    </div>
  );
};
