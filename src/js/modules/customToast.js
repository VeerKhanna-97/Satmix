// ==========================================
// CUSTOM TOAST NOTIFICATION
// ==========================================
window.showToast = function(title, message, isError = false) {
  let container = document.querySelector('.custom-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'custom-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  
  const iconName = isError ? 'alert-circle' : 'check-circle';
  const iconClass = isError ? 'custom-toast-icon error' : 'custom-toast-icon';

  toast.innerHTML = `
    <div class="${iconClass}">
      <i data-lucide="${iconName}"></i>
    </div>
    <div class="custom-toast-content">
      <div class="custom-toast-title">${title}</div>
      <div class="custom-toast-message">${message}</div>
    </div>
    <div class="custom-toast-close">
      <i data-lucide="x" style="width: 16px; height: 16px;"></i>
    </div>
  `;

  container.appendChild(toast);
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons({ root: toast });
  }

  toast.offsetHeight; // force reflow
  toast.classList.add('show');

  const removeToast = () => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 400);
  };

  toast.querySelector('.custom-toast-close').addEventListener('click', removeToast);
  setTimeout(removeToast, 5000);
};