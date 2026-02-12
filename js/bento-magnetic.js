/* ═══════════════════════════════════════════════════════════════
   BENTO MAGNETIC - Advanced Cursor Interaction System (2026)
   Features: Magnetic attraction, 3D perspective, particle effects
   Performance: RAF loop, GPU acceleration, smart throttling
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // Feature detection
  const supportsHover = window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!supportsHover || prefersReducedMotion) {
    console.log('[Bento Magnetic] Skipping: hover not supported or reduced motion preferred');
    return;
  }

  // ═══════════════════════════ CONFIG ═══════════════════════════
  
  const CONFIG = {
    magneticRange: 300,        // Distance for magnetic pull (px)
    magneticStrength: 0.15,    // Pull force multiplier
    rotationStrength: 8,       // 3D rotation degrees max
    particleInterval: 100,     // Particle spawn rate (ms)
    particleLifetime: 1500,    // Particle animation duration (ms)
    smoothing: 0.15,           // Interpolation smoothing (0-1)
  };

  // ═══════════════════════════ STATE ═══════════════════════════
  
  let rafId = null;
  let lastParticleTime = 0;
  
  const bentoGrid = document.querySelector('.bento-grid');
  const bentoCards = document.querySelectorAll('.bento-card');
  
  if (!bentoGrid || !bentoCards.length) {
    console.log('[Bento Magnetic] No bento grid found');
    return;
  }

  // Card state tracking
  const cardStates = new Map();

  // ═══════════════════════ INITIALIZATION ═══════════════════════
  
  function initCard(card) {
    // Create magnetic effect layers
    const border = document.createElement('div');
    border.className = 'bento-magnetic-border';
    
    const spotlight = document.createElement('div');
    spotlight.className = 'bento-magnetic-spotlight';
    
    const shine = document.createElement('div');
    shine.className = 'bento-magnetic-shine';
    
    const particles = document.createElement('div');
    particles.className = 'bento-particles';
    
    // Wrap existing content
    const content = Array.from(card.children);
    const inner = document.createElement('div');
    inner.className = 'bento-card-inner';
    content.forEach(el => inner.appendChild(el));
    
    // Assemble layers (bottom to top)
    card.appendChild(spotlight);
    card.appendChild(shine);
    card.appendChild(inner);
    card.appendChild(border);
    card.appendChild(particles);
    
    // Initialize state
    cardStates.set(card, {
      rect: card.getBoundingClientRect(),
      centerX: 0,
      centerY: 0,
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      isActive: false,
      particlesContainer: particles,
    });
  }

  bentoCards.forEach(initCard);

  // ═══════════════════════ UTILITY FUNCTIONS ═══════════════════════
  
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  // ═══════════════════════ PARTICLE SYSTEM ═══════════════════════
  
  function createParticle(container, x, y) {
    const particle = document.createElement('div');
    particle.className = 'bento-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    container.appendChild(particle);
    
    // Auto-remove after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.remove();
      }
    }, CONFIG.particleLifetime);
  }

  // ═══════════════════════ MAGNETIC CALCULATIONS ═══════════════════════
  
  function updateCardMagnetics(card, state, mouseX, mouseY) {
    const { rect } = state;
    
    // Calculate card center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Distance from cursor to card center
    const dist = distance(mouseX, mouseY, centerX, centerY);
    
    // Check if within magnetic range
    if (dist < CONFIG.magneticRange) {
      state.isActive = true;
      bentoGrid.classList.add('has-magnetic-active');
      card.classList.add('magnetic-active');
      
      // Calculate magnetic pull (normalized -1 to 1)
      const pullX = (mouseX - centerX) / CONFIG.magneticRange;
      const pullY = (mouseY - centerY) / CONFIG.magneticRange;
      
      // Apply magnetic strength
      state.targetX = pullX * CONFIG.magneticStrength;
      state.targetY = pullY * CONFIG.magneticStrength;
      
      // 3D rotation based on cursor position within card
      const localX = (mouseX - rect.left) / rect.width;
      const localY = (mouseY - rect.top) / rect.height;
      
      const rotX = (localY - 0.5) * CONFIG.rotationStrength;
      const rotY = (localX - 0.5) * CONFIG.rotationStrength;
      
      card.style.setProperty('--rotation-x', `${rotX}deg`);
      card.style.setProperty('--rotation-y', `${rotY}deg`);
      
      // Update spotlight position (percentage within card)
      card.style.setProperty('--card-x', `${localX * 100}%`);
      card.style.setProperty('--card-y', `${localY * 100}%`);
      
      // Particle trail
      const now = Date.now();
      if (now - lastParticleTime > CONFIG.particleInterval && state.particlesContainer) {
        const particleX = (mouseX - rect.left);
        const particleY = (mouseY - rect.top);
        
        // Only create particles if cursor is within card bounds
        if (particleX >= 0 && particleX <= rect.width && 
            particleY >= 0 && particleY <= rect.height) {
          createParticle(state.particlesContainer, particleX, particleY);
          lastParticleTime = now;
        }
      }
      
    } else {
      // Reset when out of range
      if (state.isActive) {
        state.isActive = false;
        card.classList.remove('magnetic-active');
        state.targetX = 0;
        state.targetY = 0;
        
        // Check if any cards are still active
        const hasActive = Array.from(cardStates.values()).some(s => s.isActive);
        if (!hasActive) {
          bentoGrid.classList.remove('has-magnetic-active');
        }
      }
    }
  }

  // ═══════════════════════ ANIMATION LOOP ═══════════════════════
  
  function animationLoop() {
    cardStates.forEach((state, card) => {
      // Smooth interpolation
      state.currentX = lerp(state.currentX, state.targetX, CONFIG.smoothing);
      state.currentY = lerp(state.currentY, state.targetY, CONFIG.smoothing);
      
      // Apply transform
      card.style.setProperty('--card-x', state.currentX);
      card.style.setProperty('--card-y', state.currentY);
    });
    
    rafId = requestAnimationFrame(animationLoop);
  }

  // ═══════════════════════ EVENT HANDLERS ═══════════════════════
  
  let currentMouseX = 0;
  let currentMouseY = 0;

  function handleMouseMove(e) {
    currentMouseX = e.clientX;
    currentMouseY = e.clientY;
    
    // Update grid-level cursor position
    const gridRect = bentoGrid.getBoundingClientRect();
    const gridX = ((e.clientX - gridRect.left) / gridRect.width) * 100;
    const gridY = ((e.clientY - gridRect.top) / gridRect.height) * 100;
    
    bentoGrid.style.setProperty('--cursor-x', `${gridX}%`);
    bentoGrid.style.setProperty('--cursor-y', `${gridY}%`);
    
    // Update all cards
    cardStates.forEach((state, card) => {
      updateCardMagnetics(card, state, currentMouseX, currentMouseY);
    });
  }

  function handleMouseLeave() {
    // Reset all cards
    cardStates.forEach((state, card) => {
      state.isActive = false;
      state.targetX = 0;
      state.targetY = 0;
      card.classList.remove('magnetic-active');
    });
    
    bentoGrid.classList.remove('has-magnetic-active');
  }

  function updateCardRects() {
    // Recalculate card positions (on scroll/resize)
    cardStates.forEach((state, card) => {
      state.rect = card.getBoundingClientRect();
    });
  }

  // ═══════════════════════ ATTACH LISTENERS ═══════════════════════
  
  bentoGrid.addEventListener('mousemove', handleMouseMove, { passive: true });
  bentoGrid.addEventListener('mouseleave', handleMouseLeave);
  
  // Update rects on scroll/resize
  window.addEventListener('scroll', updateCardRects, { passive: true });
  window.addEventListener('resize', updateCardRects, { passive: true });
  
  // Initial rect calculation
  updateCardRects();
  
  // Start animation loop
  animationLoop();

  console.log('[Bento Magnetic] ✨ Initialized with', bentoCards.length, 'cards');
  console.log('[Bento Magnetic] Config:', CONFIG);

  // ═══════════════════════ CLEANUP ═══════════════════════
  
  // Expose cleanup function for page unload
  window.bentoMagneticCleanup = function() {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
    bentoGrid.removeEventListener('mousemove', handleMouseMove);
    bentoGrid.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('scroll', updateCardRects);
    window.removeEventListener('resize', updateCardRects);
    console.log('[Bento Magnetic] Cleaned up');
  };

})();
