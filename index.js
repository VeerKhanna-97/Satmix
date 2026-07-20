// Google Apps Script Web App URL for Google Sheets integration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzZXuSM4K79NVAAgsxtq9Z3G5qr7Tsma1zDss8t53xwDhQ3Dohj6JG5YuayepI44A6Sng/exec';

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // DARK MODE CONTROLLER (PREFER SYSTEM DEFAULT)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('satmix_theme');
    if (savedTheme) {
      return savedTheme;
    }
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return userPrefersDark ? 'dark' : 'light';
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      localStorage.setItem('satmix_theme', 'dark');
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = '<i data-lucide="sun" style="width: 18px; height: 18px;"></i>';
      }
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('satmix_theme', 'light');
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = '<i data-lucide="moon" style="width: 18px; height: 18px;"></i>';
      }
    }
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // Initialize
  setTheme(getPreferredTheme());

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('satmix_theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      setTheme(isDark ? 'light' : 'dark');
    });
  }

  // ==========================================
  // PATH NAV HIGHLIGHTING
  // ==========================================
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ==========================================
  // LIVE REAL-MARKET CRYPTO PRICE TICKER
  // ==========================================
  const tickerTrack = document.querySelector('.ticker-track');
  let previousPrices = {};

  async function fetchCryptoPrices() {
    try {
      const response = await fetch('https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,solana,tether');
      const json = await response.json();
      if (json && json.data) {
        renderTicker(json.data);
      }
    } catch (err) {
      console.warn("Using offline ticker fallback data", err);
      renderTicker(getFallbackPrices());
    }
  }

  function getFallbackPrices() {
    return [
      { id: 'bitcoin', symbol: 'BTC', priceUsd: (58000 + (Math.random() - 0.5) * 120).toString(), changePercent24Hr: '1.24' },
      { id: 'ethereum', symbol: 'ETH', priceUsd: (3100 + (Math.random() - 0.5) * 15).toString(), changePercent24Hr: '-0.45' },
      { id: 'solana', symbol: 'SOL', priceUsd: (145 + (Math.random() - 0.5) * 2.5).toString(), changePercent24Hr: '3.12' },
      { id: 'tether', symbol: 'USDT', priceUsd: '1.00', changePercent24Hr: '0.05' }
    ];
  }

  function renderTicker(data) {
    if (!tickerTrack) return;
    const order = ['bitcoin', 'ethereum', 'solana', 'tether'];
    data.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

    let tickerHTML = '';
    data.forEach(coin => {
      const priceUsd = parseFloat(coin.priceUsd);
      const priceInr = priceUsd * 88.00;
      const change = parseFloat(coin.changePercent24Hr);
      const isUp = change >= 0;
      const changeSign = isUp ? '+' : '';
      const changeClass = isUp ? 'price-up' : 'price-down';
      
      let priceText = '';
      if (coin.symbol === 'USDT') {
        priceText = `₹${priceInr.toFixed(2)}`;
      } else if (priceInr >= 100000) {
        priceText = `₹${(priceInr / 100000).toFixed(2)}L`;
      } else {
        priceText = `₹${new Intl.NumberFormat('en-IN').format(Math.round(priceInr))}`;
      }

      let flashClass = '';
      if (previousPrices[coin.id]) {
        if (priceUsd > previousPrices[coin.id]) {
          flashClass = 'price-up';
        } else if (priceUsd < previousPrices[coin.id]) {
          flashClass = 'price-down';
        }
      }
      previousPrices[coin.id] = priceUsd;

      tickerHTML += `
        <div class="ticker-item" id="ticker-${coin.id}">
          <span>${coin.symbol}/INR</span>
          <span class="ticker-price ${flashClass}">${priceText}</span>
          <span class="ticker-change ${changeClass}">${changeSign}${change.toFixed(2)}%</span>
        </div>
      `;
    });

    tickerTrack.innerHTML = tickerHTML + tickerHTML;

    setTimeout(() => {
      data.forEach(coin => {
        const itemPrice = document.querySelector(`#ticker-${coin.id} .ticker-price`);
        if (itemPrice) {
          itemPrice.classList.remove('price-up', 'price-down');
        }
      });
    }, 1000);
  }

  // Run immediately and poll
  fetchCryptoPrices();
  setInterval(fetchCryptoPrices, 10000);

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
    if (!slideTrack) return;
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
  const stratMedBtn = document.getElementById('calc-strat-med');
  const stratHighBtn = document.getElementById('calc-strat-high');
  
  const resultTotalVal = document.getElementById('result-total');
  const resultInvestedVal = document.getElementById('result-invested');
  const resultGainVal = document.getElementById('result-gain');
  
  let dailySavings = 50;
  let selectedStrategy = 'high'; // 'low', 'med', or 'high'
  
  const strategyRates = {
    low: 0.08,  // 8% annual yield for stablecoins
    med: 0.16,  // 16% Balanced Growth yield
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

  function updateSavingsGoals() {
    const dailyInput = dailySavings;
    const annualRate = strategyRates[selectedStrategy];

    // Helper to calculate days to reach target using compound interest
    function calculateDaysToTarget(target, daily, rate) {
      if (rate === 0) return target / daily;
      const dailyRate = rate / 365;
      const val = (target * dailyRate) / (daily * (1 + dailyRate));
      return Math.log(1 + val) / Math.log(1 + dailyRate);
    }

    // 1. Emergency Shield (Target ₹15,000)
    const emEtaElement = document.getElementById('goal-em-eta');
    if (emEtaElement) {
      const emergencyDays = Math.round(calculateDaysToTarget(15000, dailyInput, annualRate));
      emEtaElement.innerHTML = `Time to complete: <span>${emergencyDays} days</span>`;
    }
    
    // 2. Gadget Upgrade (Target ₹60,000)
    const gaEtaElement = document.getElementById('goal-ga-eta');
    if (gaEtaElement) {
      const gadgetDays = Math.round(calculateDaysToTarget(60000, dailyInput, annualRate));
      const totalMonths = Math.round(gadgetDays / 30);
      let gadgetStr = '';
      if (totalMonths < 12) {
        gadgetStr = `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;
      } else {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        gadgetStr = `${years} year${years !== 1 ? 's' : ''}`;
        if (months > 0) {
          gadgetStr += ` & ${months} month${months !== 1 ? 's' : ''}`;
        }
      }
      gaEtaElement.innerHTML = `Time to complete: <span>${gadgetStr}</span>`;
    }
    
    // 3. Wealth Accelerator (Target ₹2,50,000)
    const weEtaElement = document.getElementById('goal-we-eta');
    if (weEtaElement) {
      const wealthDays = Math.round(calculateDaysToTarget(250000, dailyInput, annualRate));
      const totalMonths = Math.round(wealthDays / 30);
      let wealthStr = '';
      if (totalMonths < 12) {
        wealthStr = `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;
      } else {
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        wealthStr = `${years} year${years !== 1 ? 's' : ''}`;
        if (months > 0) {
          wealthStr += ` & ${months} month${months !== 1 ? 's' : ''}`;
        }
      }
      weEtaElement.innerHTML = `Time to complete: <span>${wealthStr}</span>`;
    }
  }

  if (calcRange) {
    calcRange.addEventListener('input', (e) => {
      dailySavings = parseInt(e.target.value, 10);
      calcAmountVal.textContent = `₹${dailySavings}`;
      calculateReturns();
    });
  }

  if (stratLowBtn && stratMedBtn && stratHighBtn) {
    stratLowBtn.addEventListener('click', () => {
      selectedStrategy = 'low';
      stratLowBtn.classList.add('active');
      stratMedBtn.classList.remove('active');
      stratHighBtn.classList.remove('active');
      calculateReturns();
    });

    stratMedBtn.addEventListener('click', () => {
      selectedStrategy = 'med';
      stratMedBtn.classList.add('active');
      stratLowBtn.classList.remove('active');
      stratHighBtn.classList.remove('active');
      calculateReturns();
    });

    stratHighBtn.addEventListener('click', () => {
      selectedStrategy = 'high';
      stratHighBtn.classList.add('active');
      stratLowBtn.classList.remove('active');
      stratMedBtn.classList.remove('active');
      calculateReturns();
    });
  }

  // Wrap calculation run to also update goals
  const originalCalculateReturns = calculateReturns;
  calculateReturns = function() {
    originalCalculateReturns();
    updateSavingsGoals();
  };

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
        const formData = new URLSearchParams();
        // Keys must exactly match what the Google Apps Script expects (data.name, data.email)
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);

        // Send data to Google Apps Script
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        })
        .then(() => {
          // With no-cors, response is opaque so we assume success if no network error
          
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

  // ==========================================
  // 7. STEPS SCROLL ANIMATION
  // ==========================================
  const stepsSection = document.getElementById('steps-animation');
  const phones = [
    document.getElementById('phone-ui-1'),
    document.getElementById('phone-ui-2'),
    document.getElementById('phone-ui-3')
  ];
  const nodes = [
    document.getElementById('node-container-1'),
    document.getElementById('node-container-2'),
    document.getElementById('node-container-3')
  ];
  const timelineFill = document.getElementById('timeline-fill');

  if (stepsSection) {
    window.addEventListener('scroll', () => {
      const rect = stepsSection.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      
      let progress = 0;
      if (totalScrollable > 0) {
        progress = -rect.top / totalScrollable;
      }
      
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      if (timelineFill) {
        timelineFill.style.width = `${progress * 100}%`;
      }

      let stepIndex = 0;
      if (progress > 0.33) stepIndex = 1;
      if (progress > 0.66) stepIndex = 2;

      phones.forEach((phone, idx) => {
        if (phone) {
          if (idx === stepIndex) {
            phone.classList.add('active');
          } else {
            phone.classList.remove('active');
          }
        }
      });

      nodes.forEach((node, idx) => {
        if (node) {
          if (idx <= stepIndex) {
            node.classList.add('active');
          } else {
            node.classList.remove('active');
          }
        }
      });
    });
    
    // Trigger once on load
    setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 100);
  }

  // ==========================================
  // 8. FLEXIBLE SAVINGS SCROLL ANIMATION
  // ==========================================
  const flexSection = document.getElementById('flex-savings');
  const flexTabs = document.querySelectorAll('.flex-tab');
  const flexCards = document.querySelectorAll('.flex-card');
  const flexTexts = document.querySelectorAll('.flex-text-group');
  const flexScrollThumb = document.getElementById('flex-scroll-thumb');

  if (flexSection) {
    window.addEventListener('scroll', () => {
      const rect = flexSection.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      
      let progress = 0;
      if (totalScrollable > 0) {
        progress = -rect.top / totalScrollable;
      }
      
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      if (flexScrollThumb) {
        flexScrollThumb.style.top = `${progress * 120}px`;
      }

      let stepIndex = 0;
      if (progress > 0.25) stepIndex = 1;
      if (progress > 0.50) stepIndex = 2;
      if (progress > 0.75) stepIndex = 3;

      flexTabs.forEach((tab, idx) => {
        tab.classList.toggle('active', idx === stepIndex);
      });

      flexCards.forEach((card, idx) => {
        card.classList.toggle('active', idx === stepIndex);
      });

      flexTexts.forEach((text, idx) => {
        text.classList.toggle('active', idx === stepIndex);
      });
    });
  }
});

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

      // REPLACE THIS URL with your deployed Google Apps Script Web App URL
      const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

      if (scriptURL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        alert('Please update the scriptURL in index.js with your deployed Apps Script URL.');
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        return;
      }

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
          alert('Thank you for contacting Satmix! Our support team will get in touch with you shortly.');
          contactForm.reset();
        } else {
          alert('Oops! Something went wrong. Please try again later.');
        }
      } catch (error) {
        console.error('Error!', error.message);
        alert('Oops! Something went wrong. Please try again later.');
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }
});
