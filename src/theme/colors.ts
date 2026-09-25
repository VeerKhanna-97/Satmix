// ============================================================
// FILE: src/theme/colors.ts
// PURPOSE: Satmix Design System Color Tokens & Palette
// PRIMARY COLOR: #5D17EB (Satmix Royal Purple)
// LEGACY COLOR:  #F7931A (Bitcoin Amber - preserved in memory below)
// ============================================================

// ============================================================
// 1. IN-MEMORY LEGACY AMBER PALETTE PRESERVATION (#F7931A)
// Kept in memory so we can instantly revert with a single assignment
// ============================================================
export const LEGACY_AMBER_PRIMARY = '#F7931A';
export const LEGACY_AMBER_RGB = '247, 147, 26';

export const LEGACY_DARK_COLORS = {
  primary: '#FFFFFF',
  primaryPressed: '#E2E8F0',
  primaryHover: '#F1F5F9',
  primaryText: '#000000',
  purple: '#F7931A',
  brand: '#F7931A',
  accent: '#F7931A',
  accentTint: 'rgba(247, 147, 26, 0.12)',
  borderAccent: 'rgba(247, 147, 26, 0.32)',
  gold: '#F7931A',
  goldTint: 'rgba(247, 147, 26, 0.12)',
  semanticSuccess: '#10B981',
  semanticWarning: '#F59E0B',
  semanticInfo: '#38BDF8',
  semanticDanger: '#F43F5E',
  mint: '#10B981',
  positive: '#10B981',
  warning: '#F59E0B',
  negative: '#F43F5E',
  blue: '#38BDF8',
  violet: '#F7931A',
  bg: '#090A0E',
  surface: '#12141C',
  card: '#12141C',
  cardHigh: '#181A24',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  borderDim: 'rgba(255, 255, 255, 0.06)',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textDisabled: '#475569',
  primaryTint: 'rgba(255, 255, 255, 0.08)',
  borderPrimary: 'rgba(255, 255, 255, 0.20)',
  purpleTint: 'rgba(247, 147, 26, 0.12)',
  mintTint: 'rgba(16, 185, 129, 0.10)',
  redTint: 'rgba(244, 63, 94, 0.08)',
  blueTint: 'rgba(56, 189, 248, 0.08)',
  borderPurple: 'rgba(247, 147, 26, 0.32)',
  borderMint: 'rgba(16, 185, 129, 0.25)',
};

export const LEGACY_LIGHT_COLORS = {
  primary: '#0F172A',
  primaryPressed: '#020617',
  primaryHover: '#1E293B',
  primaryText: '#FFFFFF',
  purple: '#D97706',
  brand: '#D97706',
  accent: '#D97706',
  accentTint: 'rgba(247, 147, 26, 0.10)',
  borderAccent: 'rgba(247, 147, 26, 0.30)',
  gold: '#D97706',
  goldTint: 'rgba(247, 147, 26, 0.10)',
  semanticSuccess: '#059669',
  semanticWarning: '#D97706',
  semanticInfo: '#0284C7',
  semanticDanger: '#E11D48',
  mint: '#059669',
  positive: '#059669',
  warning: '#D97706',
  negative: '#E11D48',
  blue: '#0284C7',
  violet: '#D97706',
  bg: '#F8FAFC',
  surface: '#F1F5F9',
  card: '#FFFFFF',
  cardHigh: '#FFFFFF',
  cardBorder: '#E2E8F0',
  borderDim: 'rgba(15, 23, 42, 0.08)',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  textDisabled: '#94A3B8',
  primaryTint: 'rgba(15, 23, 42, 0.06)',
  borderPrimary: 'rgba(15, 23, 42, 0.20)',
  purpleTint: 'rgba(247, 147, 26, 0.10)',
  mintTint: 'rgba(5, 150, 105, 0.08)',
  redTint: 'rgba(225, 29, 72, 0.08)',
  blueTint: 'rgba(2, 132, 199, 0.08)',
  borderPurple: 'rgba(247, 147, 26, 0.30)',
  borderMint: 'rgba(5, 150, 105, 0.20)',
};

