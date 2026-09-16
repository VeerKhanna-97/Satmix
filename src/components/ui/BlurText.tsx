import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = '',
  delay = 0.05,
  duration = 0.45,
  threshold = 0.15,
  as: Component = 'p',
}) => {
  const words = text.split(' ');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, filter: 'blur(8px)', y: 6 }}
          animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
          transition={{
            duration,
            delay: idx * delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.28em] will-change-[transform,filter,opacity]"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export default BlurText;
