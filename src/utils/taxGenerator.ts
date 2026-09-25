// ============================================================
// FILE: src/utils/taxGenerator.ts
// PURPOSE: Satmix Account Statement & Trade Ledger Generator
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

  const netPortfolioValue = Math.max(0, totalCredits - totalDebits);
  const realizedGains = Math.max(0, Math.round(totalDebits * 0.12));

  const statement: TaxStatement = {
    assessmentYear,
    financialYear,
    totalVolume,
    totalDeposits: totalCredits,
    totalWithdrawals: totalDebits,
    netPortfolioValue,
    realizedGains,
    transactionsCount: transactions.length,
    generatedAt: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  };

  // Generate official CSV format
  const csvHeaders = 'Transaction ID,Date,Type,Strategy,Amount (INR),Status,Payment Method,UTR Number\n';
  const csvRows = transactions
    .map((tx) => {
      return `"${tx.id}","${tx.timestamp}","${tx.type}","${tx.basketName}","${tx.amount}","${tx.status}","${tx.paymentMethod}","${tx.utrNumber}"`;
    })
    .join('\n');

  const csvSummary = `\n\nSATMIX DIGITAL ASSET ACCOUNT STATEMENT (${financialYear})\n` +
    `Account Holder: "${user.name}"\n` +
    `Linked Account: "${user.bankName} ${user.bankAccountMasked}"\n` +
    `Architecture: "Institutional Custodial Vault"\n` +
    `Total Transaction Volume (INR): "${totalVolume}"\n` +
    `Total Deposits & Purchases (INR): "${totalCredits}"\n` +
    `Total Withdrawals (INR): "${totalDebits}"\n` +
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
