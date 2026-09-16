import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FAQ_ITEMS } from '../../data/mockData';
import { SpotlightCard, FadeIn } from '../ui';
import { motion, AnimatePresence } from 'motion/react';

export const FaqSection: React.FC = () => {
  const { colors } = useApp();
  // First question open by default (index 0)
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-20 md:py-28 border-t relative overflow-hidden" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeIn delay={0.05} direction="up" className="text-center max-w-2xl mx-auto mb-16 space-y-3.5">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-[11px] font-mono font-medium tracking-wider uppercase"
            style={{
              backgroundColor: colors.accentTint,
              color: colors.accent,
              borderColor: colors.borderAccent,
            }}
          >
            <span>PROTOCOL FAQ & KNOWLEDGE BASE</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            Everything you need to know about automated micro-savings, UPI AutoPay, and compliance.
          </p>
        </FadeIn>

        {/* FAQ List with SpotlightCard and Smooth Height Drawer */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <FadeIn key={idx} delay={idx * 0.06} direction="up">
                <SpotlightCard
                  spotlightColor={colors.purpleTint}
                  onClick={() => toggle(idx)}
                  className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md ${
                    isOpen
                      ? 'shadow-[0_8px_30px_rgba(197,160,89,0.12)]'
                      : 'hover:border-slate-700'
                  }`}
                  style={{
                    backgroundColor: colors.card,
                    borderColor: isOpen ? colors.accent : colors.cardBorder,
                  }}
                >
                  {/* Question Header */}
                  <div
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm md:text-base select-none transition-colors"
                    style={{ color: isOpen ? colors.textPrimary : colors.textSecondary }}
                  >
                    <span className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors duration-300"
                        style={{
                          backgroundColor: isOpen ? colors.purpleTint : 'rgba(255, 255, 255, 0.05)',
                          color: isOpen ? colors.accent : colors.textTertiary,
                        }}
                      >
                        <HelpCircle className="w-4 h-4 flex-shrink-0" />
                      </div>
                      <span className="transition-colors duration-300" style={{ color: isOpen ? colors.textPrimary : colors.textSecondary }}>
                        {item.question}
                      </span>
                    </span>

                    <ChevronDown
                      className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ease-out ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      style={{ color: isOpen ? colors.accent : colors.textTertiary }}
                    />
                  </div>

                  {/* Smooth Spring Accordion Drawer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-5 pb-5 pt-1 text-xs md:text-sm leading-relaxed border-t"
                          style={{ color: colors.textSecondary, borderColor: colors.borderDim }}
                        >
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SpotlightCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
