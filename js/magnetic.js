/**
 * Magnetic Cursor Effects
 * Premium 2026 interaction pattern - elements subtly move toward cursor
 * Inspired by: Apple.com, Awwwards, Stripe, Linear
 */

class MagneticEffect {
  constructor() {
    this.magneticElements = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.rafId = null;
    
    // Check if device supports hover (not touch-only)
    this.isHoverDevice = window.matchMedia('(hover: hover)').matches;
    
    if (this.isHoverDevice) {
      this.init();
    }
  }

  init() {
    // Track global mouse position
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Initialize magnetic elements
    this.initMagneticElements();
    
    // Start animation loop
    this.animate();
  }

  initMagneticElements() {
    // Magnetic CTAs (stronger pull)
    document.querySelectorAll('.cta-button, .primary-button, .btn-primary').forEach(el => {
      this.addMagneticElement(el, {
        strength: 0.3, // 30% movement toward cursor
        scale: 1.05,
        rotation: 2
      });
    });

    // Magnetic pricing cards (medium pull)
    document.querySelectorAll('.pricing-card').forEach(el => {
      this.addMagneticElement(el, {
        strength: 0.15,
        scale: 1.02,
        rotation: 1
      });
    });

    // Magnetic feature cards (subtle pull)
    document.querySelectorAll('.feature-card, .feature-item').forEach(el => {
      this.addMagneticElement(el, {
        strength: 0.12,
        scale: 1.01,
        rotation: 0.5
      });
    });

    // Magnetic navigation items (subtle pull)
    document.querySelectorAll('nav a, .nav-link').forEach(el => {
      this.addMagneticElement(el, {
        strength: 0.2,
        scale: 1.08,
        rotation: 1.5
      });
    });

    // Magnetic social icons (medium pull)
    document.querySelectorAll('.social-icon, .icon-link').forEach(el => {
      this.addMagneticElement(el, {
        strength: 0.25,
        scale: 1.1,
        rotation: 3
      });
    });
  }

  addMagneticElement(element, options = {}) {
    const config = {
      element,
      strength: options.strength || 0.2,
      scale: options.scale || 1.05,
      rotation: options.rotation || 1,
      currentX: 0,
      currentY: 0,
      currentRotation: 0,
      currentScale: 1,
      targetX: 0,
      targetY: 0,
      targetRotation: 0,
      targetScale: 1,
      isHovering: false
    };

    // Mouse enter/leave listeners
    element.addEventListener('mouseenter', () => {
      config.isHovering = true;
    });

    element.addEventListener('mouseleave', () => {
      config.isHovering = false;
      config.targetX = 0;
      config.targetY = 0;
      config.targetRotation = 0;
      config.targetScale = 1;
    });

    this.magneticElements.push(config);
  }

  calculateMagneticPull(config) {
    if (!config.isHovering) return;

    const rect = config.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from cursor to element center
    const deltaX = this.mouseX - centerX;
    const deltaY = this.mouseY - centerY;

    // Calculate magnetic pull (move element toward cursor)
    config.targetX = deltaX * config.strength;
    config.targetY = deltaY * config.strength;

    // Calculate rotation based on cursor position
    const angle = Math.atan2(deltaY, deltaX);
    config.targetRotation = (angle * 180 / Math.PI) * (config.rotation / 10);

    // Set target scale
    config.targetScale = config.scale;
  }

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  animate() {
    this.magneticElements.forEach(config => {
      this.calculateMagneticPull(config);

      // Smooth spring physics (lerp with damping)
      const damping = 0.15; // Higher = faster response
      
      config.currentX = this.lerp(config.currentX, config.targetX, damping);
      config.currentY = this.lerp(config.currentY, config.targetY, damping);
      config.currentRotation = this.lerp(config.currentRotation, config.targetRotation, damping);
      config.currentScale = this.lerp(config.currentScale, config.targetScale, damping);

      // Apply transforms
      config.element.style.transform = `
        translate(${config.currentX}px, ${config.currentY}px)
        rotate(${config.currentRotation}deg)
        scale(${config.currentScale})
      `;
    });

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.magneticEffect = new MagneticEffect();
  });
} else {
  window.magneticEffect = new MagneticEffect();
}

// Respect reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  console.log('Magnetic effects disabled (prefers-reduced-motion)');
} else {
  console.log('✨ Magnetic cursor effects initialized');
}
