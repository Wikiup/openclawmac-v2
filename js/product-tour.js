/**
 * INTERACTIVE PRODUCT TOUR SYSTEM
 * Modern SaaS onboarding pattern (2026)
 * Sequential tooltips guiding first-time visitors through key sections
 * 
 * Features:
 * - Welcome modal on first visit
 * - Sequential spotlight highlighting
 * - Progress tracking & navigation
 * - LocalStorage persistence (show once)
 * - Keyboard navigation (Arrow keys, Escape)
 * - Mobile responsive
 * - Accessible (ARIA, focus management)
 */

class ProductTour {
  constructor() {
    this.currentStep = 0;
    this.isActive = false;
    this.hasCompletedTour = localStorage.getItem('tour-completed') === 'true';
    
    // Tour steps configuration
    this.steps = [
      {
        target: '.hero-section',
        title: '👋 Welcome to OpenClaw Mac',
        description: 'Professional installation and setup service for your Mac. Let\'s show you around!',
        position: 'bottom'
      },
      {
        target: '.stats-dashboard-section',
        title: '📊 Real Results',
        description: 'See our track record: 127+ successful setups with 98% satisfaction. Real clients, real outcomes.',
        position: 'bottom'
      },
      {
        target: '.service-timeline-section',
        title: '🎯 Simple 4-Step Process',
        description: 'Book → Consult → Execute → Deliver. Clear, predictable, professional. No surprises.',
        position: 'top'
      },
      {
        target: '.video-testimonials-section',
        title: '🎥 Hear From Clients',
        description: 'Watch real testimonials from Mac users who went from DIY struggles to working setups.',
        position: 'top'
      },
      {
        target: '#pricing',
        title: '💎 Choose Your Package',
        description: 'Three tiers designed for different needs. Not sure? Take the quiz above to find your perfect fit.',
        position: 'top'
      },
      {
        target: '.availability-calendar-section',
        title: '📅 See Real Availability',
        description: 'No mystery booking. See exact available slots and choose what works for your schedule.',
        position: 'top'
      },
      {
        target: '#booking',
        title: '✅ Ready to Book?',
        description: 'Fill out this form to secure your session. You\'ll get a confirmation within 24 hours.',
        position: 'top'
      }
    ];

    this.init();
  }

  init() {
    // Don't show if already completed
    if (this.hasCompletedTour) {
      this.createRestartButton();
      return;
    }

    // Show welcome modal after 2 seconds
    setTimeout(() => {
      this.showWelcomeModal();
    }, 2000);
  }

  showWelcomeModal() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'tour-overlay active';
    overlay.id = 'tour-overlay';
    document.body.appendChild(overlay);

