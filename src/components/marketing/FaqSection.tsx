import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FAQ_ITEMS } from '../../data/mockData';
import { FadeIn } from '../ui';
import { motion, AnimatePresence } from 'motion/react';

export const FaqSection: React.FC = () => {
  const { colors } = useApp();
  // All accordion drawers closed by default as shown in reference design
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      id="faq-section"
      className="py-16 sm:py-20 md:py-28 relative overflow-hidden scroll-mt-20 sm:scroll-mt-24"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Subtle atmospheric ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-12"
        style={{
          background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`,
        }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <FadeIn delay={0.05} direction="up" className="text-center max-w-xl mx-auto mb-12 sm:mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display" style={{ color: colors.textPrimary }}>
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            Direct, transparent answers on custody, automated UPI execution, and fee architecture.
          </p>
        </FadeIn>

        {/* Minimal Hairline Accordion List */}
        <div className="border-t border-white/10 divide-y divide-white/10">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <FadeIn key={idx} delay={idx * 0.04} direction="up">
                <div className="group transition-colors duration-200">
                  {/* Question Header Button */}
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    onClick={() => toggle(idx)}
                    className="w-full py-5 sm:py-6 text-left flex items-center justify-between gap-4 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/50"
                  >
                    <span
                      className={`text-base sm:text-lg font-medium transition-colors duration-200 ${
                        isOpen ? 'text-white' : 'text-neutral-200 group-hover:text-white'
                      }`}
                    >
                      {item.question}
                    </span>

                    <span
                      className={`w-7 h-7 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ease-out ${
                        isOpen ? 'rotate-45 text-emerald-400' : 'text-neutral-400 group-hover:text-white'
                      }`}
                    >
                      <Plus className="w-5 h-5 stroke-[1.75]" />
                    </span>
                  </button>

                  {/* Smooth Accordion Drawer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        id={`faq-answer-${idx}`}
                        role="region"
                        aria-labelledby={`faq-question-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pt-1 text-sm sm:text-[15px] leading-relaxed text-[#94a3b8] [font-variant-numeric:tabular-nums]">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};
