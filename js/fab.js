/**
 * FLOATING ACTION BUTTON (FAB) SYSTEM
 * Modern mobile-first conversion optimization
 * Inspired by: Intercom, Calendly, Linear, Webflow (2026)
 */

class FloatingActionButton {
  constructor() {
    this.container = null;
    this.mainButton = null;
    this.menu = null;
    this.isMenuOpen = false;
    this.scrollThreshold = 300; // Show FAB after scrolling 300px
    this.lastScrollY = 0;
    this.isVisible = false;
    
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.createFAB();
    this.attachEventListeners();
    this.handleInitialScroll();
  }

  createFAB() {
    // Create FAB container
    this.container = document.createElement('div');
    this.container.className = 'fab-container hidden';
    this.container.setAttribute('role', 'navigation');
    this.container.setAttribute('aria-label', 'Quick actions');

    // Create speed dial menu
    this.menu = document.createElement('div');
    this.menu.className = 'fab-menu';
    this.menu.setAttribute('role', 'menu');

    // Menu items configuration
    const menuItems = [
      {
        icon: '📅',
        label: 'Book Appointment',
        action: () => this.scrollToBooking(),
        className: 'booking',
        ariaLabel: 'Book an appointment'
      },
      {
        icon: '📞',
        label: 'Call Now',
        action: () => window.location.href = 'tel:+1234567890',
        className: 'call',
        ariaLabel: 'Call us now'
      },
      {
        icon: '✉️',
        label: 'Email Us',
        action: () => window.location.href = 'mailto:hello@openclawmac.com',
        className: 'email',
        ariaLabel: 'Send us an email'
      },
      {
        icon: '💬',
        label: 'WhatsApp',
        action: () => window.open('https://wa.me/1234567890?text=Hi! I\'d like to book a service.', '_blank'),
        className: 'whatsapp',
        ariaLabel: 'Message us on WhatsApp'
      }
    ];

    // Create menu items
    menuItems.forEach((item, index) => {
      const menuItem = this.createMenuItem(item, index);
      this.menu.appendChild(menuItem);
    });

    // Create main FAB button
    this.mainButton = document.createElement('button');
    this.mainButton.className = 'fab-main';
    this.mainButton.setAttribute('aria-label', 'Quick actions menu');
    this.mainButton.setAttribute('aria-expanded', 'false');
    this.mainButton.setAttribute('aria-haspopup', 'menu');
    this.mainButton.innerHTML = `
      <span class="fab-icon">➕</span>
      <div class="fab-tooltip">Quick Actions</div>
    `;

    // Assemble FAB
    this.container.appendChild(this.menu);
    this.container.appendChild(this.mainButton);
    document.body.appendChild(this.container);
  }

  createMenuItem(config, index) {
    const item = document.createElement('div');
    item.className = 'fab-menu-item';
    item.setAttribute('role', 'menuitem');
    item.style.transitionDelay = `${index * 0.05}s`;

    const label = document.createElement('span');
    label.className = 'fab-menu-label';
    label.textContent = config.label;

    const button = document.createElement('button');
    button.className = `fab-menu-btn ${config.className}`;
    button.setAttribute('aria-label', config.ariaLabel);
    button.innerHTML = config.icon;
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      config.action();
      this.closeMenu();
      this.trackEvent('FAB Action', config.label);
    });

    item.appendChild(label);
    item.appendChild(button);

    return item;
  }

  attachEventListeners() {
    // Main button click
    this.mainButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !this.container.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMenu();
        this.mainButton.focus();
      }
    });

    // Scroll handling
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

    // Resize handling
    window.addEventListener('resize', () => this.handleResize(), { passive: true });
  }

  toggleMenu() {
    if (this.isMenuOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    this.isMenuOpen = true;
    this.menu.classList.add('active');
    this.mainButton.classList.add('active');
    this.mainButton.setAttribute('aria-expanded', 'true');
    this.trackEvent('FAB Menu', 'Opened');
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.menu.classList.remove('active');
    this.mainButton.classList.remove('active');
    this.mainButton.setAttribute('aria-expanded', 'false');
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > this.lastScrollY;
    
    // Show/hide FAB based on scroll position
    if (currentScrollY > this.scrollThreshold) {
      if (!this.isVisible) {
        this.showFAB();
      }
      
      // Hide when scrolling down fast, show when scrolling up
      if (scrollingDown && currentScrollY > this.lastScrollY + 100) {
        this.hideFAB();
      } else if (!scrollingDown || currentScrollY < this.lastScrollY - 50) {
        this.showFAB();
      }
    } else {
      this.hideFAB();
    }
    
    this.lastScrollY = currentScrollY;
  }

  handleInitialScroll() {
    // Check initial scroll position on page load
    if (window.scrollY > this.scrollThreshold) {
      this.showFAB();
    }
  }

  showFAB() {
    if (!this.isVisible) {
      this.container.classList.remove('hidden');
      this.isVisible = true;
    }
  }

  hideFAB() {
    if (this.isVisible) {
      this.container.classList.add('hidden');
      this.isVisible = false;
      this.closeMenu(); // Close menu when hiding FAB
    }
  }

  handleResize() {
    // Close menu on resize to prevent layout issues
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }

  scrollToBooking() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Focus on first input field after scroll
      setTimeout(() => {
        const firstInput = bookingSection.querySelector('input, textarea');
        if (firstInput) {
          firstInput.focus();
        }
      }, 800);
      
      this.trackEvent('FAB Scroll', 'Booking Section');
    }
  }

  trackEvent(category, action) {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: 'FAB Interaction'
      });
    }
    
    if (typeof plausible !== 'undefined') {
      plausible('FAB Action', { props: { action, category } });
    }
    
    // Console log for development
    console.log(`[FAB] ${category}: ${action}`);
  }

  // Public API
  show() {
    this.showFAB();
  }

  hide() {
    this.hideFAB();
  }

  destroy() {
    if (this.container) {
      this.container.remove();
    }
  }
}

// Initialize FAB when script loads
let fab;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    fab = new FloatingActionButton();
  });
} else {
  fab = new FloatingActionButton();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FloatingActionButton;
}
