import React from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  spotlightColor: _unusedSpotlightColor,
  style,
  ...props
}) => {
  return (
    <div
      className={`relative overflow-hidden transition-colors ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
