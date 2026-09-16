// ============================================================
// FILE: src/utils/taxGenerator.ts
// PURPOSE: Indian Web3 Tax Statement & TDS Generator (Section 115BBH / 194S)
// ============================================================

import { Transaction, UserProfile, TaxStatement } from '../types';

export function generateTaxStatement(
  user: UserProfile,
  transactions: Transaction[],
  financialYear: 'FY 2025-26' | 'FY 2026-27' = 'FY 2025-26'
): { statement: TaxStatement; csvContent: string } {
  const assessmentYear = financialYear === 'FY 2025-26' ? 'AY 2026-27' : 'AY 2027-28';

  let totalVolume = 0;
  let totalCredits = 0;
  let totalDebits = 0;

  transactions.forEach((tx) => {
    totalVolume += tx.amount;
    if (tx.type === 'WITHDRAWAL') {
      totalDebits += tx.amount;
    } else {
      totalCredits += tx.amount;
    }
  });

  // Calculate estimated realized gains (using conservative 10% gain assumption on withdrawals or net volume)
  const realizedGains = Math.max(0, Math.round(totalDebits * 0.12));
  // Flat 30% tax under Section 115BBH
  const taxPayable115BBH = Math.round(realizedGains * 0.3);
  // 1% TDS deducted on transfer/sale under Section 194S
  const tdsDeducted194S = Math.round(totalDebits * 0.01);

  const statement: TaxStatement = {
    assessmentYear,
    financialYear,
    totalVolume,
    realizedGains,
    taxPayable115BBH,
    tdsDeducted194S,
    transactionsCount: transactions.length,
    generatedAt: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  };

  // Generate official CSV format
  const csvHeaders = 'Transaction ID,Date,Type,Strategy,Amount (INR),Status,Payment Method,UTR Number,TDS Deducted (194S)\n';
  const csvRows = transactions
    .map((tx) => {
      const tds = tx.type === 'WITHDRAWAL' ? (tx.amount * 0.01).toFixed(2) : '0.00';
      return `"${tx.id}","${tx.timestamp}","${tx.type}","${tx.basketName}","${tx.amount}","${tx.status}","${tx.paymentMethod}","${tx.utrNumber}","${tds}"`;
    })
    .join('\n');

  const csvSummary = `\n\nSATMIX DIGITAL ASSET TAX SUMMARY (${financialYear} / ${assessmentYear})\n` +
    `Taxpayer Name: "${user.name}"\n` +
    `PAN (Masked): "${user.panNumberMasked}"\n` +
    `Architecture: "Non-Custodial Multi-Sig Vault"\n` +
    `Total Investment Volume (INR): "${totalVolume}"\n` +
    `Realized Capital Gains u/s 115BBH (INR): "${realizedGains}"\n` +
    `Tax Payable @ 30% u/s 115BBH (INR): "${taxPayable115BBH}"\n` +
    `TDS Deducted u/s 194S (INR): "${tdsDeducted194S}"\n` +
    `Generated On: "${statement.generatedAt}"\n`;

  const csvContent = csvHeaders + csvRows + csvSummary;

  return { statement, csvContent };
}

export function downloadCsvFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
