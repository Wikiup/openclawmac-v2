// ═══════════════════════════════════════════════════════════════
// SPOTLIGHT EFFECT - Mouse-Following Premium Cards
// Modern SaaS UI Pattern (2026) - Vercel/Linear/Stripe aesthetic
// ═══════════════════════════════════════════════════════════════

(function() {
  'use strict';
  
  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  // Check if mobile
  const isMobile = window.innerWidth <= 768;
  if (isMobile) return;
  
  // Track global mouse position for spotlight
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // ─────────────────────────────────────────────────────────────
  // Card Spotlights
  // ─────────────────────────────────────────────────────────────
  
  const cards = document.querySelectorAll(
    '.pricing-card, .testimonial-card, .deep-card, .bento-card'
  );
  
  cards.forEach(card => {
    // Add spotlight overlay
    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight-overlay';
    card.insertBefore(spotlight, card.firstChild);
    
    // Update spotlight position on mouse move
    const updateSpotlight = () => {
      const rect = card.getBoundingClientRect();
      
      // Calculate mouse position relative to card (0-100%)
      const relativeX = ((mouseX - rect.left) / rect.width) * 100;
      const relativeY = ((mouseY - rect.top) / rect.height) * 100;
      
      // Calculate angle for border gradient (from center to mouse)
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
      
      // Update CSS variables
      spotlight.style.setProperty('--spotlight-x', `${relativeX}%`);
      spotlight.style.setProperty('--spotlight-y', `${relativeY}%`);
      card.style.setProperty('--spotlight-angle', angle);
    };
    
    // Update on hover
    card.addEventListener('mouseenter', () => {
      const interval = setInterval(() => {
        if (!card.matches(':hover')) {
          clearInterval(interval);
          return;
        }
        updateSpotlight();
      }, 16); // ~60fps
    });
    
    // Initial update
    updateSpotlight();
  });
  
  // ─────────────────────────────────────────────────────────────
  // Hero Spotlight
  // ─────────────────────────────────────────────────────────────
  
  const hero = document.querySelector('.hero__content');
  if (hero) {
    const heroSpotlight = document.createElement('div');
    heroSpotlight.className = 'hero-spotlight';
    hero.insertBefore(heroSpotlight, hero.firstChild);
    
    // Update hero spotlight continuously
    const updateHeroSpotlight = () => {
      const rect = hero.getBoundingClientRect();
      
      // Calculate mouse position relative to hero (0-100%)
      const relativeX = ((mouseX - rect.left) / rect.width) * 100;
      const relativeY = ((mouseY - rect.top) / rect.height) * 100;
      
      heroSpotlight.style.setProperty('--spotlight-x', `${relativeX}%`);
      heroSpotlight.style.setProperty('--spotlight-y', `${relativeY}%`);
    };
    
    // Update on every animation frame (smooth 60fps)
    const heroLoop = () => {
      updateHeroSpotlight();
      requestAnimationFrame(heroLoop);
    };
    heroLoop();
  }
  
  // ─────────────────────────────────────────────────────────────
  // Button Spotlights
  // ─────────────────────────────────────────────────────────────
  
  const buttons = document.querySelectorAll('.btn--primary, .btn--ghost');
  
  buttons.forEach(btn => {
    // Add button spotlight
    const btnSpotlight = document.createElement('div');
    btnSpotlight.className = 'btn-spotlight';
    btn.insertBefore(btnSpotlight, btn.firstChild);
    
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      
      // Calculate mouse position relative to button (0-100%)
      const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
      const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
      
      btnSpotlight.style.setProperty('--btn-spotlight-x', `${relativeX}%`);
      btnSpotlight.style.setProperty('--btn-spotlight-y', `${relativeY}%`);
    });
  });
  
  // ─────────────────────────────────────────────────────────────
  // Performance: Pause updates when tab is hidden
  // ─────────────────────────────────────────────────────────────
  
  let isVisible = true;
  
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });
  
  console.log('✨ Spotlight Effects initialized on', cards.length, 'cards +', buttons.length, 'buttons');
})();
