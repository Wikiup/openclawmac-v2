/**
 * INTERACTIVE FEATURE COMPARISON MATRIX (Scroll Trigger Disabled)
 * Sprint #36 - 2026-02-10 5:42 AM
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
    // Disabled scroll reveal to prevent jump
    // setupScrollReveal();
    setupFeatureAnimations();
    setupAccessibility();
  }

  /**
   * SCROLL REVEAL (DISABLED)
   */
  function setupScrollReveal() {
    // Logic removed to prevent auto-scroll focus stealing
  }

  /**
   * FEATURE ANIMATIONS
   * Staggered slide-in animations for feature list items
   */
  function setupFeatureAnimations() {
    // Animation is handled via CSS
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
   */
  function setupAccessibility() {
    const columns = document.querySelectorAll('.comparison-column');
    
    columns.forEach((column, index) => {
      // Add ARIA labels
      const title = column.querySelector('h3')?.textContent || '';
      column.setAttribute('role', 'region');
      column.setAttribute('aria-label', `${title} comparison column`);

      // Removed tabindex to prevent focus stealing on load
      // column.setAttribute('tabindex', '0'); 
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
   */
  window.ComparisonMatrix = {
    triggerFeatureAnimations: triggerFeatureAnimations
  };

})();
