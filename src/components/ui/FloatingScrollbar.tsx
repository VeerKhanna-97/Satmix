import React, { useEffect, useState, useRef, useCallback } from 'react';

export const FloatingScrollbar: React.FC = () => {
  const [thumbHeight, setThumbHeight] = useState(56);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [opacity, setOpacity] = useState(0.4);

  const thumbRef = useRef<HTMLDivElement | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number>(0);

  // Position tracking (target vs current for smooth 60/120fps lerp)
  const currentY = useRef(12);
  const targetY = useRef(12);
  const isDraggingRef = useRef(false);
  const dragStartY = useRef(0);
  const scrollStartTop = useRef(0);

  // Smooth RAF loop with hardware-accelerated translate3d
  useEffect(() => {
    const renderLoop = () => {
      // Lerp damping factor (0.28 for silky responsive follow)
      const factor = isDraggingRef.current ? 1.0 : 0.28;
      const diff = targetY.current - currentY.current;

      if (Math.abs(diff) > 0.1) {
        currentY.current += diff * factor;
      } else {
        currentY.current = targetY.current;
      }

      if (thumbRef.current) {
        thumbRef.current.style.transform = `translate3d(0, ${currentY.current}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Calculate and update scroll dimensions
  const updateScroll = useCallback(() => {
    const docEl = document.documentElement;
    const body = document.body;
    const scrollHeight = Math.max(docEl.scrollHeight, body.scrollHeight);
    const clientHeight = window.innerHeight;
    const scrollTop = window.scrollY || docEl.scrollTop || body.scrollTop;

    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 10) {
      setIsScrollable(false);
      return;
    }

    setIsScrollable(true);
    const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));

    // Calculate thumb height proportionally (min 44px, max 140px)
    const ratio = clientHeight / scrollHeight;
    const calculatedHeight = Math.max(44, Math.min(140, clientHeight * ratio));
    setThumbHeight(calculatedHeight);

    // Calculate target Y
    const availableTrackHeight = clientHeight - calculatedHeight - 24; // 12px top & bottom margin
    targetY.current = 12 + progress * Math.max(0, availableTrackHeight);

    // Handle visibility
    setOpacity(1);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (!isDraggingRef.current && !isHovered) {
      hideTimeoutRef.current = setTimeout(() => {
        setOpacity(0.4);
      }, 1400);
    }
  }, [isHovered]);

  useEffect(() => {
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);

    const observer = new MutationObserver(updateScroll);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      observer.disconnect();
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [updateScroll]);

  // Drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartY.current = e.clientY;
    scrollStartTop.current = window.scrollY;
    setOpacity(1);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const docEl = document.documentElement;
      const scrollHeight = Math.max(docEl.scrollHeight, document.body.scrollHeight);
      const clientHeight = window.innerHeight;
      const maxScroll = scrollHeight - clientHeight;

      const trackHeight = clientHeight - thumbHeight - 24;
      const deltaY = e.clientY - dragStartY.current;
      const scrollDelta = (deltaY / trackHeight) * maxScroll;

      window.scrollTo({
        top: Math.max(0, Math.min(maxScroll, scrollStartTop.current + scrollDelta)),
        behavior: 'instant' as ScrollBehavior,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, thumbHeight]);

  if (!isScrollable) return null;

  return (
    <div
      className="fixed top-0 right-1.5 bottom-0 z-[9998] pointer-events-none flex flex-col justify-start select-none transition-opacity duration-300"
      style={{
        width: '14px',
        opacity: isHovered || isDragging ? 1 : opacity,
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        setOpacity(1);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isDraggingRef.current) {
          hideTimeoutRef.current = setTimeout(() => setOpacity(0.4), 1200);
        }
      }}
    >
      {/* 100% Pure Floating Amber Pill Thumb with Zero Track Rail */}
      <div
        ref={thumbRef}
        onMouseDown={handleMouseDown}
        className="pointer-events-auto absolute top-0 right-0 cursor-pointer rounded-full"
        style={{
          width: isHovered || isDragging ? '6px' : '4.5px',
          height: `${thumbHeight}px`,
          background: 'linear-gradient(180deg, #FFA733 0%, #F7931A 50%, #FF9500 100%)',
          boxShadow:
            isHovered || isDragging
              ? '0 0 16px rgba(247, 147, 26, 0.95), 0 0 6px rgba(255, 255, 255, 0.6)'
              : '0 0 10px rgba(247, 147, 26, 0.6), 0 0 2px rgba(247, 147, 26, 0.8)',
          borderRadius: '9999px',
          willChange: 'transform, width, box-shadow',
          transition: 'width 0.15s ease, box-shadow 0.15s ease',
        }}
      />
    </div>
  );
};
