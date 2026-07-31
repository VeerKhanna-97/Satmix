export function initTheme() {
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
}
