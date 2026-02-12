/* =================================================================
   TRUST BADGE SHOWCASE - Interactive JavaScript Controller
   Handles animations, tooltips, stats counting, and interactions
   ================================================================= */

(function() {
  'use strict';

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrustShowcase);
  } else {
    initTrustShowcase();
  }

  function initTrustShowcase() {
    // Initialize all trust badge features
    initBadgeHoverEffects();
    initStatsCounter();
    initTooltips();
    initScrollReveal();
    initCertificationLogos();
  }

  // ============================================================
  // Badge Hover Effects with Ripple Animation
  // ============================================================
  function initBadgeHoverEffects() {
    const badges = document.querySelectorAll('.trust-badge');
    
    badges.forEach(badge => {
      badge.addEventListener('mouseenter', function(e) {
        // Add active class for additional effects
        this.classList.add('trust-badge-active');
        
        // Trigger haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
      });

      badge.addEventListener('mouseleave', function() {
        this.classList.remove('trust-badge-active');
      });

      // Click effect
      badge.addEventListener('click', function(e) {
        createRipple(e, this);
        
        // Stronger haptic feedback on click
        if ('vibrate' in navigator) {
          navigator.vibrate([20, 10, 20]);
        }
      });
    });
  }

  // Create ripple effect on click
  function createRipple(event, element) {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.transition = 'width 0.6s ease-out, height 0.6s ease-out, opacity 0.6s ease-out';
    ripple.style.opacity = '1';
    ripple.style.zIndex = '1';

    element.appendChild(ripple);

    // Trigger animation
    requestAnimationFrame(() => {
      ripple.style.width = '400px';
      ripple.style.height = '400px';
      ripple.style.opacity = '0';
    });

    // Remove after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // ============================================================
  // Animated Stats Counter
  // ============================================================
  function initStatsCounter() {
    const stats = document.querySelectorAll('.trust-stat-value');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          stats.forEach(stat => {
            animateCounter(stat);
          });
        }
      });
    }, { threshold: 0.5 });

    const statsBar = document.querySelector('.trust-stats-bar');
    if (statsBar) {
      observer.observe(statsBar);
    }
  }

  function animateCounter(element) {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const isCurrency = target.includes('$');
    const hasPlus = target.includes('+');
    
    // Extract numeric value
    let targetValue = parseFloat(target.replace(/[^0-9.]/g, ''));
    
    if (isNaN(targetValue)) return;

    let current = 0;
    const increment = targetValue / 60; // 60 frames for smooth animation
    const duration = 2000; // 2 seconds
    const frameTime = duration / 60;

    const counter = setInterval(() => {
      current += increment;
      
      if (current >= targetValue) {
        current = targetValue;
        clearInterval(counter);
      }

      let displayValue = Math.floor(current);
      
      // Format based on type
      if (isCurrency) {
        element.textContent = '$' + displayValue.toLocaleString();
      } else if (isPercentage) {
        element.textContent = displayValue + '%';
      } else if (hasPlus) {
        element.textContent = displayValue + '+';
      } else {
        element.textContent = displayValue.toLocaleString();
      }
    }, frameTime);
  }

  // ============================================================
  // Tooltip System
  // ============================================================
  function initTooltips() {
    const badges = document.querySelectorAll('.trust-badge[data-tooltip]');
    
    badges.forEach(badge => {
      const tooltipText = badge.dataset.tooltip;
      
      if (!tooltipText) return;

      // Create tooltip element
      const tooltip = document.createElement('div');
      tooltip.className = 'trust-tooltip';
      tooltip.textContent = tooltipText;
      tooltip.setAttribute('role', 'tooltip');
      
      badge.style.position = 'relative';
      badge.appendChild(tooltip);
      
      // ARIA accessibility
      badge.setAttribute('aria-describedby', 'tooltip-' + Math.random().toString(36).substr(2, 9));
    });
  }

  // ============================================================
  // Scroll-Triggered Reveal Animations
  // ============================================================
  function initScrollReveal() {
    const badges = document.querySelectorAll('.trust-badge');
    const statsBar = document.querySelector('.trust-stats-bar');
    const certifications = document.querySelector('.trust-certifications');

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { 
      threshold: 0.2,
      rootMargin: '-50px'
    });

    // Set initial state and observe badges
    badges.forEach((badge, index) => {
      badge.style.opacity = '0';
      badge.style.transform = 'translateY(30px)';
      badge.style.transition = `opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
      observer.observe(badge);
    });

    // Stats bar
    if (statsBar) {
      statsBar.style.opacity = '0';
      statsBar.style.transform = 'translateY(30px)';
      statsBar.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(statsBar);
    }

    // Certifications
    if (certifications) {
      certifications.style.opacity = '0';
      certifications.style.transform = 'translateY(30px)';
      certifications.style.transition = 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s';
      observer.observe(certifications);
    }
  }

  // ============================================================
  // Certification Logo Animations
  // ============================================================
  function initCertificationLogos() {
    const logos = document.querySelectorAll('.trust-cert-logo');
    
    logos.forEach(logo => {
      logo.addEventListener('mouseenter', function() {
        // Slight rotation on hover
        this.style.transform = 'scale(1.1) rotate(5deg)';
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(5);
        }
      });

      logo.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
      });
    });
  }

  // ============================================================
  // Public API
  // ============================================================
  window.TrustShowcase = {
    refresh: initTrustShowcase,
    animateStats: initStatsCounter
  };

})();
