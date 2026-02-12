/**
 * CUSTOM CURSOR SYSTEM
 * Sprint #22 - 2026-02-10 2:12 AM
 * Premium interactive cursor with magnetic effects and smooth animations
 * Inspired by: Pitch, Linear, Arc Browser, Framer 2026
 */

class CustomCursor {
  constructor() {
    // Only initialize on desktop with precise pointer
    if (!this.isDesktop()) {
      return;
    }

    // State
    this.mouse = { x: 0, y: 0 };
    this.cursor = { x: 0, y: 0 };
    this.ring = { x: 0, y: 0 };
    this.glow = { x: 0, y: 0 };
    this.isHovering = false;
    this.isClicking = false;
    this.currentTarget = null;
    
    // Smoothing factors
    this.cursorSpeed = 0.2;
    this.ringSpeed = 0.1;
    this.glowSpeed = 0.08;
    
    // Trail settings
    this.trailInterval = 50; // ms between trail dots
    this.lastTrailTime = 0;
    
    // Magnetic settings
    this.magneticStrength = 0.3;
    this.magneticRadius = 80;
    
    // Initialize
    this.init();
  }

  isDesktop() {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }

  init() {
    // Create cursor elements
    this.createCursorElements();
    
    // Bind events
    this.bindEvents();
    
    // Start animation loop
    this.animate();
    
    // Add active class to body
    document.body.classList.add('cursor-active');
  }

  createCursorElements() {
    // Main cursor dot
    this.cursorElement = document.createElement('div');
    this.cursorElement.className = 'custom-cursor';
    document.body.appendChild(this.cursorElement);
    
    // Cursor ring
    this.ringElement = document.createElement('div');
    this.ringElement.className = 'cursor-ring';
    document.body.appendChild(this.ringElement);
    
    // Cursor glow
    this.glowElement = document.createElement('div');
    this.glowElement.className = 'cursor-glow';
    document.body.appendChild(this.glowElement);
    
    // Cursor label (for hints)
    this.labelElement = document.createElement('div');
    this.labelElement.className = 'cursor-label';
    document.body.appendChild(this.labelElement);
    
    // Magnetic indicator
    this.magneticElement = document.createElement('div');
    this.magneticElement.className = 'cursor-magnetic';
    document.body.appendChild(this.magneticElement);
  }

  bindEvents() {
    // Mouse move
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    
    // Mouse down
    document.addEventListener('mousedown', (e) => this.onMouseDown(e));
    
    // Mouse up
    document.addEventListener('mouseup', (e) => this.onMouseUp(e));
    
    // Mouse enter/leave interactive elements
    this.bindInteractiveElements();
    
    // Window resize
    window.addEventListener('resize', () => this.onResize());
  }

