/**
 * TOOLTIPS.JS
 * Premium interactive tooltip system for OpenClaw Mac v2
 * Sprint #40 - Interactive Tooltip System (2026-02-10 6:45 AM)
 * 
 * Features:
 * - Auto-discovery via data-tooltip attributes
 * - Smart positioning with viewport collision detection
 * - Touch device support (tap to show/hide)
 * - Keyboard accessible (focus/blur)
 * - Hover delay for better UX
 * - Single tooltip instance (performance optimized)
 * - RAF-optimized positioning
 * 
 * Usage:
 * <button data-tooltip="Click me!">Hover</button>
 * <button data-tooltip="Rich content" data-tooltip-variant="success">Success</button>
 * <button data-tooltip="Left side" data-tooltip-placement="left">Left</button>
 */

class TooltipSystem {
  constructor() {
    this.tooltip = null;
    this.currentTarget = null;
    this.hoverTimeout = null;
    this.hideTimeout = null;
    this.isTouch = 'ontouchstart' in window;
    this.hoverDelay = 300; // ms delay before showing on hover
    this.hideDelay = 100; // ms delay before hiding
    
    this.init();
  }

  init() {
    // Create single tooltip element
    this.createTooltip();
    
    // Attach event listeners to all elements with data-tooltip
    this.attachListeners();
    
    // Handle window resize
    window.addEventListener('resize', () => this.hide(), { passive: true });
    
    // Handle scroll (hide tooltips on scroll)
    window.addEventListener('scroll', () => this.hide(), { passive: true });
    
    console.log('✨ Tooltip System initialized');
  }

  createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    this.tooltip.setAttribute('role', 'tooltip');
    this.tooltip.innerHTML = `
      <div class="tooltip__content"></div>
      <div class="tooltip__arrow"></div>
    `;
    document.body.appendChild(this.tooltip);
  }

  attachListeners() {
    // Find all elements with data-tooltip
    const targets = document.querySelectorAll('[data-tooltip]');
    
    targets.forEach(target => {
      if (this.isTouch) {
        // Touch devices - tap to toggle
        target.addEventListener('click', (e) => {
          e.preventDefault();
          if (this.currentTarget === target) {
            this.hide();
          } else {
            this.show(target);
          }
        });
      } else {
        // Desktop - hover
        target.addEventListener('mouseenter', () => {
          clearTimeout(this.hideTimeout);
          this.hoverTimeout = setTimeout(() => {
            this.show(target);
          }, this.hoverDelay);
        });

        target.addEventListener('mouseleave', () => {
          clearTimeout(this.hoverTimeout);
          this.hideTimeout = setTimeout(() => {
            this.hide();
          }, this.hideDelay);
        });
      }

      // Keyboard support
      target.addEventListener('focus', () => {
        if (!this.isTouch) {
          this.show(target);
        }
      });

      target.addEventListener('blur', () => {
        if (!this.isTouch) {
          this.hide();
        }
      });

      // Make focusable if not already
      if (!target.hasAttribute('tabindex') && !target.matches('a, button, input, select, textarea')) {
        target.setAttribute('tabindex', '0');
      }
    });

    console.log(`🎯 Attached tooltip listeners to ${targets.length} elements`);
  }

  show(target) {
    if (!target || !target.hasAttribute('data-tooltip')) return;

    const text = target.getAttribute('data-tooltip');
    if (!text) return;

    this.currentTarget = target;

    // Set content
    const content = this.tooltip.querySelector('.tooltip__content');
    content.textContent = text;

    // Set variant if specified
    const variant = target.getAttribute('data-tooltip-variant');
    if (variant) {
      this.tooltip.setAttribute('data-variant', variant);
    } else {
      this.tooltip.removeAttribute('data-variant');
    }

    // Position tooltip
    requestAnimationFrame(() => {
      this.position(target);
      
      // Show with animation
      this.tooltip.classList.add('visible');
    });
  }

  hide() {
    if (!this.tooltip) return;
    
    this.tooltip.classList.remove('visible');
    this.currentTarget = null;
    
    // Clear any pending timeouts
    clearTimeout(this.hoverTimeout);
    clearTimeout(this.hideTimeout);
  }

  position(target) {
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    const spacing = 12; // px gap between target and tooltip
    const viewportPadding = 16; // px padding from viewport edges

    // Get preferred placement (default: top)
    let placement = target.getAttribute('data-tooltip-placement') || 'top';

    // Calculate positions for each placement
    const positions = {
      top: {
        left: targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2),
        top: targetRect.top - tooltipRect.height - spacing
      },
      bottom: {
        left: targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2),
        top: targetRect.bottom + spacing
      },
      left: {
        left: targetRect.left - tooltipRect.width - spacing,
        top: targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)
      },
      right: {
        left: targetRect.right + spacing,
        top: targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2)
      }
    };

    // Viewport boundaries
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Smart collision detection - try preferred placement first
    let finalPlacement = placement;
    let pos = positions[placement];

    // Check if tooltip fits in viewport
    const fitsInViewport = (position, place) => {
      const horizontal = position.left >= viewportPadding && 
                        position.left + tooltipRect.width <= viewport.width - viewportPadding;
      const vertical = position.top >= viewportPadding && 
                      position.top + tooltipRect.height <= viewport.height - viewportPadding;
      
      if (place === 'top' || place === 'bottom') return vertical && horizontal;
      if (place === 'left' || place === 'right') return horizontal && vertical;
      return horizontal && vertical;
    };

    // If preferred placement doesn't fit, try alternatives
    if (!fitsInViewport(pos, placement)) {
      const alternatives = {
        top: ['bottom', 'left', 'right'],
        bottom: ['top', 'left', 'right'],
        left: ['right', 'top', 'bottom'],
        right: ['left', 'top', 'bottom']
      };

      for (const alt of alternatives[placement]) {
        const altPos = positions[alt];
        if (fitsInViewport(altPos, alt)) {
          finalPlacement = alt;
          pos = altPos;
          break;
        }
      }
    }

    // Constrain to viewport (fallback if no placement works perfectly)
    pos.left = Math.max(viewportPadding, Math.min(pos.left, viewport.width - tooltipRect.width - viewportPadding));
    pos.top = Math.max(viewportPadding, Math.min(pos.top, viewport.height - tooltipRect.height - viewportPadding));

    // Apply position
    this.tooltip.style.left = `${pos.left}px`;
    this.tooltip.style.top = `${pos.top}px`;
    this.tooltip.setAttribute('data-placement', finalPlacement);
  }

  // Public method to refresh listeners (useful if DOM changes)
  refresh() {
    this.attachListeners();
  }

  // Public method to manually show tooltip
  showManual(element, text, options = {}) {
    if (!element) return;
    
    // Temporarily set data-tooltip attribute
    element.setAttribute('data-tooltip', text);
    if (options.variant) {
      element.setAttribute('data-tooltip-variant', options.variant);
    }
    if (options.placement) {
      element.setAttribute('data-tooltip-placement', options.placement);
    }
    
    this.show(element);
  }

  // Public method to manually hide tooltip
  hideManual() {
    this.hide();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.tooltipSystem = new TooltipSystem();
  });
} else {
  window.tooltipSystem = new TooltipSystem();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TooltipSystem;
}
