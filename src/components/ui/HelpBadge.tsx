import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AnimatePresence, motion } from 'motion/react';

export interface HelpBadgeProps {
  content: string;
  title?: string;
  size?: 'xs' | 'sm';
  className?: string;
}

export const HelpBadge: React.FC<HelpBadgeProps> = ({
  content,
  title,
  size = 'xs',
  className = '',
}) => {
  const { colors, themeMode } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const iconSizeClass = size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const buttonPadding = size === 'xs' ? 'p-0.5' : 'p-1';

  return (
    <div className={`relative inline-flex items-center align-middle ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={title || 'Explain this term'}
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`${buttonPadding} rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer select-none inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400`}
        style={{ color: colors.textTertiary }}
      >
        <Info className={iconSizeClass} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 max-w-[calc(100vw-32px)] p-3 rounded-xl border shadow-xl z-50 pointer-events-auto backdrop-blur-md text-left"
            style={{
              backgroundColor: themeMode === 'light' ? '#FFFFFF' : '#141622',
              borderColor: colors.cardBorder,
              color: colors.textPrimary,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
            }}
          >
            {title && (
              <div className="font-bold text-xs mb-1 flex items-center justify-between" style={{ color: colors.textPrimary }}>
                <span>{title}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-mono" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                  Explained
                </span>
              </div>
            )}
            <p className="text-[11px] leading-relaxed font-normal" style={{ color: colors.textSecondary }}>
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
