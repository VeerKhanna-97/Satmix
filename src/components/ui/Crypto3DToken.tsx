import React, { useState, useRef, useEffect } from 'react';

export type CryptoSymbol = 'BTC' | 'ETH' | 'SOL';

export interface Crypto3DTokenProps {
  symbol: CryptoSymbol;
  size?: number;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

interface TokenConfig {
  name: string;
  glyph: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  edgeColor: string;
}

const TOKEN_CONFIGS: Record<CryptoSymbol, TokenConfig> = {
  BTC: {
    name: 'Bitcoin',
    glyph: '₿',
    primaryColor: '#F7931A',
    secondaryColor: '#FFD166',
    glowColor: 'rgba(247, 147, 26, 0.35)',
    edgeColor: '#C46D08',
  },
  ETH: {
    name: 'Ethereum',
    glyph: 'Ξ',
    primaryColor: '#627EEA',
    secondaryColor: '#A78BFA',
    glowColor: 'rgba(98, 126, 234, 0.35)',
    edgeColor: '#4358A8',
  },
  SOL: {
    name: 'Solana',
    glyph: '◎',
    primaryColor: '#14F195',
    secondaryColor: '#00F5A0',
    glowColor: 'rgba(20, 241, 149, 0.35)',
    edgeColor: '#0B935A',
  },
};

export const Crypto3DToken: React.FC<Crypto3DTokenProps> = ({
  symbol,
  size = 64,
  interactive = true,
  className = '',
  onClick,
}) => {
  const config = TOKEN_CONFIGS[symbol];
  const tokenRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || reducedMotion || !tokenRef.current) return;
    const rect = tokenRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX((y / (rect.height / 2)) * -22);
    setRotateY((x / (rect.width / 2)) * 22);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        perspective: '600px',
      }}
      className={`relative inline-block select-none cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${config.name} 3D token`}
    >
      <div
        ref={tokenRef}
        className={`w-full h-full relative rounded-full transition-transform ease-out ${
          isHovered ? 'duration-100 scale-105' : 'duration-300'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: reducedMotion
            ? 'none'
            : isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`
            : 'rotateX(8deg) rotateY(-10deg)',
          boxShadow: `0 8px 24px ${config.glowColor}, 0 2px 6px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Front Face of Coin */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center border"
          style={{
            background: `linear-gradient(135deg, ${config.secondaryColor} 0%, ${config.primaryColor} 60%, ${config.edgeColor} 100%)`,
            borderColor: 'rgba(255, 255, 255, 0.4)',
            backfaceVisibility: 'hidden',
            boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.5), inset 0 -2px 6px rgba(0, 0, 0, 0.4)',
            transform: 'translateZ(4px)',
          }}
        >
          {/* Inner Coin Rim Ring */}
          <div
            className="w-[84%] h-[84%] rounded-full border border-dashed flex items-center justify-center font-extrabold text-white"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.45)',
              fontSize: `${Math.round(size * 0.44)}px`,
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
            }}
          >
            {config.glyph}
          </div>
        </div>

        {/* 3D Coin Edge Extrusion Layer */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: config.edgeColor,
            transform: 'translateZ(0px)',
            boxShadow: `0 0 1px ${config.edgeColor}`,
          }}
          aria-hidden="true"
        />

        {/* Back Face of Coin */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center border"
          style={{
            background: `linear-gradient(225deg, ${config.secondaryColor} 0%, ${config.primaryColor} 60%, ${config.edgeColor} 100%)`,
            borderColor: 'rgba(255, 255, 255, 0.25)',
            transform: 'rotateY(180deg) translateZ(4px)',
            backfaceVisibility: 'hidden',
          }}
          aria-hidden="true"
        >
          <div
            className="w-[84%] h-[84%] rounded-full border border-dashed flex items-center justify-center font-mono font-bold text-white text-[10px]"
            style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
          >
            {symbol}
          </div>
        </div>
      </div>
    </div>
  );
};
