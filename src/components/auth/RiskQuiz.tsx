import React, { useState } from 'react';
import { Shield, Rocket, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BasketId } from '../../types';
import { SpotlightCard, ShinyText } from '../ui';
import { motion, AnimatePresence } from 'motion/react';
import { RecommendScreen } from './RecommendScreen';

interface QuizOption {
  title: string;
  subtitle: string;
  points: number; // 0, 1, or 2
}

interface QuizQuestion {
  stepText: string;
  title: string;
  prompt: string;
  options: QuizOption[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    stepText: 'Question 1 of 3 · Market Volatility',
    title: 'How do price ups and downs feel to you?',
    prompt: 'Price volatility comfort',
    options: [
      {
        title: 'Prefer small moves',
        subtitle: 'I prefer USD-pegged stability (USDT) with modest Bitcoin upside to beat inflation without market anxiety.',
        points: 0,
      },
      {
        title: 'Some movement fine',
        subtitle: 'Moderate price swings are acceptable as long as my principal is well-balanced over time.',
        points: 1,
      },
      {
        title: 'Bigger swings okay',
        subtitle: 'I welcome market dips as automated buying discounts for higher long-term compounding upside.',
        points: 2,
      },
    ],
  },
  {
    stepText: 'Question 2 of 3 · Experience Level',
    title: 'How much do you know about crypto?',
    prompt: 'Crypto domain knowledge',
    options: [
      {
        title: "I'm new",
        subtitle: 'First time entering digital assets. I want an automated, transparent, and ultra-simple entry point.',
        points: 0,
      },
      {
        title: 'Basics',
        subtitle: 'I know how Bitcoin and digital dollars work and want a systematic daily accumulation habit.',
        points: 1,
      },
      {
        title: 'Followed a while',
        subtitle: 'I understand Bitcoin, Ethereum, and Solana mechanics and want multi-year halving cycle exposure.',
        points: 2,
      },
    ],
  },
  {
    stepText: 'Question 3 of 3 · Goal Alignment',
    title: 'What do you want from Satmix?',
    prompt: 'Primary Satmix goal',
    options: [
      {
        title: 'Stable way to start',
        subtitle: 'A stress-free digital dollar reserve (85% USDT) with a modest Bitcoin kicker (15% BTC).',
        points: 0,
      },
      {
        title: 'Simple daily habit',
        subtitle: 'Set-and-forget daily UPI micro-savings starting at ₹10–₹30/day without manual intervention.',
        points: 1,
      },
      {
        title: 'More crypto over time',
        subtitle: 'Maximized long-term accumulation across the top 3 high-conviction assets (BTC, ETH, SOL).',
        points: 2,
      },
    ],
  },
];

export const RiskQuiz: React.FC = () => {
  const { colors, submitQuiz, completeOnboardingQuiz } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { optionTitle: string; points: number }>>({});
  const [selectedOptIndex, setSelectedOptIndex] = useState<number | null>(null);

  // Recommendation State (rendered after 3 questions)
  const [showRecommend, setShowRecommend] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);
  const [suggestedBasket, setSuggestedBasket] = useState<BasketId>('stable');

  const question = QUIZ_QUESTIONS[currentStep];

  const handleNext = () => {
    if (selectedOptIndex === null) return;
    const chosenOption = question.options[selectedOptIndex];

    const newAnswers = {
      ...answers,
      [`q${currentStep + 1}`]: {
        optionTitle: chosenOption.title,
        points: chosenOption.points,
      },
    };
    setAnswers(newAnswers);
    setSelectedOptIndex(null);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate total points (0 to 6)
      const totalScore = Object.values(newAnswers).reduce((sum, item) => sum + item.points, 0);
      const suggested: BasketId = totalScore <= 3 ? 'stable' : 'growth';

      setCalculatedScore(totalScore);
      setSuggestedBasket(suggested);

      // Save to context
      submitQuiz(
        Object.fromEntries(Object.entries(newAnswers).map(([k, v]) => [k, v.optionTitle])),
        totalScore,
        suggested
      );

      setShowRecommend(true);
    }
  };

  if (showRecommend) {
    return (
      <RecommendScreen
        suggestedBasketId={suggestedBasket}
        quizScore={calculatedScore}
        onProceed={(chosenBasketId) => {
          completeOnboardingQuiz(chosenBasketId);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden" style={{ backgroundColor: colors.bg }}>
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none opacity-20 animate-ambient-glow"
        style={{ background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)` }}
      />

      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 backdrop-blur-2xl relative z-10 animate-fade-in"
        style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      >
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2 font-mono" style={{ color: colors.accent }}>
            <span>{question.stepText}</span>
            <span>{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% Complete</span>
          </div>

          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: colors.surface }}>
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                backgroundColor: colors.accent,
              }}
            />
          </div>
        </div>

        {/* Animated Question & Options */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Question Title */}
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-6" style={{ color: colors.textPrimary }}>
              {question.title}
            </h2>

            {/* 3 Option Cards */}
            <div className="space-y-3.5 mb-8">
              {question.options.map((opt, optIdx) => {
                const isSelected = selectedOptIndex === optIdx;
                return (
                  <SpotlightCard
                    key={opt.title}
                    spotlightColor={colors.accentTint}
                    onClick={() => setSelectedOptIndex(optIdx)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected ? 'shadow-lg scale-[1.01]' : 'hover:border-white/20'
                    }`}
                    style={{
                      backgroundColor: isSelected ? colors.surface : colors.bg,
                      borderColor: isSelected ? colors.accent : colors.cardBorder,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {opt.points === 0 ? (
                          <Shield className="w-5 h-5" style={{ color: colors.accent }} />
                        ) : opt.points === 1 ? (
                          <Sparkles className="w-5 h-5" style={{ color: colors.accent }} />
                        ) : (
                          <Rocket className="w-5 h-5" style={{ color: colors.accent }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold" style={{ color: colors.textPrimary }}>
                            {opt.title}
                          </h3>
                          <span className="text-[10px] font-mono" style={{ color: colors.textTertiary }}>
                            {opt.points} pts
                          </span>
                        </div>
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: colors.textSecondary }}>
                          {opt.subtitle}
                        </p>
                      </div>
                      <div
                        className="w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: isSelected ? colors.accent : 'transparent',
                          borderColor: isSelected ? colors.accent : colors.borderDim,
                        }}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: colors.surface }} />}
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Continue Button */}
        <button
          onClick={handleNext}
          disabled={selectedOptIndex === null}
          className="w-full h-12 px-6 rounded-xl font-bold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          style={{ backgroundColor: colors.primary, color: colors.primaryText }}
        >
          <span>{currentStep === QUIZ_QUESTIONS.length - 1 ? 'Calculate Basket Fit' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
};

