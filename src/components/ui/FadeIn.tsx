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

const ELASTIC_BEZIER: [number, number, number, number] = [0.34, 1.35, 0.64, 1];
const STANDARD_BEZIER: [number, number, number, number] = [0.25, 1, 0.5, 1];

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.65,
  direction = 'up',
  distance = 32,
  elastic = true,
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
    if (!elastic) {
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
          return { opacity: 0, scale: 0.95 };
      }
    }

    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance, scaleY: 1.08, scaleX: 0.94 };
      case 'down':
        return { opacity: 0, y: -distance, scaleY: 1.08, scaleX: 0.94 };
      case 'left':
        return { opacity: 0, x: distance, scaleX: 1.08, scaleY: 0.94 };
      case 'right':
        return { opacity: 0, x: -distance, scaleX: 1.08, scaleY: 0.94 };
      case 'none':
      default:
        return { opacity: 0, scale: 0.92 };
    }
  };

  const getWhileInView = (): TargetAndTransition => {
    if (!elastic) {
      return {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: STANDARD_BEZIER,
        },
      };
    }

    switch (direction) {
      case 'up':
        return {
          opacity: [0, 1, 1],
          y: [distance, -4, 0],
          scaleY: [1.08, 0.96, 1],
          scaleX: [0.94, 1.03, 1],
          transition: {
            duration,
            delay,
            times: [0, 0.65, 1],
            ease: ELASTIC_BEZIER,
          },
        };
      case 'down':
        return {
          opacity: [0, 1, 1],
          y: [-distance, 4, 0],
          scaleY: [1.08, 0.96, 1],
          scaleX: [0.94, 1.03, 1],
          transition: {
            duration,
            delay,
            times: [0, 0.65, 1],
            ease: ELASTIC_BEZIER,
          },
        };
      case 'left':
        return {
          opacity: [0, 1, 1],
          x: [distance, -4, 0],
          scaleX: [1.08, 0.96, 1],
          scaleY: [0.94, 1.03, 1],
          transition: {
            duration,
            delay,
            times: [0, 0.65, 1],
            ease: ELASTIC_BEZIER,
          },
        };
      case 'right':
        return {
          opacity: [0, 1, 1],
          x: [-distance, 4, 0],
          scaleX: [1.08, 0.96, 1],
          scaleY: [0.94, 1.03, 1],
          transition: {
            duration,
            delay,
            times: [0, 0.65, 1],
            ease: ELASTIC_BEZIER,
          },
        };
      case 'none':
      default:
        return {
          opacity: [0, 1, 1],
          scale: [0.92, 1.03, 1],
          transition: {
            duration,
            delay,
            times: [0, 0.65, 1],
            ease: ELASTIC_BEZIER,
          },
        };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getWhileInView()}
      viewport={{ once: true, margin: '-40px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
