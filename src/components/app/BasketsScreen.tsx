import React from 'react';
import { Shield, Rocket, CheckCircle2, ArrowRight, Zap, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BASKETS } from '../../data/baskets';
import { BasketId } from '../../types';
import { SpotlightCard, ShinyText, FadeIn } from '../ui';
import { motion } from 'motion/react';

export const BasketsScreen: React.FC = () => {
  const { selectedBasketId, setSelectedBasketId, setActiveTab, prototypeState, colors } = useApp();

  const handleSelect = (id: BasketId) => {
    setSelectedBasketId(id);
  };

  const handleConfirmAndInvest = (id: BasketId) => {
    setSelectedBasketId(id);
    setActiveTab('invest');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-[11px] font-mono font-medium tracking-wider uppercase mb-3"
          style={{
            backgroundColor: colors.accentTint,
            color: colors.accent,
            borderColor: colors.borderAccent,
          }}
        >
          <span>DUAL STRATEGY ARCHITECTURE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
          Curated Investment Baskets
        </h1>
        <p className="text-xs sm:text-sm mt-1.5" style={{ color: colors.textSecondary }}>
          Run one or both baskets concurrently with independent daily micro-AutoPay allocations. Executed daily at 9:00 AM with zero private keys held.
        </p>
      </div>

      {/* Baskets Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {BASKETS.map((basket, index) => {
          const isSelected = selectedBasketId === basket.id;
          const isStable = basket.id === 'stable';
          const habitStatus = isStable ? prototypeState.habits.stable : prototypeState.habits.growth;
          const isConfigured = habitStatus?.setupAt !== null;
          const isRunning = isConfigured && !habitStatus.paused;

          return (
            <FadeIn key={basket.id} delay={index * 0.1}>
              <SpotlightCard
                spotlightColor={colors.accentTint}
                onClick={() => handleSelect(basket.id)}
                className={`rounded-3xl p-7 sm:p-9 border shadow-xl flex flex-col justify-between transition-all cursor-pointer h-full ${
                  isSelected ? 'scale-[1.01] shadow-[0_8px_30px_rgba(93,23,235,0.2)]' : 'hover:border-slate-700 opacity-95'
                }`}
                style={{ backgroundColor: colors.card, borderColor: isSelected ? colors.accent : colors.cardBorder }}
              >
                <div>
                  {/* Habit Active Status Header */}
                  {isRunning ? (
                    <div className="flex items-center justify-between text-xs font-bold mb-4 pb-3 border-b" style={{ color: colors.semanticSuccess, borderColor: colors.borderDim }}>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Daily Habit Active · ₹{habitStatus.dailyAmount}/day</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold" style={{ backgroundColor: colors.mintTint, borderColor: colors.borderMint }}>
                        RUNNING
                      </span>
                    </div>
                  ) : isConfigured && habitStatus.paused ? (
                    <div className="flex items-center justify-between text-xs font-bold mb-4 pb-3 border-b" style={{ color: colors.semanticWarning, borderColor: colors.borderDim }}>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Daily Habit Paused · ₹{habitStatus.dailyAmount}/day</span>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                        PAUSED
                      </span>
                    </div>
                  ) : isSelected ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold mb-4 pb-3 border-b" style={{ color: colors.accent, borderColor: colors.borderDim }}>
                      <CheckCircle2 className="w-4 h-4" style={{ color: colors.accent }} />
                      <span>Currently Selected in Setup</span>
                    </div>
                  ) : null}

                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-3 rounded-2xl"
                        style={{
                          backgroundColor: isStable ? colors.mintTint : colors.accentTint,
                          color: isStable ? colors.semanticSuccess : colors.accent,
                        }}
                      >
                        {isStable ? <Shield className="w-6 h-6" /> : <Rocket className="w-6 h-6" />}
                      </div>
                      <div>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border font-mono"
                          style={{
                            backgroundColor: isStable ? colors.mintTint : colors.accentTint,
                            borderColor: isStable ? colors.borderMint : colors.borderAccent,
                            color: isStable ? colors.semanticSuccess : colors.accent,
                          }}
                        >
                          {basket.riskLabel}
                        </span>
                        <h3 className="text-xl font-extrabold mt-0.5" style={{ color: colors.textPrimary }}>{basket.name}</h3>
                        <span className="text-[11px]" style={{ color: colors.textTertiary }}>Min: ₹{basket.minDailyAmount}/day</span>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Reference</span>
                      <span className="text-lg font-extrabold" style={{ color: colors.semanticSuccess }}>
                        <ShinyText text={basket.returnRange} color={colors.semanticSuccess} speed={2.5} />
                      </span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed mb-4" style={{ color: colors.textSecondary }}>{basket.tagline}</p>

                  {/* Disclosure Notice for Stable */}
                  {isStable && basket.disclosure && (
                    <div
                      className="p-3 rounded-xl border text-[11px] font-mono leading-relaxed mb-5 flex items-start gap-2"
                      style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textSecondary }}
                    >
                      <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{basket.disclosure}</span>
                    </div>
                  )}

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl border mb-6 text-center font-mono text-xs" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                    <div>
                      <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Historical CAGR</span>
                      <strong style={{ color: colors.textPrimary }}>{basket.historicalCagr}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Volatility</span>
                      <strong style={{ color: isStable ? colors.semanticSuccess : colors.semanticWarning }}>{basket.volatility}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Min Daily</span>
                      <strong style={{ color: colors.textPrimary }}>₹{basket.minDailyAmount}</strong>
                    </div>
                  </div>

                  {/* Asset Distribution */}
                  <div className="space-y-3 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: colors.textTertiary }}>
                      Target Asset Allocation
                    </span>
                    {basket.allocation.map((item) => (
                      <div key={item.ticker} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span style={{ color: colors.textPrimary }}>{item.label} ({item.ticker})</span>
                          <span className="font-mono" style={{ color: colors.textTertiary }}>{item.pct}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: colors.surface }}>
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            style={{ backgroundColor: colors[item.colorKey] || colors.primary }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action */}
                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmAndInvest(basket.id);
                    }}
                    className="w-full h-11 px-5 rounded-xl font-bold text-xs tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_2px_6px_rgba(0,0,0,0.15)] transition-all hover:brightness-105 active:scale-[0.98] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    style={{
                      backgroundColor: isSelected ? colors.primary : colors.surface,
                      color: isSelected ? colors.primaryText : colors.textPrimary,
                      border: `1px solid ${isSelected ? 'transparent' : colors.cardBorder}`,
                    }}
                  >
                    <span>{isConfigured ? `Adjust ${basket.name} (₹${habitStatus.dailyAmount}/day)` : `Set Up Daily AutoPay (from ₹${basket.minDailyAmount})`}</span>
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                  </button>
                </div>
              </SpotlightCard>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
};
