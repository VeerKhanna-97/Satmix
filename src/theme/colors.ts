// ============================================================
// FILE: src/theme/colors.ts
// PURPOSE: Satmix Design System Color Tokens & Palette
// SPEC: Direction A — Monochrome Titanium & Satmix Amber (#F7931A)
// BENCHMARK: Mercury Bank / Ramp / CRED Private Wealth / Bitcoin Amber
// ============================================================

export const DARK_COLORS = {
  // Brand Primary & Interaction (Stark Monochrome White on Dark)
  primary: '#FFFFFF', // Stark White CTA button on Dark Obsidian Canvas
  primaryPressed: '#E2E8F0',
  primaryHover: '#F1F5F9',
  primaryText: '#000000', // Crisp Black text inside stark white buttons
  purple: '#F7931A',
  brand: '#F7931A',

  // Signature Accent (Satmix Bitcoin Amber #F7931A)
  accent: '#F7931A', // Satmix Signature Amber accent
  accentTint: 'rgba(247, 147, 26, 0.12)',
  borderAccent: 'rgba(247, 147, 26, 0.32)',
  gold: '#F7931A',
  goldTint: 'rgba(247, 147, 26, 0.12)',

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
  violet: '#F7931A',

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
  purpleTint: 'rgba(247, 147, 26, 0.12)',
  mintTint: 'rgba(16, 185, 129, 0.10)',
  redTint: 'rgba(244, 63, 94, 0.08)',
  blueTint: 'rgba(56, 189, 248, 0.08)',
  borderPurple: 'rgba(247, 147, 26, 0.32)',
  borderMint: 'rgba(16, 185, 129, 0.25)',
};

export const LIGHT_COLORS = {
  // Brand Primary & Interaction (Deep Slate Onyx on Light Canvas)
  primary: '#0F172A', // Deep Slate Onyx CTA button on Light Slate Canvas
  primaryPressed: '#020617',
  primaryHover: '#1E293B',
  primaryText: '#FFFFFF', // Crisp White text inside dark slate buttons
  purple: '#D97706',
  brand: '#D97706',

  // Signature Accent (High contrast deep gold/amber on light mode)
  accent: '#D97706', // High-contrast Deep Amber for crisp text readability (>4.5:1 AA/AAA)
  accentTint: 'rgba(247, 147, 26, 0.10)',
  borderAccent: 'rgba(247, 147, 26, 0.30)',
  gold: '#D97706',
  goldTint: 'rgba(247, 147, 26, 0.10)',

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
  violet: '#D97706',

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
  purpleTint: 'rgba(247, 147, 26, 0.10)',
  mintTint: 'rgba(5, 150, 105, 0.08)',
  redTint: 'rgba(225, 29, 72, 0.08)',
  blueTint: 'rgba(2, 132, 199, 0.08)',
  borderPurple: 'rgba(247, 147, 26, 0.30)',
  borderMint: 'rgba(5, 150, 105, 0.20)',
};
