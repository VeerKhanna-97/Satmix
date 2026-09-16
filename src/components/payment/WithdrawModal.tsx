import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowLeft,
  Building2,
  Receipt,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { verifyPin } from '../../utils/crypto';
import { Transaction } from '../../types';
import { Magnet } from '../ui';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WithdrawStep = 'AMOUNT' | 'PIN_AUTH' | 'PROCESSING' | 'SUCCESS';

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { colors, user, portfolioSummary, simulateWithdrawal, setActiveTab } = useApp();

  const [step, setStep] = useState<WithdrawStep>('AMOUNT');
  const [amount, setAmount] = useState<string>('500');
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<string>('Initiating IMPS Rail...');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  // Set smart default amount on open and add Escape key listener
  useEffect(() => {
    if (isOpen) {
      setStep('AMOUNT');
      setPin('');
      setPinError('');
      setErrorMsg('');
      setCompletedTx(null);

      const available = Math.floor(portfolioSummary.currentValue);
      if (available <= 0) {
        setAmount('0');
      } else if (available < 500) {
        setAmount(available.toString());
      } else {
        setAmount('500');
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && step !== 'PROCESSING') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, portfolioSummary.currentValue, step, onClose]);

  if (!isOpen) return null;

  const availableBalance = Math.floor(portfolioSummary.currentValue * 100) / 100;
  const numAmount = parseInt(amount, 10) || 0;
  const tdsDeduction = Math.round(numAmount * 0.01 * 100) / 100;
  const netPayout = Math.max(0, Math.round((numAmount - tdsDeduction) * 100) / 100);

  // Quick Preset Handlers
  const handlePreset = (percentage: number) => {
    setErrorMsg('');
    const target = Math.floor(availableBalance * (percentage / 100));
    setAmount(Math.max(1, target).toString());
  };

  // Step 1: Proceed from Amount selection to PIN Auth
  const handleProceedToPin = () => {
    setErrorMsg('');
    if (availableBalance <= 0) {
      setErrorMsg('Your portfolio balance is currently ₹0.');
      return;
    }
    if (numAmount <= 0) {
      setErrorMsg('Please enter a valid withdrawal amount.');
      return;
    }
    const minRequired = availableBalance < 10 ? availableBalance : 10;
    if (numAmount < minRequired) {
      setErrorMsg(`Minimum withdrawal amount is ₹${minRequired}.`);
      return;
    }
    if (numAmount > availableBalance) {
      setErrorMsg(`Amount exceeds available balance of ₹${availableBalance.toLocaleString('en-IN')}.`);
      return;
    }

    setPin('');
    setPinError('');
    setStep('PIN_AUTH');
  };

  // Step 2: Confirm PIN & Execute Instant IMPS Disbursal
  const handleConfirmPin = async () => {
    if (pin.length !== 4) {
      setPinError('Please enter your 4-digit Security PIN');
      return;
    }

    // Verify PIN against stored hash (with demo fallback if user created before PIN feature)
    let isPinValid = false;
    if (user?.pinHash) {
      isPinValid = await verifyPin(pin, user.pinHash);
    } else {
      isPinValid = true; // Fallback for demo users
    }

    if (!isPinValid) {
      setPinError('Incorrect 4-digit PIN. Please try again.');
      setPin('');
      return;
    }

    // PIN Valid: Move to Processing Animation
    setStep('PROCESSING');
    setProcessingStatus('Routing spot sell order via CoinDCX API...');

    await new Promise((resolve) => setTimeout(resolve, 500));
    setProcessingStatus('Deducting 1% TDS u/s 194S & generating Sec 115BBH gain record...');

    await new Promise((resolve) => setTimeout(resolve, 500));
    setProcessingStatus('Connecting to NPCI IMPS Payout Gateway...');

    const result = await simulateWithdrawal(numAmount);
    if (result.success && result.tx) {
      setCompletedTx(result.tx);
      setStep('SUCCESS');
    } else {
      setErrorMsg(result.error || 'Failed to process payout. Please try again.');
      setStep('AMOUNT');
    }
  };

  const handleClose = () => {
    setStep('AMOUNT');
    setPin('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300"
        style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}
      >
        {/* ── MODAL HEADER ── */}
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: colors.borderDim }}>
          <div className="flex items-center gap-2.5">
            {step === 'PIN_AUTH' && (
              <button
                onClick={() => setStep('AMOUNT')}
                className="p-1 rounded-lg hover:opacity-80 transition-opacity mr-1"
                style={{ color: colors.textSecondary }}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm block" style={{ color: colors.textPrimary }}>
                {step === 'PIN_AUTH' ? 'Authorize Withdrawal' : 'Instant INR Bank Payout'}
              </span>
              <span className="text-[10px] font-mono" style={{ color: colors.textTertiary }}>
                {step === 'PIN_AUTH' ? '4-Digit Security PIN' : '24/7 NPCI IMPS Transfer'}
              </span>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-xl hover:opacity-80 transition-opacity" style={{ color: colors.textSecondary }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── STEP 1: AMOUNT SELECTION ── */}
        {step === 'AMOUNT' && (
          <div className="p-6 space-y-5">
            {/* Available Balance Notice */}
            <div className="flex justify-between items-center text-xs p-3.5 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <span style={{ color: colors.textSecondary }}>Available to Withdraw:</span>
              <span className="font-extrabold font-mono text-sm" style={{ color: colors.textPrimary }}>
                ₹{availableBalance.toLocaleString('en-IN')}{Number.isInteger(availableBalance) ? '.00' : ''}
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>
                Withdrawal Amount (INR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-lg font-bold font-mono" style={{ color: colors.textTertiary }}>₹</span>
                <input
                  type="number"
                  min="1"
                  max={availableBalance}
                  value={amount}
                  onChange={(e) => {
                    setErrorMsg('');
                    setAmount(e.target.value);
                  }}
                  placeholder="0"
                  className="w-full pl-9 pr-4 py-3.5 rounded-2xl text-xl font-bold font-mono border focus:outline-none focus:ring-1 transition-all"
                  style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                />
              </div>

              {/* Quick Preset Percentage Buttons */}
              <div className="grid grid-cols-4 gap-2 mt-2.5">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePreset(pct)}
                    className="py-1.5 px-2 rounded-xl text-xs font-bold font-mono border transition-all hover:opacity-80 active:scale-95"
                    style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textSecondary }}
                  >
                    {pct === 100 ? 'MAX' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout & Tax Breakdown (1% TDS u/s 194S) */}
            <div className="p-4 rounded-2xl border text-xs space-y-2.5" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex justify-between items-center">
                <span style={{ color: colors.textSecondary }}>Gross Sale Amount:</span>
                <span className="font-mono" style={{ color: colors.textPrimary }}>₹{numAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: colors.textSecondary }}>Platform Exit Load:</span>
                <span className="font-bold" style={{ color: colors.accent }}>₹0 (Zero Fee)</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1" style={{ color: colors.textSecondary }}>
                  <span>1% TDS (Sec 194S):</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>Credited in Tax Form</span>
                </div>
                <span className="font-mono" style={{ color: colors.accent }}>-₹{tdsDeduction.toFixed(2)}</span>
              </div>
              <div className="pt-2.5 border-t flex justify-between items-baseline font-bold" style={{ borderColor: colors.borderDim }}>
                <span style={{ color: colors.textPrimary }}>Net IMPS Bank Payout:</span>
                <span className="font-mono text-base font-extrabold" style={{ color: colors.accent }}>₹{netPayout.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Destination Bank Account */}
            <div className="p-3.5 rounded-2xl border text-xs flex justify-between items-center" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] block" style={{ color: colors.textTertiary }}>Payout Bank Account</span>
                  <span className="font-bold block mt-0.5" style={{ color: colors.textPrimary }}>{user?.bankName || 'HDFC Bank'} · {user?.bankAccountMasked || '•••• 4129'}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono tracking-wider" style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}>
                VERIFIED
              </span>
            </div>

            {/* Next Button */}
            <Magnet strength={0.15} className="w-full block">
              <button
                onClick={handleProceedToPin}
                disabled={availableBalance <= 0 || numAmount <= 0 || numAmount > availableBalance}
                className="w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <span>Proceed to Payout · ₹{netPayout.toLocaleString('en-IN')}</span>
                <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
              </button>
            </Magnet>
          </div>
        )}

        {/* ── STEP 2: 4-DIGIT SECURITY PIN AUTH ── */}
        {step === 'PIN_AUTH' && (
          <div className="p-6 space-y-6 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto" style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}>
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Enter 4-Digit Security PIN</h3>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                Authorize ₹{netPayout.toLocaleString('en-IN')} instant IMPS transfer to {user?.bankName || 'HDFC Bank'}
              </p>
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {/* PIN Input & Dot Visualizer */}
            <div className="space-y-4">
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pin.length > idx;
                  return (
                    <div
                      key={idx}
                      className="w-12 h-14 rounded-2xl border flex items-center justify-center text-xl font-bold font-mono transition-all"
                      style={{
                        backgroundColor: isFilled ? colors.accentTint : colors.surface,
                        borderColor: isFilled ? colors.borderAccent : colors.cardBorder,
                        color: isFilled ? colors.accent : colors.textTertiary,
                      }}
                    >
                      {isFilled ? '•' : ''}
                    </div>
                  );
                })}
              </div>

              {/* Hidden Real Input for Keyboard focus */}
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setPin(val);
                  setPinError('');
                }}
                className="opacity-0 absolute -z-10"
              />

              {/* Quick On-Screen Keypad for Touch / Mouse */}
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setPinError('');
                      if (k === 'C') setPin('');
                      else if (k === '⌫') setPin((prev) => prev.slice(0, -1));
                      else setPin((prev) => (prev.length < 4 ? prev + k : prev));
                    }}
                    className="py-3 rounded-xl border text-sm font-bold font-mono hover:opacity-80 active:scale-95 transition-all"
                    style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textPrimary }}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Auth */}
            <Magnet strength={0.15} className="w-full block">
              <button
                onClick={handleConfirmPin}
                disabled={pin.length !== 4}
                className="w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                <span>Authorize & Disburse Payout</span>
              </button>
            </Magnet>
          </div>
        )}

        {/* ── STEP 3: PROCESSING SPINNER ── */}
        {step === 'PROCESSING' && (
          <div className="p-10 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full border-4 border-current border-t-transparent animate-spin mx-auto" style={{ color: colors.accent }} />
            <div>
              <h3 className="text-lg font-bold" style={{ color: colors.textPrimary }}>Processing Instant Payout</h3>
              <p className="text-xs font-mono mt-1 animate-pulse" style={{ color: colors.accent }}>
                {processingStatus}
              </p>
            </div>
            <div className="p-3 rounded-xl border text-xs font-mono max-w-xs mx-auto" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textSecondary }}>
              Amount: ₹{netPayout.toLocaleString('en-IN')} · IMPS 24/7 Rail
            </div>
          </div>
        )}

        {/* ── STEP 4: SUCCESS RECEIPT ── */}
        {step === 'SUCCESS' && completedTx && (
          <div className="p-6 space-y-5 text-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border shadow-lg" style={{ backgroundColor: colors.accentTint, borderColor: colors.borderAccent, color: colors.accent }}>
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border font-mono" style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}>
                IMPS Payout Settled
              </span>
              <h3 className="text-xl font-extrabold mt-1.5" style={{ color: colors.textPrimary }}>
                ₹{netPayout.toLocaleString('en-IN')} Disbursed
              </h3>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                Transferred directly to your linked {user?.bankName || 'HDFC Bank'} account.
              </p>
            </div>

            {/* Official Receipt Card */}
            <div className="p-4 rounded-2xl border text-xs text-left space-y-2.5 font-mono" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>IMPS UTR Number:</span>
                <span className="font-bold" style={{ color: colors.accent }}>{completedTx.utrNumber}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>Gross Liquidation:</span>
                <span style={{ color: colors.textPrimary }}>₹{completedTx.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>1% TDS (Sec 194S):</span>
                <span style={{ color: colors.accent }}>-₹{tdsDeduction.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>Net Bank Payout:</span>
                <span className="font-bold" style={{ color: colors.accent }}>₹{netPayout.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t flex justify-between" style={{ borderColor: colors.borderDim }}>
                <span style={{ color: colors.textSecondary }}>Destination:</span>
                <span className="truncate" style={{ color: colors.textPrimary }}>{user?.bankName || 'HDFC Bank'} {user?.bankAccountMasked || '•••• 4129'}</span>
              </div>
            </div>

            {/* Navigation CTAs */}
            <div className="space-y-2">
              <Magnet strength={0.15} className="w-full block">
                <button
                  onClick={handleClose}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center transition-all active:scale-95"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  Back to Dashboard
                </button>
              </Magnet>

              <button
                onClick={() => {
                  handleClose();
                  setActiveTab('profile');
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity flex items-center justify-center gap-1.5"
                style={{ color: colors.textSecondary }}
              >
                <FileCheck className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                <span>View in Tax & TDS Reports</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
