// Mobile Menu Controller
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinksContainer) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('mobile-open');
    });
  }

  // Handle dropdowns on mobile
  const dropdownTriggers = document.querySelectorAll('.nav-dropdown-trigger > .nav-link');
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 767) {
        e.preventDefault();
        const parent = trigger.parentElement;
        parent.classList.toggle('mobile-active');
        
        // Toggle chevron rotation
        const icon = trigger.querySelector('i') || trigger.querySelector('svg');
        if (icon) {
          if (parent.classList.contains('mobile-active')) {
            icon.style.transform = 'rotate(180deg)';
            icon.style.transition = 'transform 0.2s ease';
          } else {
            icon.style.transform = 'rotate(0deg)';
          }
        }
      }
    });
  });
});