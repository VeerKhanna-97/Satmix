// Google Apps Script Web App URL for Google Sheets integration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzZXuSM4K79NVAAgsxtq9Z3G5qr7Tsma1zDss8t53xwDhQ3Dohj6JG5YuayepI44A6Sng/exec';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // ==========================================
  // 1. SLIDE DECK CONTROLLER
  // ==========================================
  const slideTrack = document.querySelector('.slide-track');
  const slides = document.querySelectorAll('.slide-item');
  const tabBtns = document.querySelectorAll('.slide-tab-btn');
  const dots = document.querySelectorAll('.slide-dot');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');
  
  let currentSlide = 0;
  const totalSlides = slides.length;

  function updateSlidePosition() {
    // Slide the track
    slideTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update active tab buttons
    tabBtns.forEach((btn, idx) => {
      if (idx === currentSlide) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update dots
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update navigation arrows disabled state
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
  }

  function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
      currentSlide = index;
      updateSlidePosition();
    }
  }

  // Event Listeners for Tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const slideIndex = parseInt(btn.dataset.slide, 10);
      goToSlide(slideIndex);
    });
  });

  // Event Listeners for Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.dataset.slide, 10);
      goToSlide(slideIndex);
    });
  });

  // Event Listeners for Arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) goToSlide(currentSlide - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
    });
  }

  // CTA Link Handlers to focus the Waitlist (Slide 0)
  const waitlistCTAs = document.querySelectorAll('.trigger-waitlist');
  waitlistCTAs.forEach(cta => {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      // Smooth scroll to hero if not visible
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
      }
      // Set slide to 0 (Waitlist)
      goToSlide(0);
      
      // Auto focus name input
      setTimeout(() => {
        const nameInput = document.getElementById('w-name');
        if (nameInput) nameInput.focus();
      }, 500);
    });
  });

  // Swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  const slideContainer = document.querySelector('.slide-container');
  if (slideContainer) {
    slideContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slideContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swiped left -> Next slide
      if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swiped right -> Prev slide
      if (currentSlide > 0) goToSlide(currentSlide - 1);
    }
  }

  // Initialize slides
  updateSlidePosition();


  // ==========================================
  // 2. INVESTMENT CALCULATOR
  // ==========================================
  const calcRange = document.getElementById('calc-range');
  const calcAmountVal = document.getElementById('calc-amount-val');
  const stratLowBtn = document.getElementById('calc-strat-low');
  const stratHighBtn = document.getElementById('calc-strat-high');
  
  const resultTotalVal = document.getElementById('result-total');
  const resultInvestedVal = document.getElementById('result-invested');
  const resultGainVal = document.getElementById('result-gain');
  
  let dailySavings = 50;
  let selectedStrategy = 'high'; // 'low' or 'high'
  
  const strategyRates = {
    low: 0.08,  // 8% annual yield for stablecoins
    high: 0.26  // 26% annual yield average for top assets index
  };

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(amount);
  }

  function calculateReturns() {
    const annualRate = strategyRates[selectedStrategy];
    const dailyRate = annualRate / 365;
    const days = 365; // 1 year simulation
    
    let totalInvested = 0;
    let accumulatedValue = 0;
    
    // Simulate day-by-day auto-savings and compound growth
    for (let day = 0; day < days; day++) {
      totalInvested += dailySavings;
      accumulatedValue += dailySavings;
      accumulatedValue *= (1 + dailyRate);
    }
    
    const totalGains = accumulatedValue - totalInvested;
    
    // Animate the values counting up smoothly
    animateValue(resultTotalVal, parseInt(resultTotalVal.dataset.value || 0), Math.round(accumulatedValue), '₹');
    animateValue(resultInvestedVal, parseInt(resultInvestedVal.dataset.value || 0), totalInvested, '₹');
    animateValue(resultGainVal, parseInt(resultGainVal.dataset.value || 0), Math.round(totalGains), '₹');
    
    resultTotalVal.dataset.value = Math.round(accumulatedValue);
    resultInvestedVal.dataset.value = totalInvested;
    resultGainVal.dataset.value = Math.round(totalGains);
  }

  // Smooth number counting animation
  function animateValue(element, start, end, prefix = '') {
    if (start === end) {
      element.textContent = `${prefix}${formatCurrency(end)}`;
      return;
    }
    
    const duration = 400; // ms
    const startTime = performance.now();
    
    function updateNumber(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const current = Math.round(start + (end - start) * easeProgress);
      
      element.textContent = `${prefix}${formatCurrency(current)}`;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        element.textContent = `${prefix}${formatCurrency(end)}`;
      }
    }
    
    requestAnimationFrame(updateNumber);
  }

  if (calcRange) {
    calcRange.addEventListener('input', (e) => {
      dailySavings = parseInt(e.target.value, 10);
      calcAmountVal.textContent = `₹${dailySavings}`;
      calculateReturns();
    });
  }

  if (stratLowBtn && stratHighBtn) {
    stratLowBtn.addEventListener('click', () => {
      selectedStrategy = 'low';
      stratLowBtn.classList.add('active');
      stratHighBtn.classList.remove('active');
      calculateReturns();
    });

    stratHighBtn.addEventListener('click', () => {
      selectedStrategy = 'high';
      stratHighBtn.classList.add('active');
      stratLowBtn.classList.remove('active');
      calculateReturns();
    });
  }

  // Initial calculation run
  if (calcRange) {
    calculateReturns();
  }


  // ==========================================
  // 3. TOAST NOTIFICATION SYSTEM
  // ==========================================
  const toastContainer = document.getElementById('toast-container');

  function showToast(title, message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    
    toast.innerHTML = `
      <div class="toast-icon">
        <i data-lucide="${icon}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Re-trigger lucide for the new icon
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    // Auto remove toast
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }


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
      
      if (GOOGLE_SCRIPT_URL) {
        // Send data to Google Apps Script
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify({ name, email, phone })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.status === 'success') {
            // Save submission to localStorage
            const waitlistDB = JSON.parse(localStorage.getItem('satmix_waitlist') || '[]');
            waitlistDB.push({
              name,
              email,
              phone,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('satmix_waitlist', JSON.stringify(waitlistDB));
            
            // Show success toast
            showToast('Welcome to Satmix!', "You've successfully joined the waitlist.", 'success');
            
            // Reset form
            waitlistForm.reset();
            
            // Open Success Thank You Popup
            if (successModal) {
              successModal.classList.add('active');
            }
          } else {
            throw new Error(data.message || 'Unknown server error');
          }
        })
        .catch(error => {
          console.error('Waitlist submission error:', error);
          showToast('Submission Error', 'Failed to join waitlist. Please try again.', 'error');
        })
        .finally(() => {
          // Reset loading state
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


  // ==========================================
  // 5. FAQ ACCORDION HANDLER
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
        }
      });
      
      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 6. BIDIRECTIONAL SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      } else {
        // Removing the class when leaving viewport allows it to trigger again when scrolling back up
        entry.target.classList.remove('reveal-active');
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -40px 0px' // Offset bottom trigger slightly for organic entry
  });

  const revealElements = document.querySelectorAll('.scroll-reveal');
  revealElements.forEach(el => revealObserver.observe(el));
});

