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
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitTxt.textContent = 'Joining...';
      
      if (WAITLIST_API_URL) {
        const formData = new URLSearchParams();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);

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
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('satmix_waitlist', JSON.stringify(waitlistDB));
          
          // Show success modal
          successModal.classList.add('active');
          document.body.style.overflow = 'hidden'; // Prevent scrolling
          
          // Reset form
          waitlistForm.reset();
          
          // Reset button
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          submitTxt.textContent = 'Get Early Access';
        })
        .catch(error => {
          console.error('Error:', error);
          showToast('Submission Error', 'Failed to join waitlist. Please try again.', 'error');
          
          // Reset button
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          submitTxt.textContent = 'Get Early Access';
        });
      } else {
        // Fallback for simulation / testing if URL is not configured
        setTimeout(() => {
          const waitlistDB = JSON.parse(localStorage.getItem('satmix_waitlist') || '[]');
          waitlistDB.push({
            name,
            email,
            phone,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('satmix_waitlist', JSON.stringify(waitlistDB));
          
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
          submitTxt.textContent = 'Get Early Access';
          
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
      successModal.classList.remove('active');
    });
  }

  if (modalContinue) {
    modalContinue.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }

  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }
}
