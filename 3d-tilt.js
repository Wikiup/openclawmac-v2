// ═══════════════════════════════════════════════════════════════
// 3D TILT EFFECTS - Interactive Depth & Parallax
// Modern SaaS Premium UI Pattern (2026)
// ═══════════════════════════════════════════════════════════════

(function() {
  'use strict';
  
  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  // Check if mobile
  const isMobile = window.innerWidth <= 768;
  if (isMobile) return;
  
  // Select all tiltable cards
  const tiltCards = document.querySelectorAll(
    '.pricing-card, .testimonial-card, .deep-card, .bento-card'
  );
  
  tiltCards.forEach(card => {
    // Add shine overlay
    const shine = document.createElement('div');
    shine.className = 'tilt-shine';
    card.appendChild(shine);
    
    // Tilt parameters
    const maxTilt = 8; // degrees
    const perspective = 1000; // px
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      
      // Mouse position relative to card center (-1 to 1)
      const mouseX = (e.clientX - rect.left) / cardWidth;
      const mouseY = (e.clientY - rect.top) / cardHeight;
      
      // Calculate tilt
      const tiltY = (mouseX - 0.5) * maxTilt * 2; // Horizontal mouse -> Y axis tilt
      const tiltX = (0.5 - mouseY) * maxTilt * 2; // Vertical mouse -> X axis tilt
      
      // Apply transform
      card.style.transform = `
        perspective(${perspective}px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
        scale3d(1.02, 1.02, 1.02)
      `;
      
      // Update shine position
      shine.style.setProperty('--mouse-x', `${mouseX * 100}%`);
      shine.style.setProperty('--mouse-y', `${mouseY * 100}%`);
    });
    
    card.addEventListener('mouseleave', () => {
      // Reset to neutral
      card.style.transform = `
        perspective(${perspective}px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;
    });
  });
  
  // Add magnetic effect to buttons inside tilt cards
  const buttons = document.querySelectorAll('.pricing-card .btn, .deep-card .btn, .bento-card .btn');
  
  buttons.forEach(btn => {
    const parent = btn.closest('.pricing-card, .deep-card, .bento-card');
    if (!parent) return;
    
    btn.addEventListener('mouseenter', (e) => {
      const rect = btn.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      
      // Calculate button position relative to card
      const btnCenterX = rect.left + rect.width / 2 - parentRect.left;
      const btnCenterY = rect.top + rect.height / 2 - parentRect.top;
      
      // Slight pull toward button
      const pullStrength = 2; // degrees
      const tiltTowardsBtn = `
        perspective(1000px)
        rotateX(${(btnCenterY / parentRect.height - 0.5) * pullStrength}deg)
        rotateY(${(btnCenterX / parentRect.width - 0.5) * pullStrength}deg)
        scale3d(1.03, 1.03, 1.03)
      `;
      
      parent.style.transform = tiltTowardsBtn;
    });
    
    btn.addEventListener('mouseleave', () => {
      // Let the parent card's mousemove handler take over
      // or reset if mouse leaves both
      if (!parent.matches(':hover')) {
        parent.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });
  });
  
  console.log('🎭 3D Tilt Effects initialized on', tiltCards.length, 'cards');
})();
