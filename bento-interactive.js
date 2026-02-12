/* ═══════════════════════════════════════════════════════════════
   BENTO INTERACTIVE - Cursor Tracking JavaScript
   Tracks mouse position and updates CSS custom properties
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // Only run on devices with hover capability (non-touch)
  if (!window.matchMedia('(hover: hover)').matches) {
    return;
  }

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const bentoCards = document.querySelectorAll('.bento-card');
  
  if (!bentoCards.length) return;

  // Track mouse position within each card
  bentoCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update CSS custom properties
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });

    // Add border glow element programmatically
    const borderGlow = document.createElement('div');
    borderGlow.className = 'bento-card-border-glow';
    card.appendChild(borderGlow);
  });

  console.log('[Bento Interactive] Cursor tracking initialized on', bentoCards.length, 'cards');
})();
