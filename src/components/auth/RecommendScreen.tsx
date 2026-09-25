import React, { useState } from 'react';
import {
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ArrowLeftRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BasketId } from '../../types';
import { BASKETS, getBasketById } from '../../data/baskets';
import { getAssetBarColor } from '../../theme/colors';
import { BasketCurrencyIcons } from '../common/BasketCurrencyIcons';
import { SpotlightCard, ShinyText } from '../ui';
import { motion } from 'motion/react';

interface RecommendScreenProps {
  suggestedBasketId: BasketId;
  quizScore: number;
  onProceed: (chosenBasketId: BasketId) => void;
}

export const RecommendScreen: React.FC<RecommendScreenProps> = ({
  suggestedBasketId,
  quizScore,
  onProceed,
}) => {
  const { colors, themeMode, triggerConfetti } = useApp();
  const [selectedId, setSelectedId] = useState<BasketId>(suggestedBasketId);

  const activeBasket = getBasketById(selectedId);
  const isSuggested = selectedId === suggestedBasketId;

  const handleSwitch = (newId: BasketId) => {
    setSelectedId(newId);
    triggerConfetti();
  };

  const handleContinue = () => {
    triggerConfetti();
    onProceed(selectedId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden" style={{ backgroundColor: colors.bg }}>
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-20 animate-ambient-glow"
        style={{ background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)` }}
      />

      <div
        className="w-full max-w-xl rounded-3xl border shadow-2xl p-6 sm:p-8 backdrop-blur-2xl relative z-10 animate-fade-in"
        style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      >
        {/* Top Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            Your Recommended Strategy
          </h1>
          <p className="text-xs sm:text-sm mt-1.5 leading-relaxed" style={{ color: colors.textSecondary }}>
            Based on your risk profile score ({quizScore}/6), we recommend starting with{' '}
            <strong style={{ color: colors.textPrimary }}>{getBasketById(suggestedBasketId).name}</strong>.
          </p>
        </div>

        {/* Suggested Basket Card */}
        <SpotlightCard
          spotlightColor={colors.accentTint}
          className="p-6 sm:p-7 rounded-2xl border shadow-xl mb-6 relative overflow-hidden"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.accent,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BasketCurrencyIcons basketId={selectedId} size="lg" />
              <div>
                {isSuggested && (
                  <div className="mb-1">
                    <span className="text-[10px] font-bold text-emerald-400 font-mono">
                      ✓ Best Quiz Fit
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-extrabold" style={{ color: colors.textPrimary }}>
                  {activeBasket.name}
                </h3>
              </div>
            </div>

            <div className="text-right font-mono">
              <span className="text-[10px] font-sans block" style={{ color: colors.textTertiary }}>Min Amount</span>
              <span className="text-lg font-extrabold" style={{ color: colors.accent }}>
                ₹{activeBasket.minDailyAmount}/day
              </span>
            </div>
          </div>

          <p className="text-xs leading-relaxed mb-5" style={{ color: colors.textSecondary }}>
            {activeBasket.tagline}
          </p>

          {activeBasket.disclosure && (
            <div
              className="p-3 rounded-xl border text-[11px] font-medium mb-5"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.borderDim,
                color: colors.textTertiary,
              }}
            >
              🔒 <strong>Transparency Note:</strong> {activeBasket.disclosure}
            </div>
          )}

          {/* Allocation Breakdown */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: colors.textTertiary }}>
              Target Portfolio Allocation
            </span>
            {activeBasket.allocation.map((item) => (
              <div key={item.ticker} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span style={{ color: colors.textPrimary }}>{item.label} ({item.ticker})</span>
                  <span className="font-mono" style={{ color: colors.textTertiary }}>{item.pct}%</span>
                </div>
                <div
                  className="h-1.5 w-full rounded-full overflow-hidden"
                  style={{ backgroundColor: themeMode === 'light' ? '#E2E8F0' : colors.card }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      backgroundColor: getAssetBarColor(item.ticker, themeMode),
                      boxShadow: item.ticker === 'ETH' && themeMode === 'light' ? '0 0 0 1px rgba(15, 23, 42, 0.15)' : undefined,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Option to Switch Basket */}
        <div className="mb-6 p-3.5 rounded-2xl border flex items-center justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4" style={{ color: colors.accent }} />
            <span className="text-xs font-semibold" style={{ color: colors.textSecondary }}>
              Prefer the {selectedId === 'stable' ? 'Growth Basket' : 'Stable Basket'} instead?
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSwitch(selectedId === 'stable' ? 'growth' : 'stable')}
            className="text-xs font-bold hover:underline active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            style={{ color: colors.accent }}
          >
            Switch to {selectedId === 'stable' ? 'Growth' : 'Stable'} →
          </button>
        </div>

        {/* Continue Action */}
        <button
          onClick={handleContinue}
          className="w-full h-12 px-6 rounded-xl font-bold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-all hover:brightness-105 active:scale-[0.98] flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          style={{ backgroundColor: colors.primary, color: colors.primaryText }}
        >
          <span>Confirm & Set Daily Amount (from ₹{activeBasket.minDailyAmount}/day)</span>
          <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
};
