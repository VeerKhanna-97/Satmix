import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface MagnetProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  active?: boolean;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  className = '',
  strength = 18,
  active = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  const xMotion = useMotionValue(0);
  const yMotion = useMotionValue(0);

  const xSpring = useSpring(xMotion, { stiffness: 360, damping: 28, mass: 0.35 });
  const ySpring = useSpring(yMotion, { stiffness: 360, damping: 28, mass: 0.35 });

  const handleMouseEnter = () => {
    if (!ref.current || !active) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    rectRef.current = { left, top, width, height };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current || !active) return;
    const { left, top, width, height } = rectRef.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = ((e.clientX - centerX) / (width / 2)) * strength;
    const y = ((e.clientY - centerY) / (height / 2)) * strength;
    xMotion.set(x);
    yMotion.set(y);
  };

  const handleMouseLeave = () => {
    xMotion.set(0);
    yMotion.set(0);
    rectRef.current = null;
  };

  const hasDisplayOrWidth =
    className.includes('w-full') ||
    className.includes('block') ||
    className.includes('flex') ||
    className.includes('grid');
  const baseDisplay = hasDisplayOrWidth ? '' : 'inline-block';

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={`${baseDisplay} ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
};

export default Magnet;
