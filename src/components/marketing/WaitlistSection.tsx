import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MessageSquare,
  Info,
  BarChart2,
  Lock,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { initReferralCapture, getStoredReferralCode } from '../../utils/referral';
import { SpotlightCard, FadeIn } from '../ui';
import { BasketCurrencyIcons } from '../common/BasketCurrencyIcons';
import { getAssetBarColor } from '../../theme/colors';

export const WaitlistSection: React.FC = () => {
  const { colors, themeMode, setViewMode, setAuthSubView, triggerConfetti } = useApp();

  // Tab State: 0 = Early Access, 1 = How It Works, 2 = Baskets
  const [activeTab, setActiveTab] = useState<number>(0);

  // Early Access Form State
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
        source: 'Landing Page Interactive Tabbed Card',
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

  const handleStartInApp = () => {
    setAuthSubView('signup');
    setViewMode('auth');
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
            className="w-full rounded-3xl border shadow-2xl p-5 sm:p-7 lg:p-9 backdrop-blur-xl relative overflow-hidden"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            {/* ── TOP SEGMENTED TAB SWITCHER ── */}
            <div className="flex items-center pb-5 mb-6 border-b" style={{ borderColor: colors.borderDim }}>
              <div
                className="inline-flex items-center p-1 rounded-2xl border"
                style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab(0)}
                  className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] flex items-center gap-2 cursor-pointer select-none ${
                    activeTab === 0 ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: activeTab === 0 ? colors.cardHigh : 'transparent',
                    color: activeTab === 0 ? colors.textPrimary : colors.textSecondary,
                  }}
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>Early Access</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab(1)}
                  className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] flex items-center gap-2 cursor-pointer select-none ${
                    activeTab === 1 ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: activeTab === 1 ? colors.cardHigh : 'transparent',
                    color: activeTab === 1 ? colors.textPrimary : colors.textSecondary,
                  }}
                >
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>How It Works</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] flex items-center gap-2 cursor-pointer select-none ${
                    activeTab === 2 ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: activeTab === 2 ? colors.cardHigh : 'transparent',
                    color: activeTab === 2 ? colors.textPrimary : colors.textSecondary,
                  }}
                >
                  <BarChart2 className="w-4 h-4 flex-shrink-0" />
                  <span>Baskets</span>
                </button>
              </div>
            </div>

            {/* ── TAB CONTENT ── */}
            <div className="min-h-[290px] flex flex-col justify-between">
              {/* TAB 0: EARLY ACCESS WAITLIST */}
              {activeTab === 0 && (
                <div className="animate-fade-in space-y-6">
                  {!isSubmitted ? (
                    <div className="space-y-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
                            Join the Early Access Waitlist
                          </h2>
                          <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: colors.textSecondary }}>
                            Be among the first to experience automated daily crypto micro-saving from ₹10/day. No lock-ins, zero clutter, and bank-grade transparency.
                          </p>
                        </div>

                        <div className="hidden lg:flex items-center gap-4 text-xs font-mono border-l pl-6" style={{ borderColor: colors.borderDim }}>
                          <div>
                            <span className="block text-[11px] font-sans" style={{ color: colors.textTertiary }}>Alpha Queued</span>
                            <span className="font-bold text-base" style={{ color: colors.textPrimary }}>4,200+ Savers</span>
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

                      {/* 3-COLUMN RESPONSIVE INPUT FORM */}
                      <form onSubmit={handleEarlyAccessSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                          {/* Input 1: Full Name */}
                          <div>
                            <label htmlFor="card-waitlist-name" className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textTertiary }}>
                              Full Name <span className="text-rose-400">*</span>
                            </label>
                            <div className="relative">
                              <User className="w-4 h-4 absolute left-3.5 top-3.5" style={{ color: colors.textTertiary }} />
                              <input
                                id="card-waitlist-name"
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
                            <label htmlFor="card-waitlist-email" className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textTertiary }}>
                              Email Address <span className="text-rose-400">*</span>
                            </label>
                            <div className="relative">
                              <Mail className="w-4 h-4 absolute left-3.5 top-3.5" style={{ color: colors.textTertiary }} />
                              <input
                                id="card-waitlist-email"
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
                              <label htmlFor="card-waitlist-phone" className="block text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.textTertiary }}>
                                Mobile Number
                              </label>
                              <span className="text-[10px] font-mono tabular-nums" style={{ color: colors.textTertiary }}>
                                {phone.replace(/\D/g, '').length}/10 digits
                              </span>
                            </div>
                            <div className="relative">
                              <span className="absolute left-3.5 top-3.5 text-xs font-mono font-bold select-none" style={{ color: colors.textSecondary }}>
                                +91
                              </span>
                              <input
                                id="card-waitlist-phone"
                                name="phone"
                                type="tel"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                placeholder="98765 43210"
                                disabled={isSubmitting}
                                className="w-full h-12 pl-12 pr-3.5 rounded-xl text-sm border font-mono tabular-nums focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                                style={{
                                  backgroundColor: colors.surface,
                                  borderColor: colors.borderDim,
                                  color: colors.textPrimary,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* BOTTOM ACTIONS */}
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
                              className="w-full sm:w-auto h-12 px-7 rounded-xl font-bold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_4px_16px_rgba(93,23,235,0.25)] transition-[transform,background-color,box-shadow] duration-150 ease-out active:scale-[0.96] disabled:opacity-50 inline-flex items-center justify-center gap-2 select-none cursor-pointer whitespace-nowrap"
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
                    /* SUCCESS STATE */
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
                          className="w-full sm:w-auto h-11 px-6 rounded-xl font-semibold text-sm shadow-md transition-all active:scale-[0.96] flex items-center justify-center gap-2 select-none"
                          style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                        >
                          <span>Launch Web App</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <a
                          href="https://chat.whatsapp.com/KWW9pIYhZOF3GlcsNvs7Jw"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto h-11 px-5 rounded-xl font-semibold text-xs border transition-all active:scale-[0.96] flex items-center justify-center gap-2 select-none"
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
                </div>
              )}

              {/* TAB 1: HOW IT WORKS */}
              {activeTab === 1 && (
                <div className="animate-fade-in space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
                        How Satmix Works in 4 Steps
                      </h2>
                      <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: colors.textSecondary }}>
                        An automated daily savings routine designed to run quietly in the background without manual trading stress.
                      </p>
                    </div>

                    <div className="hidden lg:flex items-center gap-4 text-xs font-mono border-l pl-6" style={{ borderColor: colors.borderDim }}>
                      <div>
                        <span className="block text-[11px] font-sans" style={{ color: colors.textTertiary }}>Execution</span>
                        <span className="font-bold text-base" style={{ color: colors.textPrimary }}>9:00 AM Daily</span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-sans" style={{ color: colors.textTertiary }}>Commitment</span>
                        <span className="font-bold text-base text-emerald-400">Cancel Anytime</span>
                      </div>
                    </div>
                  </div>

                  {/* 4 HORIZONTAL / RESPONSIVE STEP CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                    {[
                      {
                        step: '01',
                        title: 'Sign Up in 30 Seconds',
                        desc: 'Fast OTP sign-in with your mobile number and a 4-digit PIN. Zero complicated paperwork.',
                      },
                      {
                        step: '02',
                        title: '5-Question Risk Fit',
                        desc: 'A 1-minute quiz that maps your comfort level to either our Stable or Growth basket.',
                      },
                      {
                        step: '03',
                        title: 'Set Daily AutoPay',
                        desc: 'Pick your daily amount from ₹10/day. Safe, recurring morning debit via your favorite UPI app.',
                      },
                      {
                        step: '04',
                        title: 'Automated Daily Spot',
                        desc: 'Batch executed daily at 9:00 AM straight into institutional-grade safe custody.',
                      },
                    ].map((item) => (
                      <div
                        key={item.step}
                        className="p-4 rounded-2xl border transition-all duration-200 hover:border-white/20 flex flex-col justify-between"
                        style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}
                      >
                        <div>
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs font-mono mb-3"
                            style={{
                              backgroundColor: colors.card,
                              color: colors.accent,
                              border: `1px solid ${colors.borderAccent}`,
                            }}
                          >
                            {item.step}
                          </div>
                          <h4 className="font-bold text-sm mb-1.5" style={{ color: colors.textPrimary }}>
                            {item.title}
                          </h4>
                          <p className="text-xs leading-relaxed" style={{ color: colors.textSecondary }}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* BOTTOM ACTION ROW */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t" style={{ borderColor: colors.borderDim }}>
                    <div className="flex items-center gap-2 text-xs" style={{ color: colors.textSecondary }}>
                      <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Zero lock-in periods. Pause, change your amount, or withdraw INR back to bank anytime.</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleStartInApp}
                        className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.96] flex items-center justify-center gap-2 select-none"
                        style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                      >
                        <span>Start in 30 Seconds</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab(0)}
                        className="hidden sm:inline-flex h-11 px-4 rounded-xl font-semibold text-xs border transition-all active:scale-[0.96] items-center justify-center gap-1.5 select-none"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.borderDim,
                          color: colors.textSecondary,
                        }}
                      >
                        <span>Back to Waitlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BASKETS */}
              {activeTab === 2 && (
                <div className="animate-fade-in space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
                        Curated Baskets (V1)
                      </h2>
                      <p className="text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed" style={{ color: colors.textSecondary }}>
                        Two transparent, rule-based baskets tailored to your risk appetite. Zero hidden management charges.
                      </p>
                    </div>

                    <div className="hidden lg:flex items-center gap-4 text-xs font-mono border-l pl-6" style={{ borderColor: colors.borderDim }}>
                      <div>
                        <span className="block text-[11px] font-sans" style={{ color: colors.textTertiary }}>Custody</span>
                        <span className="font-bold text-base" style={{ color: colors.textPrimary }}>Institutional Multi-Sig</span>
                      </div>
                      <div>
                        <span className="block text-[11px] font-sans" style={{ color: colors.textTertiary }}>Spot Debit</span>
                        <span className="font-bold text-base text-emerald-400">9:00 AM Daily</span>
                      </div>
                    </div>
                  </div>

                  {/* 2 HORIZONTAL SIDE-BY-SIDE BASKET CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {/* Stable Basket Card */}
                    <div
                      className="p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:border-white/30 cursor-pointer flex flex-col justify-between"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}
                      onClick={handleStartInApp}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <BasketCurrencyIcons basketId="stable" size="md" />
                            <div>
                              <h4 className="font-bold text-sm sm:text-base" style={{ color: colors.textPrimary }}>
                                Stable Basket
                              </h4>
                              <p className="text-xs font-mono mt-0.5" style={{ color: colors.textSecondary }}>
                                85% USDT · 15% BTC
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold font-mono block text-emerald-400">
                              Low Volatility
                            </span>
                            <span className="text-[11px] font-mono tabular-nums" style={{ color: colors.textTertiary }}>
                              From ₹10/day
                            </span>
                          </div>
                        </div>

                        <p className="text-xs leading-relaxed mb-3.5" style={{ color: colors.textSecondary }}>
                          Designed for capital preservation and steady wealth building. High exposure to dollar-backed stable assets with a disciplined touch of Bitcoin.
                        </p>

                        {/* Visual allocation bar */}
                        <div
                          className="h-2 w-full rounded-full overflow-hidden flex"
                          style={{ backgroundColor: themeMode === 'light' ? '#E2E8F0' : 'rgba(255, 255, 255, 0.08)' }}
                        >
                          <div
                            className="h-full rounded-l-full"
                            style={{ width: '85%', backgroundColor: getAssetBarColor('USDT', themeMode) }}
                            title="85% USDT"
                          />
                          <div
                            className="h-full rounded-r-full"
                            style={{ width: '15%', backgroundColor: getAssetBarColor('BTC', themeMode) }}
                            title="15% BTC"
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono mt-2" style={{ color: colors.textTertiary }}>
                          <span>85% USDT (Safe Dollar Peg)</span>
                          <span>15% BTC (Digital Gold)</span>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: colors.borderDim }}>
                        <span style={{ color: colors.textSecondary }}>Target: Inflation Hedge</span>
                        <span className="font-semibold flex items-center gap-1" style={{ color: colors.accent }}>
                          Explore Mix →
                        </span>
                      </div>
                    </div>

                    {/* Growth Basket Card */}
                    <div
                      className="p-4 sm:p-5 rounded-2xl border transition-all duration-200 hover:border-white/30 cursor-pointer flex flex-col justify-between"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder }}
                      onClick={handleStartInApp}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <BasketCurrencyIcons basketId="growth" size="md" />
                            <div>
                              <h4 className="font-bold text-sm sm:text-base" style={{ color: colors.textPrimary }}>
                                Growth Basket
                              </h4>
                              <p className="text-xs font-mono mt-0.5" style={{ color: colors.textSecondary }}>
                                70% BTC · 20% ETH · 10% SOL
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold font-mono block" style={{ color: colors.accent }}>
                              Core Upside
                            </span>
                            <span className="text-[11px] font-mono tabular-nums" style={{ color: colors.textTertiary }}>
                              From ₹30/day
                            </span>
                          </div>
                        </div>

                        <p className="text-xs leading-relaxed mb-3.5" style={{ color: colors.textSecondary }}>
                          Balanced upside exposure capturing the long-term compounding growth of the most dominant blockchain networks.
                        </p>

                        {/* Visual allocation bar */}
                        <div
                          className="h-2 w-full rounded-full overflow-hidden flex"
                          style={{ backgroundColor: themeMode === 'light' ? '#E2E8F0' : 'rgba(255, 255, 255, 0.08)' }}
                        >
                          <div
                            className="h-full rounded-l-full"
                            style={{ width: '70%', backgroundColor: getAssetBarColor('BTC', themeMode) }}
                            title="70% BTC"
                          />
                          <div
                            className="h-full"
                            style={{
                              width: '20%',
                              backgroundColor: getAssetBarColor('ETH', themeMode),
                              boxShadow: themeMode === 'light' ? '0 0 0 1px rgba(15, 23, 42, 0.15)' : undefined,
                            }}
                            title="20% ETH"
                          />
                          <div
                            className="h-full rounded-r-full"
                            style={{ width: '10%', backgroundColor: getAssetBarColor('SOL', themeMode) }}
                            title="10% SOL"
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono mt-2" style={{ color: colors.textTertiary }}>
                          <span>70% BTC</span>
                          <span>20% ETH</span>
                          <span>10% SOL</span>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: colors.borderDim }}>
                        <span style={{ color: colors.textSecondary }}>Target: Maximum Long-term Upside</span>
                        <span className="font-semibold flex items-center gap-1" style={{ color: colors.accent }}>
                          Explore Mix →
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTION ROW */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t" style={{ borderColor: colors.borderDim }}>
                    <div className="flex items-center gap-2 text-xs" style={{ color: colors.textSecondary }}>
                      <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span>Execution Frequency: 9:00 AM Daily Spot Debit directly into segregated custody.</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleStartInApp}
                        className="w-full sm:w-auto h-11 px-6 rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.96] flex items-center justify-center gap-2 select-none"
                        style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                      >
                        <span>Explore Baskets in Web App</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab(0)}
                        className="hidden sm:inline-flex h-11 px-4 rounded-xl font-semibold text-xs border transition-all active:scale-[0.96] items-center justify-center gap-1.5 select-none"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.borderDim,
                          color: colors.textSecondary,
                        }}
                      >
                        <span>Join Waitlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── BOTTOM SLIDER DOTS ── */}
            <div className="flex items-center justify-center gap-2 pt-6 mt-2">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeTab === idx ? 'w-6 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to tab ${idx + 1}`}
                />
              ))}
            </div>
          </SpotlightCard>
        </FadeIn>
      </div>
    </section>
  );
};

export default WaitlistSection;
