/**
 * SCROLL-REVEAL.JS
 * Intersection Observer-based reveal animations
 * Zero dependencies, 60fps smooth
 */

(function () {
  'use strict';

  // Configuration
  const config = {
    threshold: 0.05,        // Trigger when 5% visible
    rootMargin: '0px 0px 200px 0px',  // Trigger 200px BEFORE element enters viewport
    triggerOnce: true       // Only animate once
  };

  // Intersection Observer callback
  function handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class
        entry.target.classList.add('is-visible');

        // Unobserve if triggerOnce is enabled
        if (config.triggerOnce) {
          observer.unobserve(entry.target);
        }
      } else {
        // Remove visible class if triggerOnce is disabled
        if (!config.triggerOnce) {
          entry.target.classList.remove('is-visible');
        }
      }
    });
  }

  // Initialize observer
  function initScrollReveal() {
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      console.warn('Intersection Observer not supported, revealing all elements immediately');
      document.querySelectorAll('.reveal, .reveal-from-left, .reveal-from-right, .reveal-scale, .reveal-fade, .reveal-blur').forEach(el => {
        el.classList.add('is-visible');
      });
      return;
    }

    // Create observer
    const observer = new IntersectionObserver(handleIntersection, config);

    // Observe all reveal elements
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-from-left, .reveal-from-right, .reveal-scale, .reveal-fade, .reveal-blur'
    );

    revealElements.forEach(el => {
      observer.observe(el);
    });

    console.log(`🎬 Scroll Reveal initialized: ${revealElements.length} elements`);
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }

  // Reveal hero immediately on page load (no delay)
  window.addEventListener('load', () => {
    const heroElements = document.querySelectorAll('.hero .reveal');
    heroElements.forEach(el => {
      el.classList.add('is-visible');
    });
  });

})();
