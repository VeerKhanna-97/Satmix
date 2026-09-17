import React, { useState } from 'react';
import { X, ArrowDownLeft, ShieldCheck, CheckCircle2, Shield, Rocket, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BasketId } from '../../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { colors, user, selectedBasketId, simulateDeposit } = useApp();
  const [targetBasket, setTargetBasket] = useState<BasketId>(selectedBasketId || 'stable');
  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'IMPS'>('GPay');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedUtr, setGeneratedUtr] = useState('');

  if (!isOpen) return null;

  const handleDeposit = async () => {
    const amt = parseInt(amount, 10);
    if (isNaN(amt) || amt < 10) return;

    setLoading(true);
    const utr = `50${Date.now().toString().slice(-10)}`;
    setGeneratedUtr(utr);

    await simulateDeposit(amt, `UPI Instant · ${method}`, targetBasket);
    setLoading(false);
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setAmount('500');
    setGeneratedUtr('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden transition-all"
        style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}
      >
        {/* Header */}
        <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: colors.borderDim }}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm block" style={{ color: colors.textPrimary }}>Instant Capital Top-Up</span>
              <span className="text-[10px]" style={{ color: colors.textTertiary }}>One-time spot buy · No impact on daily SIP</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{ color: colors.textSecondary }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!success ? (
          <div className="p-6 space-y-5">
            {/* Target Strategy Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>
                Target Investment Basket
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetBasket('stable')}
                  className="p-3 rounded-2xl border text-left transition-all relative active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                  style={{
                    backgroundColor: targetBasket === 'stable' ? colors.mintTint : colors.surface,
                    borderColor: targetBasket === 'stable' ? colors.borderMint : colors.cardBorder,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>Stable Basket</span>
                    </div>
                    {targetBasket === 'stable' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <div className="text-[10px] font-mono" style={{ color: colors.textSecondary }}>85% USDT · 15% BTC</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetBasket('growth')}
                  className="p-3 rounded-2xl border text-left transition-all relative active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                  style={{
                    backgroundColor: targetBasket === 'growth' ? colors.accentTint : colors.surface,
                    borderColor: targetBasket === 'growth' ? colors.borderAccent : colors.cardBorder,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Rocket className="w-3.5 h-3.5" style={{ color: colors.accent }} />
                      <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>Growth Basket</span>
                    </div>
                    {targetBasket === 'growth' && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: colors.accent }} />}
                  </div>
                  <div className="text-[10px] font-mono" style={{ color: colors.textSecondary }}>70% BTC · 20% ETH · 10% SOL</div>
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                  Top-Up Amount (INR)
                </label>
                <span className="text-[10px]" style={{ color: colors.textTertiary }}>Min ₹10</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-lg font-bold font-mono" style={{ color: colors.textTertiary }}>₹</span>
                <input
                  type="number"
                  min="10"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl text-xl font-bold font-mono border focus:outline-none focus:ring-1 transition-all"
                  style={{ backgroundColor: colors.surface, borderColor: colors.cardBorder, color: colors.textPrimary }}
                />
              </div>

              {/* Preset Chips */}
              <div className="grid grid-cols-4 gap-2 mt-2.5">
                {['100', '500', '1000', '5000'].map((preset) => {
                  const isActive = amount === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className="h-8 rounded-lg text-xs font-bold font-mono border transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                      style={{
                        backgroundColor: isActive ? colors.accentTint : colors.surface,
                        borderColor: isActive ? colors.borderAccent : colors.cardBorder,
                        color: isActive ? colors.accent : colors.textSecondary,
                        boxShadow: isActive ? 'inset 0 1px 0 0 rgba(255,255,255,0.2)' : 'none',
                      }}
                    >
                      +₹{preset}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>
                Payment Gateway
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['GPay', 'PhonePe', 'Paytm', 'IMPS'].map((m) => {
                  const isSelected = method === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m as any)}
                      className="h-10 px-3.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                      style={{
                        backgroundColor: isSelected ? colors.accentTint : colors.surface,
                        borderColor: isSelected ? colors.borderAccent : colors.cardBorder,
                        color: isSelected ? colors.textPrimary : colors.textSecondary,
                      }}
                    >
                      <span>{m}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: colors.accent }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleDeposit}
              disabled={loading || !amount || parseInt(amount, 10) < 10}
              className="w-full h-12 px-6 rounded-xl font-bold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              style={{ backgroundColor: colors.primary, color: colors.primaryText }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Pay ₹{amount ? parseInt(amount, 10).toLocaleString('en-IN') : '0'} Instantly</span>
              )}
            </button>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border shadow-lg" style={{ backgroundColor: colors.mintTint, borderColor: colors.borderMint, color: colors.semanticSuccess }}>
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Top-Up Executed!</h3>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                ₹{parseInt(amount, 10).toLocaleString('en-IN')} allocated instantly into{' '}
                <strong style={{ color: colors.textPrimary }}>{targetBasket === 'stable' ? 'Stable Basket' : 'Growth Basket'}</strong>.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-3.5 rounded-2xl border text-left space-y-2 font-mono text-xs" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex justify-between">
                <span style={{ color: colors.textTertiary }}>Settled Amount:</span>
                <span className="font-bold" style={{ color: colors.textPrimary }}>₹{parseInt(amount, 10).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textTertiary }}>Target Basket:</span>
                <span className="font-bold" style={{ color: colors.accent }}>{targetBasket === 'stable' ? 'Stable Basket' : 'Growth Basket'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textTertiary }}>UTR Ref:</span>
                <span className="font-bold" style={{ color: colors.textPrimary }}>{generatedUtr || '502918273615'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textTertiary }}>Daily SIP Status:</span>
                <span className="font-bold text-emerald-500">Unchanged (Protected)</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full h-11 px-6 rounded-xl font-bold text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] mt-2 flex items-center justify-center transition-all hover:brightness-105 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
              style={{ backgroundColor: colors.primary, color: colors.primaryText }}
            >
              View Updated Portfolio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
