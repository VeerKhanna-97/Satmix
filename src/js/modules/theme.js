export function initTheme() {
  // ==========================================
  // THEME CONTROLLER & SYNC (REACT + VANILLA JS)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('satmix_theme_mode') || localStorage.getItem('satmix_theme');
    if (savedTheme) {
      return savedTheme;
    }
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return userPrefersDark ? 'dark' : 'light';
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      localStorage.setItem('satmix_theme_mode', 'dark');
      localStorage.setItem('satmix_theme', 'dark');
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = '<i data-lucide="sun" style="width: 18px; height: 18px;"></i>';
      }
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      localStorage.setItem('satmix_theme_mode', 'light');
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
      if (!localStorage.getItem('satmix_theme_mode') && !localStorage.getItem('satmix_theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark-theme');
      setTheme(isDark ? 'light' : 'dark');
    });
  }
}
