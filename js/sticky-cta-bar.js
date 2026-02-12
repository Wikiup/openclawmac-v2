/**
 * FLOATING STICKY CTA BAR
 * Modern conversion pattern - appears after hero scroll
 * Features: Scroll-triggered, dismissible, urgency messaging, dual CTAs
 */

class StickyCTABar {
  constructor() {
    this.bar = null;
    this.isVisible = false;
    this.isDismissed = false;
    this.heroSection = null;
    this.observer = null;
    
    // Config
    this.config = {
      storageKey: 'openclawmac_cta_dismissed',
      dismissDuration: 24 * 60 * 60 * 1000, // 24 hours
      urgencyMessage: '3 slots left this week',
      scrollThreshold: 0.8, // Show when 80% of hero is scrolled past
    };
    
    this.init();
  }
  
  init() {
    // Check if previously dismissed
    this.checkDismissalStatus();
    
    // Create the bar
    this.createBar();
    
    // Setup scroll observer
    this.setupObserver();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Keyboard navigation
    this.setupKeyboardNav();
  }
  
  checkDismissalStatus() {
    try {
      const dismissedData = localStorage.getItem(this.config.storageKey);
      if (dismissedData) {
        const { timestamp } = JSON.parse(dismissedData);
        const now = Date.now();
        
        // Check if dismissal has expired
        if (now - timestamp < this.config.dismissDuration) {
          this.isDismissed = true;
        } else {
          // Expired - clear it
          localStorage.removeItem(this.config.storageKey);
        }
      }
    } catch (e) {
      console.warn('Failed to check dismissal status:', e);
    }
  }
  
  createBar() {
    // Create container
    this.bar = document.createElement('div');
    this.bar.className = 'sticky-cta-bar';
    this.bar.setAttribute('role', 'region');
    this.bar.setAttribute('aria-label', 'Quick booking actions');
    
    // If dismissed, add class immediately
    if (this.isDismissed) {
      this.bar.classList.add('dismissed');
    }
    
    // Build HTML
    this.bar.innerHTML = `
      <div class="sticky-cta-container">
        <div class="sticky-cta-content">
          <div class="sticky-cta-icon" aria-hidden="true">🚀</div>
          <div class="sticky-cta-text">
            <p class="sticky-cta-title">Ready to get your Mac set up right?</p>
            <p class="sticky-cta-subtitle">
              Professional OpenClaw installation & configuration
              <span class="urgency-badge">${this.config.urgencyMessage}</span>
            </p>
          </div>
        </div>
        
        <div class="sticky-cta-actions">
          <a href="#availability-calendar" class="sticky-cta-btn secondary" data-action="view-availability">
            <span>📅</span>
            <span>View Availability</span>
          </a>
          <a href="#booking-form" class="sticky-cta-btn primary" data-action="book-now">
            <span>⚡</span>
            <span>Book Now</span>
          </a>
        </div>
        
        <button 
          class="sticky-cta-close" 
          aria-label="Dismiss booking bar"
          title="Dismiss (returns tomorrow)"
        >
          ✕
        </button>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(this.bar);
  }
  
  setupObserver() {
    // Find hero section (or use viewport top as fallback)
    this.heroSection = document.querySelector('.hero-section') || 
                      document.querySelector('header') ||
                      document.querySelector('section');
    
    if (!this.heroSection) {
      // Fallback: show after scrolling 500px
      this.setupScrollFallback();
      return;
    }
    
    // Intersection Observer options
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.2, 0.5, 0.8, 1.0],
    };
    
    // Create observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show bar when hero is mostly scrolled past
        if (entry.intersectionRatio < this.config.scrollThreshold) {
          this.show();
        } else {
          this.hide();
        }
      });
    }, options);
    
    // Start observing
    this.observer.observe(this.heroSection);
  }
  
  setupScrollFallback() {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          
          if (scrollY > 500) {
            this.show();
          } else {
            this.hide();
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  show() {
    if (this.isVisible || this.isDismissed) return;
    
    requestAnimationFrame(() => {
      this.bar.classList.add('visible');
      this.isVisible = true;
      
      // Announce to screen readers (once)
      if (!this.bar.hasAttribute('data-announced')) {
        this.announce('Booking options available at bottom of screen');
        this.bar.setAttribute('data-announced', 'true');
      }
    });
  }
  
  hide() {
    if (!this.isVisible || this.isDismissed) return;
    
    requestAnimationFrame(() => {
      this.bar.classList.remove('visible');
      this.isVisible = false;
    });
  }
  
  dismiss() {
    this.isDismissed = true;
    
    // Add dismissed class
    this.bar.classList.add('dismissed');
    this.bar.classList.remove('visible');
    this.isVisible = false;
    
    // Save to localStorage
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify({
        timestamp: Date.now(),
      }));
    } catch (e) {
      console.warn('Failed to save dismissal:', e);
    }
    
    // Announce
    this.announce('Booking bar dismissed');
  }
  
  setupEventListeners() {
    // Close button
    const closeBtn = this.bar.querySelector('.sticky-cta-close');
    closeBtn.addEventListener('click', () => this.dismiss());
    
    // Track CTA clicks
    const buttons = this.bar.querySelectorAll('[data-action]');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.getAttribute('data-action');
        this.trackClick(action);
        
        // Smooth scroll to target
        const href = btn.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Focus first interactive element in target
            setTimeout(() => {
              const firstInput = target.querySelector('input, button, select, textarea, [tabindex]');
              if (firstInput) firstInput.focus();
            }, 500);
          }
        }
      });
    });
  }
  
  setupKeyboardNav() {
    // Escape key to dismiss
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible && !this.isDismissed) {
        this.dismiss();
      }
    });
  }
  
  trackClick(action) {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'sticky_cta_click', {
        event_category: 'engagement',
        event_label: action,
      });
    }
    
    console.log(`[Sticky CTA] ${action} clicked`);
  }
  
  announce(message) {
    // Screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }
  
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    if (this.bar) {
      this.bar.remove();
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.stickyCTABar = new StickyCTABar();
  });
} else {
  window.stickyCTABar = new StickyCTABar();
}

// Add screen reader only utility class if not exists
if (!document.querySelector('style[data-sr-only]')) {
  const style = document.createElement('style');
  style.setAttribute('data-sr-only', 'true');
  style.textContent = `
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `;
  document.head.appendChild(style);
}
