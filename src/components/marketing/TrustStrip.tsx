// ============================================================
// FILE: src/components/marketing/TrustStrip.tsx
// PURPOSE: Trust & key feature metrics bar.
//          Understated, calm, static (zero mouse/hover reactivity),
//          and seamlessly blended with the canvas background.
// ============================================================

import React from 'react';
import { useApp } from '../../context/AppContext';
import { FadeIn } from '../ui';

export const TrustStrip: React.FC = () => {
  const { colors, themeMode } = useApp();
  const isLight = themeMode === 'light';

  const trustItems = [
    {
      iconDarkSrc: '/icons/instant.png',
      iconLightSrc: '/icons/instant-light.png',
      title: 'Instant Withdrawals',
      desc: 'Zero lock-in • Withdraw anytime',
      bgColor: isLight ? 'rgba(15, 23, 42, 0.04)' : 'rgba(255, 255, 255, 0.06)',
      borderColor: isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.10)',
    },
    {
      iconDarkSrc: '/icons/autopay.png',
      iconLightSrc: '/icons/autopay-light.png',
      title: 'Daily UPI AutoPay',
      desc: 'Automated daily micro-savings',
      bgColor: isLight ? 'rgba(93, 23, 235, 0.06)' : 'rgba(93, 23, 235, 0.12)',
      borderColor: isLight ? 'rgba(93, 23, 235, 0.18)' : 'rgba(93, 23, 235, 0.25)',
    },
    {
      iconDarkSrc: '/icons/dashboard.png',
      iconLightSrc: '/icons/dashboard-light.png',
      title: 'Live Profit Tracking',
      desc: 'See your returns in real time',
      bgColor: isLight ? 'rgba(2, 132, 199, 0.06)' : 'rgba(56, 189, 248, 0.08)',
      borderColor: isLight ? 'rgba(2, 132, 199, 0.16)' : 'rgba(56, 189, 248, 0.20)',
    },
    {
      iconDarkSrc: '/icons/custody.png',
      iconLightSrc: '/icons/custody-light.png',
      title: 'Safe & Secure',
      desc: 'Protected with licensed partners',
      bgColor: isLight ? 'rgba(124, 58, 237, 0.06)' : 'rgba(124, 58, 237, 0.12)',
      borderColor: isLight ? 'rgba(124, 58, 237, 0.18)' : 'rgba(124, 58, 237, 0.25)',
    },
  ];

  return (
    <section className="py-6 sm:py-8 relative overflow-hidden bg-transparent">
      {/* Subtle ambient connector glow flowing into WaitlistSection */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 pointer-events-none blur-[60px] opacity-10"
        style={{
          background: `radial-gradient(ellipse at center, ${colors.accent} 0%, transparent 70%)`,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
          {trustItems.map((item, idx) => {
            const iconSrc = isLight ? item.iconLightSrc : item.iconDarkSrc;
            return (
              <FadeIn key={idx} delay={idx * 0.05} direction="up" className="h-full">
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border h-full select-none"
                  style={{
                    backgroundColor: isLight ? 'rgba(15, 23, 42, 0.02)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: isLight ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.06)',
                  }}
                >
                  {/* Static Icon Container */}
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 border p-2 sm:p-2.5"
                    style={{
                      backgroundColor: item.bgColor,
                      borderColor: item.borderColor,
                    }}
                  >
                    <img
                      src={iconSrc}
                      alt={item.title}
                      className="w-full h-full object-contain select-none"
                      style={{
                        filter: isLight
                          ? 'drop-shadow(0 1px 1px rgba(0,0,0,0.04))'
                          : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                      }}
                      loading="lazy"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="min-w-0 flex-1 w-full">
                    <div
                      className="font-semibold text-xs sm:text-sm tracking-tight truncate"
                      style={{ color: colors.textPrimary }}
                    >
                      {item.title}
                    </div>
                    <div
                      className="text-[10px] sm:text-xs mt-0.5 font-normal truncate leading-relaxed"
                      style={{ color: colors.textSecondary }}
                    >
                      {item.desc}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
