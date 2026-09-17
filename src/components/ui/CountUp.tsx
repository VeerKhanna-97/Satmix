import React, { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useInView } from 'motion/react';

interface CountUpProps {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  separator?: boolean;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1.2,
  className = '',
  separator = true,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(spanRef, { once: true, margin: '-20px' });
  
  const motionVal = useMotionValue(from);
  const spring = useSpring(motionVal, {
    stiffness: 70,
    damping: 20,
    mass: 0.8,
  });

  const formatNumber = (val: number) => {
    const isNeg = val < 0;
    const absVal = Math.abs(val);
    let formatted = absVal.toFixed(decimals);
    if (separator) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      formatted = parts.join('.');
    }

    // If prefix already has a minus sign explicitly provided (e.g. '-₹')
    if (prefix.includes('-')) {
      return `${prefix}${formatted}${suffix}`;
    }

    // If the value is negative and prefix does not contain '-', prepend '-' before prefix
    if (isNeg && absVal > 0) {
      return `-${prefix}${formatted}${suffix}`;
    }

    return `${prefix}${formatted}${suffix}`;
  };

  useEffect(() => {
    if (isInView) {
      motionVal.set(to);
    }
  }, [isInView, to, motionVal]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      if (spanRef.current) {
        spanRef.current.textContent = formatNumber(latest);
      }
    });
    return () => unsubscribe();
  }, [spring, decimals, prefix, suffix, separator]);

  return <span ref={spanRef} className={className}>{formatNumber(from)}</span>;
};

export default CountUp;
