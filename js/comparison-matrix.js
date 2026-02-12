/**
 * INTERACTIVE FEATURE COMPARISON MATRIX
 * Sprint #36 - 2026-02-10 5:42 AM
 * 
 * Handles scroll-triggered reveals and interactive enhancements
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    setupScrollReveal();
    setupFeatureAnimations();
    setupAccessibility();
  }

  /**
   * SCROLL REVEAL
   * Triggers section reveal when scrolled into view
   */
  function setupScrollReveal() {
    const section = document.querySelector('.comparison-section');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Trigger feature animations after section reveal
          setTimeout(() => {
            triggerFeatureAnimations();
          }, 300);
        }
      });
    }, {
      threshold: 0.2, // Trigger when 20% visible
      rootMargin: '0px 0px -100px 0px' // Offset from bottom
    });

    observer.observe(section);
  }

  /**
   * FEATURE ANIMATIONS
   * Staggered slide-in animations for feature list items
   */
  function setupFeatureAnimations() {
    // Animation is handled via CSS
    // This function can be extended for more complex interactions
  }

  function triggerFeatureAnimations() {
    const features = document.querySelectorAll('.comparison-feature');
    
    // Check if animations are already running
    if (features.length > 0 && features[0].style.animationPlayState === 'running') {
      return;
    }

    features.forEach((feature, index) => {
      // Reset and replay animation
      feature.style.animation = 'none';
      // Force reflow
      feature.offsetHeight;
      // Re-apply animation
      feature.style.animation = '';
    });
  }

  /**
   * ACCESSIBILITY
   * Enhanced keyboard navigation and screen reader support
   */
  function setupAccessibility() {
    const columns = document.querySelectorAll('.comparison-column');
    
    columns.forEach((column, index) => {
      // Add ARIA labels
      const title = column.querySelector('h3')?.textContent || '';
      column.setAttribute('role', 'region');
      column.setAttribute('aria-label', `${title} comparison column`);

      // Add focus styles
      column.setAttribute('tabindex', '0');
    });

    // Make feature icons more descriptive for screen readers
    const icons = document.querySelectorAll('.feature-icon');
    icons.forEach(icon => {
      let label = '';
      if (icon.classList.contains('check')) {
        label = 'Included';
      } else if (icon.classList.contains('cross')) {
        label = 'Not included';
      } else if (icon.classList.contains('partial')) {
        label = 'Partially included';
      }
      icon.setAttribute('aria-label', label);
      icon.setAttribute('role', 'img');
    });
  }

  /**
   * PUBLIC API
   * Expose methods for external control if needed
   */
  window.ComparisonMatrix = {
    triggerFeatureAnimations: triggerFeatureAnimations
  };

})();
