import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, CheckCircle2, Rocket, User, Mail, Phone, Layers, Info, BarChart2, Loader2, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { initReferralCapture, getStoredReferralCode } from '../../utils/referral';
import { SpotlightCard, BlurText, Magnet, FadeIn, CountUp } from '../ui';
import { BasketCurrencyIcons } from '../common/BasketCurrencyIcons';

export const Hero: React.FC = () => {
  const { colors, themeMode, setViewMode, setAuthSubView, isAuthenticated, triggerConfetti } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  // Early Access form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Capture referral code on component mount
  useEffect(() => {
    const code = initReferralCapture();
    if (code) {
      setReferralCode(code);
    }
  }, []);

  const handleStartSaving = () => {
    if (isAuthenticated) {
      setViewMode('app');
    } else {
      setAuthSubView('signup');
      setViewMode('auth');
    }
  };

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

    const trimmedPhone = cleanPhone;

    // Cache prefill credentials for instant zero-friction WebApp signup
    try {
      sessionStorage.setItem('satmix_prefill_name', trimmedName);
      sessionStorage.setItem('satmix_prefill_email', trimmedEmail);
      sessionStorage.setItem('satmix_prefill_phone', trimmedPhone);
    } catch (e) {}

    // Open WhatsApp Community immediately in a new tab upon user gesture to prevent popup blocking
    const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/KWW9pIYhZOF3GlcsNvs7Jw';
    try {
      window.open(WHATSAPP_COMMUNITY_URL, '_blank', 'noopener,noreferrer');
    } catch (popupErr) {
      console.warn('Popup blocked or failed to open:', popupErr);
    }

    setIsSubmitting(true);

    try {
      const activeRef = referralCode || getStoredReferralCode();
      const payload = {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        referralCode: activeRef,
        consentAgreed: true,
        source: 'Satmix Hero Waitlist'
      };

      // Call the API endpoint proxy
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      await response.json().catch(() => ({}));

      // Cache submission locally
      try {
        const waitlistDB = JSON.parse(localStorage.getItem('satmix_waitlist') || '[]');
        waitlistDB.push({
          ...payload,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('satmix_waitlist', JSON.stringify(waitlistDB));
      } catch (storageErr) {}

      setIsSubmitted(true);
      triggerConfetti();

      // Automatically redirect current tab to WebApp after brief confirmation
      setTimeout(() => {
        handleGoToApp();
      }, 1200);
    } catch (err) {
      console.warn('Network waitlist submission failed, fallback locally:', err);
      // Fallback: still treat as success locally
      try {
        const waitlistDB = JSON.parse(localStorage.getItem('satmix_waitlist') || '[]');
        waitlistDB.push({
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          referralCode: referralCode || getStoredReferralCode(),
          consentAgreed: true,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('satmix_waitlist', JSON.stringify(waitlistDB));
      } catch (storageErr) {}

      setIsSubmitted(true);
      triggerConfetti();

      // Automatically redirect current tab to WebApp after brief confirmation
      setTimeout(() => {
        handleGoToApp();
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToApp = () => {
    if (isAuthenticated) {
      setViewMode('app');
    } else {
      setAuthSubView('signup');
      setViewMode('auth');
    }
  };

  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-0 lg:min-h-[calc(100vh-100px)] flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <FadeIn delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]" style={{ color: colors.textPrimary }}>
                Put Your Crypto on Autopilot for Just{' '}
                <span className="block font-extrabold mt-1 sm:mt-2" style={{ color: colors.accent }}>
                  ₹10 a Day
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.25}>
              <p className="text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed" style={{ color: colors.textSecondary }}>
                No coin picking. No market timing. No staring at charts. Auto-invest from ₹10 daily via UPI AutoPay into curated baskets of top crypto assets. Withdraw to your bank anytime.
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.35}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1 lg:pt-2">
                <button
                  onClick={handleStartSaving}
                  className="w-full sm:w-auto h-12 px-7 rounded-xl font-semibold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(93,23,235,0.25)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] inline-flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  <span>{isAuthenticated ? 'Open Web Dashboard' : 'Start with ₹10/Day'}</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </button>

                <a
                  href="#calc-section"
                  className="w-full sm:w-auto h-12 px-6 rounded-xl font-semibold text-sm transition-[transform,background-color,border-color] duration-150 ease-out hover:bg-white/[0.04] hover:border-white/20 active:scale-[0.98] border inline-flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary,
                  }}
                >
                  <span>Calculate Your Growth</span>
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Interactive 3-Tab Slide Deck */}
          <div className="lg:col-span-5">
            <SpotlightCard
                className="rounded-3xl border shadow-2xl p-5 md:p-6 backdrop-blur-xl transition-all"
                spotlightColor={colors.accentTint}
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                }}
              >
                {/* Slider Tabs Header */}
                <div className="flex items-center p-1 rounded-xl mb-5" style={{ backgroundColor: colors.surface }}>
                  <button
                    onClick={() => setActiveSlide(0)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeSlide === 0 ? 'shadow-sm' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: activeSlide === 0 ? (colors.cardHigh) : 'transparent',
                      color: activeSlide === 0 ? colors.textPrimary : colors.textSecondary,
                    }}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Early Access</span>
                  </button>

                  <button
                    onClick={() => setActiveSlide(1)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeSlide === 1 ? 'shadow-sm' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: activeSlide === 1 ? (colors.cardHigh) : 'transparent',
                      color: activeSlide === 1 ? colors.textPrimary : colors.textSecondary,
                    }}
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>How It Works</span>
                  </button>

                  <button
                    onClick={() => setActiveSlide(2)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeSlide === 2 ? 'shadow-sm' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: activeSlide === 2 ? (colors.cardHigh) : 'transparent',
                      color: activeSlide === 2 ? colors.textPrimary : colors.textSecondary,
                    }}
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>Baskets</span>
                  </button>
                </div>

              {/* Slide Content Container with Consistent Height */}
              <div className="min-h-[420px] flex flex-col justify-between">
                {/* Slide 0: Early Access Form & WebApp Link */}
                {activeSlide === 0 && (
                  <div className="h-full flex flex-col justify-between animate-fade-in">
                    {!isSubmitted ? (
                      <div className="h-full flex flex-col justify-between">
                        <div>
                          <div className="mb-2.5">
                            <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                              Join the Waitlist
                            </h3>
                            <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                              Be among the first to experience automated crypto micro-investing from ₹10/day.
                            </p>
                          </div>

                          {submitError && (
                            <div className="p-2 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-2">
                              {submitError}
                            </div>
                          )}

                          <form onSubmit={handleEarlyAccessSubmit} className="space-y-2.5">
                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.textTertiary }}>
                                Full Name <span className="text-rose-400">*</span>
                              </label>
                              <div className="relative">
                                <User className="w-4 h-4 absolute left-3 top-3" style={{ color: colors.textTertiary }} />
                                <input
                                  type="text"
                                  required
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  placeholder="Arjun Sharma"
                                  disabled={isSubmitting}
                                  className="w-full h-10 pl-9 pr-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-1 transition-all disabled:opacity-50"
                                  style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.cardBorder,
                                    color: colors.textPrimary,
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.textTertiary }}>
                                Email Address <span className="text-rose-400">*</span>
                              </label>
                              <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3 top-3" style={{ color: colors.textTertiary }} />
                                <input
                                  type="email"
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="arjun@example.com"
                                  disabled={isSubmitting}
                                  className="w-full h-10 pl-9 pr-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-1 transition-all disabled:opacity-50"
                                  style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.cardBorder,
                                    color: colors.textPrimary,
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.textTertiary }}>
                                  Mobile Number
                                </label>
                                <span
                                  className="text-[10px] font-mono font-semibold"
                                  style={{
                                    color: phone.length === 10 ? colors.semanticSuccess : colors.textTertiary,
                                  }}
                                >
                                  {phone.length === 10 ? '✓ 10 Digits' : `${phone.length}/10 digits`}
                                </span>
                              </div>
                              <div className="relative flex items-center">
                                <div
                                  className="absolute left-3 flex items-center gap-1 text-xs font-mono font-bold pr-2 border-r"
                                  style={{ borderColor: colors.borderDim, color: colors.textSecondary }}
                                >
                                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                                  <span>+91</span>
                                </div>
                                <input
                                  type="tel"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  required
                                  maxLength={10}
                                  value={phone}
                                  onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
                                      e.preventDefault();
                                    }
                                  }}
                                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                  placeholder="98765 43210"
                                  disabled={isSubmitting}
                                  className="w-full h-10 pl-20 pr-3 py-2 rounded-xl text-xs sm:text-sm font-mono border focus:outline-none focus:ring-1 transition-all disabled:opacity-50"
                                  style={{
                                    backgroundColor: colors.surface,
                                    borderColor: phone.length === 10 ? 'rgba(16, 185, 129, 0.5)' : colors.cardBorder,
                                    color: colors.textPrimary,
                                  }}
                                />
                              </div>
                            </div>

                            {/* DPDP Act Explicit Consent Checkbox */}
                            <div className="flex items-start gap-2 pt-0.5">
                              <input
                                id="hero-consent"
                                type="checkbox"
                                checked={consentAgreed}
                                onChange={(e) => setConsentAgreed(e.target.checked)}
                                className="mt-0.5 w-3.5 h-3.5 rounded border-gray-700 cursor-pointer accent-white flex-shrink-0"
                              />
                              <label htmlFor="hero-consent" className="text-[10px] leading-tight select-none cursor-pointer" style={{ color: colors.textSecondary }}>
                                I agree to Satmix's{' '}
                                <button
                                  type="button"
                                  onClick={() => setViewMode('terms')}
                                  className="hover:underline font-semibold inline"
                                  style={{ color: colors.accent }}
                                >
                                  Terms
                                </button>{' '}
                                and{' '}
                                <button
                                  type="button"
                                  onClick={() => setViewMode('privacy')}
                                  className="hover:underline font-semibold inline"
                                  style={{ color: colors.accent }}
                                >
                                  Privacy Policy
                                </button>{' '}
                                (DPDP Act 2023).
                              </label>
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmitting || !consentAgreed || phone.replace(/\D/g, '').length !== 10}
                              className="w-full h-10 sm:h-11 rounded-xl font-semibold text-xs sm:text-sm tracking-[-0.01em] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-[transform,background-color,box-shadow,opacity] duration-150 ease-out active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 mt-1"
                              style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Securing Your Spot...</span>
                                </>
                              ) : (
                                <span>Get Early Access</span>
                              )}
                            </button>
                          </form>
                        </div>

                        <div className="pt-2 text-center">
                          <button
                            type="button"
                            onClick={handleGoToApp}
                            className="text-[11px] font-semibold hover:underline inline-flex items-center gap-1 transition-opacity opacity-75 hover:opacity-100"
                            style={{ color: colors.textSecondary }}
                          >
                            <span>Already registered? Launch Web App</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Post-Submit Dual CTAs to WebApp and WhatsApp */
                      <div className="py-2 text-center space-y-3.5 animate-fade-in my-auto h-full flex flex-col justify-center">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border"
                          style={{
                            backgroundColor: colors.mintTint,
                            borderColor: colors.borderMint,
                            color: colors.semanticSuccess,
                          }}
                        >
                          <CheckCircle2 className="w-6 h-6" />
                        </div>

                        <div>
                          <h4 className="font-extrabold text-base" style={{ color: colors.textPrimary }}>
                            You're on the Waitlist!
                          </h4>
                          <p className="text-xs mt-1 leading-relaxed max-w-xs mx-auto" style={{ color: colors.textSecondary }}>
                            Thanks for signing up{name ? `, ${name}` : ''}! Launching your WebApp session now...
                          </p>
                        </div>

                        {/* Dual Action CTAs: WebApp & WhatsApp Community */}
                        <div className="space-y-2 pt-1 max-w-xs mx-auto w-full">
                          <button
                            type="button"
                            onClick={handleGoToApp}
                            className="w-full h-10 sm:h-11 rounded-xl font-semibold text-xs sm:text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                            style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                          >
                            <span>Launch Web App</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href="https://chat.whatsapp.com/KWW9pIYhZOF3GlcsNvs7Jw"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-10 sm:h-11 rounded-xl font-semibold text-xs border transition-[transform,background-color,border-color] duration-150 ease-out active:scale-[0.98] flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                            style={{
                              backgroundColor: colors.surface,
                              borderColor: colors.cardBorder,
                              color: colors.textPrimary,
                            }}
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-500" />
                            <span>Join WhatsApp Community</span>
                          </a>
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-1">
                          <button
                            onClick={() => setViewMode('thank-you')}
                            className="text-xs font-semibold hover:underline"
                            style={{ color: colors.accent }}
                          >
                            View Full Details
                          </button>
                          <span style={{ color: colors.textTertiary }}>•</span>
                          <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-[11px] hover:opacity-80 transition-opacity"
                            style={{ color: colors.textSecondary }}
                          >
                            Edit details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Slide 1: 4 Steps */}
                {activeSlide === 1 && (
                  <div className="h-full flex flex-col justify-between animate-fade-in">
                    <div>
                      <div className="mb-2.5">
                        <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                          How Satmix Works
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                          Automated micro-investing in 4 simple steps.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {[
                          { step: '01', title: 'Sign Up with Mobile & PIN', desc: 'Secure authentication in under 30 seconds.' },
                          { step: '02', title: '5-Question Risk Quiz', desc: 'Maps you to Stable or Growth basket.' },
                          { step: '03', title: 'Set UPI AutoPay from ₹10', desc: 'Morning 8:00 AM automated debit.' },
                          { step: '04', title: 'Automated Batch Execution', desc: '9:00 AM spot execution into your basket.' },
                        ].map((item) => (
                          <div
                            key={item.step}
                            className="flex items-start gap-3 p-2.5 rounded-2xl border transition-colors"
                            style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
                          >
                            <div
                              className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs font-mono flex-shrink-0"
                              style={{ backgroundColor: colors.surface, color: colors.accent, border: `1px solid ${colors.borderAccent}` }}
                            >
                              {item.step}
                            </div>
                            <div>
                              <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>{item.title}</div>
                              <div className="text-[11px] mt-0.5" style={{ color: colors.textSecondary }}>{item.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleStartSaving}
                      className="w-full h-10 sm:h-11 rounded-xl font-semibold text-xs border transition-all duration-150 flex items-center justify-center gap-2 select-none hover:opacity-90 active:scale-[0.98] mt-2.5"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.accent }}
                    >
                      <span>Start in 30 Seconds</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Slide 2: Curated Baskets */}
                {activeSlide === 2 && (
                  <div className="h-full flex flex-col justify-between animate-fade-in">
                    <div>
                      <div className="mb-2.5">
                        <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                          Curated Baskets (V1)
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                          Two transparent, rule-based baskets tailored to your risk comfort.
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {/* Stable Basket Card */}
                        <div
                          className="p-3.5 rounded-2xl border transition-all duration-200 hover:border-white/30 cursor-pointer"
                          style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}
                          onClick={() => {
                            setAuthSubView('signup');
                            setViewMode('auth');
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <BasketCurrencyIcons basketId="stable" size="md" />
                              <div>
                                <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>Stable Basket</div>
                                <div className="text-[11px] font-mono mt-0.5" style={{ color: colors.textSecondary }}>
                                  85% USDT · 15% BTC
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold font-mono block" style={{ color: colors.semanticSuccess }}>Low Volatility</span>
                              <span className="text-[10px] font-mono" style={{ color: colors.textTertiary }}>From ₹10/day</span>
                            </div>
                          </div>
                          {/* Visual allocation bar */}
                          <div className="mt-2.5 h-1.5 w-full rounded-full overflow-hidden flex bg-white/5">
                            <div className="h-full rounded-l-full" style={{ width: '85%', backgroundColor: '#26a17b' }} title="85% USDT" />
                            <div className="h-full rounded-r-full" style={{ width: '15%', backgroundColor: '#f7931b' }} title="15% BTC" />
                          </div>
                        </div>

                        {/* Growth Basket Card */}
                        <div
                          className="p-3.5 rounded-2xl border transition-all duration-200 hover:border-white/30 cursor-pointer"
                          style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}
                          onClick={() => {
                            setAuthSubView('signup');
                            setViewMode('auth');
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <BasketCurrencyIcons basketId="growth" size="md" />
                              <div>
                                <div className="font-bold text-xs" style={{ color: colors.textPrimary }}>Growth Basket</div>
                                <div className="text-[11px] font-mono mt-0.5" style={{ color: colors.textSecondary }}>
                                  70% BTC · 20% ETH · 10% SOL
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold font-mono block" style={{ color: colors.accent }}>Core Upside</span>
                              <span className="text-[10px] font-mono" style={{ color: colors.textTertiary }}>From ₹30/day</span>
                            </div>
                          </div>
                          {/* Visual allocation bar */}
                          <div className="mt-2.5 h-1.5 w-full rounded-full overflow-hidden flex bg-white/5">
                            <div className="h-full rounded-l-full" style={{ width: '70%', backgroundColor: '#f7931b' }} title="70% BTC" />
                            <div className="h-full" style={{ width: '20%', backgroundColor: themeMode === 'light' ? '#0F172A' : '#ffffff' }} title="20% ETH" />
                            <div className="h-full rounded-r-full" style={{ width: '10%', backgroundColor: '#9945fe' }} title="10% SOL" />
                          </div>
                        </div>

                        {/* Institutional Batch Execution Note */}
                        <div
                          className="px-3 py-2 rounded-xl border flex items-center justify-between text-[11px]"
                          style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
                        >
                          <span style={{ color: colors.textSecondary }}>Execution Frequency:</span>
                          <span className="font-mono font-semibold" style={{ color: colors.textPrimary }}>9:00 AM Daily Spot Debit</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setAuthSubView('signup');
                        setViewMode('auth');
                      }}
                      className="w-full h-10 sm:h-11 rounded-xl font-semibold text-xs border transition-all duration-150 flex items-center justify-center gap-2 select-none hover:opacity-90 active:scale-[0.98] mt-2.5"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.accent }}
                    >
                      <span>Explore in Interactive Web App</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-2 pt-3">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeSlide === idx ? 'w-6 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </SpotlightCard>
          </div>
      </div>
    </div>
  </section>
);
};
