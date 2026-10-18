import React, { useState, useEffect } from 'react';
import { motion, type TargetAndTransition } from 'motion/react';

export interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  elastic?: boolean;
}

// Apple / Linear standard deceleration curve: fast initial departure, silky settle
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.36,
  direction = 'up',
  distance = 18,
  elastic = false,
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getInitial = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance, x: 0 };
      case 'down':
        return { opacity: 0, y: -distance, x: 0 };
      case 'left':
        return { opacity: 0, x: distance, y: 0 };
      case 'right':
        return { opacity: 0, x: -distance, y: 0 };
      case 'none':
      default:
        return { opacity: 0, scale: 0.98 };
    }
  };

  const getWhileInView = (): TargetAndTransition => {
    return {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: elastic ? EASE_OUT_QUINT : EASE_OUT_EXPO,
      },
    };
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getWhileInView()}
      viewport={{ once: true, margin: '-24px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
