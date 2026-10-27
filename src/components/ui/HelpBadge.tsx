import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Info, X } from 'lucide-react';
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
  const [coords, setCoords] = useState<{ top: number; left: number; placeAbove: boolean } | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = Math.min(280, window.innerWidth - 32);

    // If there is less than 160px above, flip to below
    const placeAbove = rect.top >= 160;

    // Center horizontally on trigger, but clamp within viewport edges
    const idealLeft = rect.left + rect.width / 2;
    const minLeft = popoverWidth / 2 + 16;
    const maxLeft = window.innerWidth - popoverWidth / 2 - 16;
    const clampedLeft = Math.max(minLeft, Math.min(maxLeft, idealLeft));

    const topPos = placeAbove ? rect.top - 8 : rect.bottom + 8;

    setCoords({
      top: topPos,
      left: clampedLeft,
      placeAbove,
    });
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  // Close on outside click or scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, updatePosition]);

  const iconSizeClass = size === 'xs' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const buttonPadding = size === 'xs' ? 'p-1' : 'p-1.5';

  return (
    <>
      <span className={`inline-flex items-center align-middle ${className}`}>
        <button
          ref={triggerRef}
          type="button"
          aria-label={title || 'Information'}
          aria-expanded={isOpen}
          onClick={handleToggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`${buttonPadding} rounded-full text-neutral-400 hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all cursor-pointer select-none inline-flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400`}
          style={{ color: colors.textTertiary }}
        >
          <Info className={iconSizeClass} />
        </button>
      </span>

      {/* Portal to document.body: completely escapes parent overflow-hidden and stacking contexts */}
      {typeof document !== 'undefined' &&
        coords &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={popoverRef}
                initial={{ opacity: 0, scale: 0.94, y: coords.placeAbove ? 6 : -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: coords.placeAbove ? 4 : -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'fixed',
                  top: coords.top,
                  left: coords.left,
                  transform: coords.placeAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
                  zIndex: 99999,
                  width: '280px',
                  maxWidth: 'calc(100vw - 32px)',
                  backgroundColor: themeMode === 'light' ? '#FFFFFF' : '#10131E',
                  borderColor: themeMode === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.14)',
                  color: colors.textPrimary,
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
                }}
                className="p-3.5 rounded-2xl border pointer-events-auto backdrop-blur-xl text-left"
              >
                {title && (
                  <div className="font-bold text-xs mb-1.5 flex items-center justify-between" style={{ color: colors.textPrimary }}>
                    <span className="truncate pr-2">{title}</span>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="text-neutral-400 hover:text-white p-0.5 rounded cursor-pointer sm:hidden"
                      aria-label="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <p className="text-[11px] leading-relaxed font-normal" style={{ color: colors.textSecondary }}>
                  {content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