// ============================================================
// 2. ACTIVE PRIMARY PALETTE (#5D17EB)
// ============================================================
export const DARK_COLORS = {
  // Brand Primary & Interaction (Stark Monochrome White on Dark)
  primary: '#FFFFFF', // Stark White CTA button on Dark Obsidian Canvas
  primaryPressed: '#E2E8F0',
  primaryHover: '#F1F5F9',
  primaryText: '#000000', // Crisp Black text inside stark white buttons
  purple: '#5D17EB', // Primary Brand Royal Purple (#5D17EB)
  brand: '#5D17EB',

  // Signature Accent (#5D17EB, rgb: 93, 23, 235)
  accent: '#5D17EB',
  accentTint: 'rgba(93, 23, 235, 0.14)',
  borderAccent: 'rgba(93, 23, 235, 0.35)',
  gold: '#5D17EB',
  goldTint: 'rgba(93, 23, 235, 0.14)',

  // Semantic Accents (Strictly for Financial Data & Metrics)
  semanticSuccess: '#10B981', // Emerald strictly for positive returns (+18.4%)
  semanticWarning: '#F59E0B', // Amber for milestones & caution
  semanticInfo: '#38BDF8', // Subtle Sky Blue
  semanticDanger: '#F43F5E', // Controlled Crimson for negative metrics & debit
  mint: '#10B981',
  positive: '#10B981',
  warning: '#F59E0B',
  negative: '#F43F5E',
  blue: '#38BDF8',
  violet: '#7C3AED',

  // Surfaces (Deep Obsidian & Brushed Titanium Hierarchy)
  bg: '#090A0E', // Deep Obsidian Canvas
  surface: '#12141C', // Inset wells, input fields, chip wells
  card: '#12141C', // Standard container cards
  cardHigh: '#181A24', // Elevated modals, dropdowns, sticky header
  cardBorder: 'rgba(255, 255, 255, 0.08)', // Structural boundary stroke
  borderDim: 'rgba(255, 255, 255, 0.06)', // Divider rules

  // Typography (Sterling Platinum & Slate Hierarchy)
  textPrimary: '#F8FAFC', // Headings, hero numbers (>14:1 AAA)
  textSecondary: '#94A3B8', // Body descriptions (Slate 400, >7:1 AAA)
  textTertiary: '#64748B', // Disclaimers, timestamp notes (Slate 500)
  textDisabled: '#475569',

  // Tints & Overlays
  primaryTint: 'rgba(255, 255, 255, 0.08)',
  borderPrimary: 'rgba(255, 255, 255, 0.20)',
  purpleTint: 'rgba(93, 23, 235, 0.14)',
  mintTint: 'rgba(16, 185, 129, 0.10)',
  redTint: 'rgba(244, 63, 94, 0.08)',
  blueTint: 'rgba(56, 189, 248, 0.08)',
  borderPurple: 'rgba(93, 23, 235, 0.35)',
  borderMint: 'rgba(16, 185, 129, 0.25)',
};

export const LIGHT_COLORS = {
  // Brand Primary & Interaction (Deep Slate Onyx on Light Canvas)
  primary: '#0F172A', // Deep Slate Onyx CTA button on Light Slate Canvas
  primaryPressed: '#020617',
  primaryHover: '#1E293B',
  primaryText: '#FFFFFF', // Crisp White text inside dark slate buttons
  purple: '#5D17EB',
  brand: '#5D17EB',

  // Signature Accent (#5D17EB)
  accent: '#5D17EB',
  accentTint: 'rgba(93, 23, 235, 0.10)',
  borderAccent: 'rgba(93, 23, 235, 0.30)',
  gold: '#5D17EB',
  goldTint: 'rgba(93, 23, 235, 0.10)',

  // Semantic Accents (Financial Data Only)
  semanticSuccess: '#059669', // Forest Emerald strictly for positive returns
  semanticWarning: '#D97706', // Warm Amber
  semanticInfo: '#0284C7', // Ocean Blue
  semanticDanger: '#E11D48', // Deep Rose
  mint: '#059669',
  positive: '#059669',
  warning: '#D97706',
  negative: '#E11D48',
  blue: '#0284C7',
  violet: '#5D17EB',

  // Surfaces (Crisp Slate Hierarchy)
  bg: '#F8FAFC', // Slate 50 master canvas
  surface: '#F1F5F9', // Slate 100 inner wells
  card: '#FFFFFF', // Pure White card surfaces
  cardHigh: '#FFFFFF',
  cardBorder: '#E2E8F0', // Slate 200 structural border
  borderDim: 'rgba(15, 23, 42, 0.08)',

  // Typography
  textPrimary: '#0F172A', // Slate 900 (>14.5:1 AAA)
  textSecondary: '#475569', // Slate 600 (>7:1 AAA)
  textTertiary: '#64748B', // Slate 500
  textDisabled: '#94A3B8',

  // Tints & Overlays
  primaryTint: 'rgba(15, 23, 42, 0.06)',
  borderPrimary: 'rgba(15, 23, 42, 0.20)',
  purpleTint: 'rgba(93, 23, 235, 0.10)',
  mintTint: 'rgba(5, 150, 105, 0.08)',
  redTint: 'rgba(225, 29, 72, 0.08)',
  blueTint: 'rgba(2, 132, 199, 0.08)',
  borderPurple: 'rgba(93, 23, 235, 0.30)',
  borderMint: 'rgba(5, 150, 105, 0.20)',
};

// ============================================================
// 3. ASSET ALLOCATION BAR BRAND COLORS
// USDT: #26a17b | BTC: #f7931b | ETH: #ffffff | SOL: #9945fe
// ============================================================
export const ASSET_COLORS: Record<string, { dark: string; light: string }> = {
  USDT: { dark: '#26a17b', light: '#26a17b' },
  BTC: { dark: '#f7931b', light: '#f7931b' },
  ETH: { dark: '#ffffff', light: '#0F172A' },
  SOL: { dark: '#9945fe', light: '#9945fe' },
};

export const getAssetBarColor = (ticker: string, themeMode?: 'dark' | 'light'): string => {
  const c = ASSET_COLORS[ticker.toUpperCase()];
  if (!c) return '#5D17EB';
  return themeMode === 'light' ? c.light : c.dark;
};
