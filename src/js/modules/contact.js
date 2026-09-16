// Contact Form Handler
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('support-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      const name = document.getElementById('c-name').value;
      const email = document.getElementById('c-email').value;
      const subject = document.getElementById('c-subject').value;
      const message = document.getElementById('c-message').value;

      // Your deployed Google Apps Script Web App URL
      const scriptURL = 'https://script.google.com/macros/s/AKfycbwHMH4gKZDN6HQv44W2mL0fghVZb0t85EOtSMeqtCJwibNNLaKN36vyERIrf5Ao6CSQhA/exec';

      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('subject', subject);
        formData.append('message', message);

        const response = await fetch(scriptURL, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          window.showToast('Message Sent', 'Thank you for contacting Satmix! Our support team will get in touch with you shortly.');
          contactForm.reset();
        } else {
          window.showToast('Error', 'Oops! Something went wrong. Please try again later.', true);
        }
      } catch (error) {
        console.error('Error!', error.message);
        window.showToast('Error', 'Oops! Something went wrong. Please try again later.', true);
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});