    // Create welcome modal
    const modal = document.createElement('div');
    modal.className = 'tour-welcome-modal';
    modal.id = 'tour-welcome-modal';
    modal.innerHTML = `
      <div class="tour-welcome-icon">🦞</div>
      <h2 class="tour-welcome-title">First Time Here?</h2>
      <p class="tour-welcome-description">
        Take a 60-second guided tour to see how OpenClaw Mac works, 
        what's included, and how to book your session.
      </p>
      <div class="tour-welcome-controls">
        <button class="tour-welcome-btn tour-welcome-btn-skip" id="tour-skip-welcome">
          No Thanks
        </button>
        <button class="tour-welcome-btn tour-welcome-btn-start" id="tour-start-welcome">
          Start Tour (60s)
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    // Animate in
    setTimeout(() => {
      modal.classList.add('active');
    }, 100);

    // Event listeners
    document.getElementById('tour-skip-welcome').addEventListener('click', () => {
      this.skipTour();
    });

    document.getElementById('tour-start-welcome').addEventListener('click', () => {
      this.startTour();
    });

    // ESC to skip
    this.welcomeEscapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.skipTour();
      }
    };
    document.addEventListener('keydown', this.welcomeEscapeHandler);
  }

  startTour() {
    // Remove welcome modal
    const modal = document.getElementById('tour-welcome-modal');
    const overlay = document.getElementById('tour-overlay');
    
    modal.classList.remove('active');
    
    setTimeout(() => {
      modal.remove();
      document.removeEventListener('keydown', this.welcomeEscapeHandler);
      
      // Start actual tour
      this.isActive = true;
      this.currentStep = 0;
      this.showStep(this.currentStep);
      this.createRestartButton();
    }, 500);
  }

  skipTour() {
    const modal = document.getElementById('tour-welcome-modal');
    const overlay = document.getElementById('tour-overlay');
    
    modal.classList.remove('active');
    overlay.classList.remove('active');
    
    setTimeout(() => {
      modal.remove();
      overlay.remove();
      document.removeEventListener('keydown', this.welcomeEscapeHandler);
    }, 400);

    // Mark as completed so it doesn't show again
    localStorage.setItem('tour-completed', 'true');
    this.hasCompletedTour = true;
    this.createRestartButton();
  }

  showStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.steps.length) return;

    const step = this.steps[stepIndex];
    const target = document.querySelector(step.target);

    if (!target) {
      console.warn(`Tour target not found: ${step.target}`);
      this.nextStep();
      return;
    }

    // Scroll target into view
    target.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });

    setTimeout(() => {
      this.createSpotlight(target);
      this.createTooltip(target, step, stepIndex);
      this.setupKeyboardNavigation();
    }, 600);
  }

  createSpotlight(target) {
    // Remove existing spotlight
    const existingSpotlight = document.getElementById('tour-spotlight');
    if (existingSpotlight) existingSpotlight.remove();

    // Create new spotlight
    const spotlight = document.createElement('div');
    spotlight.className = 'tour-spotlight';
    spotlight.id = 'tour-spotlight';
    document.body.appendChild(spotlight);

    // Position spotlight
    this.positionSpotlight(target, spotlight);

    // Reposition on resize
    this.resizeHandler = () => this.positionSpotlight(target, spotlight);
    window.addEventListener('resize', this.resizeHandler);
  }

  positionSpotlight(target, spotlight) {
    const rect = target.getBoundingClientRect();
    const padding = 12;

    spotlight.style.top = `${rect.top + window.scrollY - padding}px`;
    spotlight.style.left = `${rect.left + window.scrollX - padding}px`;
    spotlight.style.width = `${rect.width + (padding * 2)}px`;
    spotlight.style.height = `${rect.height + (padding * 2)}px`;
  }

  createTooltip(target, step, stepIndex) {
    // Remove existing tooltip
    const existingTooltip = document.getElementById('tour-tooltip');
    if (existingTooltip) existingTooltip.remove();

    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip';
    tooltip.id = 'tour-tooltip';
    tooltip.setAttribute('data-position', step.position);
    tooltip.setAttribute('role', 'dialog');
    tooltip.setAttribute('aria-labelledby', 'tour-tooltip-title');
    tooltip.innerHTML = `
      <div class="tour-tooltip-header">
        <span class="tour-step-badge">Step ${stepIndex + 1} of ${this.steps.length}</span>
        <button class="tour-close-btn" id="tour-close" aria-label="Close tour">×</button>
      </div>
      <h3 class="tour-tooltip-title" id="tour-tooltip-title">${step.title}</h3>
      <p class="tour-tooltip-description">${step.description}</p>
      <div class="tour-progress">
        ${this.steps.map((_, i) => `
          <div class="tour-progress-dot ${i === stepIndex ? 'active' : ''} ${i < stepIndex ? 'completed' : ''}" 
               data-step="${i}"
               role="button"
               tabindex="0"
               aria-label="Go to step ${i + 1}"></div>
        `).join('')}
      </div>
      <div class="tour-controls">
        <button class="tour-btn tour-btn-secondary" id="tour-prev" ${stepIndex === 0 ? 'disabled' : ''}>
          ← Previous
        </button>
        <button class="tour-btn tour-btn-primary" id="tour-next">
          ${stepIndex === this.steps.length - 1 ? 'Finish ✓' : 'Next →'}
        </button>
      </div>
      <div class="tour-skip">
        <a href="#" class="tour-skip-link" id="tour-skip">Skip Tour</a>
      </div>
    `;
    document.body.appendChild(tooltip);

    // Position tooltip
    this.positionTooltip(target, tooltip, step.position);

    // Animate in
    setTimeout(() => {
      tooltip.classList.add('active');
    }, 100);

    // Event listeners
    document.getElementById('tour-close').addEventListener('click', () => this.endTour());
    document.getElementById('tour-skip').addEventListener('click', (e) => {
      e.preventDefault();
      this.endTour();
    });

    const prevBtn = document.getElementById('tour-prev');
    if (prevBtn && !prevBtn.disabled) {
      prevBtn.addEventListener('click', () => this.prevStep());
    }

    document.getElementById('tour-next').addEventListener('click', () => {
      if (stepIndex === this.steps.length - 1) {
        this.completeTour();
      } else {
        this.nextStep();
      }
    });

    // Progress dots navigation
    document.querySelectorAll('.tour-progress-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const targetStep = parseInt(dot.getAttribute('data-step'));
        this.goToStep(targetStep);
      });
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const targetStep = parseInt(dot.getAttribute('data-step'));
          this.goToStep(targetStep);
        }
      });
    });

    // Focus first interactive element
    document.getElementById('tour-next').focus();
  }

  positionTooltip(target, tooltip, position) {
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const offset = 24;

    let top, left;

    switch (position) {
      case 'bottom':
        top = rect.bottom + window.scrollY + offset;
        left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'top':
        top = rect.top + window.scrollY - tooltipRect.height - offset;
        left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = rect.top + window.scrollY + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.left + window.scrollX - tooltipRect.width - offset;
        break;
      case 'right':
        top = rect.top + window.scrollY + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.right + window.scrollX + offset;
        break;
      default:
        top = rect.bottom + window.scrollY + offset;
        left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
    }

    // Keep tooltip in viewport
    const padding = 16;
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  setupKeyboardNavigation() {
    this.keyboardHandler = (e) => {
      if (!this.isActive) return;

      switch (e.key) {
        case 'Escape':
          this.endTour();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          if (this.currentStep < this.steps.length - 1) {
            this.nextStep();
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          if (this.currentStep > 0) {
            this.prevStep();
          }
          break;
      }
    };

    document.addEventListener('keydown', this.keyboardHandler);
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.showStep(this.currentStep);
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep(this.currentStep);
    }
  }

  goToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStep = stepIndex;
      this.showStep(this.currentStep);
    }
  }

  completeTour() {
    // Mark as completed
    localStorage.setItem('tour-completed', 'true');
    this.hasCompletedTour = true;

    // Clean up
    this.cleanup();

    // Show completion message
    this.showCompletionMessage();
  }

  endTour() {
    // Mark as completed so it doesn't show again
    localStorage.setItem('tour-completed', 'true');
    this.hasCompletedTour = true;

    this.cleanup();
  }

  cleanup() {
    this.isActive = false;

    // Remove spotlight
    const spotlight = document.getElementById('tour-spotlight');
    if (spotlight) spotlight.remove();

    // Remove tooltip
    const tooltip = document.getElementById('tour-tooltip');
    if (tooltip) {
      tooltip.classList.remove('active');
      setTimeout(() => tooltip.remove(), 400);
    }

    // Remove overlay
    const overlay = document.getElementById('tour-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 400);
    }

    // Remove event listeners
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
    }
  }

  showCompletionMessage() {
    // Create confetti effect (if particle system is available)
    if (typeof window.createConfetti === 'function') {
      window.createConfetti();
    }

    // Show toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4);
      z-index: 10001;
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    `;
    toast.textContent = '✅ Tour Complete! Ready to book your session?';
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 100);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-20px)';
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  }

  createRestartButton() {
    // Don't create if already exists
    if (document.getElementById('tour-restart-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'tour-restart-btn';
    btn.id = 'tour-restart-btn';
    btn.textContent = 'Restart Tour';
    btn.setAttribute('aria-label', 'Restart product tour');
    document.body.appendChild(btn);

    // Show after 3 seconds
    setTimeout(() => {
      btn.classList.add('visible');
    }, 3000);

    btn.addEventListener('click', () => {
      // Reset state
      localStorage.removeItem('tour-completed');
      this.hasCompletedTour = false;
      this.currentStep = 0;
      
      // Remove restart button
      btn.classList.remove('visible');
      setTimeout(() => btn.remove(), 300);

      // Show welcome modal
      this.showWelcomeModal();
    });
  }
}

// Initialize tour when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // new ProductTour(); // Disabled auto-start
  });
} else {
  // new ProductTour(); // Disabled auto-start
}

// Expose for debugging
window.ProductTour = ProductTour;