  bindInteractiveElements() {
    const interactiveSelectors = [
      'a',
      'button',
      'input',
      'textarea',
      'select',
      '[role="button"]',
      '[onclick]',
      '.interactive'
    ];
    
    const elements = document.querySelectorAll(interactiveSelectors.join(', '));
    
    elements.forEach(el => {
      el.addEventListener('mouseenter', () => this.onHoverStart(el));
      el.addEventListener('mouseleave', () => this.onHoverEnd());
    });
    
    // Text elements for text cursor
    const textElements = document.querySelectorAll('input[type="text"], textarea, [contenteditable]');
    textElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.onTextHover(true));
      el.addEventListener('mouseleave', () => this.onTextHover(false));
    });
  }

  onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    
    // Create trail effect
    const now = Date.now();
    if (now - this.lastTrailTime > this.trailInterval) {
      this.createTrailDot(e.clientX, e.clientY);
      this.lastTrailTime = now;
    }
    
    // Update magnetic effect if hovering
    if (this.currentTarget) {
      this.updateMagneticEffect(this.currentTarget);
    }
  }

  onMouseDown(e) {
    this.isClicking = true;
    this.cursorElement.classList.add('click');
    this.ringElement.classList.add('click');
    
    // Create ripple effect
    this.createRipple(e.clientX, e.clientY);
    
    // Create particle burst
    this.createParticleBurst(e.clientX, e.clientY);
  }

  onMouseUp(e) {
    this.isClicking = false;
    this.cursorElement.classList.remove('click');
    this.ringElement.classList.remove('click');
  }

  onHoverStart(element) {
    this.isHovering = true;
    this.currentTarget = element;
    this.cursorElement.classList.add('hover');
    this.ringElement.classList.add('hover');
    this.glowElement.classList.add('hover');
    
    // Show label if element has title or aria-label
    const label = element.getAttribute('aria-label') || element.getAttribute('title');
    if (label && label.length < 30) {
      this.showLabel(label);
    }
  }

  onHoverEnd() {
    this.isHovering = false;
    this.currentTarget = null;
    this.cursorElement.classList.remove('hover');
    this.ringElement.classList.remove('hover');
    this.glowElement.classList.remove('hover');
    this.magneticElement.classList.remove('active');
    this.hideLabel();
  }

  onTextHover(isText) {
    if (isText) {
      this.cursorElement.classList.add('text');
      this.ringElement.classList.add('text');
    } else {
      this.cursorElement.classList.remove('text');
      this.ringElement.classList.remove('text');
    }
  }

  onResize() {
    // Re-bind interactive elements on resize (in case layout changes)
    this.bindInteractiveElements();
  }

  updateMagneticEffect(target) {
    const rect = target.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(this.mouse.x - centerX, 2) + 
      Math.pow(this.mouse.y - centerY, 2)
    );
    
    if (distance < this.magneticRadius) {
      // Calculate magnetic pull
      const pullX = (centerX - this.mouse.x) * this.magneticStrength;
      const pullY = (centerY - this.mouse.y) * this.magneticStrength;
      
      // Apply magnetic offset
      this.cursor.magneticX = pullX;
      this.cursor.magneticY = pullY;
      
      // Show magnetic indicator
      this.magneticElement.classList.add('active');
      this.magneticElement.style.left = `${centerX}px`;
      this.magneticElement.style.top = `${centerY}px`;
    } else {
      this.cursor.magneticX = 0;
      this.cursor.magneticY = 0;
      this.magneticElement.classList.remove('active');
    }
  }

  createTrailDot(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    document.body.appendChild(trail);
    
    // Remove after animation
    setTimeout(() => trail.remove(), 600);
  }

  createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    
    // Remove after animation
    setTimeout(() => ripple.remove(), 600);
  }

  createParticleBurst(x, y) {
    const particleCount = 6;
    const angleStep = (Math.PI * 2) / particleCount;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      
      const angle = angleStep * i;
      const velocity = 20;
      const offsetX = Math.cos(angle) * velocity;
      const offsetY = Math.sin(angle) * velocity;
      
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty('--offset-x', `${offsetX}px`);
      particle.style.setProperty('--offset-y', `${offsetY}px`);
      
      document.body.appendChild(particle);
      
      // Remove after animation
      setTimeout(() => particle.remove(), 800);
    }
  }

  showLabel(text) {
    this.labelElement.textContent = text;
    this.labelElement.classList.add('active');
  }

  hideLabel() {
    this.labelElement.classList.remove('active');
  }

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  animate() {
    // Smooth cursor movement with easing
    this.cursor.x = this.lerp(this.cursor.x, this.mouse.x + (this.cursor.magneticX || 0), this.cursorSpeed);
    this.cursor.y = this.lerp(this.cursor.y, this.mouse.y + (this.cursor.magneticY || 0), this.cursorSpeed);
    
    // Smooth ring movement (slower than cursor)
    this.ring.x = this.lerp(this.ring.x, this.mouse.x, this.ringSpeed);
    this.ring.y = this.lerp(this.ring.y, this.mouse.y, this.ringSpeed);
    
    // Smooth glow movement (slowest)
    this.glow.x = this.lerp(this.glow.x, this.mouse.x, this.glowSpeed);
    this.glow.y = this.lerp(this.glow.y, this.mouse.y, this.glowSpeed);
    
    // Update positions
    this.cursorElement.style.left = `${this.cursor.x}px`;
    this.cursorElement.style.top = `${this.cursor.y}px`;
    
    this.ringElement.style.left = `${this.ring.x}px`;
    this.ringElement.style.top = `${this.ring.y}px`;
    
    this.glowElement.style.left = `${this.glow.x}px`;
    this.glowElement.style.top = `${this.glow.y}px`;
    
    // Update label position
    if (this.labelElement.classList.contains('active')) {
      this.labelElement.style.left = `${this.cursor.x}px`;
      this.labelElement.style.top = `${this.cursor.y}px`;
    }
    
    // Continue animation loop
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
  });
} else {
  new CustomCursor();
}

// Export for potential manual initialization
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CustomCursor;
}
