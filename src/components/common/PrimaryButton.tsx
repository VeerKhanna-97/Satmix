import React from 'react';
import { useApp } from '../../context/AppContext';

interface PrimaryButtonProps {
  label: string;
  sublabel?: string;
  onClick: () => void;
  color?: string;
  textColor?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  sublabel,
  onClick,
  color,
  textColor,
  disabled = false,
  loading = false,
  className = '',
  icon,
}) => {
  const { colors } = useApp();
  const bg = color || colors.primary;
  const textClr = textColor || colors.primaryText;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full relative flex flex-col items-center justify-center py-3.5 px-5 rounded-xl font-bold transition-all duration-200 shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
      style={{ backgroundColor: bg, color: textClr }}
    >
      <div className="flex items-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        ) : (
          icon
        )}
        <span className="text-sm md:text-base tracking-wide font-semibold">
          {loading ? 'Processing...' : label}
        </span>
      </div>
      {sublabel && (
        <span className="text-xs opacity-80 mt-0.5 font-normal tracking-normal">{sublabel}</span>
      )}
    </button>
  );
};

export const GhostButton: React.FC<{
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}> = ({ label, onClick, icon, className = '' }) => {
  const { colors } = useApp();

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white/5 active:scale-[0.98] ${className}`}
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.cardBorder}`,
        color: colors.textPrimary,
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
