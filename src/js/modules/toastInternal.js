export function initToastInternal() {
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
}
