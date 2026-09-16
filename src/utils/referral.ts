// ============================================================
// FILE: src/utils/referral.ts
// PURPOSE: Robust referral code capture, persistence, and extraction
//          for the Satmix Waitlist & Intern Attribution System
// ============================================================

const STORAGE_KEY = 'satmix_referral_code';
const PARAM_KEYS = ['ref', 'referral', 'code', 'creator', 'affiliate', 'influencer', 'partner', 'ref_code', 'utm_source'];

/**
 * Normalizes referral codes to uppercase alphanumeric format
 */
export function sanitizeReferralCode(code: string | null | undefined): string {
  if (!code) return '';
  return code
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '');
}

/**
 * Extracts referral code from the current URL query parameters.
 * Checks for ?ref=..., ?referral=..., ?code=..., etc.
 */
export function extractReferralFromUrl(): string {
  if (typeof window === 'undefined') return '';
  
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of PARAM_KEYS) {
      const val = params.get(key);
      if (val) {
        const sanitized = sanitizeReferralCode(val);
        if (sanitized) return sanitized;
      }
    }
  } catch (err) {
    console.error('Error parsing referral query parameter:', err);
  }
  return '';
}

/**
 * Captures referral code from URL and persists it to both localStorage
 * and sessionStorage so it is never lost across route navigation.
 */
export function initReferralCapture(): string {
  if (typeof window === 'undefined') return '';

  const urlCode = extractReferralFromUrl();
  if (urlCode) {
    try {
      localStorage.setItem(STORAGE_KEY, urlCode);
      sessionStorage.setItem(STORAGE_KEY, urlCode);
    } catch (e) {
      // Ignore storage quota errors in private browsing
    }
    return urlCode;
  }

  return getStoredReferralCode();
}

/**
 * Retrieves the active referral code from session or local storage.
 */
export function getStoredReferralCode(): string {
  if (typeof window === 'undefined') return '';

  try {
    const sessionCode = sessionStorage.getItem(STORAGE_KEY);
    if (sessionCode) return sanitizeReferralCode(sessionCode);

    const localCode = localStorage.getItem(STORAGE_KEY);
    if (localCode) return sanitizeReferralCode(localCode);
  } catch (e) {
    // Fallback if storage access is restricted
  }
  return '';
}

/**
 * Explicitly sets or updates the stored referral code.
 */
export function setStoredReferralCode(code: string): void {
  const sanitized = sanitizeReferralCode(code);
  if (!sanitized) return;
  try {
    localStorage.setItem(STORAGE_KEY, sanitized);
    sessionStorage.setItem(STORAGE_KEY, sanitized);
  } catch (e) {}
}

/**
 * Clears stored referral data.
 */
export function clearStoredReferralCode(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}
