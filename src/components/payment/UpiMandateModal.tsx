import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';


interface UpiMandateModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyAmount: number;
}

export const UpiMandateModal: React.FC<UpiMandateModalProps> = ({ isOpen, onClose, dailyAmount }) => {
  const { colors, user, setupUpiMandate } = useApp();

  const [selectedApp, setSelectedApp] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'BHIM'>('GPay');
  const [vpa, setVpa] = useState(user?.vpa || 'veer@okhdfcbank');
  const [bankName, setBankName] = useState(user?.bankName || 'HDFC Bank');
  const [step, setStep] = useState<'details' | 'pin' | 'processing' | 'success'>('details');
  const [upiPin, setUpiPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [mandateConsent, setMandateConsent] = useState(true);

  // Close on Escape key press
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'processing') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step, onClose]);

  if (!isOpen) return null;

  const handleKeypadPress = (val: string) => {
    if (val === 'backspace') {
      setUpiPin((prev) => prev.slice(0, -1));
    } else if (upiPin.length < 4) {
      const nextPin = upiPin + val;
      setUpiPin(nextPin);
      if (nextPin.length === 4) {
        // Auto trigger NPCI mandate authorization
        setTimeout(async () => {
          setStep('processing');
          await setupUpiMandate(dailyAmount, vpa, bankName);
          setStep('success');
        }, 300);
      }
    }
  };

  const handleDone = () => {
    setStep('details');
    setUpiPin('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-label="NPCI UPI AutoPay Mandate Setup">
      <div
        className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all"
        style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}
      >
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: colors.borderDim }}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" style={{ color: colors.accent }} />
            <span className="font-bold text-sm" style={{ color: colors.textPrimary }}>
              NPCI UPI AutoPay Mandate
            </span>
          </div>
          {step !== 'processing' && (
            <button onClick={onClose} className="p-1 hover:opacity-80 transition-opacity" aria-label="Close Mandate Modal" style={{ color: colors.textSecondary }}>
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: Mandate Details */}
        {step === 'details' && (
          <div className="p-6 space-y-5 animate-fade-in">
            {/* Amount Callout */}
            <div className="p-4 rounded-2xl border text-center" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <span className="text-xs font-semibold" style={{ color: colors.textSecondary }}>Authorized Daily Auto-Debit</span>
              <div className="text-3xl font-extrabold font-mono mt-1" style={{ color: colors.textPrimary }}>
                ₹{dailyAmount}<span className="text-xs font-normal" style={{ color: colors.textTertiary }}>/day</span>
              </div>
              <span className="text-[11px] block mt-1" style={{ color: colors.textTertiary }}>Daily debit at 08:00 AM (09:00 AM Spot Buy Execution)</span>
            </div>

            {/* Select App */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>
                Select UPI App
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'GPay', desc: 'Google Pay' },
                  { name: 'PhonePe', desc: 'PhonePe UPI' },
                  { name: 'Paytm', desc: 'Paytm Wallet/UPI' },
                  { name: 'BHIM', desc: 'BHIM UPI' },
                ].map((app) => {
                  const isSelected = selectedApp === app.name;
                  return (
                    <button
                      key={app.name}
                      type="button"
                      onClick={() => setSelectedApp(app.name as any)}
                      className="p-3 rounded-xl border text-left flex items-center justify-between transition-all hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                      style={{
                        backgroundColor: isSelected ? colors.accentTint : colors.surface,
                        borderColor: isSelected ? colors.borderAccent : colors.cardBorder,
                      }}
                      aria-label={`Select ${app.name} for UPI AutoPay`}
                    >
                      <div>
                        <div className="text-xs font-bold" style={{ color: isSelected ? colors.textPrimary : colors.textSecondary }}>{app.name}</div>
                        <div className="text-[10px]" style={{ color: colors.textTertiary }}>{app.desc}</div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4" style={{ color: colors.accent }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bank Info */}
            <div className="p-3 rounded-xl border text-xs space-y-1" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>Linked Bank:</span>
                <span className="font-bold" style={{ color: colors.textPrimary }}>{bankName} (•••• 4129)</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>UPI ID (VPA):</span>
                <span className="font-mono" style={{ color: colors.accent }}>{vpa}</span>
              </div>
            </div>

            {/* Mandate Consent Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="mandate-consent"
                type="checkbox"
                checked={mandateConsent}
                onChange={(e) => setMandateConsent(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-gray-700 cursor-pointer accent-[#F7931A]"
              />
              <label htmlFor="mandate-consent" className="text-[11px] leading-tight select-none cursor-pointer" style={{ color: colors.textSecondary }}>
                I authorize a recurring daily UPI AutoPay mandate of ₹{dailyAmount}/day with zero lock-in (can be paused or revoked anytime).
              </label>
            </div>

            <button
              onClick={() => setStep('pin')}
              disabled={!mandateConsent}
              className="w-full h-12 px-6 rounded-xl font-bold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 transition-all hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              style={{ backgroundColor: colors.primary, color: colors.primaryText }}
            >
              <span>Proceed to Enter UPI PIN</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </button>
          </div>
        )}

        {/* STEP 2: Realistic UPI PIN Keypad */}
        {step === 'pin' && (
          <div className="p-6 space-y-6 animate-fade-in">
            <div className="text-center space-y-1">
              <span className="text-xs uppercase font-bold font-mono" style={{ color: colors.accent }}>Authenticating via NPCI</span>
              <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Enter 4-Digit UPI PIN</h3>
              <p className="text-xs" style={{ color: colors.textSecondary }}>Authorizing mandate for {user?.bankName || 'HDFC Bank'}</p>
            </div>

            {/* 4 PIN Dots */}
            <div className="flex items-center justify-center gap-4 py-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    upiPin.length > i ? 'scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: upiPin.length > i ? colors.accent : 'transparent',
                    borderColor: upiPin.length > i ? colors.accent : colors.borderDim,
                  }}
                />
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'backspace'].map((key, idx) => {
                if (key === '') return <div key={idx} />;
                return (
                  <button
                    key={idx}
                    onClick={() => handleKeypadPress(key)}
                    className="h-12 rounded-xl text-lg font-bold font-mono border active:scale-[0.96] hover:bg-white/5 flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textPrimary }}
                  >
                    {key === 'backspace' ? '⌫' : key}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Processing */}
        {step === 'processing' && (
          <div className="p-10 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full border-4 border-current border-t-transparent animate-spin mx-auto" style={{ color: colors.accent }} />
            <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Registering Mandate with NPCI...</h3>
            <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
              Communicating with {selectedApp} gateway and securing non-custodial recurring authorization.
            </p>
          </div>
        )}

        {/* STEP 4: Success Confetti View */}
        {step === 'success' && (
          <div className="p-8 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border shadow-lg" style={{ backgroundColor: colors.accentTint, borderColor: colors.borderAccent, color: colors.accent }}>
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold" style={{ color: colors.textPrimary }}>UPI AutoPay Mandate Active!</h3>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                Your daily micro-savings of <strong style={{ color: colors.textPrimary }}>₹{dailyAmount}</strong> is now automated.
              </p>
            </div>

            <div className="p-3 rounded-xl border text-xs text-left space-y-1 font-mono" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>UMN Number:</span>
                <span style={{ color: colors.accent }}>STMX{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>First Execution:</span>
                <span style={{ color: colors.semanticSuccess }}>Day 1 Credited (+1 Streak)</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full h-11 px-6 rounded-xl font-bold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              style={{ backgroundColor: colors.primary, color: colors.primaryText }}
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
