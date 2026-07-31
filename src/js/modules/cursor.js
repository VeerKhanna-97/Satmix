// Calc Results Pane Cursor Glow Tracker
document.addEventListener('DOMContentLoaded', () => {
  const calcPane = document.querySelector('.calc-results-pane');
  if (calcPane) {
    calcPane.addEventListener('mousemove', (e) => {
      const rect = calcPane.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      calcPane.style.setProperty('--mouse-x', `${x}px`);
      calcPane.style.setProperty('--mouse-y', `${y}px`);
    });
  }
});

// Custom Cursor Logic
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if device supports hover (pointer: fine)
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let cursorDot = document.querySelector('.cursor-dot');
  let cursorRing = document.querySelector('.cursor-ring');
  
  // Dynamically inject cursor elements if they are missing on this page
  if (!cursorDot || !cursorRing) {
    cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursorRing);
  }
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  
  let ringX = mouseX;
  let ringY = mouseY;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update dot immediately for instant responsiveness
    cursorDot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });
  
  // Animation loop for smooth ring trailing (lerp)
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
  
  // Interactive Hover States
  const addHoverState = () => {
    cursorDot.classList.add('hover');
    cursorRing.classList.add('hover');
  };
  
  const removeHoverState = () => {
    cursorDot.classList.remove('hover');
    cursorRing.classList.remove('hover');
  };

  // Add listeners to existing interactive elements
  const interactables = document.querySelectorAll('a, button, input:not([type="range"]), select, textarea, .nav-link, .crypto-segment, [role="button"], .slide-tab-btn');
  interactables.forEach(el => {
    el.addEventListener('mouseenter', addHoverState);
    el.addEventListener('mouseleave', removeHoverState);
  });

  // Slider Morph State
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach(slider => {
    slider.addEventListener('mouseenter', () => {
      cursorDot.classList.add('drag');
      cursorRing.classList.add('drag');
    });
    slider.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('drag');
      cursorRing.classList.remove('drag');
    });
  });

  // Click States
  window.addEventListener('mousedown', () => {
    cursorDot.classList.add('active');
    cursorRing.classList.add('active');
  });
  window.addEventListener('mouseup', () => {
    cursorDot.classList.remove('active');
    cursorRing.classList.remove('active');
  });
});