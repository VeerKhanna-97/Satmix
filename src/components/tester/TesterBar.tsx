import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FeedbackDrawer } from './FeedbackDrawer';

export const TesterBar: React.FC = () => {
  const { viewMode, colors } = useApp();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Retain the feedback/reviews button ONLY in the Web App part
  if (viewMode !== 'app') {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center animate-fade-in">
        <button
          onClick={() => setFeedbackOpen(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-bold backdrop-blur-xl border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_8px_24px_rgba(0,0,0,0.4)] transition-all hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
          style={{
            backgroundColor: colors.cardHigh,
            borderColor: colors.borderAccent,
            color: colors.accent,
          }}
        >
          <MessageSquare className="w-4 h-4" style={{ color: colors.accent }} />
          <span>Feedback / Reviews</span>
        </button>
      </div>

      <FeedbackDrawer isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
};
