/**
 * Advanced Micro-interactions System
 * Premium tactile feedback for 2026 UX standards
 * Inspired by: Material Design 3, Apple HIG, Linear, Vercel, Stripe
 */

class MicroInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupRippleEffects();
    this.setupButtonAnimations();
    this.setupFormAnimations();
    this.setupCardAnimations();
    this.setupLoadingStates();
    this.setupSuccessAnimations();
  }

  /**
   * Material Design 3 Ripple Effects
   * Creates expanding circle ripple on click
   */
  setupRippleEffects() {
    const rippleElements = document.querySelectorAll('.btn, .pricing-card, .feature-card, .nav-link, .social-link');
    
    rippleElements.forEach(el => {
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      
      el.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        el.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  /**
   * Advanced Button Animations
   * Scale down on press, bounce on release
   */
  setupButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
      // Press down effect
      btn.addEventListener('mousedown', () => {
        btn.style.transform = 'scale(0.95)';
      });
      
      btn.addEventListener('mouseup', () => {
        btn.style.transform = 'scale(1)';
        this.bounceEffect(btn);
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
      });
      
      // Glow pulse on hover
      btn.addEventListener('mouseenter', () => {
        this.glowPulse(btn);
      });
    });
  }

  /**
   * Bounce effect animation
   */
  bounceEffect(element) {
    element.animate([
      { transform: 'scale(0.95)' },
      { transform: 'scale(1.02)' },
      { transform: 'scale(0.98)' },
      { transform: 'scale(1)' }
    ], {
      duration: 400,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });
  }

  /**
   * Glow pulse animation
   */
  glowPulse(element) {
    const currentShadow = getComputedStyle(element).boxShadow;
    element.animate([
      { boxShadow: currentShadow },
      { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.3)' },
      { boxShadow: currentShadow }
    ], {
      duration: 800,
      easing: 'ease-in-out'
    });
  }

  /**
   * Form Field Animations
   * Focus glow, floating labels, validation states
   */
  setupFormAnimations() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Focus animation
      input.addEventListener('focus', () => {
        this.focusGlow(input);
        if (input.value === '') {
          this.floatLabel(input);
        }
      });
      
      // Blur animation
      input.addEventListener('blur', () => {
        if (input.value === '') {
          this.sinkLabel(input);
        }
      });
      
      // Real-time validation feedback
      input.addEventListener('input', () => {
        if (input.validity.valid && input.value !== '') {
          this.showValidFeedback(input);
        }
      });
    });
  }

  /**
   * Focus glow effect for form fields
   */
  focusGlow(input) {
    input.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    input.animate([
      { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)' },
      { boxShadow: '0 0 0 4px rgba(139, 92, 246, 0.2), 0 0 20px rgba(139, 92, 246, 0.3)' }
    ], {
      duration: 300,
      fill: 'forwards'
    });
  }

  /**
   * Floating label animation
   */
  floatLabel(input) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) {
      label.animate([
        { transform: 'translateY(0) scale(1)', opacity: 0.7 },
        { transform: 'translateY(-24px) scale(0.85)', opacity: 1 }
      ], {
        duration: 200,
        fill: 'forwards',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });
    }
  }

  /**
   * Sink label animation
   */
  sinkLabel(input) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) {
      label.animate([
        { transform: 'translateY(-24px) scale(0.85)', opacity: 1 },
        { transform: 'translateY(0) scale(1)', opacity: 0.7 }
      ], {
        duration: 200,
        fill: 'forwards',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });
    }
  }

  /**
   * Valid input feedback (checkmark animation)
   */
  showValidFeedback(input) {
    const existingCheck = input.parentElement.querySelector('.valid-check');
    if (existingCheck) existingCheck.remove();
    
    const check = document.createElement('span');
    check.className = 'valid-check';
    check.innerHTML = '✓';
    check.style.cssText = `
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%) scale(0);
      color: #10b981;
      font-size: 20px;
      font-weight: bold;
    `;
    
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(check);
    
    check.animate([
      { transform: 'translateY(-50%) scale(0) rotate(-180deg)', opacity: 0 },
      { transform: 'translateY(-50%) scale(1.2) rotate(0deg)', opacity: 1 },
      { transform: 'translateY(-50%) scale(1) rotate(0deg)', opacity: 1 }
    ], {
      duration: 400,
      fill: 'forwards',
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    });
  }

  /**
   * Card Hover Animations
   * Subtle lift and glow on hover
   */
  setupCardAnimations() {
    const cards = document.querySelectorAll('.pricing-card, .feature-card, .testimonial-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.animate([
          { transform: 'translateY(0)', boxShadow: getComputedStyle(card).boxShadow },
          { transform: 'translateY(-8px)', boxShadow: '0 20px 60px -10px rgba(139, 92, 246, 0.4)' }
        ], {
          duration: 300,
          fill: 'forwards',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        card.animate([
          { transform: 'translateY(-8px)', boxShadow: '0 20px 60px -10px rgba(139, 92, 246, 0.4)' },
          { transform: 'translateY(0)', boxShadow: '0 10px 30px -10px rgba(139, 92, 246, 0.2)' }
        ], {
          duration: 300,
          fill: 'forwards',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
      });
    });
  }

  /**
   * Loading State Management
   * Skeleton screens and loading animations
   */
  setupLoadingStates() {
    // Add loading state helper method
    window.showLoadingState = (element, message = 'Loading...') => {
      element.dataset.originalHTML = element.innerHTML;
      element.classList.add('loading-state');
      element.disabled = true;
      
      element.innerHTML = `
        <span class="loading-spinner"></span>
        <span class="loading-text">${message}</span>
      `;
      
      this.spinAnimation(element.querySelector('.loading-spinner'));
    };
    
    window.hideLoadingState = (element) => {
      if (element.dataset.originalHTML) {
        element.innerHTML = element.dataset.originalHTML;
        delete element.dataset.originalHTML;
      }
      element.classList.remove('loading-state');
      element.disabled = false;
    };
  }

  /**
   * Spinner animation
   */
  spinAnimation(spinner) {
    if (!spinner) return;
    
    spinner.animate([
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(360deg)' }
    ], {
      duration: 1000,
      iterations: Infinity,
      easing: 'linear'
    });
  }

  /**
   * Success Animation System
   * Checkmark reveal, confetti, success state
   */
  setupSuccessAnimations() {
    window.showSuccessAnimation = (element, message = 'Success!') => {
      const successOverlay = document.createElement('div');
      successOverlay.className = 'success-overlay';
      successOverlay.innerHTML = `
        <div class="success-check">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#10b981" stroke-width="4" class="success-circle"/>
            <path d="M20 40 L35 55 L60 25" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round" class="success-path"/>
          </svg>
        </div>
        <div class="success-message">${message}</div>
      `;
      
      element.appendChild(successOverlay);
      
      // Animate circle
      const circle = successOverlay.querySelector('.success-circle');
      circle.style.strokeDasharray = '220';
      circle.style.strokeDashoffset = '220';
      circle.animate([
        { strokeDashoffset: '220' },
        { strokeDashoffset: '0' }
      ], {
        duration: 600,
        fill: 'forwards',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      });
      
      // Animate checkmark
      const path = successOverlay.querySelector('.success-path');
      path.style.strokeDasharray = '60';
      path.style.strokeDashoffset = '60';
      setTimeout(() => {
        path.animate([
          { strokeDashoffset: '60' },
          { strokeDashoffset: '0' }
        ], {
          duration: 400,
          fill: 'forwards',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });
      }, 300);
      
      // Scale in overlay
      successOverlay.animate([
        { opacity: 0, transform: 'scale(0.8)' },
        { opacity: 1, transform: 'scale(1)' }
      ], {
        duration: 500,
        fill: 'forwards',
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      });
      
      // Auto remove after 3s
      setTimeout(() => {
        successOverlay.animate([
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.9)' }
        ], {
          duration: 300,
          fill: 'forwards'
        });
        setTimeout(() => successOverlay.remove(), 300);
      }, 3000);
    };
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new MicroInteractions());
} else {
  new MicroInteractions();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MicroInteractions;
}
