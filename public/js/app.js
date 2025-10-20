/* ========================================
   PREMIUM MICRO-INTERACTIONS & UTILITIES
   Smooth, delightful user experience
   ======================================== */

// ============================================
// THEME MANAGEMENT
// ============================================

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateIcon();

    // Remove preload class after page load
    window.addEventListener('load', () => {
      document.body.classList.remove('preload');
    });
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    this.updateIcon();
    this.triggerAnimation();
  }

  updateIcon() {
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  triggerAnimation() {
    // Add subtle animation on theme change
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
  }
}

// Initialize theme manager
const themeManager = new ThemeManager();

function toggleTheme() {
  themeManager.toggle();
}

// ============================================
// RIPPLE EFFECT
// ============================================

function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple-effect');

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add ripple to all buttons
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button:not(.no-ripple)');
  buttons.forEach(button => {
    if (!button.classList.contains('ripple-added')) {
      button.addEventListener('click', createRipple);
      button.classList.add('ripple-added');
      button.style.position = 'relative';
      button.style.overflow = 'hidden';
    }
  });
});

// ============================================
// TOAST NOTIFICATIONS
// ============================================

class ToastManager {
  constructor() {
    this.container = null;
    this.toasts = [];
    this.init();
  }

  init() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      `;
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('toast-container');
    }
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} toast-enter`;
    toast.style.cssText = `
      background: var(--surface-primary);
      backdrop-filter: blur(var(--blur-lg));
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      padding: 16px 20px;
      box-shadow: var(--shadow-xl);
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 300px;
      max-width: 400px;
      pointer-events: auto;
      border-left: 4px solid var(--color-${type});
    `;

    const icon = this.getIcon(type);
    const text = document.createElement('span');
    text.textContent = message;
    text.style.cssText = `
      color: var(--text-primary);
      font-size: 14px;
      font-weight: 500;
      flex: 1;
    `;

    toast.innerHTML = `<i class="${icon}" style="color: var(--color-${type}); font-size: 18px;"></i>`;
    toast.appendChild(text);

    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Auto remove after duration
    setTimeout(() => {
      this.remove(toast);
    }, duration);
  }

  getIcon(type) {
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
  }

  remove(toast) {
    toast.classList.add('toast-exit');
    setTimeout(() => {
      toast.remove();
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 300);
  }
}

const toastManager = new ToastManager();

function showToast(message, type = 'info', duration = 3000) {
  toastManager.show(message, type, duration);
}

// ============================================
// NUMBER COUNT-UP ANIMATION
// ============================================

function animateNumber(element, target, duration = 1000) {
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(start + (target - start) * easeOutQuad);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

// ============================================
// GREETING MESSAGE (Time-based)
// ============================================

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'おはようございます';
  if (hour < 18) return 'こんにちは';
  return 'こんばんは';
}

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ============================================
// SKELETON LOADING
// ============================================

function showSkeleton(container) {
  container.classList.add('skeleton');
  container.innerHTML = '';
}

function hideSkeleton(container, content) {
  container.classList.remove('skeleton');
  container.innerHTML = content;
}

// ============================================
// SMOOTH SCROLL
// ============================================

function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

// ============================================
// FORM VALIDATION WITH ANIMATIONS
// ============================================

function validateInput(input) {
  if (!input.checkValidity()) {
    input.classList.add('invalid');
    input.classList.add('animate-shake');
    setTimeout(() => {
      input.classList.remove('animate-shake');
    }, 500);
    return false;
  }
  input.classList.remove('invalid');
  return true;
}

// ============================================
// LOADING STATE MANAGER
// ============================================

class LoadingManager {
  constructor() {
    this.activeLoaders = new Set();
  }

  show(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      this.activeLoaders.add(elementId);
      element.classList.add('loading');

      // Add spinner
      const spinner = document.createElement('div');
      spinner.className = 'spinner spinner-sm';
      spinner.id = `spinner-${elementId}`;
      element.appendChild(spinner);
    }
  }

  hide(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      this.activeLoaders.delete(elementId);
      element.classList.remove('loading');

      // Remove spinner
      const spinner = document.getElementById(`spinner-${elementId}`);
      if (spinner) spinner.remove();
    }
  }

  isLoading(elementId) {
    return this.activeLoaders.has(elementId);
  }
}

const loadingManager = new LoadingManager();

// ============================================
// MODAL MANAGER
// ============================================

class ModalManager {
  show(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('modal-backdrop-enter');
      const content = modal.querySelector('.modal-content');
      if (content) {
        content.classList.add('modal-content-enter');
      }
      document.body.style.overflow = 'hidden';
    }
  }

  hide(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }
}

const modalManager = new ModalManager();

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K for theme toggle
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    toggleTheme();
  }
});

// ============================================
// PAGE LOAD ANIMATIONS
// ============================================

window.addEventListener('DOMContentLoaded', () => {
  // Add entrance animations to cards
  const cards = document.querySelectorAll('.card, .stat-card, .kpi-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    setTimeout(() => {
      card.classList.add('animate-fade-in-up');
      card.style.opacity = '1';
    }, index * 100);
  });

  // Add stagger animation to list items
  const listItems = document.querySelectorAll('.nav-item, .menu-item');
  listItems.forEach((item, index) => {
    item.classList.add('stagger-item');
    item.style.animationDelay = `${index * 0.05}s`;
  });
});

// ============================================
// FOCUS VISIBLE (Accessibility)
// ============================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Format time duration
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}時間${mins}分`;
}

// Format date
function formatDate(date) {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ============================================
// EXPORT FOR USE IN OTHER FILES
// ============================================

window.App = {
  themeManager,
  toastManager,
  loadingManager,
  modalManager,
  showToast,
  animateNumber,
  getGreeting,
  getCurrentTime,
  validateInput,
  debounce,
  throttle,
  formatDuration,
  formatDate
};

console.log('✨ App utilities loaded successfully');
