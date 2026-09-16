
import { initTheme } from './modules/theme.js';
import { initNav } from './modules/nav.js';
import { initTicker } from './modules/ticker.js';
import { initSlider } from './modules/slider.js';
import { initCalculator } from './modules/calculator.js';
import { initToastInternal } from './modules/toastInternal.js';
import { initWaitlist } from './modules/waitlist.js';
import { initFaq } from './modules/faq.js';
import { initAnimations } from './modules/animations.js';

// Import side-effect modules (these have their own DOMContentLoaded listeners or attach to window)
import './modules/customToast.js';
import './modules/contact.js';
import './modules/mobileMenu.js';
import './modules/tooltips.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initTicker();
  initSlider();
  initCalculator();
  initToastInternal();
  initWaitlist();
  initFaq();
  initAnimations();
});
