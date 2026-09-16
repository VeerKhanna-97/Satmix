import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

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
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !active) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = ((e.clientX - centerX) / (width / 2)) * strength;
    const y = ((e.clientY - centerY) / (height / 2)) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 250, damping: 20, mass: 0.5 }}
      className={`${baseDisplay} ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
};

export default Magnet;
