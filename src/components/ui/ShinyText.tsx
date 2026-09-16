import React from 'react';

interface ShinyTextProps {
  children?: React.ReactNode;
  text?: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  children,
  text,
  disabled = false,
  speed = 3,
  className = '',
  color = 'rgba(255, 255, 255, 0.7)',
  shineColor = '#FFFFFF',
  spread = 120,
}) => {
  const content = text || children;

  if (disabled) {
    return <span className={className}>{content}</span>;
  }

  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 40%, ${shineColor} 50%, ${color} 60%, ${color} 100%)`,
        backgroundSize: '200% auto',
        animation: `shiny-sweep ${speed}s linear infinite`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {content}
    </span>
  );
};

export default ShinyText;
