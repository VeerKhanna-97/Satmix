import React, { useState } from 'react';
import {
  Lock,
  User,
  Mail,
  Phone,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpotlightCard } from '../ui';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const { authSubView, setAuthSubView, setViewMode, login, signUp, colors } = useApp();

  // Form fields with prefill support from waitlist signup
  const [name, setName] = useState(() => {
    try {
      return sessionStorage.getItem('satmix_prefill_name') || '';
    } catch {
      return '';
    }
  });
  const [identifier, setIdentifier] = useState(() => {
    try {
      return sessionStorage.getItem('satmix_prefill_email') || sessionStorage.getItem('satmix_prefill_phone') || '';
    } catch {
      return '';
    }
  });
  const [email, setEmail] = useState(() => {
    try {
      return sessionStorage.getItem('satmix_prefill_email') || '';
    } catch {
      return '';
    }
  });
  const [phone, setPhone] = useState(() => {
    try {
      return sessionStorage.getItem('satmix_prefill_phone') || '';
    } catch {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isLogin = authSubView === 'login';

  // Synchronize prefill credentials if authSubView opens
  React.useEffect(() => {
    try {
      const storedName = sessionStorage.getItem('satmix_prefill_name');
      const storedEmail = sessionStorage.getItem('satmix_prefill_email');
      const storedPhone = sessionStorage.getItem('satmix_prefill_phone');
      if (storedName && !name) setName(storedName);
      if (storedEmail && !email) setEmail(storedEmail);
      if (storedPhone && !phone) setPhone(storedPhone);
      if ((storedEmail || storedPhone) && !identifier) setIdentifier(storedEmail || storedPhone || '');
    } catch {}
  }, [authSubView]);

  // Keyboard accessibility: Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setViewMode('marketing');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setViewMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    if (isLogin) {
      if (!identifier.trim()) {
        setErrorMsg('Please enter your registered email address or mobile number');
        return;
      }
      const cleanIdent = identifier.trim().replace(/\s+/g, '');
      if (/^\d+$/.test(cleanIdent)) {
        if (cleanIdent.length !== 10) {
          setErrorMsg('Mobile number must be exactly 10 digits');
          return;
        }
      }
    } else {
      if (name.trim().length < 2) {
        setErrorMsg('Please enter your legal full name');
        return;
      }

      const cleanPhoneDigits = phone.replace(/\D/g, '').slice(0, 10);
      if (!cleanPhoneDigits || cleanPhoneDigits.length !== 10) {
        setErrorMsg('Please enter your 10-digit mobile number (exactly 10 digits required)');
        return;
      }
      if (!/^[6-9]\d{9}$/.test(cleanPhoneDigits)) {
        setErrorMsg('Please enter a valid Indian mobile number starting with 6, 7, 8, or 9');
        return;
      }

      const cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        setErrorMsg('Please enter a valid email address');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return;
      }
      if (!consentAgreed) {
        setErrorMsg('Please accept the Terms of Use and Privacy Policy to proceed');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await login(identifier.trim(), password);
        if (!res.success) {
          setErrorMsg(res.error || 'Login failed. Please check your credentials.');
        }
      } else {
        const res = await signUp(name.trim(), email.trim().toLowerCase(), password, phone.trim());
        if (!res.success) {
          setErrorMsg(res.error || 'Registration failed');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 py-4 sm:py-6 relative overflow-x-hidden" style={{ backgroundColor: colors.bg }}>
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-20 animate-ambient-glow"
        style={{ background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)` }}
      />

      <SpotlightCard
        spotlightColor={colors.accentTint}
        className={`w-full ${isLogin ? 'max-w-md sm:max-w-lg' : 'max-w-xl sm:max-w-2xl'} rounded-3xl border shadow-2xl p-5 sm:p-7 backdrop-blur-2xl relative z-10 transition-all duration-300 animate-fade-in`}
        style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      >
        {/* Top Navigation Back */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button
            onClick={() => setViewMode('marketing')}
            className="text-xs font-semibold hover:opacity-80 transition-opacity flex items-center gap-1.5"
            style={{ color: colors.textSecondary }}
          >
            <span>← Back to Website</span>
          </button>
          <div className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textTertiary }}>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>DPDP & KYC Ready</span>
          </div>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="w-10 h-10 rounded-xl mx-auto mb-2 overflow-hidden border p-0.5 shadow-sm" style={{ borderColor: colors.borderDim }}>
            <img src="/assets/images/satmix-logo.jpg" alt="Satmix Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            {isLogin ? 'Welcome Back to Satmix' : 'Create Your Satmix Account'}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
            {isLogin
              ? 'Enter your registered email address & password'
              : 'Sign up to start automated daily crypto micro-investing'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl mb-4 relative" style={{ backgroundColor: colors.surface }}>
          <button
            onClick={() => {
              setAuthSubView('login');
              setErrorMsg('');
            }}
            className="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all relative z-10"
            style={{ color: isLogin ? colors.textPrimary : colors.textSecondary }}
          >
            {isLogin && (
              <motion.div
                layoutId="authTabIndicator"
                className="absolute inset-0 rounded-lg shadow-md border"
                style={{ backgroundColor: colors.cardHigh, borderColor: colors.borderDim }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">Sign In</span>
          </button>
          <button
            onClick={() => {
              setAuthSubView('signup');
              setErrorMsg('');
            }}
            className="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all relative z-10"
            style={{ color: !isLogin ? colors.textPrimary : colors.textSecondary }}
          >
            {!isLogin && (
              <motion.div
                layoutId="authTabIndicator"
                className="absolute inset-0 rounded-lg shadow-md border"
                style={{ backgroundColor: colors.cardHigh, borderColor: colors.borderDim }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">Sign Up</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            className="p-2.5 rounded-xl mb-3.5 flex items-start gap-2 text-xs font-medium border"
            style={{
              backgroundColor: colors.redTint,
              borderColor: colors.semanticDanger,
              color: colors.semanticDanger,
            }}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {!isLogin ? (
              <motion.div
                key="signup-fields"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {/* Full Legal Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.textTertiary }}>
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3" style={{ color: colors.textTertiary }} />
                    <input
                      type="text"
                      required
                      placeholder="Arjun Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                  </div>
                </div>

                {/* Mobile Number (Exactly 10 Digits) */}
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
                      placeholder="98765 43210"
                      value={phone}
                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full h-10 pl-20 pr-3 py-2 rounded-xl text-xs sm:text-sm font-mono border focus:outline-none focus:ring-1 transition-all"
                      style={{
                        backgroundColor: colors.surface,
                        borderColor: phone.length === 10 ? 'rgba(16, 185, 129, 0.5)' : colors.cardBorder,
                        color: colors.textPrimary,
                      }}
                    />
                  </div>
                </div>

                {/* Email Address (Full Width across 2 columns) */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.textTertiary }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3" style={{ color: colors.textTertiary }} />
                    <input
                      type="email"
                      required
                      placeholder="arjun@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.textTertiary }}>
                      Password (min 6)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] hover:opacity-80 transition-opacity flex items-center gap-1"
                      style={{ color: colors.textSecondary }}
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3" style={{ color: colors.textTertiary }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.textTertiary }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3" style={{ color: colors.textTertiary }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                  </div>
                </div>

                {/* Terms and Privacy Consent */}
                <div className="sm:col-span-2 flex items-start gap-2 pt-0.5">
                  <input
                    id="auth-consent"
                    type="checkbox"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded cursor-pointer accent-[#5D17EB]"
                  />
                  <label htmlFor="auth-consent" className="text-[11px] leading-tight select-none cursor-pointer" style={{ color: colors.textSecondary }}>
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

                {/* Submit Button */}
                <div className="sm:col-span-2 pt-1">
                  <button
                    type="submit"
                    disabled={loading || phone.length !== 10}
                    className="w-full h-11 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account & Start</span>
                        <ArrowRight className="w-4 h-4 flex-shrink-0" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="login-fields"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.textTertiary }}>
                    Email Address or Mobile Number
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3" style={{ color: colors.textTertiary }} />
                    <input
                      type="text"
                      required
                      placeholder="arjun@example.com or 9876543210"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.textTertiary }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] hover:opacity-80 transition-opacity flex items-center gap-1"
                      style={{ color: colors.textSecondary }}
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3" style={{ color: colors.textTertiary }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In to Web App</span>
                        <ArrowRight className="w-4 h-4 flex-shrink-0" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </SpotlightCard>
    </div>
  );
};

