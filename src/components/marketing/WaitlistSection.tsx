import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, CheckCircle2, User, Mail, Phone, ShieldCheck, MessageSquare, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { initReferralCapture, getStoredReferralCode } from '../../utils/referral';
import { SpotlightCard, FadeIn } from '../ui';

export const WaitlistSection: React.FC = () => {
  const { colors, setViewMode, setAuthSubView, triggerConfetti } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const code = initReferralCapture();
    if (code) {
      setReferralCode(code);
    }
  }, []);

  const handleEarlyAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const cleanPhone = phone.replace(/\D/g, '').slice(0, 10);

    if (!trimmedName || !trimmedEmail) {
      setSubmitError('Please enter your full name and email address.');
      return;
    }

    if (cleanPhone.length !== 10) {
      setSubmitError('Mobile number must be exactly 10 digits.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setSubmitError('Please enter a valid Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    if (!consentAgreed) {
      setSubmitError('Please agree to the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    try {
      sessionStorage.setItem('satmix_prefill_name', trimmedName);
      sessionStorage.setItem('satmix_prefill_email', trimmedEmail);
      sessionStorage.setItem('satmix_prefill_phone', cleanPhone);
    } catch {}

    const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/KWW9pIYhZOF3GlcsNvs7Jw';
    try {
      window.open(WHATSAPP_COMMUNITY_URL, '_blank', 'noopener,noreferrer');
    } catch (popupErr) {
      console.warn('Popup blocked:', popupErr);
    }

    setIsSubmitting(true);

    try {
      const activeRef = referralCode || getStoredReferralCode();
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        phone: cleanPhone,
        referralCode: activeRef,
        consentAgreed: true,
        source: 'Landing Page Horizontal Waitlist Section',
      };

      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => ({}));

      try {
        const waitlistDB = JSON.parse(localStorage.getItem('satmix_waitlist') || '[]');
        waitlistDB.push({ ...payload, timestamp: new Date().toISOString() });
        localStorage.setItem('satmix_waitlist', JSON.stringify(waitlistDB));
      } catch {}

      setIsSubmitted(true);
      triggerConfetti();
    } catch (err) {
      console.warn('Waitlist submission local fallback:', err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToApp = () => {
    setViewMode('app');
  };

  return (
    <section
      id="waitlist-section"
      className="py-10 sm:py-14 md:py-16 border-t border-b relative overflow-hidden"
      style={{ backgroundColor: colors.bg, borderColor: colors.borderDim }}
    >
      {/* Subtle ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-15"
        style={{ background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)` }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn direction="up">
          <SpotlightCard
            spotlightColor={colors.accentTint}
            className="w-full rounded-3xl border shadow-2xl p-6 sm:p-8 lg:p-10 backdrop-blur-xl relative overflow-hidden"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            {!isSubmitted ? (
              <div className="space-y-6">
                {/* ── TOP HORIZONTAL HEADER ROW (PC: side-by-side / Mobile: stacked) ── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b" style={{ borderColor: colors.borderDim }}>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-mono font-bold tracking-wider uppercase shadow-xs"
                        style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.accent }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Early Access Alpha</span>
                      </span>

                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-mono font-semibold"
                        style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textSecondary }}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>FIU-IND Verified</span>
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
                      Join the Satmix Waitlist
                    </h2>
                    <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: colors.textSecondary }}>
                      Be among the first to experience automated daily crypto micro-saving from ₹10/day. No lock-ins, zero clutter, and complete bank-grade transparency.
                    </p>
                  </div>

                  {/* Right Trust Stats on PC */}
                  <div className="hidden lg:flex items-center gap-4 text-xs font-mono border-l pl-6" style={{ borderColor: colors.borderDim }}>
                    <div>
                      <span className="block text-[11px] font-sans" style={{ color: colors.textTertiary }}>Alpha Queued</span>
                      <span className="font-bold text-base" style={{ color: colors.textPrimary }}>1,200+ Savers</span>
                    </div>
                    <div>
                      <span className="block text-[11px] font-sans" style={{ color: colors.textTertiary }}>Daily Start</span>
                      <span className="font-bold text-base text-emerald-400">From ₹10/day</span>
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    {submitError}
                  </div>
                )}

                {/* ── HORIZONTAL FORM (PC: 3 inputs in a row / Mobile: stacked) ── */}
                <form onSubmit={handleEarlyAccessSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                    {/* Input 1: Full Name */}
                    <div>
                      <label htmlFor="h-waitlist-name" className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textTertiary }}>
                        Full Name <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-3.5" style={{ color: colors.textTertiary }} />
                        <input
                          id="h-waitlist-name"
                          name="name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Arjun Sharma"
                          disabled={isSubmitting}
                          className="w-full h-12 pl-10 pr-3.5 rounded-xl text-sm border focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.borderDim,
                            color: colors.textPrimary,
                          }}
                        />
                      </div>
                    </div>

                    {/* Input 2: Email Address */}
                    <div>
                      <label htmlFor="h-waitlist-email" className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textTertiary }}>
                        Email Address <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3.5" style={{ color: colors.textTertiary }} />
                        <input
                          id="h-waitlist-email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="arjun@example.com"
                          disabled={isSubmitting}
                          className="w-full h-12 pl-10 pr-3.5 rounded-xl text-sm border focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.borderDim,
                            color: colors.textPrimary,
                          }}
                        />
                      </div>
                    </div>

                    {/* Input 3: Mobile Number */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="h-waitlist-phone" className="block text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.textTertiary }}>
                          Mobile Number
                        </label>
                        <span className="text-[10px] font-mono" style={{ color: colors.textTertiary }}>
                          {phone.replace(/\D/g, '').length}/10 digits
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-3.5 text-xs font-mono font-bold select-none" style={{ color: colors.textSecondary }}>
                          +91
                        </span>
                        <input
                          id="h-waitlist-phone"
                          name="phone"
                          type="tel"
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="98765 43210"
                          disabled={isSubmitting}
                          className="w-full h-12 pl-12 pr-3.5 rounded-xl text-sm border font-mono focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.borderDim,
                            color: colors.textPrimary,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── HORIZONTAL BOTTOM ACTION ROW ── */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t" style={{ borderColor: colors.borderDim }}>
                    <label className="flex items-start gap-2.5 cursor-pointer select-none max-w-md">
                      <input
                        type="checkbox"
                        checked={consentAgreed}
                        onChange={(e) => setConsentAgreed(e.target.checked)}
                        className="mt-0.5 rounded border text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
                        I agree to Satmix's{' '}
                        <button
                          type="button"
                          onClick={() => setViewMode('terms')}
                          className="hover:underline font-semibold"
                          style={{ color: colors.accent }}
                        >
                          Terms
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => setViewMode('privacy')}
                          className="hover:underline font-semibold"
                          style={{ color: colors.accent }}
                        >
                          Privacy Policy
                        </button>{' '}
                        (DPDP Act 2023).
                      </span>
                    </label>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto h-12 px-7 rounded-xl font-bold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(93,23,235,0.25)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] disabled:opacity-50 inline-flex items-center justify-center gap-2 select-none cursor-pointer whitespace-nowrap"
                        style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                      >
                        <span>{isSubmitting ? 'Registering...' : 'Get Early Access'}</span>
                        <ArrowRight className="w-4 h-4 flex-shrink-0" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthSubView('login');
                          setViewMode('auth');
                        }}
                        className="hidden md:inline-flex text-xs hover:underline items-center gap-1 whitespace-nowrap"
                        style={{ color: colors.textSecondary }}
                      >
                        <span>Launch App →</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              /* ── HORIZONTAL SUCCESS BANNER ── */
              <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center border flex-shrink-0"
                    style={{
                      backgroundColor: colors.mintTint,
                      borderColor: colors.borderMint,
                      color: colors.semanticSuccess,
                    }}
                  >
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xl sm:text-2xl" style={{ color: colors.textPrimary }}>
                      You're on the Waitlist!
                    </h3>
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: colors.textSecondary }}>
                      Thanks for signing up{name ? `, ${name}` : ''}! You are queued for alpha access.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleGoToApp}
                    className="w-full sm:w-auto h-11 px-6 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 select-none"
                    style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                  >
                    <span>Launch Web App</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="https://chat.whatsapp.com/KWW9pIYhZOF3GlcsNvs7Jw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto h-11 px-5 rounded-xl font-semibold text-xs border transition-all active:scale-[0.98] flex items-center justify-center gap-2 select-none"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary,
                    }}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Community</span>
                  </a>
                </div>
              </div>
            )}
          </SpotlightCard>
        </FadeIn>
      </div>
    </section>
  );
};

export default WaitlistSection;
