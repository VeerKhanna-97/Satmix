export function initAnimations() {
  // ==========================================
  // 6. BIDIRECTIONAL SCROLL REVEAL ANIMATIONS
  // ==========================================
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target); // Stop observing once revealed for better performance
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
}
