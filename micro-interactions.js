/* ═══════════════════════════════════════════════════════════════
   Micro-Interactions Engine (v2 Redesign)
   3D Tilt, Cursor Glow, Magnetic Buttons
   ═══════════════════════════════════════════════════════════════ */

// ── 3D Tilt Effect for Cards ──────────────────────────────────
function init3DTilt() {
  const tiltCards = document.querySelectorAll('.bento-card, .pricing-card, .testimonial-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8; // Max 8deg tilt
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale(1.02)
      `;
      
      // Update CSS variables for glow effect
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── Cursor Glow Effect ──────────────────────────────────
function initCursorGlow() {
  const sections = document.querySelectorAll('.included, .pricing, .deep-dives');
  
  sections.forEach(section => {
    section.classList.add('cursor-glow-container');
    
    const glow = document.createElement('div');
    glow.classList.add('cursor-glow');
    section.appendChild(glow);
    
    section.addEventListener('mousemove', (e) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });
  });
}

// ── Magnetic Button Effect ──────────────────────────────────
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn--primary, .btn--secondary');
  
  buttons.forEach(btn => {
    btn.classList.add('btn-magnetic');
    
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const moveX = x * 0.15;
      const moveY = y * 0.15;
      
      btn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ── Hero Parallax Scroll Effect ──────────────────────────────────
function initHeroParallax() {
  const heroVisual = document.querySelector('.hero__visual');
  if (!heroVisual) return;
  
  heroVisual.classList.add('parallax');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxValue = scrolled * 0.15;
    heroVisual.style.setProperty('--parallax-y', `${parallaxValue}px`);
  });
}

// ── Staggered Fade-in on Scroll ──────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('fade-in');
        }, index * 100); // Stagger by 100ms
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  const elements = document.querySelectorAll(
    '.bento-card, .pricing-card, .step, .deep-card, .testimonial-card, .faq-item, .comparison__row'
  );
  
  elements.forEach(el => observer.observe(el));
}

// ── Enhanced Button Ripple ──────────────────────────────────
function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ── Initialize All Micro-Interactions ──────────────────────────────────
function initMicroInteractions() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    init3DTilt();
    initCursorGlow();
    initMagneticButtons();
    initHeroParallax();
    initScrollAnimations();
  }
  
  initButtonRipple(); // Always enable (subtle)
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMicroInteractions);
} else {
  initMicroInteractions();
}

// Export for manual init if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initMicroInteractions };
}
