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
    } else {
      if (name.trim().length < 2) {
        setErrorMsg('Please enter your legal full name');
        return;
      }

      const cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        setErrorMsg('Please enter a valid email address');
        return;
      }

      const cleanPhoneDigits = phone.replace(/\D/g, '').slice(-10);
      if (phone && (cleanPhoneDigits.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhoneDigits))) {
        setErrorMsg('Please enter a valid 10-digit Indian mobile number');
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
    <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden" style={{ backgroundColor: colors.bg }}>
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-20 animate-ambient-glow"
        style={{ background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)` }}
      />

      <SpotlightCard
        spotlightColor={colors.accentTint}
        className="w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-8 backdrop-blur-2xl relative z-10 animate-fade-in"
        style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
      >
        {/* Top Navigation Back */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setViewMode('marketing')}
            className="text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{ color: colors.textSecondary }}
          >
            ← Back to Website
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl mx-auto mb-3 overflow-hidden border p-0.5" style={{ borderColor: colors.borderDim }}>
            <img src="/assets/images/satmix-logo.jpg" alt="Satmix Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: colors.textPrimary }}>
            {isLogin ? 'Welcome Back to Satmix' : 'Create Your Satmix Account'}
          </h2>
          <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
            {isLogin
              ? 'Enter your registered email address & password'
              : 'Sign up to start automated daily crypto micro-investing'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl mb-6 relative" style={{ backgroundColor: colors.surface }}>
          <button
            onClick={() => {
              setAuthSubView('login');
              setErrorMsg('');
            }}
            className="flex-1 py-2 text-xs font-bold rounded-lg transition-all relative z-10"
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
            className="flex-1 py-2 text-xs font-bold rounded-lg transition-all relative z-10"
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
            className="p-3 rounded-xl mb-5 flex items-start gap-2.5 text-xs font-medium border"
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin ? (
              <motion.div
                key="signup-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textTertiary }}>
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5" style={{ color: colors.textTertiary }} />
                    <input
                      type="text"
                      required
                      placeholder="Arjun Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textTertiary }}>
                    Mobile Number (for UPI AutoPay linking)
                  </label>
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
                      required
                      maxLength={10}
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-20 pr-4 py-3 rounded-xl text-sm font-mono border focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textTertiary }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5" style={{ color: colors.textTertiary }} />
                    <input
                      type="email"
                      required
                      placeholder="arjun@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="login-fields"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textTertiary }}>
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5" style={{ color: colors.textTertiary }} />
                  <input
                    type="text"
                    required
                    placeholder="arjun@example.com or 9876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-1 transition-all"
                    style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.textTertiary }}>
                Password (min 6 characters)
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] hover:opacity-80 transition-opacity flex items-center gap-1"
                style={{ color: colors.textSecondary }}
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5" style={{ color: colors.textTertiary }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-1 transition-all"
                style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-4"
              >
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textTertiary }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5" style={{ color: colors.textTertiary }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                  </div>
                </div>

                {/* Terms and Privacy Consent */}
                <div className="flex items-start gap-2 pt-1">
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
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 px-6 rounded-xl font-bold text-sm tracking-wide shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 flex items-center justify-center gap-2 mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
            style={{ backgroundColor: colors.primary, color: colors.primaryText }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In to Web App' : 'Create Account & Start'}</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
              </>
            )}
          </button>
        </form>
      </SpotlightCard>
    </div>
  );
};

