import React from 'react';
import { useApp } from '../../context/AppContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: string;
  selected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  accent,
  selected = false,
  onClick,
  style = {},
}) => {
  const { colors } = useApp();

  const borderColor = selected
    ? colors.primary
    : accent
    ? `${accent}40`
    : colors.cardBorder;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-white/30 dark:hover:border-white/30' : ''} ${className}`}
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${borderColor}`,
        boxShadow: selected ? `0 0 0 1px ${colors.primary}` : 'none',
        padding: '20px',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
