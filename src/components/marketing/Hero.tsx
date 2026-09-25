import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, CheckCircle2, Rocket, User, Mail, Phone, Layers, Info, BarChart2, Loader2, Zap, ArrowDownLeft, FileCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { initReferralCapture, getStoredReferralCode } from '../../utils/referral';
import { SpotlightCard, BlurText, Magnet, FadeIn, CountUp } from '../ui';

export const Hero: React.FC = () => {
  const { colors, setViewMode, setAuthSubView, isAuthenticated, triggerConfetti } = useApp();
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

    if (!name.trim() || !email.trim()) {
      setSubmitError('Please enter your full name and email address.');
      return;
    }

    if (!consentAgreed) {
      setSubmitError('Please agree to the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const activeRef = referralCode || getStoredReferralCode();
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
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

      const result = await response.json().catch(() => ({}));

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
    } catch (err) {
      console.warn('Network waitlist submission failed, fallback locally:', err);
      // Fallback: still treat as success locally
      try {
        const waitlistDB = JSON.parse(localStorage.getItem('satmix_waitlist') || '[]');
        waitlistDB.push({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          referralCode: referralCode || getStoredReferralCode(),
          consentAgreed: true,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('satmix_waitlist', JSON.stringify(waitlistDB));
      } catch (storageErr) {}

      setIsSubmitted(true);
      triggerConfetti();
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
    <section className="relative overflow-hidden py-14 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left lg:pt-2">
            <FadeIn delay={0.1}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]" style={{ color: colors.textPrimary }}>
                Put Your Crypto on Autopilot for Just{' '}
                <span className="block font-extrabold mt-1 sm:mt-2" style={{ color: colors.accent }}>
                  ₹10 a Day
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.25}>
              <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed" style={{ color: colors.textSecondary }}>
                {/* Mobile (< 1024px): Concise, punchy copy */}
                <span className="block lg:hidden">
                  Automated crypto baskets from ₹10 via daily UPI. Zero stress, full control.
                </span>
                {/* Laptop / Desktop (>= 1024px): 100% untouched original */}
                <span className="hidden lg:inline">
                  No coin picking. No market timing. No staring at charts. Auto-invest from ₹10 daily via UPI AutoPay into curated baskets of top crypto assets. Withdraw to your bank anytime.
                </span>
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.35}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
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

            {/* Feature Spec Strip */}
            <FadeIn delay={0.45}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
                <div
                  className="flex items-center justify-center lg:justify-start gap-2 px-3 py-2 rounded-lg border text-xs font-mono"
                  style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textSecondary }}
                >
                  <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.accent }} />
                  <span>Daily UPI AutoPay</span>
                </div>
                <div
                  className="flex items-center justify-center lg:justify-start gap-2 px-3 py-2 rounded-lg border text-xs font-mono"
                  style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textSecondary }}
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.accent }} />
                  <span>Withdraw Anytime 24/7</span>
                </div>
                <div
                  className="flex items-center justify-center lg:justify-start gap-2 px-3 py-2 rounded-lg border text-xs font-mono"
                  style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textSecondary }}
                >
                  <FileCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.accent }} />
                  <span>Institutional Custody</span>
                </div>
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

              {/* Slide 0: Early Access Form & WebApp Nudge */}
              {activeSlide === 0 && (
                <div className="space-y-4 animate-fade-in">
                  {!isSubmitted ? (
                    <>
                      <div>
                        <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                          Join the Waitlist
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                          Be among the first to experience automated crypto micro-investing from ₹10/day.
                        </p>
                      </div>

                      {submitError && (
                        <div className="p-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400">
                          {submitError}
                        </div>
                      )}

                      <form onSubmit={handleEarlyAccessSubmit} className="space-y-3">
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
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-1 transition-all disabled:opacity-50"
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
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-1 transition-all disabled:opacity-50"
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
                            Phone Number <span className="text-gray-500 font-normal lowercase">(optional)</span>
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 absolute left-3 top-3" style={{ color: colors.textTertiary }} />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+91 98765 43210"
                              disabled={isSubmitting}
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-1 transition-all disabled:opacity-50"
                              style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.cardBorder,
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
                            className="mt-0.5 w-3.5 h-3.5 rounded border-gray-700 cursor-pointer accent-white"
                          />
                          <label htmlFor="hero-consent" className="text-[10px] leading-tight select-none cursor-pointer" style={{ color: colors.textSecondary }}>
                            I agree to Satmix's{' '}
                            <button
                              type="button"
                              onClick={() => setViewMode('terms')}
                              className="hover:underline font-semibold inline"
                              style={{ color: colors.accent }}
                            >
                              Terms of Use
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
                          disabled={isSubmitting || !consentAgreed}
                          className="w-full h-11 rounded-xl font-semibold text-sm tracking-[-0.01em] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-[transform,background-color,box-shadow,opacity] duration-150 ease-out active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
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

                      {/* WebApp Nudge Banner */}
                      <div
                        className="p-3 rounded-2xl border flex items-center justify-between gap-3 mt-3"
                        style={{
                          backgroundColor: colors.accentTint,
                          borderColor: colors.borderAccent,
                        }}
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider block font-mono" style={{ color: colors.accent }}>
                            Live Interactive WebApp
                          </span>
                          <span className="text-xs font-semibold" style={{ color: colors.textPrimary }}>
                            Experience the Satmix WebApp
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleGoToApp}
                          className="h-8 px-3 rounded-lg font-semibold text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-[transform,background-color] duration-150 ease-out active:scale-[0.98] flex items-center gap-1.5 flex-shrink-0 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                          style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                        >
                          <span>Launch App</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Post-Submit Nudge to WebApp */
                    <div className="py-4 text-center space-y-4 animate-fade-in">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border"
                        style={{
                          backgroundColor: colors.mintTint,
                          borderColor: colors.borderMint,
                          color: colors.semanticSuccess,
                        }}
                      >
                        <CheckCircle2 className="w-8 h-8" />
                      </div>

                      <div>
                        <h4 className="font-extrabold text-lg" style={{ color: colors.textPrimary }}>
                          You're on the Waitlist!
                        </h4>
                        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: colors.textSecondary }}>
                          Thanks for signing up{name ? `, ${name}` : ''}! Experience the interactive Satmix WebApp right now.
                        </p>
                      </div>

                      {/* Direct WebApp Launch CTA */}
                      <button
                        onClick={handleGoToApp}
                        className="w-full h-11 rounded-xl font-semibold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.98] flex items-center justify-center gap-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                        style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                      >
                        <span>Launch Web App →</span>
                      </button>

                      <div className="flex items-center justify-center gap-4 pt-1">
                        <button
                          onClick={() => setViewMode('thank-you')}
                          className="text-xs font-semibold hover:underline"
                          style={{ color: colors.accent }}
                        >
                          View Full Confirmation Details
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
              {/* Slide 1: 4 Steps */}
              {activeSlide === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                      How Satmix Works
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                      Automated micro-investing in 4 simple steps.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { step: '01', title: 'Sign Up with Mobile & PIN', desc: 'Secure authentication in under 30 seconds.' },
                      { step: '02', title: '5-Question Risk Quiz', desc: 'Maps you to Stable or Growth basket.' },
                      { step: '03', title: 'Set UPI AutoPay from ₹10', desc: 'Morning 8:00 AM automated debit.' },
                      { step: '04', title: 'Automated Batch Execution', desc: '9:00 AM spot execution into your basket.' },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className="flex items-start gap-3.5 p-3 rounded-2xl border transition-colors"
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

                  <button
                    onClick={handleStartSaving}
                    className="w-full h-11 rounded-xl font-semibold text-xs border transition-all duration-150 flex items-center justify-center gap-2 select-none hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.accent }}
                  >
                    <span>Start in 30 Seconds</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Slide 2: Quick Strategies */}
              {activeSlide === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>
                      Curated Baskets (V1)
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                      Two transparent baskets tailored to your risk comfort.
                    </p>
                  </div>

                  {/* Stable Basket Card */}
                  <div
                    className="p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-200 hover:border-white/30"
                    style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}
                    onClick={() => {
                      setAuthSubView('signup');
                      setViewMode('auth');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl" style={{ backgroundColor: colors.mintTint, color: colors.semanticSuccess }}>
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>Stable Basket</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: colors.mintTint, color: colors.semanticSuccess }}>
                            Stable
                          </span>
                        </div>
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

                  {/* Growth Basket Card */}
                  <div
                    className="p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-200 hover:border-white/30"
                    style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}
                    onClick={() => {
                      setAuthSubView('signup');
                      setViewMode('auth');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>Growth Basket</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
                            Growth
                          </span>
                        </div>
                        <div className="text-[11px] font-mono mt-0.5" style={{ color: colors.textSecondary }}>
                          70% BTC · 20% ETH · 10% SOL
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono block" style={{ color: colors.accent }}>Core Upside</span>
                      <span className="text-[10px] font-mono" style={{ color: colors.textTertiary }}>From ₹10/day</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAuthSubView('signup');
                      setViewMode('auth');
                    }}
                    className="w-full h-11 rounded-xl font-semibold text-xs border transition-all duration-150 flex items-center justify-center gap-2 select-none hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.accent }}
                  >
                    <span>Explore in Interactive Web App</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

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
