import React from 'react';
import { useApp } from '../../context/AppContext';
import { SpotlightCard, FadeIn } from '../ui';

export const TrustStrip: React.FC = () => {
  const { colors, themeMode } = useApp();
  const isLight = themeMode === 'light';

  const trustItems = [
    {
      iconDarkSrc: '/icons/instant.png',
      iconLightSrc: '/icons/instant-light.png',
      title: 'Instant Withdrawals',
      desc: 'Zero lock-in • Withdraw anytime',
      bgColor: isLight ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.08)',
      borderColor: isLight ? 'rgba(15, 23, 42, 0.12)' : 'rgba(255, 255, 255, 0.15)',
      spotlight: isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.12)',
    },
    {
      iconDarkSrc: '/icons/autopay.png',
      iconLightSrc: '/icons/autopay-light.png',
      title: 'Daily UPI AutoPay',
      desc: 'Automated daily micro-savings',
      bgColor: colors.accentTint,
      borderColor: colors.borderAccent,
      spotlight: colors.accentTint,
    },
    {
      iconDarkSrc: '/icons/dashboard.png',
      iconLightSrc: '/icons/dashboard-light.png',
      title: 'Live Profit Tracking',
      desc: 'See your returns in real time',
      bgColor: isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(56, 189, 248, 0.10)',
      borderColor: isLight ? 'rgba(2, 132, 199, 0.22)' : 'rgba(56, 189, 248, 0.25)',
      spotlight: isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(56, 189, 248, 0.15)',
    },
    {
      iconDarkSrc: '/icons/custody.png',
      iconLightSrc: '/icons/custody-light.png',
      title: 'Safe & Secure',
      desc: 'Protected with licensed partners',
      bgColor: colors.purpleTint,
      borderColor: colors.borderPurple,
      spotlight: colors.accentTint,
    },
  ];

  return (
    <div
      className="border-t border-b py-8 md:py-10 relative overflow-hidden"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.borderDim,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
          {trustItems.map((item, idx) => {
            const iconSrc = isLight ? item.iconLightSrc : item.iconDarkSrc;
            return (
              <FadeIn key={idx} delay={idx * 0.08} direction="up" className="h-full">
                <SpotlightCard
                  spotlightColor={item.spotlight}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-default group h-full"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border transition-transform duration-300 group-hover:scale-110 p-2 sm:p-2.5 shadow-sm"
                    style={{
                      backgroundColor: item.bgColor,
                      borderColor: item.borderColor,
                    }}
                  >
                    <img
                      src={iconSrc}
                      alt={item.title}
                      className="w-full h-full object-contain select-none transition-opacity duration-200"
                      style={{
                        filter: isLight
                          ? 'drop-shadow(0 1px 1px rgba(0,0,0,0.05))'
                          : 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1 w-full">
                    <div className="font-bold text-xs sm:text-sm tracking-tight transition-colors line-clamp-1" style={{ color: colors.textPrimary }}>
                      {item.title}
                    </div>
                    <div className="text-[10px] sm:text-xs mt-0.5 font-normal line-clamp-2 leading-relaxed" style={{ color: colors.textSecondary }}>
                      {item.desc}
                    </div>
                  </div>
                </SpotlightCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
};
