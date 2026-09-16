import React, { useMemo } from 'react';
import { Shield, Smartphone, Rocket, Zap, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getBasketById } from '../../data/baskets';
import { SpotlightCard, CountUp, FadeIn } from '../ui';
import { motion } from 'motion/react';

interface MilestonesWidgetProps {
  customDailyAmount?: number;
  title?: string;
  subtitle?: string;
}

export const MilestonesWidget: React.FC<MilestonesWidgetProps> = ({
  customDailyAmount,
  title = "Life Milestones on Autopilot",
  subtitle
}) => {
  const { dailyAmount: appDailyAmount, selectedBasketId, portfolioSummary, colors, setActiveTab } = useApp();
  
  const dailyAmount = customDailyAmount || appDailyAmount || 30;
  const activeBasket = getBasketById(selectedBasketId);
  const annualRate = activeBasket ? activeBasket.growthRate : 0.28;

  const milestones = useMemo(() => {
    const dailyRate = annualRate / 365;

    const calcMilestone = (targetValuation: number, title: string, category: string, icon: 'shield' | 'gadget' | 'rocket', colorKey: string) => {
      const numerator = (targetValuation * dailyRate) / (dailyAmount * (1 + dailyRate));
      
      let exactDays = 0;
      let linearDays = Math.ceil(targetValuation / dailyAmount);
      let investedAtGoal = targetValuation;
      let gainAtGoal = 0;
      let daysSaved = 0;

      if (numerator <= 0) {
        exactDays = linearDays;
      } else {
        exactDays = Math.ceil(Math.log(1 + numerator) / Math.log(1 + dailyRate));
        daysSaved = Math.max(0, linearDays - exactDays);
        investedAtGoal = Math.round(exactDays * dailyAmount);
        gainAtGoal = Math.max(0, targetValuation - investedAtGoal);
      }

      const months = (exactDays / 30.4).toFixed(1);
      const monthsSaved = (daysSaved / 30.4).toFixed(1);
      const currentVal = portfolioSummary.currentValue || 0;
      const progressPct = Math.min(100, Math.round((currentVal / targetValuation) * 100));

      return {
        targetValuation,
        title,
        category,
        icon,
        colorKey,
        exactDays,
        months,
        linearDays,
        daysSaved,
        monthsSaved,
        gainAtGoal,
        investedAtGoal,
        progressPct,
        currentVal,
      };
    };

    return [
      calcMilestone(15000, 'Emergency Shield', 'Conservative Goal', 'shield', colors.accent),
      calcMilestone(60000, 'Next Milestone / Asset', 'Balanced Goal', 'gadget', '#E5C98B'),
      calcMilestone(250000, 'Wealth Accelerator', 'Aggressive Goal', 'rocket', '#F8FAFC'),
    ];
  }, [dailyAmount, annualRate, portfolioSummary.currentValue, colors.accent]);

  return (
    <FadeIn delay={0.15}>
      <SpotlightCard
        spotlightColor={colors.accentTint}
        className="rounded-3xl p-6 sm:p-8 border shadow-xl space-y-6"
        style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: colors.accent }} />
              <h3 className="font-extrabold text-base sm:text-lg" style={{ color: colors.textPrimary }}>
                {title}
              </h3>
            </div>
            <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
              {subtitle || `Accelerated timeline projections based on your active ₹${dailyAmount}/day UPI AutoPay mandate in ${activeBasket?.name || 'Satmix'}.`}
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold w-fit border" style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}>
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Compounded Speed</span>
          </div>
        </div>

        {/* 3 Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {milestones.map((m) => {
            return (
              <SpotlightCard
                key={m.title}
                spotlightColor={`${m.colorKey}18`}
                className="rounded-2xl p-5 border flex flex-col justify-between transition-all relative overflow-hidden"
                style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}
              >
                <div className="space-y-3">
                  {/* Top Category and Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono" style={{ color: m.colorKey }}>
                      {m.category}
                    </span>
                    <div className="p-2 rounded-xl border flex items-center justify-center" style={{ backgroundColor: `${m.colorKey}15`, borderColor: `${m.colorKey}30`, color: m.colorKey }}>
                      {m.icon === 'shield' && <Shield className="w-4 h-4" />}
                      {m.icon === 'gadget' && <Smartphone className="w-4 h-4" />}
                      {m.icon === 'rocket' && <Rocket className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Target Valuation & Title */}
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: colors.textPrimary }}>{m.title}</h4>
                    <div className="text-2xl font-extrabold font-mono mt-0.5" style={{ color: colors.textPrimary }}>
                      <CountUp to={m.targetValuation} prefix="₹" duration={1.2} />
                      <span className="text-xs font-normal font-sans ml-1" style={{ color: colors.textSecondary }}>Target</span>
                    </div>
                  </div>

                  {/* Free Wealth Gain Highlight */}
                  <div className="p-2.5 rounded-xl border space-y-1" style={{ backgroundColor: colors.card, borderColor: colors.borderDim }}>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-sans" style={{ color: colors.textSecondary }}>Compounded Gain:</span>
                      <strong className="font-bold" style={{ color: colors.semanticSuccess }}>
                        <CountUp to={m.gainAtGoal} prefix="+₹" duration={1.2} />
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="font-sans" style={{ color: colors.textSecondary }}>Days Saved vs Cash:</span>
                      <strong className="font-bold" style={{ color: colors.accent }}>⚡ {m.daysSaved} Days ({m.monthsSaved} mo faster)</strong>
                    </div>
                  </div>

                  {/* Progress Bar Towards Goal */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-mono" style={{ color: colors.textSecondary }}>
                      <span>Progress: ₹{m.currentVal.toLocaleString('en-IN')}</span>
                      <span className="font-bold" style={{ color: colors.textPrimary }}>{m.progressPct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: colors.surface }}>
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${m.progressPct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          backgroundColor: m.colorKey,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Time to Target Footer */}
                <div className="pt-3 mt-3 border-t flex items-center justify-between text-xs font-mono" style={{ borderColor: colors.borderDim }}>
                  <span className="font-sans" style={{ color: colors.textSecondary }}>Est. Duration:</span>
                  <span className="font-bold" style={{ color: colors.textPrimary }}>
                    {m.months} mo <span className="font-normal" style={{ color: colors.textTertiary }}>({m.exactDays}d)</span>
                  </span>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </SpotlightCard>
    </FadeIn>
  );
};
