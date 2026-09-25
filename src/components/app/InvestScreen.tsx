import React, { useState, useMemo } from 'react';
import { Shield, Rocket, Sparkles, TrendingUp, Calendar, Zap, CheckCircle2, ArrowRight, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LineChart } from '../common/LineChart';
import { UpiMandateModal } from '../payment/UpiMandateModal';
import { getBasketById, BASKETS } from '../../data/baskets';
import { BasketId } from '../../types';
import { SpotlightCard, CountUp, FadeIn, ShinyText } from '../ui';
import { motion } from 'motion/react';

const STABLE_PRESETS = [10, 20, 30, 50, 100];
const GROWTH_PRESETS = [30, 50, 100, 250, 500];

const HORIZONS = [
  { label: '1 Year', years: 1 },
  { label: '3 Years', years: 3 },
  { label: '5 Years', years: 5 },
];

export const InvestScreen: React.FC = () => {
  const {
    selectedBasketId,
    setSelectedBasketId,
    dailyAmount,
    setDailyAmount,
    prototypeState,
    setupHabit,
    toggleHabitPause,
    triggerConfetti,
    colors,
  } = useApp();

  const activeBasket = getBasketById(selectedBasketId);
  const [horizonIdx, setHorizonIdx] = useState(0);
  const [mandateModalOpen, setMandateModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const horizon = HORIZONS[horizonIdx];
  const presets = selectedBasketId === 'stable' ? STABLE_PRESETS : GROWTH_PRESETS;
  const currentHabit = selectedBasketId === 'stable' ? prototypeState.habits.stable : prototypeState.habits.growth;

  const handleBasketChange = (id: BasketId) => {
    setSelectedBasketId(id);
    const minAmt = id === 'growth' ? 30 : 10;
    if (dailyAmount < minAmt) {
      setDailyAmount(minAmt);
    }
  };

  // Compounding math calculations
  const projection = useMemo(() => {
    const months = horizon.years * 12;
    const monthlyRate = activeBasket.growthRate / 12;
    const monthlyDeposit = dailyAmount * (365 / 12);

    let accumulatedValue = 0;
    const trajectory: number[] = [0];

    for (let m = 1; m <= months; m++) {
      accumulatedValue = accumulatedValue * (1 + monthlyRate) + monthlyDeposit;
      if (m % Math.ceil(months / 12) === 0 || m === months) {
        trajectory.push(accumulatedValue);
      }
    }

    const totalInvested = dailyAmount * 365 * horizon.years;
    const totalGains = Math.max(0, accumulatedValue - totalInvested);

    return {
      totalInvested: Math.round(totalInvested),
      futureValue: Math.round(accumulatedValue),
      totalGains: Math.round(totalGains),
      trajectory,
    };
  }, [dailyAmount, horizon, activeBasket]);

  const handleSaveHabit = async () => {
    await setupHabit(selectedBasketId, dailyAmount);
    triggerConfetti();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
          Configure Daily AutoPay Habit
        </h1>
        <p className="text-xs sm:text-sm mt-1.5" style={{ color: colors.textSecondary }}>
          Set your automated daily habit into <strong>{activeBasket.name}</strong>. Executed daily via secure UPI AutoPay.
        </p>
      </div>

      {/* Main Configuration Card */}
      <FadeIn delay={0.1}>
        <SpotlightCard
          spotlightColor={colors.accentTint}
          className="rounded-3xl p-7 sm:p-9 border shadow-xl space-y-7"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
        >
          {/* Strategy Switcher */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: colors.textTertiary }}>
              1. Select Basket
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BASKETS.map((b) => {
                const isSelected = selectedBasketId === b.id;
                const isStable = b.id === 'stable';
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleBasketChange(b.id)}
                    className="p-4 rounded-2xl border text-left transition-all relative"
                    style={{
                      backgroundColor: isSelected ? colors.surface : colors.card,
                      borderColor: isSelected ? colors.accent : colors.borderDim,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {isStable ? <Shield className="w-4 h-4 text-emerald-400" /> : <Rocket className="w-4 h-4 text-amber-400" />}
                        <span className="font-bold text-sm" style={{ color: colors.textPrimary }}>{b.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold" style={{ color: colors.semanticSuccess }}>
                        {b.returnRange}
                      </span>
                    </div>
                    <div className="text-[11px]" style={{ color: colors.textSecondary }}>
                      Min: ₹{b.minDailyAmount}/day · {b.tagline}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Amount Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: colors.textTertiary }}>
                2. Daily Investment Amount (Min: ₹{activeBasket.minDailyAmount})
              </span>
              <span className="text-3xl font-extrabold font-mono" style={{ color: colors.textPrimary }}>
                ₹{dailyAmount}<span className="text-xs font-normal" style={{ color: colors.textTertiary }}>/day</span>
              </span>
            </div>

            <input
              type="range"
              min={activeBasket.minDailyAmount}
              max="500"
              step="5"
              value={dailyAmount}
              onChange={(e) => setDailyAmount(Math.max(activeBasket.minDailyAmount, parseInt(e.target.value, 10) || activeBasket.minDailyAmount))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer mb-4"
              style={{
                backgroundColor: colors.surface,
                accentColor: colors.accent,
              }}
            />

            {/* Preset Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {presets.map((preset) => {
                const isSelected = dailyAmount === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDailyAmount(preset)}
                    className="min-w-[60px] h-8 px-3 rounded-lg text-xs font-bold font-mono border transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    style={{
                      backgroundColor: isSelected ? colors.primary : colors.surface,
                      color: isSelected ? colors.primaryText : colors.textSecondary,
                      borderColor: isSelected ? colors.accent : colors.cardBorder,
                      boxShadow: isSelected ? 'inset 0 1px 0 0 rgba(255,255,255,0.2)' : 'none',
                    }}
                  >
                    ₹{preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multi-Year Horizon Switcher */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: colors.textTertiary }}>3. Investment Horizon</span>
              <span className="text-xs font-mono font-bold" style={{ color: colors.accent }}>{horizon.years * 365} Days of Compounding</span>
            </div>

            <div className="grid grid-cols-3 gap-3 p-1 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              {HORIZONS.map((h, idx) => (
                <button
                  key={h.label}
                  type="button"
                  onClick={() => setHorizonIdx(idx)}
                  className="py-2.5 rounded-xl text-xs font-bold transition-all relative active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                  style={{
                    backgroundColor: horizonIdx === idx ? colors.primary : 'transparent',
                    color: horizonIdx === idx ? colors.primaryText : colors.textSecondary,
                    boxShadow: horizonIdx === idx ? 'inset 0 1px 0 0 rgba(255,255,255,0.2), 0 2px 6px rgba(0,0,0,0.15)' : 'none',
                  }}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Projection Box */}
          <div className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: colors.textTertiary }}>
                  Projected Future Wealth ({horizon.label})
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-1" style={{ color: colors.textPrimary }}>
                  <CountUp to={projection.futureValue} prefix="₹" duration={1.2} />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="block text-[11px]" style={{ color: colors.textTertiary }}>Total Outlay</span>
                  <span className="font-bold" style={{ color: colors.textPrimary }}>
                    <CountUp to={projection.totalInvested} prefix="₹" duration={1.2} />
                  </span>
                </div>
                <div className="w-px h-8" style={{ backgroundColor: colors.borderDim }} />
                <div>
                  <span className="block text-[11px]" style={{ color: colors.semanticSuccess }}>Est. Wealth Gain</span>
                  <span className="font-bold" style={{ color: colors.semanticSuccess }}>
                    <CountUp to={projection.totalGains} prefix="+₹" duration={1.2} />
                  </span>
                </div>
              </div>
            </div>

            {/* Compounding Curve */}
            <div className="pt-2">
              <LineChart
                investedData={projection.trajectory.map((_, i) => (projection.totalInvested / projection.trajectory.length) * (i + 1))}
                valueData={projection.trajectory}
                height={100}
                showLegend={false}
                showAxisLabels={false}
              />
            </div>
          </div>

          {/* UPI AutoPay Mandate Activation Button */}
          <div className="pt-2 space-y-3">
            {saveSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Habit saved! Daily AutoPay active at ₹{dailyAmount}/day for {activeBasket.name}.</span>
              </div>
            )}

            {!currentHabit.paused ? (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl border flex items-center justify-between text-xs" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold" style={{ color: colors.textPrimary }}>Daily {activeBasket.name} Habit is ACTIVE</div>
                      <div className="font-mono text-[11px]" style={{ color: colors.textSecondary }}>₹{currentHabit.dailyAmount}/day · Next fill: Tomorrow 09:00 AM</div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleHabitPause(selectedBasketId)}
                    className="h-8 px-3 rounded-lg text-xs font-semibold border transition-all hover:opacity-85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.12)',
                      color: colors.semanticWarning,
                      borderColor: 'rgba(245, 158, 11, 0.25)',
                    }}
                  >
                    Pause Habit
                  </button>
                </div>

                <button
                  onClick={handleSaveHabit}
                  className="w-full h-12 px-6 rounded-xl font-bold text-xs tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  <span>Update Habit Rate to ₹{dailyAmount}/day</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSaveHabit}
                className="w-full h-12 px-6 rounded-xl font-bold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <Zap className="w-4 h-4 fill-current flex-shrink-0" />
                <span>Activate Daily Habit (₹{dailyAmount}/day in {activeBasket.name})</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px]" style={{ color: colors.textTertiary }}>
              <Shield className="w-3.5 h-3.5" style={{ color: colors.accent }} />
              <span>UPI AutoPay at launch · Non-custodial direct spot execution · Pause anytime.</span>
            </div>
          </div>
        </SpotlightCard>
      </FadeIn>

      {/* Modal */}
      <UpiMandateModal
        isOpen={mandateModalOpen}
        onClose={() => setMandateModalOpen(false)}
        dailyAmount={dailyAmount}
      />
    </div>
  );
};
