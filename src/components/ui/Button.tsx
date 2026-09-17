import React from 'react';
import { useApp } from '../../context/AppContext';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'accent-tint';
  size?: 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon-md';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  sublabel?: string;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      iconRight,
      sublabel,
      fullWidth = false,
      className = '',
      style = {},
      type = 'button',
      ...props
    },
    ref
  ) => {
    const { colors } = useApp();
    const isDisabled = disabled || loading;

    // Base interaction and layout
    const baseClasses =
      'inline-flex items-center justify-center select-none font-semibold transition-[transform,background-color,border-color,box-shadow,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F7931A]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0C10] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 disabled:shadow-none';

    // Size tiers
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
      md: 'h-10 px-4 text-xs rounded-xl gap-2',
      lg: 'h-12 px-6 text-sm rounded-xl gap-2',
      'icon-sm': 'h-8 w-8 rounded-lg p-0',
      'icon-md': 'h-10 w-10 rounded-xl p-0',
    }[size];

    // Active press scale (subtle 0.98, not squishy 0.95)
    const activeClass = isDisabled ? '' : 'active:scale-[0.98]';
    const widthClass = fullWidth ? 'w-full' : '';

    // Variant-specific styling
    let variantStyle: React.CSSProperties = {};
    let variantClasses = '';

    if (variant === 'primary') {
      variantClasses =
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] hover:brightness-105';
      variantStyle = {
        backgroundColor: colors.primary,
        color: colors.primaryText,
      };
    } else if (variant === 'secondary') {
      variantClasses = 'border hover:bg-white/[0.04] shadow-sm';
      variantStyle = {
        backgroundColor: colors.surface,
        borderColor: colors.cardBorder,
        color: colors.textPrimary,
      };
    } else if (variant === 'ghost') {
      variantClasses = 'hover:bg-white/[0.06]';
      variantStyle = {
        backgroundColor: 'transparent',
        color: colors.textPrimary,
      };
    } else if (variant === 'outline') {
      variantClasses = 'border hover:bg-white/[0.04]';
      variantStyle = {
        backgroundColor: 'transparent',
        borderColor: colors.cardBorder,
        color: colors.textPrimary,
      };
    } else if (variant === 'danger') {
      variantClasses = 'border hover:bg-red-500/15';
      variantStyle = {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        color: colors.semanticDanger,
      };
    } else if (variant === 'accent-tint') {
      variantClasses = 'border hover:brightness-105';
      variantStyle = {
        backgroundColor: colors.accentTint,
        borderColor: colors.borderAccent,
        color: colors.accent,
      };
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`${baseClasses} ${sizeClasses} ${variantClasses} ${activeClass} ${widthClass} ${className}`.trim()}
        style={{ ...variantStyle, ...style }}
        {...props}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin flex-shrink-0" />
        ) : (
          icon && <span className="flex-shrink-0 flex items-center">{icon}</span>
        )}

        {children && (
          <span className="truncate leading-none flex flex-col items-center">
            <span>{children}</span>
            {sublabel && (
              <span className="text-[10px] opacity-75 font-normal tracking-normal mt-0.5">
                {sublabel}
              </span>
            )}
          </span>
        )}

        {!loading && iconRight && (
          <span className="flex-shrink-0 flex items-center">{iconRight}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
