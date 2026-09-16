import React from 'react';
import { ShieldCheck, RefreshCw, Lock, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpotlightCard, FadeIn } from '../ui';

export const TrustStrip: React.FC = () => {
  const { colors } = useApp();

  const trustItems = [
    {
      icon: ShieldCheck,
      title: '1% TDS & 31.2% Tax Ready',
      desc: 'Automated Sec 194S / 115BBH Reports',
      iconColor: '#E2E8F0',
      bgColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      spotlight: 'rgba(255, 255, 255, 0.12)',
    },
    {
      icon: RefreshCw,
      title: 'NPCI UPI AutoPay',
      desc: 'Automated 8:00 AM Daily Debits',
      iconColor: colors.accent,
      bgColor: colors.accentTint,
      borderColor: colors.borderAccent,
      spotlight: 'rgba(247, 147, 26, 0.15)',
    },
    {
      icon: Building2,
      title: 'CoinDCX API Routing',
      desc: 'FIU-Compliant Spot Execution at 9 AM',
      iconColor: '#38BDF8',
      bgColor: 'rgba(56, 189, 248, 0.1)',
      borderColor: 'rgba(56, 189, 248, 0.25)',
      spotlight: 'rgba(56, 189, 248, 0.15)',
    },
    {
      icon: Lock,
      title: 'Non-Custodial Design',
      desc: 'Zero Keys Held • Direct Exchange Ownership',
      iconColor: '#F7931A',
      bgColor: 'rgba(247, 147, 26, 0.1)',
      borderColor: 'rgba(247, 147, 26, 0.25)',
      spotlight: 'rgba(247, 147, 26, 0.15)',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <FadeIn key={idx} delay={idx * 0.08} direction="up" className="h-full">
                <SpotlightCard
                  spotlightColor={item.spotlight}
                  className="flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-default group h-full"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: item.bgColor,
                      borderColor: item.borderColor,
                      color: item.iconColor,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs sm:text-sm truncate transition-colors" style={{ color: colors.textPrimary }}>
                      {item.title}
                    </div>
                    <div className="text-[11px] sm:text-xs truncate mt-0.5 font-normal" style={{ color: colors.textSecondary }}>
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
