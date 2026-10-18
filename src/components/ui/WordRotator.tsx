import React, { useState, useEffect } from 'react';

export interface WordRotatorProps {
  words?: string[];
  intervalMs?: number;
  staggerMs?: number;
  className?: string;
  charClassName?: string;
  accentColor?: string;
  underline?: boolean;
}

const DEFAULT_SATMIX_WORDS = ['compound', 'automate', 'grow'];

export const WordRotator: React.FC<WordRotatorProps> = ({
  words = DEFAULT_SATMIX_WORDS,
  intervalMs = 2600,
  staggerMs = 45,
  className = '',
  charClassName = '',
  accentColor,
  underline = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [words, intervalMs]);

  const currentWord = words[currentIndex] || '';

  return (
    <span className={`relative inline-block align-baseline ${className}`}>
      <span className="inline-flex" key={currentIndex}>
        {currentWord.split('').map((char, charIdx) => (
          <span
            key={`${currentIndex}-${charIdx}`}
            className={`inline-block animate-char-in ${charClassName}`}
            style={{
              animationDelay: `${charIdx * staggerMs}ms`,
              color: accentColor || 'inherit',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>

      {/* Subtle indicator underline bar */}
      {underline && (
        <span
          className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-2 sm:h-3 rounded-full opacity-20 pointer-events-none transition-all duration-300"
          style={{ backgroundColor: accentColor || 'currentColor' }}
        />
      )}
    </span>
  );
};
