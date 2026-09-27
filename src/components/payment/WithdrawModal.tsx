import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  ArrowLeft,
  Building2,
  FileCheck,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Transaction } from '../../types';
import { BasketCurrencyIcons } from '../common/BasketCurrencyIcons';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WithdrawStep = 'AMOUNT' | 'PIN_AUTH' | 'PROCESSING' | 'SUCCESS';

const CRYPTO_LOGOS: Record<string, string> = {
  BTC: '/currencies/Bitcoin cursor.png',
  ETH: '/currencies/ethereum-eth-logo.png',
  SOL: '/currencies/Solana.png',
  USDT: '/currencies/USDT.png',
};

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const { colors, user, prototypeState, livePrices, simulateWithdrawal, setActiveTab } = useApp();

  const [step, setStep] = useState<WithdrawStep>('AMOUNT');
  const [sourceBasket, setSourceBasket] = useState<'all' | 'stable' | 'growth'>('all');
  const [amount, setAmount] = useState<string>('500');
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<string>('Initiating IMPS Rail...');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  // Compute live valuations for each basket
  const stableVal = useMemo(() => {
    const h = prototypeState.habits.stable?.holdings || { BTC: 0, ETH: 0, SOL: 0, USDT: 0 };
    return (h.BTC || 0) * livePrices.BTC + (h.ETH || 0) * livePrices.ETH + (h.SOL || 0) * livePrices.SOL + (h.USDT || 0) * livePrices.USDT;
  }, [prototypeState.habits.stable, livePrices]);

  const growthVal = useMemo(() => {
    const h = prototypeState.habits.growth?.holdings || { BTC: 0, ETH: 0, SOL: 0, USDT: 0 };
    return (h.BTC || 0) * livePrices.BTC + (h.ETH || 0) * livePrices.ETH + (h.SOL || 0) * livePrices.SOL + (h.USDT || 0) * livePrices.USDT;
  }, [prototypeState.habits.growth, livePrices]);

  const totalVal = Math.round((stableVal + growthVal) * 100) / 100;

  const availableBalance = useMemo(() => {
    if (sourceBasket === 'stable') return Math.floor(stableVal * 100) / 100;
    if (sourceBasket === 'growth') return Math.floor(growthVal * 100) / 100;
    return Math.floor(totalVal * 100) / 100;
  }, [sourceBasket, stableVal, growthVal, totalVal]);

  // Reset modal state and initialize amount whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('AMOUNT');
      setSourceBasket('all');
      setPin('');
      setPinError('');
      setErrorMsg('');
      setCompletedTx(null);

      const available = Math.floor(totalVal);
      if (available <= 0) {
        setAmount('0');
      } else if (available < 500) {
        setAmount(available.toString());
      } else {
        setAmount('500');
      }
    }
  }, [isOpen]);

  // Lock body and html scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen]);

  // Keyboard navigation (Escape key to close when not processing)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'PROCESSING') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step]);

  // Physical keyboard PIN entry during PIN_AUTH step
  useEffect(() => {
    if (!isOpen || step !== 'PIN_AUTH') return;
    const handlePinKeys = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        setPin((prev) => (prev.length < 4 ? prev + e.key : prev));
        setPinError('');
      } else if (e.key === 'Backspace') {
        setPin((prev) => prev.slice(0, -1));
        setPinError('');
      }
    };
    window.addEventListener('keydown', handlePinKeys);
    return () => window.removeEventListener('keydown', handlePinKeys);
  }, [isOpen, step]);

  if (!isOpen) return null;

  const numAmount = parseInt(amount, 10) || 0;
  const netPayout = numAmount;

  // Pro-rata breakdown when 'all' is selected
  const liquidationBreakdown = useMemo(() => {
    if (numAmount <= 0 || availableBalance <= 0) return null;
    if (sourceBasket === 'all') {
      const ratio = Math.min(1, numAmount / (totalVal || 1));
      const sAmt = Math.round(stableVal * ratio);
      const gAmt = Math.round(growthVal * ratio);
      return {
        stablePart: sAmt,
        growthPart: gAmt,
      };
    }
    return null;
  }, [numAmount, availableBalance, sourceBasket, stableVal, growthVal, totalVal]);

  // Quick Preset Handlers
  const handlePreset = (percentage: number) => {
    setErrorMsg('');
    const target = Math.floor(availableBalance * (percentage / 100));
    setAmount(Math.max(1, target).toString());
  };

  const handleStepUp = () => {
    setErrorMsg('');
    const cur = parseInt(amount, 10) || 0;
    const max = Math.floor(availableBalance);
    const next = Math.min(max, cur + 100);
    setAmount(next.toString());
  };

  const handleStepDown = () => {
    setErrorMsg('');
    const cur = parseInt(amount, 10) || 0;
    const next = Math.max(0, cur - 100);
    setAmount(next.toString());
  };

  // Step 1: Proceed from Amount selection to PIN Auth
  const handleProceedToPin = () => {
    setErrorMsg('');
    if (availableBalance <= 0) {
      setErrorMsg('Your selected basket balance is currently ₹0.');
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

    setStep('PROCESSING');
    setProcessingStatus('Matching spot order liquidation...');

    await new Promise((resolve) => setTimeout(resolve, 600));
    setProcessingStatus('Routing to NPCI 24/7 IMPS Payout Rail...');

    await new Promise((resolve) => setTimeout(resolve, 600));
    setProcessingStatus('Awaiting beneficiary bank acknowledgement...');

    try {
      const result = await simulateWithdrawal(numAmount, sourceBasket);
      if (result.success && result.tx) {
        setCompletedTx(result.tx);
        setStep('SUCCESS');
      } else {
        setErrorMsg(result.error || 'Failed to process payout. Please try again.');
        setStep('AMOUNT');
      }
    } catch (err: any) {
      console.error('Withdrawal error:', err);
      setErrorMsg(err?.message || 'Failed to execute payout. Please try again.');
      setStep('AMOUNT');
    }
  };

  const handleClose = () => {
    setStep('AMOUNT');
    setPin('');
    setErrorMsg('');
    setCompletedTx(null);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-3xl backdrop-saturate-150 animate-fade-in overflow-hidden"
      onClick={() => {
        if (step !== 'PROCESSING') handleClose();
      }}
    >
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300"
        style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── MODAL HEADER ── */}
        <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: colors.borderDim }}>
          <div className="flex items-center gap-2.5">
            {step === 'PIN_AUTH' && (
              <button
                onClick={() => setStep('AMOUNT')}
                className="p-1 rounded-lg hover:opacity-80 transition-opacity mr-1"
                style={{ color: colors.textSecondary }}
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm block" style={{ color: colors.textPrimary }}>
                {step === 'PIN_AUTH'
                  ? 'Authorize Withdrawal'
                  : step === 'SUCCESS'
                  ? 'Withdrawal Disbursed'
                  : 'Instant INR Bank Payout'}
              </span>
              <span className="text-[10px] font-mono" style={{ color: colors.textTertiary }}>
                {step === 'PIN_AUTH'
                  ? '4-Digit Security PIN'
                  : step === 'SUCCESS'
                  ? 'IMPS Settlement Verified'
                  : '24/7 NPCI IMPS Transfer · Zero Fee'}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl hover:opacity-80 transition-opacity"
            style={{ color: colors.textSecondary }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── STEP 1: AMOUNT SELECTION ── */}
        {step === 'AMOUNT' && (
          <div className="p-5 space-y-4">
            {totalVal <= 0 ? (
              /* Empty Portfolio State */
              <div className="p-6 text-center space-y-3 rounded-2xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto" style={{ backgroundColor: colors.card, color: colors.textTertiary }}>
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: colors.textPrimary }}>No Balance Available</h4>
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    Your portfolio balance is currently ₹0. Top up capital or start your daily SIP habit to accumulate units.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveTab('invest');
                  }}
                  className="h-9 px-4 rounded-xl text-xs font-bold transition-all hover:brightness-105 active:scale-[0.98] mt-1"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  Start Daily SIP
                </button>
              </div>
            ) : (
              <>
                {/* Source Basket Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textSecondary }}>
                    Source Investment Basket
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'all', label: 'All Baskets', val: totalVal, icon: null },
                      { id: 'stable', label: 'Stable', val: stableVal, icon: 'stable' as const },
                      { id: 'growth', label: 'Growth', val: growthVal, icon: 'growth' as const },
                    ].map((b) => {
                      const isSelected = sourceBasket === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setSourceBasket(b.id as any);
                            setErrorMsg('');
                            const newAvail = Math.floor(b.val);
                            if (numAmount > newAvail) setAmount(newAvail.toString());
                          }}
                          className="p-2 rounded-xl border text-center transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                          style={{
                            backgroundColor: isSelected ? colors.accentTint : colors.surface,
                            borderColor: isSelected ? colors.borderAccent : colors.cardBorder,
                          }}
                        >
                          <div className="flex items-center justify-center gap-1 mb-0.5">
                            {b.icon && <BasketCurrencyIcons basketId={b.icon} size="xs" />}
                            <span className="font-bold text-[11px]" style={{ color: isSelected ? colors.accent : colors.textPrimary }}>
                              {b.label}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono block" style={{ color: colors.textSecondary }}>
                            ₹{Math.floor(b.val).toLocaleString('en-IN')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Balance Notice */}
                <div className="flex justify-between items-center text-xs px-3.5 py-2.5 rounded-xl border" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                  <span style={{ color: colors.textSecondary }}>Available to Withdraw:</span>
                  <span className="font-extrabold font-mono text-sm" style={{ color: colors.textPrimary }}>
                    ₹{availableBalance.toLocaleString('en-IN')}{Number.isInteger(availableBalance) ? '.00' : ''}
                  </span>
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Amount Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textSecondary }}>
                    Withdrawal Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-base font-bold font-mono pointer-events-none" style={{ color: colors.textTertiary }}>₹</span>
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
                      className="w-full pl-8 pr-11 py-2 rounded-xl text-lg font-bold font-mono border focus:outline-none focus:ring-1 transition-all"
                      style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                    {/* Custom Sleek Stepper Controls */}
                    <div
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col items-center border rounded-lg overflow-hidden shadow-xs"
                      style={{ borderColor: colors.borderDim, backgroundColor: colors.card }}
                    >
                      <button
                        type="button"
                        onClick={handleStepUp}
                        className="w-6 h-3.5 flex items-center justify-center hover:opacity-100 hover:bg-white/10 transition-all border-b active:scale-90"
                        style={{ color: colors.textSecondary, borderColor: colors.borderDim }}
                        aria-label="Increase amount"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={handleStepDown}
                        className="w-6 h-3.5 flex items-center justify-center hover:opacity-100 hover:bg-white/10 transition-all active:scale-90"
                        style={{ color: colors.textSecondary }}
                        aria-label="Decrease amount"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Preset Percentage Buttons */}
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handlePreset(pct)}
                        className="h-7 rounded-lg text-xs font-bold font-mono border transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                        style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textSecondary }}
                      >
                        {pct === 100 ? 'MAX (100%)' : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pro-Rata Liquidation Notice if All Baskets */}
                {liquidationBreakdown && (
                  <div className="p-2.5 rounded-xl border text-[11px] font-mono flex items-center justify-between" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                    <span style={{ color: colors.textSecondary }}>Pro-Rata Liquidation:</span>
                    <span style={{ color: colors.textPrimary }}>
                      Stable: ₹{liquidationBreakdown.stablePart} · Growth: ₹{liquidationBreakdown.growthPart}
                    </span>
                  </div>
                )}

                {/* Payout Breakdown & Destination Bank Account */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border text-xs space-y-1 font-mono" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                    <div className="flex justify-between items-center text-[10px]" style={{ color: colors.textSecondary }}>
                      <span>Exit Load:</span>
                      <span className="font-bold text-emerald-500">₹0 (Zero Fee)</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1 border-t font-bold" style={{ borderColor: colors.borderDim }}>
                      <span className="text-[11px]" style={{ color: colors.textPrimary }}>Net Payout:</span>
                      <span className="font-mono text-sm font-extrabold" style={{ color: colors.accent }}>₹{netPayout.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border text-xs flex items-center gap-2" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center border flex-shrink-0" style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}>
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="text-[9px] block text-emerald-500 font-mono font-bold">IMPS 24/7 VERIFIED</span>
                      <span className="font-bold text-[11px] block truncate" style={{ color: colors.textPrimary }}>{user?.bankName || 'HDFC Bank'} · {user?.bankAccountMasked || '•••• 4129'}</span>
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleProceedToPin}
                  disabled={availableBalance <= 0 || numAmount <= 0 || numAmount > availableBalance}
                  className="w-full h-11 px-5 rounded-xl font-bold text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                  style={{ backgroundColor: colors.primary, color: colors.primaryText }}
                >
                  <span>Proceed to Payout · ₹{netPayout.toLocaleString('en-IN')}</span>
                  <ArrowUpRight className="w-4 h-4 flex-shrink-0" />
                </button>
              </>
            )}
          </div>
        )}

        {/* ── STEP 2: 4-DIGIT SECURITY PIN AUTH ── */}
        {step === 'PIN_AUTH' && (
          <div className="p-5 space-y-4 text-center animate-fade-in">
            <div className="w-10 h-10 rounded-xl border flex items-center justify-center mx-auto" style={{ backgroundColor: colors.accentTint, color: colors.accent, borderColor: colors.borderAccent }}>
              <Lock className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>Enter 4-Digit Security PIN</h3>
              <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                Authorize ₹{netPayout.toLocaleString('en-IN')} IMPS transfer to {user?.bankName || 'HDFC Bank'}
              </p>
            </div>

            {/* Discreet Demo Helper Badge */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg border flex items-center gap-1.5" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textTertiary }}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Demo PIN: <strong>1234</strong></span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setPin('1234');
                  setPinError('');
                }}
                className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-lg border transition-opacity hover:opacity-80"
                style={{ backgroundColor: colors.accentTint, borderColor: colors.borderAccent, color: colors.accent }}
              >
                Auto-Fill 1234
              </button>
            </div>

            {pinError && (
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {/* PIN Input & Dot Visualizer */}
            <div className="space-y-3">
              <div className="flex justify-center gap-3">
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pin.length > idx;
                  return (
                    <div
                      key={idx}
                      className="w-10 h-12 rounded-xl border flex items-center justify-center text-lg font-bold font-mono transition-all"
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

              {/* Compact On-Screen Keypad */}
              <div className="grid grid-cols-3 gap-1.5 max-w-[240px] mx-auto pt-1">
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
                    className="h-9 rounded-lg border text-sm font-bold font-mono active:scale-[0.96] hover:bg-white/5 transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textPrimary }}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Auth */}
            <button
              onClick={handleConfirmPin}
              disabled={pin.length !== 4}
              className="w-full h-11 px-5 rounded-xl font-bold text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              style={{ backgroundColor: colors.primary, color: colors.primaryText }}
            >
              <span>Authorize & Disburse Payout</span>
            </button>
          </div>
        )}

        {/* ── STEP 3: PROCESSING SPINNER ── */}
        {step === 'PROCESSING' && (
          <div className="p-8 text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full border-3 border-current border-t-transparent animate-spin mx-auto" style={{ color: colors.accent }} />
            <div>
              <h3 className="text-base font-bold" style={{ color: colors.textPrimary }}>Processing Instant Payout</h3>
              <p className="text-xs font-mono mt-1 animate-pulse" style={{ color: colors.accent }}>
                {processingStatus}
              </p>
            </div>
            <div className="p-2.5 rounded-xl border text-xs font-mono max-w-xs mx-auto" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim, color: colors.textSecondary }}>
              Amount: ₹{netPayout.toLocaleString('en-IN')} · IMPS 24/7 Rail
            </div>
          </div>
        )}

        {/* ── STEP 4: SUCCESS RECEIPT ── */}
        {step === 'SUCCESS' && (
          <div className="p-6 space-y-4 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto border shadow-lg" style={{ backgroundColor: colors.mintTint, borderColor: colors.borderMint, color: colors.semanticSuccess }}>
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono" style={{ backgroundColor: colors.mintTint, color: colors.semanticSuccess }}>
                IMPS Payout Settled
              </span>
              <h3 className="text-xl font-bold mt-1" style={{ color: colors.textPrimary }}>
                ₹{netPayout.toLocaleString('en-IN')} Disbursed
              </h3>
              <p className="text-xs mt-0.5" style={{ color: colors.textSecondary }}>
                Transferred directly to your linked {user?.bankName || 'HDFC Bank'} account.
              </p>
            </div>

            {/* Official Receipt Card */}
            <div className="p-3.5 rounded-2xl border text-xs text-left space-y-2 font-mono" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>IMPS UTR Number:</span>
                <span className="font-bold" style={{ color: colors.accent }}>
                  {completedTx?.utrNumber || `50${Date.now().toString().slice(-10)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>Source Basket:</span>
                <span style={{ color: colors.textPrimary }}>
                  {completedTx?.basketName || (sourceBasket === 'stable' ? 'Stable Basket' : sourceBasket === 'growth' ? 'Growth Basket' : 'All Baskets')}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textSecondary }}>Disbursed Amount:</span>
                <span className="font-bold" style={{ color: colors.textPrimary }}>₹{netPayout.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-1.5 border-t flex justify-between" style={{ borderColor: colors.borderDim }}>
                <span style={{ color: colors.textSecondary }}>Beneficiary Bank:</span>
                <span className="truncate" style={{ color: colors.textPrimary }}>{user?.bankName || 'HDFC Bank'} {user?.bankAccountMasked || '•••• 4129'}</span>
              </div>
            </div>

            {/* Navigation CTAs */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleClose}
                className="w-full h-11 px-5 rounded-xl font-bold text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                Back to Dashboard
              </button>

              <button
                onClick={() => {
                  handleClose();
                  setActiveTab('profile');
                }}
                className="w-full h-9 px-4 rounded-xl text-xs font-semibold hover:bg-white/5 transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{ color: colors.textSecondary }}
              >
                <FileCheck className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                <span>View Daily Debits Ledger in Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
