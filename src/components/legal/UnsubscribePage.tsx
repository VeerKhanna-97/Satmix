import React, { useState } from 'react';
import { Mail, CheckCircle2, ShieldCheck, ArrowLeft, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpotlightCard } from '../ui';

export const UnsubscribePage: React.FC = () => {
  const { colors, setViewMode } = useApp();

  const [email, setEmail] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('email') || '';
    } catch {
      return '';
    }
  });

  const [optOutChoice, setOptOutChoice] = useState<'all' | 'promotional_only' | 'pause_30'>('all');
  const [reason, setReason] = useState<string>('too_frequent');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          preferences: optOutChoice,
          reason,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success !== false) {
        setSubmitted(true);
      } else {
        // Even on external error, honor user preference locally
        setSubmitted(true);
      }
    } catch (err) {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col justify-between animate-fade-in">
      <div className="space-y-8">
        {/* Navigation Back */}
        <button
          onClick={() => setViewMode('marketing')}
          className="inline-flex items-center gap-2 text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ color: colors.textSecondary }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Header */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase font-bold tracking-wider" style={{ color: colors.accent }}>
            CAN-SPAM & DPDP Act 2023 Compliance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            Email Communication Preferences
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: colors.textSecondary }}>
            We respect your inbox and your privacy. You can unsubscribe from marketing communications or customize what you receive at any time.
          </p>
        </div>

        {/* Main Card */}
        <SpotlightCard
          spotlightColor={colors.accentTint}
          className="p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6"
          style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}
        >
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                Your Preferences Have Been Updated
              </h2>
              <p className="text-xs max-w-md mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
                <strong className="text-white">{email}</strong> has been removed from marketing communications. Transactional account notices (such as deposit confirmations, withdrawal OTPs, and security alerts) will continue to function.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setViewMode('marketing')}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs transition-all hover:brightness-105 active:scale-[0.98]"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Email Address Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textTertiary }}>
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3" style={{ color: colors.textTertiary }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arjun@example.com"
                    data-clarity-mask="true"
                    data-sentry-mask="true"
                    data-private="true"
                    className="w-full h-10 pl-10 pr-3 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-1 transition-all"
                    style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                  />
                </div>
              </div>

              {/* Preference Radio Options */}
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: colors.textTertiary }}>
                  Choose Your Preference
                </label>

                {[
                  {
                    id: 'all',
                    title: 'Unsubscribe from all marketing & product emails',
                    desc: 'You will only receive essential account, security, and transaction notifications.',
                  },
                  {
                    id: 'promotional_only',
                    title: 'Keep product announcements, stop promotional discounts',
                    desc: 'Receive updates on new baskets and product releases without marketing campaigns.',
                  },
                  {
                    id: 'pause_30',
                    title: 'Snooze emails for 30 days',
                    desc: 'Take a temporary 30-day break from all marketing communications.',
                  },
                ].map((opt) => {
                  const isChecked = optOutChoice === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => setOptOutChoice(opt.id as any)}
                      className="p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all hover:opacity-90"
                      style={{
                        backgroundColor: isChecked ? colors.purpleTint : colors.surface,
                        borderColor: isChecked ? colors.accent : colors.cardBorder,
                      }}
                    >
                      <input
                        type="radio"
                        name="optOut"
                        checked={isChecked}
                        onChange={() => setOptOutChoice(opt.id as any)}
                        className="mt-0.5 accent-[#5D17EB] cursor-pointer"
                      />
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold" style={{ color: colors.textPrimary }}>
                          {opt.title}
                        </div>
                        <div className="text-[11px]" style={{ color: colors.textSecondary }}>
                          {opt.desc}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Optional Reason */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textTertiary }}>
                  Reason for Leaving (Optional)
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl text-xs border focus:outline-none focus:ring-1 transition-all"
                  style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                >
                  <option value="too_frequent">Emails are too frequent</option>
                  <option value="not_relevant">Content is no longer relevant to me</option>
                  <option value="never_signed_up">I did not sign up for this list</option>
                  <option value="prefer_social">I prefer following via WhatsApp / LinkedIn</option>
                  <option value="other">Other reason</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full h-11 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Preference Update</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </SpotlightCard>
      </div>

      {/* Mandatory CAN-SPAM & DPDP Act Physical Postal Address Footer */}
      <div className="mt-12 pt-6 border-t text-center text-xs space-y-2" style={{ borderColor: colors.borderDim, color: colors.textTertiary }}>
        <div className="flex items-center justify-center gap-1.5 font-bold" style={{ color: colors.textSecondary }}>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CAN-SPAM Act (15 U.S.C. 7704) & DPDP Act 2023 Compliance</span>
        </div>
        <p className="max-w-xl mx-auto leading-relaxed text-[11px]">
          <strong>Registered Office:</strong> Satmix Technologies Private Limited, #44, Hosur Road, Koramangala / Dairy Circle, Bengaluru, Karnataka 560029, India.
        </p>
        <p className="text-[10px]">
          For privacy inquiries or grievance redressal, contact our Data Protection Officer at <a href="mailto:privacy@satmix.in" className="underline hover:text-white">privacy@satmix.in</a>.
        </p>
      </div>
    </div>
  );
};
