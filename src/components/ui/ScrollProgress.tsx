import React, { useEffect, useRef } from 'react';

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
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      if (!barRef.current) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / totalHeight)) : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none z-50 ${className}`}
      style={{ height: `${height}px`, backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full transition-transform duration-75 ease-out origin-left will-change-transform"
        style={{
          transform: 'scaleX(0)',
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}, 0 0 4px ${color}`,
        }}
      />
    </div>
  );
};

export default ScrollProgress;
