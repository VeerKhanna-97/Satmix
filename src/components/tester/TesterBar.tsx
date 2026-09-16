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
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl backdrop-blur-xl border transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
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
