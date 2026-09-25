import React from 'react';

export type BasketType = 'stable' | 'growth' | string;

export interface BasketCurrencyIconsProps {
  basketId?: BasketType;
  type?: BasketType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  borderColor?: string;
}

const CURRENCY_CONFIG = {
  stable: [
    {
      name: 'Tether USDT',
      symbol: 'USDT',
      src: '/currencies/USDT.png',
      padding: 'p-0.5',
      bgClass: 'bg-white',
    },
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      src: '/currencies/Bitcoin cursor.png',
      padding: 'p-0.5',
      bgClass: 'bg-white',
    },
  ],
  growth: [
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      src: '/currencies/Bitcoin cursor.png',
      padding: 'p-0.5',
      bgClass: 'bg-white',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      src: '/currencies/ethereum-eth-logo.png',
      padding: 'p-1',
      bgClass: 'bg-white',
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      src: '/currencies/Solana.png',
      padding: 'p-0.5',
      bgClass: 'bg-white',
    },
  ],
};

const SIZE_CONFIG = {
  xs: {
    coinSize: 'w-4 h-4',
    spaceClass: '-space-x-1.5',
    ringClass: 'ring-1 ring-black/40',
  },
  sm: {
    coinSize: 'w-5 h-5',
    spaceClass: '-space-x-2',
    ringClass: 'ring-[1.5px] ring-black/40',
  },
  md: {
    coinSize: 'w-6 h-6',
    spaceClass: '-space-x-2',
    ringClass: 'ring-2 ring-black/40',
  },
  lg: {
    coinSize: 'w-8 h-8',
    spaceClass: '-space-x-2.5',
    ringClass: 'ring-2 ring-black/40',
  },
  xl: {
    coinSize: 'w-10 h-10',
    spaceClass: '-space-x-3',
    ringClass: 'ring-2 ring-black/40',
  },
};

export const BasketCurrencyIcons: React.FC<BasketCurrencyIconsProps> = ({
  basketId,
  type,
  size = 'md',
  className = '',
  borderColor,
}) => {
  const resolvedType = (type || basketId || '').toLowerCase().includes('stable')
    ? 'stable'
    : 'growth';

  const coins = CURRENCY_CONFIG[resolvedType];
  const sizeConf = SIZE_CONFIG[size] || SIZE_CONFIG.md;

  return (
    <div
      className={`inline-flex items-center ${sizeConf.spaceClass} select-none ${className}`}
      aria-label={`${resolvedType === 'stable' ? 'Stable Basket (USDT, BTC)' : 'Growth Basket (BTC, ETH, SOL)'}`}
    >
      {coins.map((coin, index) => {
        // High z-index on front tokens for clear hierarchy
        const zIndex = coins.length - index;
        return (
          <div
            key={coin.symbol}
            className={`relative rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 ${coin.bgClass} shadow-md transition-transform duration-200 hover:scale-110 ${sizeConf.coinSize} ${sizeConf.ringClass}`}
            style={{
              zIndex,
              ...(borderColor ? { borderColor } : {}),
            }}
          >
            <img
              src={coin.src}
              alt={coin.name}
              title={coin.name}
              className={`w-full h-full object-contain ${coin.padding}`}
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
};
