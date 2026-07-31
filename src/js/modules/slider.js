export function initSlider() {
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

}
