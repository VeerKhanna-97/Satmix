import React from 'react';
import { Shield, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BASKETS } from '../../data/baskets';
import { BasketId } from '../../types';
import { SpotlightCard, Magnet, FadeIn } from '../ui';
import { BasketCurrencyIcons } from '../common/BasketCurrencyIcons';
import { motion } from 'motion/react';

export const BasketsSection: React.FC = () => {
  const { colors, setViewMode, setAuthSubView, setSelectedBasketId, isAuthenticated } = useApp();

  const handleSelectBasket = (id: BasketId) => {
    setSelectedBasketId(id);
    if (isAuthenticated) {
      setViewMode('app');
    } else {
      setAuthSubView('signup');
      setViewMode('auth');
    }
  };

  return (
    <section id="baskets-section" className="py-12 sm:py-16 md:py-24 lg:py-28 border-t relative overflow-hidden" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title */}
        <FadeIn delay={0.05} direction="up" className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            Choose Your Investment Strategy
          </h2>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            We match you with a basket tailored to your risk quiz profile, with 100% control to adjust or switch anytime in the Web App.
          </p>
        </FadeIn>

        {/* 2 Baskets Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {BASKETS.map((basket, bIdx) => {
            const isLow = basket.id === 'stable';
            return (
              <FadeIn key={basket.id} delay={0.15 + bIdx * 0.1} direction={isLow ? 'left' : 'right'} className="h-full">
                <SpotlightCard
                  spotlightColor={colors.accentTint}
                  className="rounded-2xl p-4.5 sm:p-7 md:p-8 lg:p-9 border shadow-xl flex flex-col justify-between h-full transition-all duration-300 hover:scale-[1.01]"
                  style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <BasketCurrencyIcons basketId={basket.id} size="lg" />
                        <div>
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md font-mono"
                            style={{
                              backgroundColor: isLow ? colors.mintTint : colors.accentTint,
                              color: isLow ? colors.semanticSuccess : colors.accent,
                            }}
                          >
                            {basket.riskLabel}
                          </span>
                          <h3 className="text-xl font-extrabold mt-0.5" style={{ color: colors.textPrimary }}>
                            {basket.name}
                          </h3>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-[11px] block font-sans" style={{ color: colors.textSecondary }}>Objective</span>
                        <span className="text-base font-extrabold font-mono" style={{ color: isLow ? colors.semanticSuccess : colors.accent }}>
                          {basket.returnRange}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed mb-6" style={{ color: colors.textSecondary }}>
                      {basket.tagline}
                    </p>

                    {/* 3 Metric Pills */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2.5 sm:p-3.5 rounded-2xl border mb-5 sm:mb-6 text-center font-mono text-xs transition-colors" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                      <div>
                        <span className="text-[10px] font-sans block" style={{ color: colors.textSecondary }}>Profile</span>
                        <strong className="text-xs" style={{ color: colors.textPrimary }}>{basket.historicalCagr}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-sans block" style={{ color: colors.textSecondary }}>Volatility</span>
                        <strong className="text-xs" style={{ color: isLow ? colors.semanticSuccess : colors.accent }}>{basket.volatility}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] font-sans block" style={{ color: colors.textSecondary }}>Strategy</span>
                        <strong className="text-xs" style={{ color: colors.textPrimary }}>{basket.rebalance}</strong>
                      </div>
                    </div>

                    {/* Allocation Bars with Spring Fill */}
                    <div className="space-y-2 mb-6">
                      <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: colors.textSecondary }}>
                        Target Portfolio Allocation
                      </span>
                      {basket.allocation.map((item) => (
                        <div key={item.ticker} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span style={{ color: colors.textPrimary }}>{item.label} ({item.ticker})</span>
                            <span className="font-mono" style={{ color: colors.textSecondary }}>{item.pct}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: colors.surface }}>
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                              style={{
                                backgroundColor: colors[item.colorKey] || colors.primary,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bullet Highlights */}
                    <div className="space-y-2 mb-6 text-xs font-medium" style={{ color: colors.textSecondary }}>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent }} />
                        <span>Execution Engine: <strong style={{ color: colors.textPrimary }}>{basket.custodyPartner}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent }} />
                        <span>Zero churn discipline (maximizes long-term compounding)</span>
                      </div>
                    </div>
                  </div>

                  {/* Basket Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleSelectBasket(basket.id)}
                      className="w-full h-11 rounded-xl font-semibold text-xs tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.primaryText,
                      }}
                    >
                      <span>Start with {basket.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </SpotlightCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
