import React from 'react';
import { Shield, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BASKETS } from '../../data/baskets';
import { BasketId } from '../../types';
import { getAssetBarColor } from '../../theme/colors';
import { SpotlightCard, Magnet, FadeIn, Tilt3DCard, HelpBadge } from '../ui';
import { BasketCurrencyIcons } from '../common/BasketCurrencyIcons';
import { motion } from 'motion/react';

const ASSET_EXPLANATIONS: Record<string, { title: string; desc: string }> = {
  USDT: {
    title: 'Digital US Dollars (USDT)',
    desc: 'A digital asset pegged 1:1 to the US Dollar (~₹88-90). Protects your savings from market drops while holding dollar value.',
  },
  BTC: {
    title: 'Bitcoin (BTC)',
    desc: 'Often called "Digital Gold". The world’s largest digital asset with proven 10+ year long-term compounding.',
  },
  ETH: {
    title: 'Ethereum (ETH)',
    desc: 'The global computing network powering decentralized finance, applications, and smart contracts worldwide.',
  },
  SOL: {
    title: 'Solana (SOL)',
    desc: 'An ultra-fast blockchain capable of thousands of transactions per second with near-zero network fees.',
  },
};

export const BasketsSection: React.FC = () => {
  const { colors, themeMode, setViewMode, setAuthSubView, setSelectedBasketId, isAuthenticated } = useApp();

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
            Pick the Right Mix for You
          </h2>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            Start from as little as ₹10/day. Choose between capital protection or high long-term growth. Switch anytime with one tap.
          </p>
        </FadeIn>

        {/* 2 Baskets Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {BASKETS.map((basket, bIdx) => {
            const isLow = basket.id === 'stable';
            return (
              <FadeIn key={basket.id} delay={0.15 + bIdx * 0.1} direction={isLow ? 'left' : 'right'} className="h-full">
                <Tilt3DCard
                  maxRotation={6}
                  perspective={1000}
                  scale={1.01}
                  glare={true}
                  glareOpacity={themeMode === 'dark' ? 0.1 : 0.06}
                  className="rounded-2xl h-full"
                >
                  <SpotlightCard
                    spotlightColor={colors.accentTint}
                    className="rounded-2xl p-4.5 sm:p-7 md:p-8 lg:p-9 border shadow-xl flex flex-col justify-between h-full transition-all duration-300"
                    style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
                  >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <BasketCurrencyIcons basketId={basket.id} size="lg" />
                        <div>
                          <h3 className="text-xl font-extrabold" style={{ color: colors.textPrimary }}>
                            {basket.name}
                          </h3>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-[11px] block font-sans" style={{ color: colors.textSecondary }}>Target</span>
                        <span className="text-base font-extrabold font-mono" style={{ color: isLow ? colors.semanticSuccess : colors.accent }}>
                          {basket.returnRange}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed mb-4" style={{ color: colors.textSecondary }}>
                      {basket.tagline}
                    </p>

                    {/* Everyday Rupee Split Explainer */}
                    <div
                      className="p-3 rounded-xl border mb-5 flex items-center justify-between gap-2"
                      style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded tracking-wider" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                          {isLow ? '₹10 / DAY' : '₹30 / DAY'}
                        </span>
                        <span className="text-[11px] font-semibold" style={{ color: colors.textPrimary }}>
                          {isLow ? '₹8.50 in USD + ₹1.50 in BTC' : '₹21 in BTC + ₹6 in ETH + ₹3 in SOL'}
                        </span>
                      </div>
                      <HelpBadge
                        title="How Your Money Is Split"
                        content={isLow ? 'Every ₹10 you save is split: ₹8.50 buys Digital US Dollars to prevent drops, and ₹1.50 buys Bitcoin for steady growth.' : 'Every ₹30 you save is split automatically across Bitcoin (₹21), Ethereum (₹6), and Solana (₹3).'}
                      />
                    </div>

                    {/* 3 Metric Pills */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2.5 sm:p-3.5 rounded-2xl border mb-5 sm:mb-6 text-center font-mono text-xs transition-colors" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                      <div>
                        <span className="text-[10px] font-sans block" style={{ color: colors.textSecondary }}>Risk Level</span>
                        <strong className="text-xs" style={{ color: colors.textPrimary }}>{basket.historicalCagr}</strong>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-0.5">
                          <span className="text-[10px] font-sans" style={{ color: colors.textSecondary }}>Price Swings</span>
                          <HelpBadge
                            title="Price Swings"
                            content={isLow ? 'Low swings: The majority of this basket is in Digital Dollars, protecting your value from sudden drops.' : 'Higher swings: Digital assets fluctuate day to day, but reward long-term savers over years.'}
                          />
                        </div>
                        <strong className="text-xs" style={{ color: isLow ? colors.semanticSuccess : colors.accent }}>{basket.volatility}</strong>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-0.5">
                          <span className="text-[10px] font-sans" style={{ color: colors.textSecondary }}>Method</span>
                          <HelpBadge
                            title="Hands-Free Auto-Save"
                            content="No manual trading or market timing needed. Your daily savings are invested automatically each morning."
                          />
                        </div>
                        <strong className="text-xs" style={{ color: colors.textPrimary }}>{basket.rebalance}</strong>
                      </div>
                    </div>

                    {/* Allocation Bars with Spring Fill */}
                    <div className="space-y-2.5 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                          Asset Breakdown
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">100% Spot Assets</span>
                      </div>
                      {basket.allocation.map((item) => {
                        const expl = ASSET_EXPLANATIONS[item.ticker] || { title: item.label, desc: item.desc };
                        return (
                          <div key={item.ticker} className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-semibold">
                              <span className="flex items-center gap-1" style={{ color: colors.textPrimary }}>
                                <span>{item.label} ({item.ticker})</span>
                                <HelpBadge title={expl.title} content={expl.desc} />
                              </span>
                              <span className="font-mono tabular-nums" style={{ color: colors.textSecondary }}>{item.pct}%</span>
                            </div>
                            <div
                              className="h-1.5 w-full rounded-full overflow-hidden"
                              style={{ backgroundColor: themeMode === 'light' ? '#E2E8F0' : colors.surface }}
                            >
                              <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${item.pct}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                  backgroundColor: getAssetBarColor(item.ticker, themeMode),
                                  boxShadow: item.ticker === 'ETH' && themeMode === 'light' ? '0 0 0 1px rgba(15, 23, 42, 0.15)' : undefined,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bullet Highlights */}
                    <div className="space-y-2 mb-6 text-xs font-medium" style={{ color: colors.textSecondary }}>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent }} />
                        <span>Security: <strong style={{ color: colors.textPrimary }}>Protected Storage</strong> (segregated partner custody)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent }} />
                        <span>Zero lock-in: <strong style={{ color: colors.textPrimary }}>Cash out anytime</strong> to your bank account</span>
                      </div>
                    </div>
                  </div>

                  {/* Basket Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleSelectBasket(basket.id)}
                      className="w-full h-11 rounded-xl font-semibold text-xs tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-[transform,background-color,box-shadow] duration-100 ease-out active:scale-[0.96] flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 cursor-pointer"
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
              </Tilt3DCard>
            </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
