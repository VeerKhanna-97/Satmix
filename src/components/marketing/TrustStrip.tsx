import React from 'react';
import { useApp } from '../../context/AppContext';
import { SpotlightCard, FadeIn } from '../ui';

export const TrustStrip: React.FC = () => {
  const { colors } = useApp();

  const trustItems = [
    {
      iconSrc: '/icons/instant.png',
      title: 'Instant 24/7 Liquidity',
      desc: '0% Lock-in • Withdraw Anytime',
      bgColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      spotlight: 'rgba(255, 255, 255, 0.12)',
    },
    {
      iconSrc: '/icons/Autopay.png',
      title: 'NPCI UPI AutoPay',
      desc: 'Automated 8:00 AM Daily Debits',
      bgColor: colors.accentTint,
      borderColor: colors.borderAccent,
      spotlight: colors.accentTint,
    },
    {
      iconSrc: '/icons/Dashboard.png',
      title: 'Smart Dashboard',
      desc: 'Real-Time P&L & Portfolio Tracking',
      bgColor: 'rgba(56, 189, 248, 0.1)',
      borderColor: 'rgba(56, 189, 248, 0.25)',
      spotlight: 'rgba(56, 189, 248, 0.15)',
    },
    {
      iconSrc: '/icons/custody.png',
      title: 'Institutional Custody',
      desc: 'Regulated Vaults • Secure Asset Storage',
      bgColor: colors.purpleTint,
      borderColor: colors.borderPurple,
      spotlight: colors.accentTint,
    },
  ];

  return (
    <div
      className="border-t border-b py-6 md:py-8 relative overflow-hidden"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.borderDim,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
          {trustItems.map((item, idx) => (
            <FadeIn key={idx} delay={idx * 0.08} direction="up" className="h-full">
              <SpotlightCard
                spotlightColor={item.spotlight}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5 p-3 sm:p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-default group h-full"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                }}
              >
                <div
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border transition-transform duration-300 group-hover:scale-110 p-1.5 sm:p-2.5"
                  style={{
                    backgroundColor: item.bgColor,
                    borderColor: item.borderColor,
                  }}
                >
                  <img
                    src={item.iconSrc}
                    alt={item.title}
                    className="w-full h-full object-contain filter drop-shadow-sm select-none"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1 w-full">
                  <div className="font-bold text-[11px] sm:text-sm truncate transition-colors" style={{ color: colors.textPrimary }}>
                    {item.title}
                  </div>
                  <div className="text-[10px] sm:text-xs truncate mt-0.5 font-normal" style={{ color: colors.textSecondary }}>
                    {item.desc}
                  </div>
                </div>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
};
