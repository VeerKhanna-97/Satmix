import React from 'react';
import { useApp } from '../../context/AppContext';
import { Activity } from 'lucide-react';

export const Ticker: React.FC = () => {
  const { liveCoins, colors } = useApp();

  return (
    <div
      className="w-full overflow-hidden border-b py-2 text-xs font-mono font-medium select-none flex items-center relative z-10"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.borderDim,
      }}
    >
      {/* Pinned Live Stream Badge on Left */}
      <div
        className="flex items-center gap-1.5 px-3 py-1 border-r flex-shrink-0 z-20 font-sans text-[11px] font-bold tracking-wider uppercase shadow-sm"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.borderDim,
          color: colors.textPrimary,
        }}
      >
        <Activity className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.accent }} />
        <span className="hidden sm:inline" style={{ color: colors.textSecondary }}>Live Market</span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold border"
          style={{
            backgroundColor: colors.accentTint,
            color: colors.accent,
            borderColor: colors.borderAccent,
          }}
        >
          INR
        </span>
      </div>

      {/* Infinite Smooth Marquee */}
      <div className="flex animate-ticker whitespace-nowrap gap-8 items-center pl-4">
        {[...liveCoins, ...liveCoins, ...liveCoins].map((coin, index) => {
          const isUp = coin.changePercent24Hr >= 0;
          return (
            <div key={`${coin.id}-${index}`} className="inline-flex items-center gap-2">
              <span className="font-bold tracking-wider" style={{ color: colors.textPrimary }}>
                {coin.symbol}
              </span>
              <span style={{ color: colors.textSecondary }}>
                ₹{coin.priceInr >= 100000 ? `${(coin.priceInr / 100000).toFixed(2)}L` : coin.priceInr.toLocaleString('en-IN')}
              </span>
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono"
                style={{
                  backgroundColor: isUp ? colors.mintTint : colors.redTint,
                  color: isUp ? colors.semanticSuccess : colors.semanticDanger,
                }}
              >
                {isUp ? '+' : ''}
                {coin.changePercent24Hr}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
