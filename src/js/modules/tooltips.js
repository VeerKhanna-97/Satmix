// Crypto Pie Chart Tooltips
document.addEventListener('DOMContentLoaded', () => {
  const tooltip = document.getElementById('crypto-tooltip');
  const segments = document.querySelectorAll('.crypto-segment');

  if (tooltip && segments.length > 0) {
    segments.forEach(segment => {
      segment.addEventListener('mouseenter', (e) => {
        const desc = e.target.getAttribute('data-crypto-desc');
        if (desc) {
          tooltip.innerHTML = desc;
          tooltip.classList.add('visible');
          tooltip.style.left = e.clientX + 'px';
          tooltip.style.top = e.clientY + 'px';
        }
      });

      segment.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.clientX + 'px';
        tooltip.style.top = e.clientY + 'px';
      });

      segment.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });
  }
});