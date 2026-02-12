/* ═══════════════════════════════════════════════════════════════
   Mesh Gradient & Parallax Effects
   Modern SaaS Visual Enhancement (2026)
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ══════════════════════════════════════════════════════════════
  // Parallax Scroll Effects
  // ══════════════════════════════════════════════════════════════
  
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    function updateParallax() {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }
    
    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // Initial call
    updateParallax();
  }

  // ══════════════════════════════════════════════════════════════
  // Mouse-Reactive Mesh Gradient
  // ══════════════════════════════════════════════════════════════
  
  function initInteractiveMesh() {
    const meshBg = document.querySelector('.mesh-gradient-bg');
    if (!meshBg) return;
    
    const blobs = meshBg.querySelectorAll('.mesh-blob');
    if (blobs.length === 0) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    // Smooth animation loop
    function animate() {
      // Smooth lerp
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      
      blobs.forEach((blob, index) => {
        const speed = (index + 1) * 15;
        const x = targetX * speed;
        const y = targetY * speed;
        
        blob.style.transform = `translate(${x}px, ${y}px)`;
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }

  // ══════════════════════════════════════════════════════════════
  // Glassmorphic Card Tilt Effect (Subtle)
  // ══════════════════════════════════════════════════════════════
  
  function initCardTilt() {
    const glassCards = document.querySelectorAll('.glass-card, .bento-card, .pricing-card');
    
    glassCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ══════════════════════════════════════════════════════════════
  // Scroll-Triggered Glow Effect
  // ══════════════════════════════════════════════════════════════
  
  function initScrollGlow() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.boxShadow = '0 0 40px rgba(124, 92, 255, 0.3)';
          entry.target.style.transition = 'box-shadow 0.6s ease-out';
          
          setTimeout(() => {
            entry.target.style.boxShadow = '';
          }, 1000);
        }
      });
    }, {
      threshold: 0.5
    });
    
    document.querySelectorAll('.bento-card--highlight, .pricing-card--highlight').forEach(card => {
      observer.observe(card);
    });
  }

  // ══════════════════════════════════════════════════════════════
  // Staggered Fade-In Animation Enhancement
  // ══════════════════════════════════════════════════════════════
  
  function initStaggeredAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    document.querySelectorAll('.fade-in').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });
  }

  // ══════════════════════════════════════════════════════════════
  // Performance Check (Reduce Effects on Low-End Devices)
  // ══════════════════════════════════════════════════════════════
  
  function checkPerformance() {
    // Disable heavy effects on mobile or if user prefers reduced motion
    const isMobile = window.innerWidth < 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isMobile || prefersReduced) {
      // Disable parallax and tilt
      return false;
    }
    return true;
  }

  // ══════════════════════════════════════════════════════════════
  // Initialize Everything
  // ══════════════════════════════════════════════════════════════
  
  function init() {
    const performanceEnabled = checkPerformance();
    
    if (performanceEnabled) {
      initParallax();
      initInteractiveMesh();
      initCardTilt();
    }
    
    initScrollGlow();
    initStaggeredAnimations();
    
    console.log('🎨 Mesh gradient & parallax effects initialized');
  }

  // Wait for DOM + other scripts
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
