import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, CheckCircle2, User, Mail, Phone, Lock, MessageSquare } from 'lucide-react';
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
        source: 'Landing Page Waitlist Section',
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
      className="py-16 sm:py-20 md:py-24 border-t relative overflow-hidden"
      style={{ backgroundColor: colors.bg, borderColor: colors.borderDim }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-15"
        style={{ background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)` }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <FadeIn direction="up" className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold tracking-wider uppercase shadow-xs"
            style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.accent }}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Early Access Alpha</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            Join the Waitlist
          </h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: colors.textSecondary }}>
            Be among the first to experience automated crypto micro-investing from ₹10/day. No lock-in, zero jargon, and complete bank-grade transparency.
          </p>
        </FadeIn>

        <FadeIn delay={0.15} direction="up" className="max-w-lg mx-auto">
          <SpotlightCard
            spotlightColor={colors.accentTint}
            className="rounded-3xl border shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            {!isSubmitted ? (
              <div>
                <div className="mb-5 pb-4 border-b" style={{ borderColor: colors.borderDim }}>
                  <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    Reserve Your Spot
                  </h3>
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    Join 1,200+ disciplined savers building their digital asset habit.
                  </p>
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleEarlyAccessSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="landing-waitlist-name" className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.textTertiary }}>
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3" style={{ color: colors.textTertiary }} />
                      <input
                        id="landing-waitlist-name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Arjun Sharma"
                        disabled={isSubmitting}
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl text-sm border focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.borderDim,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="landing-waitlist-email" className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.textTertiary }}>
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3" style={{ color: colors.textTertiary }} />
                      <input
                        id="landing-waitlist-email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="arjun@example.com"
                        disabled={isSubmitting}
                        className="w-full h-11 pl-10 pr-3.5 rounded-xl text-sm border focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.borderDim,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="landing-waitlist-phone" className="block text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.textTertiary }}>
                        Mobile Number
                      </label>
                      <span className="text-[10px] font-mono" style={{ color: colors.textTertiary }}>
                        {phone.replace(/\D/g, '').length}/10 digits
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-xs font-mono font-bold select-none" style={{ color: colors.textSecondary }}>
                        +91
                      </span>
                      <input
                        id="landing-waitlist-phone"
                        name="phone"
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        disabled={isSubmitting}
                        className="w-full h-11 pl-12 pr-3.5 rounded-xl text-sm border font-mono focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.borderDim,
                          color: colors.textPrimary,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
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
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl font-bold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(93,23,235,0.25)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 select-none"
                    style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                  >
                    <span>{isSubmitting ? 'Registering...' : 'Get Early Access'}</span>
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthSubView('login');
                        setViewMode('auth');
                      }}
                      className="text-xs hover:underline flex items-center justify-center gap-1 mx-auto"
                      style={{ color: colors.textSecondary }}
                    >
                      <span>Already registered? Launch Web App</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4 animate-fade-in my-auto h-full flex flex-col justify-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border"
                  style={{
                    backgroundColor: colors.mintTint,
                    borderColor: colors.borderMint,
                    color: colors.semanticSuccess,
                  }}
                >
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="font-extrabold text-xl" style={{ color: colors.textPrimary }}>
                    You're on the Waitlist!
                  </h4>
                  <p className="text-xs sm:text-sm mt-1.5 leading-relaxed max-w-sm mx-auto" style={{ color: colors.textSecondary }}>
                    Thanks for signing up{name ? `, ${name}` : ''}! You are queued for alpha access.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 max-w-xs mx-auto w-full">
                  <button
                    type="button"
                    onClick={handleGoToApp}
                    className="w-full h-11 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 select-none"
                    style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                  >
                    <span>Launch Web App</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="https://chat.whatsapp.com/KWW9pIYhZOF3GlcsNvs7Jw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 rounded-xl font-semibold text-xs border transition-all active:scale-[0.98] flex items-center justify-center gap-2 select-none"
                    style={{
                      backgroundColor: colors.surface,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary,
                    }}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Join WhatsApp Community</span>
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
