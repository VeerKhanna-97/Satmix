import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const requestRef = useRef<number>(0);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentTrail = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Disable on touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering over interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer');
        setIsHovered(!!isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth lerp trailing animation for premium micro-interaction
    const animateTrail = () => {
      const factor = 0.22;
      currentTrail.current.x += (targetPos.current.x - currentTrail.current.x) * factor;
      currentTrail.current.y += (targetPos.current.y - currentTrail.current.y) * factor;

      setTrailingPos({
        x: currentTrail.current.x,
        y: currentTrail.current.y,
      });

      requestRef.current = requestAnimationFrame(animateTrail);
    };

    requestRef.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Trailing Outer Glow Ring */}
      <div
        className="fixed top-0 left-0 rounded-full transition-opacity duration-300 pointer-events-none"
        style={{
          transform: `translate3d(${trailingPos.x - 24}px, ${trailingPos.y - 24}px, 0) scale(${isHovered ? 1.4 : isClicked ? 0.85 : 1})`,
          width: '48px',
          height: '48px',
          border: '1.5px solid rgba(247, 147, 26, 0.45)',
          background: isHovered
            ? 'radial-gradient(circle, rgba(247, 147, 26, 0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(247, 147, 26, 0.12) 0%, transparent 70%)',
          boxShadow: isHovered
            ? '0 0 16px rgba(247, 147, 26, 0.4), inset 0 0 8px rgba(247, 147, 26, 0.2)'
            : '0 0 10px rgba(247, 147, 26, 0.2)',
          transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease, opacity 0.2s ease',
          willChange: 'transform',
        }}
      />

      {/* Main Bitcoin Cursor Coin */}
      <div
        className="fixed top-0 left-0 pointer-events-none transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${position.x - 12}px, ${position.y - 12}px, 0) scale(${isClicked ? 0.8 : isHovered ? 1.25 : 1})`,
          width: '24px',
          height: '24px',
          willChange: 'transform',
        }}
      >
        <img
          src="/bitcoin.png"
          alt="Bitcoin Custom Cursor"
          className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(247,147,26,0.6)]"
          draggable={false}
        />
      </div>
    </div>
  );
};
