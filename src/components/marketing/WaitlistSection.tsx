// ============================================================
// FILE: src/components/marketing/WaitlistSection.tsx
// PURPOSE: Low-friction, high-converting Early Access Waitlist.
//          Collects Name & Email (Required) + Phone (Optional)
//          in a clean, unified, low-resistance layout for
//          both mobile and desktop views.
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  User,
  Phone,
  MessageSquare,
  Sparkles,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  initReferralCapture,
  getStoredReferralCode,
  extractReferralFromUrl,
  setStoredReferralCode,
} from '../../utils/referral';
import { FadeIn } from '../ui';
import { motion, AnimatePresence } from 'motion/react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STORAGE_KEY = 'satmix-waitlist-email';
const STORAGE_NAME_KEY = 'satmix-waitlist-name';

export const WaitlistSection: React.FC = () => {
  const { colors, themeMode, setViewMode, triggerConfetti } = useApp();
  const isLight = themeMode === 'light';

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [submittedRef, setSubmittedRef] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 1. Detect if referral code is explicitly in the current URL query (?ref=...)
    const urlReferral = extractReferralFromUrl();
    const activeCode = initReferralCapture();
    if (activeCode) {
      setReferralCode(activeCode);
    }

    // 2. If the user explicitly arrived via a referral link, NEVER lock them out
    // with stale local storage from a prior registration on this device.
    // They are here to sign up under this referral link!
    if (urlReferral) {
      setIsSubmitted(false);
      return;
    }

    // 3. For returning visitors without a referral link in URL, check prior submission in local storage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && EMAIL_REGEX.test(stored)) {
        setSubmittedEmail(stored);
        setIsSubmitted(true);
      }
    } catch {}
  }, []);

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setErrorMessage(null);
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.replace(/\D/g, '').slice(0, 10);

    if (!cleanName) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!EMAIL_REGEX.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email (e.g. name@example.com).');
      return;
    }
    if (cleanPhone && cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit phone number or leave it blank.');
      return;
    }

    setIsSubmitting(true);

    try {
      const activeRef = referralCode.trim() || getStoredReferralCode() || undefined;

      const payload = {
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone || undefined,
        referralCode: activeRef,
        source: typeof window !== 'undefined' ? window.location.href : 'landing_waitlist',
        timestamp: new Date().toISOString(),
      };

      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Registration failed (${res.status})`);
      }

      // Persist in local storage
      try {
        localStorage.setItem(STORAGE_KEY, cleanEmail);
        localStorage.setItem(STORAGE_NAME_KEY, cleanName);
      } catch {}

      setSubmittedEmail(cleanEmail);
      if (activeRef) setSubmittedRef(activeRef);
      setIsSubmitted(true);
      triggerConfetti();
    } catch (err: any) {
      console.error('Waitlist submission error:', err);

      // Offline / fallback storage
      try {
        const offlineDB = JSON.parse(localStorage.getItem('satmix_waitlist_offline') || '[]');
        offlineDB.push({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          referralCode: referralCode.trim() || undefined,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('satmix_waitlist_offline', JSON.stringify(offlineDB));
        localStorage.setItem(STORAGE_KEY, cleanEmail);
        localStorage.setItem(STORAGE_NAME_KEY, cleanName);
        setSubmittedEmail(cleanEmail);
        if (referralCode.trim()) setSubmittedRef(referralCode.trim());
        setIsSubmitted(true);
        triggerConfetti();
        return;
      } catch {}

      setErrorMessage(err?.message || 'Unable to join right now. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="waitlist-section"
      className="py-14 sm:py-20 md:py-24 relative overflow-hidden"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Seamless atmospheric ambient blend connecting from TrustStrip and Hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            themeMode === 'dark'
              ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(93, 23, 235, 0.09) 0%, transparent 70%), radial-gradient(circle at 50% 50%, rgba(93, 23, 235, 0.06) 0%, transparent 65%)'
              : 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(93, 23, 235, 0.04) 0%, transparent 70%), radial-gradient(circle at 50% 50%, rgba(93, 23, 235, 0.03) 0%, transparent 65%)',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <FadeIn delay={0.05} direction="up" className="space-y-4">
          
          {/* Main Title & Description */}
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.12]"
            style={{ color: colors.textPrimary }}
          >
            Join the Early Access Waitlist
          </h2>
          <p
            className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal"
            style={{ color: colors.textSecondary }}
          >
            Be among the first to experience automated daily crypto micro-saving from ₹10/day. Spot buys in your exchange account with zero lock-ins.
          </p>

          {/* ── SMOOTH, LOW-FRICTION WAITLIST CONTAINER ── */}
          <div className="pt-4 max-w-xl mx-auto">
            <AnimatePresence mode="wait" initial={false}>
              {!isSubmitted ? (
                /* ── STATE 1: LOW-FRICTION REGISTRATION CARD ── */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-3"
                >
                  <div
                    className="p-3 sm:p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all duration-300 space-y-2.5 sm:space-y-3 text-left"
                    style={{
                      backgroundColor: isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(18, 20, 28, 0.88)',
                      borderColor: colors.cardBorder,
                    }}
                  >
                    {/* Active Referral Pill or Toggle */}
                    {referralCode ? (
                      <div
                        className="flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs font-medium"
                        style={{
                          backgroundColor: isLight ? 'rgba(93, 23, 235, 0.05)' : 'rgba(93, 23, 235, 0.12)',
                          borderColor: isLight ? 'rgba(93, 23, 235, 0.2)' : 'rgba(93, 23, 235, 0.35)',
                        }}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                          <span style={{ color: colors.textPrimary }} className="truncate">
                            Referral invite applied:{' '}
                            <span className="font-bold font-mono tracking-wider text-purple-400">
                              {referralCode}
                            </span>
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> Priority Access
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end">
                        {!showReferralInput ? (
                          <button
                            type="button"
                            onClick={() => setShowReferralInput(true)}
                            className="text-[11.5px] text-neutral-400 hover:text-purple-400 transition-colors flex items-center gap-1 cursor-pointer select-none"
                          >
                            <Sparkles className="w-3 h-3 text-purple-400/80" />
                            <span>Have a referral code?</span>
                          </button>
                        ) : (
                          <div
                            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors focus-within:border-purple-500/60"
                            style={{
                              backgroundColor: isLight ? '#f9fafb' : 'rgba(255, 255, 255, 0.03)',
                              borderColor: colors.borderDim,
                            }}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                            <input
                              type="text"
                              placeholder="REFERRAL CODE (E.G. RAGHAV)"
                              value={referralCode}
                              onChange={(e) => {
                                const clean = e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
                                setReferralCode(clean);
                                if (clean) setStoredReferralCode(clean);
                              }}
                              className="w-full bg-transparent text-xs font-mono tracking-wider outline-none placeholder:text-neutral-500 uppercase font-semibold"
                              style={{ color: colors.textPrimary }}
                            />
                            {referralCode && (
                              <button
                                type="button"
                                onClick={() => {
                                  setReferralCode('');
                                  setShowReferralInput(false);
                                }}
                                className="text-[10px] text-neutral-400 hover:text-rose-400 uppercase font-mono px-1 cursor-pointer"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Input Grid: Name (Req) & Email (Req) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                      {/* Name Input */}
                      <div
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-colors focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30"
                        style={{
                          backgroundColor: isLight ? '#f9fafb' : 'rgba(255, 255, 255, 0.03)',
                          borderColor: colors.borderDim,
                        }}
                      >
                        <User className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        <input
                          type="text"
                          autoComplete="name"
                          placeholder="Your name *"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          required
                          className="w-full bg-transparent text-sm outline-none font-medium placeholder:text-neutral-500"
                          style={{ color: colors.textPrimary }}
                        />
                      </div>

                      {/* Email Input */}
                      <div
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-colors focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30"
                        style={{
                          backgroundColor: isLight ? '#f9fafb' : 'rgba(255, 255, 255, 0.03)',
                          borderColor: colors.borderDim,
                        }}
                      >
                        <Mail className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        <input
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="Email address *"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          required
                          className="w-full bg-transparent text-sm outline-none font-medium placeholder:text-neutral-500"
                          style={{ color: colors.textPrimary }}
                        />
                      </div>
                    </div>

                    {/* Bottom Row: Optional Phone + Direct Submit CTA */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 pt-0.5">
                      {/* Optional Phone Input */}
                      <div
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border flex-1 transition-colors focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30"
                        style={{
                          backgroundColor: isLight ? '#f9fafb' : 'rgba(255, 255, 255, 0.03)',
                          borderColor: colors.borderDim,
                        }}
                      >
                        <Phone className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        <input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="Phone (optional, for WhatsApp invite)"
                          value={phone}
                          maxLength={10}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          className="w-full bg-transparent text-sm outline-none font-medium placeholder:text-neutral-500"
                          style={{ color: colors.textPrimary }}
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-11 sm:h-[42px] px-6 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all duration-200 active:scale-[0.96] hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2 select-none cursor-pointer whitespace-nowrap"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.primaryText,
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                            <span>Joining...</span>
                          </>
                        ) : (
                          <>
                            <span>Get Early Access</span>
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Inline Error Message */}
                  {errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-semibold text-rose-400 text-left pl-3"
                    >
                      {errorMessage}
                    </motion.p>
                  )}

                  {/* Tacit Legal Consent */}
                  <p className="text-[11.5px] text-neutral-400 text-center leading-relaxed">
                    Zero spam, ever. By submitting, you agree to our{' '}
                    <button
                      type="button"
                      onClick={() => setViewMode('terms')}
                      className="hover:underline font-medium cursor-pointer"
                      style={{ color: colors.textPrimary }}
                    >
                      Terms
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => setViewMode('privacy')}
                      className="hover:underline font-medium cursor-pointer"
                      style={{ color: colors.textPrimary }}
                    >
                      Privacy Policy
                    </button>
                    .
                  </p>
                </motion.form>
              ) : (
                /* ── STATE 2: INSTANT CONFIRMATION ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-3"
                >
                  {/* Verified Success Card */}
                  <div
                    className="flex flex-col sm:flex-row items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl border shadow-xl backdrop-blur-md"
                    style={{
                      backgroundColor: isLight ? 'rgba(236, 253, 245, 0.9)' : 'rgba(6, 40, 30, 0.85)',
                      borderColor: 'rgba(16, 185, 129, 0.35)',
                    }}
                  >
                    <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-sm sm:text-base text-emerald-400 flex items-center gap-2 flex-wrap">
                          <span>You're on the list!</span>
                          {(submittedRef || referralCode) && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                              Ref: {submittedRef || referralCode}
                            </span>
                          )}
                        </div>
                        <div
                          className="text-xs font-mono mt-0.5 truncate"
                          style={{ color: isLight ? 'rgba(6, 78, 59, 0.85)' : 'rgba(167, 243, 208, 0.9)' }}
                        >
                          {submittedEmail ? `Invite queued for ${submittedEmail}` : "We'll email your invite before public launch."}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => setViewMode('app')}
                        className="flex-1 sm:flex-initial h-9 px-4 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-[0.96] flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.primaryText,
                        }}
                      >
                        <span>Try Prototype</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href="https://chat.whatsapp.com/KWW9pIYhZOF3GlcsNvs7Jw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial h-9 px-3.5 rounded-xl font-semibold text-xs border transition-all active:scale-[0.96] flex items-center justify-center gap-1.5 text-neutral-300 hover:text-white cursor-pointer whitespace-nowrap"
                        style={{
                          backgroundColor: isLight ? '#ffffff' : '#141620',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Community</span>
                      </a>
                    </div>
                  </div>

                  {/* Register another person / switch email CTA */}
                  <div className="flex items-center justify-center pt-1">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-xs font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-white/5 cursor-pointer active:scale-[0.97]"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                      <span>Register another person or use a different email</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </FadeIn>
      </div>
    </section>
  );
};

export default WaitlistSection;
