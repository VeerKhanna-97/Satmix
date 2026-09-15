// ============================================================
// FILE: src/js/modules/waitlist.js (Website 3.0)
// PURPOSE: Waitlist Form Handler with Referral & Affiliate Attribution
// ============================================================

const STORAGE_KEY = 'satmix_referral_code';
const PARAM_KEYS = ['ref', 'referral', 'code', 'creator', 'affiliate', 'influencer', 'partner', 'ref_code', 'utm_source'];

/**
 * Extracts and sanitizes referral code from URL parameters
 */
function getReferralCodeFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of PARAM_KEYS) {
      const val = params.get(key);
      if (val) {
        return val.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
      }
    }
  } catch (e) {
    console.error('Error parsing referral param:', e);
  }
  return '';
}

/**
 * Captures referral code and persists to localStorage & sessionStorage
 */
function captureAndPersistReferral() {
  const urlCode = getReferralCodeFromUrl();
  if (urlCode) {
    try {
      localStorage.setItem(STORAGE_KEY, urlCode);
      sessionStorage.setItem(STORAGE_KEY, urlCode);
    } catch (e) {}
    return urlCode;
  }

  try {
    return sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY) || '';
  } catch (e) {
    return '';
  }
}

export function initWaitlist() {
  const WAITLIST_API_URL = '/api/waitlist';
  
  // 1. Capture referral code on page load
  const activeReferralCode = captureAndPersistReferral();

  // 2. Render subtle referral badge if a code is present
  if (activeReferralCode) {
    const titleWrapper = document.querySelector('.slide-item .slide-title-wrapper');
    if (titleWrapper && !document.getElementById('referral-pill-badge')) {
      const pill = document.createElement('div');
      pill.id = 'referral-pill-badge';
      pill.style.cssText = 'display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; margin-bottom: 8px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: monospace; background: rgba(93, 47, 232, 0.12); color: #8B5CF6; border: 1px solid rgba(93, 47, 232, 0.3);';
      pill.innerHTML = `<span>✨ REF: ${activeReferralCode}</span>`;
      titleWrapper.prepend(pill);
    }
  }

  // ==========================================
  // 3. WAITLIST FORM HANDLER
  // ==========================================
  const waitlistForm = document.getElementById('waitlist-form');
  const successModal = document.getElementById('success-modal');
  const modalClose = document.getElementById('modal-close');
  const modalContinue = document.getElementById('modal-continue');
  
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = waitlistForm.querySelector('.submit-btn');
      const submitTxt = document.getElementById('submit-text');
      
      const name = document.getElementById('w-name').value.trim();
      const email = document.getElementById('w-email').value.trim();
      const phone = document.getElementById('w-phone').value.trim();
      const referralCode = captureAndPersistReferral();
      
      // Perform simple validation
      if (!name || !email) {
        showToast('Validation Error', 'Please fill in all required fields.', 'error');
        return;
      }
      
      // Show loading state
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtn) submitBtn.classList.add('loading');
      if (submitTxt) submitTxt.textContent = 'Joining...';
      
      if (WAITLIST_API_URL) {
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        if (referralCode) {
          formData.append('referralCode', referralCode);
        }
        formData.append('source', 'Website 3.0');

        fetch(WAITLIST_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString()
        })
        .then(async res => {
          if (!res.ok) throw new Error('Network response was not ok');
          const json = await res.json();
          if (!json.success) throw new Error(json.error || 'Submission failed');
          
          // Save submission to localStorage
          const waitlistDB = JSON.parse(localStorage.getItem('satmix_waitlist') || '[]');
          waitlistDB.push({
            name,
            email,
            phone,
            referralCode,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('satmix_waitlist', JSON.stringify(waitlistDB));
          
          // Show success modal
          if (successModal) {
            // Optional: update referral confirmation in modal
            const modalDesc = successModal.querySelector('.modal-desc');
            if (modalDesc && referralCode) {
              modalDesc.textContent = `Thanks for joining! Your spot is secured with referral code ${referralCode}. We'll notify you as soon as early access opens.`;
            }
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
          }
          
          // Reset form
          waitlistForm.reset();
          
          // Reset button
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
          }
          if (submitTxt) submitTxt.textContent = 'Get Early Access';
        })
        .catch(error => {
          console.error('Error:', error);
          showToast('Submission Error', 'Failed to join waitlist. Please try again.', 'error');
          
          // Reset button
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
          }
          if (submitTxt) submitTxt.textContent = 'Get Early Access';
        });
      } else {
        // Fallback for simulation / testing if URL is not configured
        setTimeout(() => {
          const waitlistDB = JSON.parse(localStorage.getItem('satmix_waitlist') || '[]');
          waitlistDB.push({
            name,
            email,
            phone,
            referralCode,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('satmix_waitlist', JSON.stringify(waitlistDB));
          
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
          }
          if (submitTxt) submitTxt.textContent = 'Get Early Access';
          
          showToast('Welcome to Satmix!', "You've successfully joined the waitlist (Simulated).", 'success');
          waitlistForm.reset();
          if (successModal) {
            successModal.classList.add('active');
          }
        }, 1200);
      }
    });
  }

  // Success Modal closing triggers
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (successModal) successModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (modalContinue) {
    modalContinue.addEventListener('click', () => {
      if (successModal) successModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}
