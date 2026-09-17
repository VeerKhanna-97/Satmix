import React, { useState } from 'react';
import { X, Star, MessageSquare, CheckCircle2, Download, Copy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FeedbackItem } from '../../types';

interface FeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackDrawer: React.FC<FeedbackDrawerProps> = ({ isOpen, onClose }) => {
  const { colors, submitFeedback, feedbackList } = useApp();

  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<FeedbackItem['category']>('UX');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    submitFeedback(rating, category, comment);
    setSubmitted(true);
  };

  const handleCopyAllReviews = () => {
    const text = JSON.stringify(feedbackList, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}
      >
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: colors.borderDim }}>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" style={{ color: colors.accent }} />
            <h3 className="font-bold text-sm" style={{ color: colors.textPrimary }}>Tester Review & Written Feedback</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:opacity-80 transition-opacity" style={{ color: colors.textSecondary }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                Test the complete flow, take screenshots, and provide your feedback on UI polish, payment realism, and usability.
              </p>

              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>
                  Experience Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          rating >= star ? 'fill-current' : ''
                        }`}
                        style={{ color: rating >= star ? colors.accent : colors.borderDim }}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold ml-2" style={{ color: colors.accent }}>{rating} / 5 Stars</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>
                  Feedback Area
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  {(['UX', 'Payments', 'Baskets', 'Bugs', 'Feature Request', 'General'] as const).map((cat) => {
                    const isSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className="h-9 p-2 rounded-xl border text-center transition-all hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                        style={{
                          backgroundColor: isSelected ? colors.accentTint : colors.surface,
                          borderColor: isSelected ? colors.borderAccent : colors.cardBorder,
                          color: isSelected ? colors.accent : colors.textSecondary,
                          fontWeight: isSelected ? 'bold' : 'normal',
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Written Comment */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>
                  Written Feedback / Bug Report / Suggestions
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="The UPI AutoPay mandate flow felt super realistic! On the portfolio chart, I'd suggest..."
                  className="w-full p-3.5 rounded-2xl text-xs border focus:outline-none focus:ring-1"
                  style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                />
              </div>

              <button
                type="submit"
                className="w-full h-11 px-5 rounded-xl font-bold text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-all hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                Submit Feedback
              </button>
            </form>
          ) : (
            <div className="p-6 text-center space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border shadow-lg" style={{ backgroundColor: colors.accentTint, borderColor: colors.borderAccent, color: colors.accent }}>
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Thank You for Your Feedback!</h4>
              <p className="text-xs" style={{ color: colors.textSecondary }}>
                Your review has been recorded into the local tester database.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setComment('');
                }}
                className="h-9 px-4 rounded-xl text-xs font-bold border transition-all hover:bg-white/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderAccent, color: colors.accent }}
              >
                Submit Another Feedback
              </button>
            </div>
          )}

          {/* Stored Feedback History */}
          {feedbackList.length > 0 && (
            <div className="pt-6 border-t space-y-3" style={{ borderColor: colors.borderDim }}>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs" style={{ color: colors.textPrimary }}>Recorded Feedback Logs ({feedbackList.length})</h4>
                <button
                  onClick={handleCopyAllReviews}
                  className="text-[11px] font-bold hover:underline flex items-center gap-1"
                  style={{ color: colors.accent }}
                >
                  <Copy className="w-3 h-3" /> {copied ? 'Copied JSON!' : 'Copy JSON'}
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {feedbackList.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl border text-xs space-y-1" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{ color: colors.textPrimary }}>{item.userName} ({item.category})</span>
                      <span className="font-bold flex items-center gap-1 font-mono" style={{ color: colors.accent }}>
                        <Star className="w-3 h-3 fill-current" />
                        <span>{item.rating}/5</span>
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>{item.comment}</p>
                    <span className="text-[9px] block font-mono" style={{ color: colors.textTertiary }}>{item.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
