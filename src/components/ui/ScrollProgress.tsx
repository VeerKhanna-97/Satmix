import React, { useEffect, useState } from 'react';

export interface ScrollProgressProps {
  color?: string;
  height?: number;
  className?: string;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  color = '#5D2FE8',
  height = 2,
  className = '',
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const currentProgress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
            setProgress(currentProgress);
          } else {
            setProgress(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none z-50 ${className}`}
      style={{ height: `${height}px`, backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
      aria-hidden="true"
    >
      <div
        className="h-full transition-transform duration-75 ease-out origin-left will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}, 0 0 4px ${color}`,
        }}
      />
    </div>
  );
};
