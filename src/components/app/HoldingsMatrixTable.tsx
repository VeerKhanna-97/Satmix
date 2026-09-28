import React from 'react';
import { useApp } from '../../context/AppContext';
import { SatmixAssetHolding } from '../../hooks/useSatmixPortfolio';
import { ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';

interface HoldingsMatrixTableProps {
  holdings: SatmixAssetHolding[];
  onSelectAsset?: (coin: 'BTC' | 'ETH' | 'SOL' | 'USDT') => void;
}

const formatINR = (val: number, decimals: number = 2) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
};

const formatCrypto = (val: number, symbol: string) => {
  const maxDecimals = symbol === 'USDT' ? 2 : symbol === 'SOL' ? 4 : 8;
  const minDecimals = symbol === 'USDT' ? 2 : 4;
  return `${val.toLocaleString('en-IN', {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  })} ${symbol}`;
};

export const HoldingsMatrixTable: React.FC<HoldingsMatrixTableProps> = ({
  holdings,
  onSelectAsset,
}) => {
  const { colors, themeMode } = useApp();

  return (
    <div
      className="overflow-x-auto rounded-2xl border transition-all duration-200"
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.borderDim,
      }}
    >
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr
            className="border-b text-[10px] uppercase font-bold tracking-wider select-none"
            style={{
              backgroundColor: themeMode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)',
              borderColor: colors.borderDim,
              color: colors.textTertiary,
            }}
          >
            <th className="py-3.5 px-4 font-bold">Asset</th>
            <th className="py-3.5 px-3 text-right font-bold">Units Held</th>
            <th className="py-3.5 px-3 text-right font-bold hidden sm:table-cell">Avg Buy (INR)</th>
            <th className="py-3.5 px-3 text-right font-bold hidden md:table-cell">Spot Price (INR)</th>
            <th className="py-3.5 px-3 text-right font-bold hidden lg:table-cell">Cost Basis</th>
            <th className="py-3.5 px-3 text-right font-bold">Valuation</th>
            <th className="py-3.5 px-3 text-right font-bold">Unrealized P&L</th>
            <th className="py-3.5 px-4 text-right font-bold">ROI</th>
            <th className="py-3.5 pr-3 w-8"></th>
          </tr>
        </thead>
        <tbody className="divide-y font-mono" style={{ borderColor: colors.borderDim }}>
          {holdings.length === 0 || holdings.every((h) => h.units === 0) ? (
            <tr>
              <td
                colSpan={9}
                className="text-center py-8 text-xs font-mono"
                style={{ color: colors.textTertiary }}
              >
                No active asset holdings found in this portfolio view.
              </td>
            </tr>
          ) : (
            holdings.map((h) => {
              const isProfit = h.unrealizedPnLINR >= 0;
              const hasInvestment = h.investedINR > 0;

              return (
                <tr
                  key={h.asset}
                  onClick={() => onSelectAsset?.(h.asset)}
                  className="transition-colors cursor-pointer group"
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      themeMode === 'light' ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Asset Token & Label */}
                  <td className="py-3.5 px-4 font-sans">
                    <div className="flex items-center gap-2.5 min-w-[130px]">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center p-0.5 shadow-xs ring-1 ring-black/10 flex-shrink-0">
                        <img
                          src={h.icon}
                          alt={h.asset}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs" style={{ color: colors.textPrimary }}>
                            {h.asset}
                          </span>
                          <span
                            className="text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold hidden sm:inline-block"
                            style={{
                              backgroundColor: colors.card,
                              borderColor: colors.borderDim,
                              color: colors.textSecondary,
                            }}
                          >
                            {h.allocationPct}%
                          </span>
                        </div>
                        <span className="text-[10px] block truncate font-mono" style={{ color: colors.textTertiary }}>
                          {h.label}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Units Held */}
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-bold text-xs tabular-nums block" style={{ color: colors.textPrimary }}>
                      {h.units === 0 ? '0.00' : formatCrypto(h.units, h.asset)}
                    </span>
                  </td>

                  {/* Avg Buy Price (INR) */}
                  <td className="py-3.5 px-3 text-right hidden sm:table-cell">
                    <span className="text-xs tabular-nums" style={{ color: colors.textSecondary }}>
                      {hasInvestment ? formatINR(h.averageBuyPriceINR, 0) : '—'}
                    </span>
                  </td>

                  {/* Spot Price (INR) */}
                  <td className="py-3.5 px-3 text-right hidden md:table-cell">
                    <div className="tabular-nums text-xs font-semibold" style={{ color: colors.textPrimary }}>
                      {formatINR(h.currentPriceINR, 0)}
                    </div>
                    {h.change24h !== 0 && (
                      <span
                        className={`text-[9px] inline-flex items-center gap-0.5 font-bold tabular-nums ${
                          h.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {h.change24h >= 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                        {Math.abs(h.change24h).toFixed(1)}%
                      </span>
                    )}
                  </td>

                  {/* Invested Cost Basis */}
                  <td className="py-3.5 px-3 text-right hidden lg:table-cell">
                    <span className="text-xs tabular-nums" style={{ color: colors.textSecondary }}>
                      {hasInvestment ? formatINR(h.investedINR, 2) : '₹0.00'}
                    </span>
                  </td>

                  {/* Current Valuation */}
                  <td className="py-3.5 px-3 text-right">
                    <span className="font-extrabold text-xs sm:text-sm tabular-nums" style={{ color: colors.textPrimary }}>
                      {formatINR(h.currentValueINR, 2)}
                    </span>
                  </td>

                  {/* Unrealized P&L */}
                  <td className="py-3.5 px-3 text-right">
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        !hasInvestment
                          ? 'text-slate-400'
                          : isProfit
                          ? 'text-emerald-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {!hasInvestment ? '₹0.00' : `${isProfit ? '+' : ''}${formatINR(h.unrealizedPnLINR, 2)}`}
                    </span>
                  </td>

                  {/* ROI Percentage */}
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`text-xs font-extrabold tabular-nums px-2 py-0.5 rounded-md inline-block ${
                        !hasInvestment
                          ? 'bg-slate-500/10 text-slate-400'
                          : isProfit
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {!hasInvestment ? '0.00%' : `${isProfit ? '+' : ''}${h.unrealizedROI.toFixed(2)}%`}
                    </span>
                  </td>

                  {/* Action Arrow */}
                  <td className="py-3.5 pr-3 text-right">
                    <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400" />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
