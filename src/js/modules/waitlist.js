export function initWaitlist() {
  const WAITLIST_API_URL = '/api/waitlist';
  // ==========================================
  // 4. WAITLIST FORM HANDLER
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
      
      // Perform simple validation
      if (!name || !email) {
        showToast('Validation Error', 'Please fill in all required fields.', 'error');
        return;
      }
      
      // Show loading state
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtn) submitBtn.classList.add('loading');
      if (submitTxt) submitTxt.textContent = 'Joining...';
      
      // Extract referral code strictly if present in URL or active session
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = (urlParams.get('ref') || urlParams.get('referral') || urlParams.get('affiliate') || sessionStorage.getItem('satmix_referral_code') || '').toUpperCase().trim();

      if (WAITLIST_API_URL) {
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        if (refCode) {
          formData.append('referralCode', refCode);
        }

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
            referralCode: refCode,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('satmix_waitlist', JSON.stringify(waitlistDB));
          
          // Show success modal
          if (successModal) {
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
            referralCode: refCode,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('satmix_waitlist', JSON.stringify(waitlistDB));
          
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
          }
          if (submitTxt) submitTxt.textContent = 'Get Early Access';
          
          showToast('Welcome to Satmix!', "You've successfully joined the waitlist.", 'success');
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
