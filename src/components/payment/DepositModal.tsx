import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowDownLeft, CheckCircle2, CreditCard, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BasketId } from '../../types';
import { BasketCurrencyIcons } from '../common/BasketCurrencyIcons';
import { getBasketById } from '../../data/baskets';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CRYPTO_LOGOS: Record<string, string> = {
  BTC: '/currencies/Bitcoin cursor.png',
  ETH: '/currencies/ethereum-eth-logo.png',
  SOL: '/currencies/Solana.png',
  USDT: '/currencies/USDT.png',
};

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const { colors, selectedBasketId, simulateDeposit, livePrices, themeMode } = useApp();
  const [targetBasket, setTargetBasket] = useState<BasketId>(selectedBasketId || 'stable');
  const [amount, setAmount] = useState('500');
  const [method, setMethod] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'IMPS'>('GPay');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [generatedUtr, setGeneratedUtr] = useState('');

  const minAmount = targetBasket === 'growth' ? 30 : 10;
  const numAmount = parseInt(amount, 10) || 0;
  const basketDef = getBasketById(targetBasket);

  const presets = useMemo(() => {
    return targetBasket === 'stable' ? ['50', '100', '500', '1000'] : ['100', '300', '500', '2000'];
  }, [targetBasket]);

  // Live estimated fills preview based on live coin spot prices
  const estimatedFills = useMemo(() => {
    if (numAmount < minAmount) return [];
    return basketDef.allocation.map((alloc) => {
      const inrShare = numAmount * (alloc.pct / 100);
      const price =
        alloc.ticker === 'BTC'
          ? livePrices.BTC
          : alloc.ticker === 'ETH'
          ? livePrices.ETH
          : alloc.ticker === 'SOL'
          ? livePrices.SOL
          : livePrices.USDT;

      const units = price > 0 ? inrShare / price : 0;
      return {
        asset: alloc.ticker,
        label: alloc.label,
        pct: alloc.pct,
        inrShare,
        units,
        price,
        logo: CRYPTO_LOGOS[alloc.ticker] || '/currencies/bitcoin.png',
        color:
          alloc.ticker === 'USDT'
            ? '#26a17b'
            : alloc.ticker === 'BTC'
            ? '#f7931b'
            : alloc.ticker === 'ETH'
            ? themeMode === 'light'
              ? '#0F172A'
              : '#ffffff'
            : '#9945fe',
      };
    });
  }, [numAmount, minAmount, basketDef, livePrices, themeMode]);

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

  if (!isOpen) return null;

  const handleDeposit = async () => {
    if (isNaN(numAmount) || numAmount < minAmount) return;

    setLoading(true);
    const utr = `50${Date.now().toString().slice(-10)}`;
    setGeneratedUtr(utr);

    await simulateDeposit(numAmount, `UPI Instant · ${method}`, targetBasket);
    setLoading(false);
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setAmount('500');
    setGeneratedUtr('');
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-3xl backdrop-saturate-150 animate-fade-in overflow-hidden"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden transition-all duration-200"
        style={{ backgroundColor: colors.cardHigh, borderColor: colors.cardBorder }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: colors.borderDim }}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl" style={{ backgroundColor: colors.accentTint, color: colors.accent }}>
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm block" style={{ color: colors.textPrimary }}>Instant Capital Top-Up</span>
              <span className="text-[10px] font-mono" style={{ color: colors.textTertiary }}>Spot Buy · Zero Impact on Recurring SIP</span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:opacity-80 transition-opacity"
            style={{ color: colors.textSecondary }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!success ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left Section (Controls) */}
            <div className="md:col-span-7 space-y-4">
              {/* Target Strategy Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: colors.textSecondary }}>
                  Target Investment Basket
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetBasket('stable');
                      if (numAmount < 10) setAmount('10');
                    }}
                    className="p-2.5 rounded-2xl border text-left transition-all relative active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    style={{
                      backgroundColor: targetBasket === 'stable' ? colors.mintTint : colors.surface,
                      borderColor: targetBasket === 'stable' ? colors.borderMint : colors.cardBorder,
                    }}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <BasketCurrencyIcons basketId="stable" size="xs" />
                        <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>Stable Basket</span>
                      </div>
                      {targetBasket === 'stable' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                    <div className="text-[10px] font-mono" style={{ color: colors.textSecondary }}>85% USDT · 15% BTC</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetBasket('growth');
                      if (numAmount < 30) setAmount('30');
                    }}
                    className="p-2.5 rounded-2xl border text-left transition-all relative active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                    style={{
                      backgroundColor: targetBasket === 'growth' ? colors.accentTint : colors.surface,
                      borderColor: targetBasket === 'growth' ? colors.borderAccent : colors.cardBorder,
                    }}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <BasketCurrencyIcons basketId="growth" size="xs" />
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                    Top-Up Amount (INR)
                  </label>
                  <span className="text-[10px] font-mono font-semibold" style={{ color: numAmount < minAmount ? colors.semanticDanger : colors.textTertiary }}>
                    Min ₹{minAmount}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-base font-bold font-mono" style={{ color: colors.textTertiary }}>₹</span>
                  <input
                    type="number"
                    min={minAmount}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl text-lg font-bold font-mono border focus:outline-none focus:ring-1 transition-all"
                    style={{ backgroundColor: colors.surface, borderColor: numAmount < minAmount && amount ? 'rgba(239, 68, 68, 0.4)' : colors.cardBorder, color: colors.textPrimary }}
                  />
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {presets.map((preset) => {
                    const isActive = amount === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset)}
                        className="h-7 rounded-lg text-xs font-bold font-mono border transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                        style={{
                          backgroundColor: isActive ? colors.accentTint : colors.surface,
                          borderColor: isActive ? colors.borderAccent : colors.borderDim,
                          color: isActive ? colors.accent : colors.textSecondary,
                        }}
                      >
                        ₹{preset}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment Gateway Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                    Payment Method
                  </label>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">Zero Platform Fee</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['GPay', 'PhonePe', 'Paytm', 'IMPS'] as const).map((m) => {
                    const isSelected = method === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        className="h-9 px-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                        style={{
                          backgroundColor: isSelected ? colors.accentTint : colors.surface,
                          borderColor: isSelected ? colors.borderAccent : colors.borderDim,
                          color: isSelected ? colors.textPrimary : colors.textSecondary,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5" style={{ color: isSelected ? colors.accent : colors.textTertiary }} />
                          <span className="text-[11px]">{m === 'IMPS' ? 'NetBanking (IMPS)' : `${m} UPI`}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3 h-3" style={{ color: colors.accent }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Section (Spot Breakdown + Action CTA) */}
            <div className="md:col-span-5 flex flex-col justify-between rounded-2xl border p-4 space-y-3.5" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: colors.borderDim }}>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                    Instant Spot Allocation
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>0% Slippage</span>
                  </span>
                </div>

                {/* Coin Allocations with Real Logos */}
                <div className="space-y-2">
                  {estimatedFills.length > 0 && numAmount >= minAmount ? (
                    estimatedFills.map((fill) => (
                      <div key={fill.asset} className="flex items-center justify-between py-1 border-b last:border-b-0" style={{ borderColor: colors.borderDim }}>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center overflow-hidden p-0.5 shadow-sm ring-1 ring-black/20 flex-shrink-0">
                            <img src={fill.logo} alt={fill.asset} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <span className="font-bold text-xs" style={{ color: colors.textPrimary }}>{fill.asset}</span>
                            <span className="text-[10px] font-mono ml-1.5" style={{ color: colors.textTertiary }}>({fill.pct}%)</span>
                          </div>
                        </div>
                        <div className="text-right font-mono">
                          <span className="font-bold text-xs block" style={{ color: colors.textPrimary }}>
                            ~{fill.asset === 'USDT' ? fill.units.toFixed(2) : fill.units.toFixed(6)} {fill.asset}
                          </span>
                          <span className="text-[10px] block" style={{ color: colors.textSecondary }}>
                            ₹{Math.round(fill.inrShare)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs font-mono" style={{ color: colors.textTertiary }}>
                      Enter at least ₹{minAmount} to preview live asset spot allocation.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleDeposit}
                disabled={loading || !amount || numAmount < minAmount}
                className="w-full h-11 px-5 rounded-xl font-bold text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
                style={{ backgroundColor: colors.primary, color: colors.primaryText }}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Pay ₹{numAmount > 0 ? numAmount.toLocaleString('en-IN') : '0'} Instantly</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4 animate-fade-in max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border shadow-lg" style={{ backgroundColor: colors.mintTint, borderColor: colors.borderMint, color: colors.semanticSuccess }}>
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono" style={{ backgroundColor: colors.mintTint, color: colors.semanticSuccess }}>
                Spot Order Filled
              </span>
              <h3 className="text-xl font-bold mt-1.5" style={{ color: colors.textPrimary }}>Capital Top-Up Complete!</h3>
              <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                ₹{numAmount.toLocaleString('en-IN')} allocated directly into{' '}
                <strong style={{ color: colors.textPrimary }}>{targetBasket === 'stable' ? 'Stable Basket' : 'Growth Basket'}</strong>.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="p-3.5 rounded-2xl border text-left space-y-2 font-mono text-xs" style={{ backgroundColor: colors.surface, borderColor: colors.borderDim }}>
              <div className="flex justify-between">
                <span style={{ color: colors.textTertiary }}>Settled Amount:</span>
                <span className="font-bold" style={{ color: colors.textPrimary }}>₹{numAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textTertiary }}>Target Basket:</span>
                <span className="font-bold" style={{ color: colors.accent }}>{targetBasket === 'stable' ? 'Stable Basket' : 'Growth Basket'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textTertiary }}>Payment Channel:</span>
                <span className="font-bold" style={{ color: colors.textPrimary }}>{method} Instant</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.textTertiary }}>UTR Ref:</span>
                <span className="font-bold" style={{ color: colors.textPrimary }}>{generatedUtr || '502918273615'}</span>
              </div>
              <div className="flex justify-between pt-1 border-t" style={{ borderColor: colors.borderDim }}>
                <span style={{ color: colors.textTertiary }}>Recurring Habit:</span>
                <span className="font-bold text-emerald-500">Intact & Active</span>
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
    </div>,
    document.body
  );
};
