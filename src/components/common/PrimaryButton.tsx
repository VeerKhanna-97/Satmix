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
      className={`w-full relative flex flex-col items-center justify-center h-12 px-5 rounded-xl font-semibold text-sm transition-[transform,background-color,box-shadow,opacity] duration-150 ease-out shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 ${className}`}
      style={{ backgroundColor: bg, color: textClr }}
    >
      <div className="flex items-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        ) : (
          icon
        )}
        <span className="tracking-[-0.01em]">
          {loading ? 'Processing...' : label}
        </span>
      </div>
      {sublabel && (
        <span className="text-[11px] opacity-80 mt-0.5 font-normal tracking-normal">{sublabel}</span>
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
      className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-xs font-semibold transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/[0.05] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${className}`}
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
