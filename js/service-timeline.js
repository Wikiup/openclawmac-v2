/* ═══════════════════════════════════════════════════════════════════════════
   SERVICE JOURNEY TIMELINE CONTROLLER
   Autonomous Redesign Sprint #32 | 2026-02-10 4:42 AM
   
   Manages scroll-driven timeline animations, hover states, and progress tracking.
   
   FEATURES:
   - Scroll-triggered step reveals with IntersectionObserver
   - Animated progress line tracking scroll position
   - Hover state management
   - Keyboard navigation support
   - Performance-optimized RAF animations
   - Full reduced-motion support
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const timeline = document.querySelector('.service-timeline');
    if (!timeline) return;

    const steps = Array.from(timeline.querySelectorAll('.timeline-step'));
    const progressLine = timeline.querySelector('.timeline-progress-line');
    const progressFill = timeline.querySelector('.timeline-progress-fill');

    // Intersection Observer for step reveals
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          // Activate progress line when first step is visible
          if (steps.indexOf(entry.target) === 0) {
            progressLine?.classList.add('active');
          }
        }
      });
    }, observerOptions);

    // Observe all steps
    steps.forEach((step, index) => {
      observer.observe(step);
      
      // Staggered reveal delay
      if (!prefersReducedMotion) {
        step.style.transitionDelay = `${index * 0.15}s`;
      }
    });

    // Progress line tracking
    if (progressFill && !prefersReducedMotion) {
      let ticking = false;

      function updateProgress() {
        if (!timeline) return;

        const timelineRect = timeline.getBoundingClientRect();
        const timelineTop = timelineRect.top + window.scrollY;
        const timelineHeight = timelineRect.height;
        const scrollTop = window.scrollY + window.innerHeight * 0.5;

        // Calculate progress (0 to 1)
        const progress = Math.max(0, Math.min(1, 
          (scrollTop - timelineTop) / timelineHeight
        ));

        progressFill.style.height = `${progress * 100}%`;
        ticking = false;
      }

      function requestUpdate() {
        if (!ticking) {
          window.requestAnimationFrame(updateProgress);
          ticking = true;
        }
      }

      window.addEventListener('scroll', requestUpdate, { passive: true });
      window.addEventListener('resize', requestUpdate, { passive: true });
      
      // Initial update
      requestUpdate();
    }

    // Step interaction handlers
    steps.forEach((step) => {
      const node = step.querySelector('.timeline-step-node');
      if (!node) return;

      // Click to activate/deactivate
      node.addEventListener('click', () => {
        const isActive = step.classList.contains('active');
        
        // Remove active from all steps
        steps.forEach(s => s.classList.remove('active'));
        
        // Toggle current step
        if (!isActive) {
          step.classList.add('active');
        }
      });

      // Keyboard navigation
      node.setAttribute('tabindex', '0');
      node.setAttribute('role', 'button');
      node.setAttribute('aria-label', `Step ${steps.indexOf(step) + 1}`);

      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          node.click();
        }
      });

      // Hover state management
      step.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion) {
          step.classList.add('hover');
        }
      });

      step.addEventListener('mouseleave', () => {
        step.classList.remove('hover');
      });
    });

    // Auto-advance active state on scroll
    if (!prefersReducedMotion) {
      const autoAdvanceObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            // Remove active from all
            steps.forEach(s => s.classList.remove('active'));
            // Add active to current
            entry.target.classList.add('active');
          }
        });
      }, {
        threshold: 0.6,
        rootMargin: '-20% 0px -20% 0px'
      });

      steps.forEach(step => autoAdvanceObserver.observe(step));
    }

    // Expose public API
    window.ServiceTimeline = {
      steps,
      activateStep(index) {
        steps.forEach(s => s.classList.remove('active'));
        if (steps[index]) {
          steps[index].classList.add('active');
        }
      },
      revealAll() {
        steps.forEach(s => s.classList.add('revealed'));
        progressLine?.classList.add('active');
      },
      reset() {
        steps.forEach(s => {
          s.classList.remove('revealed', 'active', 'hover');
        });
        progressLine?.classList.remove('active');
        if (progressFill) {
          progressFill.style.height = '0%';
        }
      }
    };

    console.log('✅ Service Timeline initialized');
  }

  // Handle visibility change (pause animations when tab is hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.ServiceTimeline) {
      // Pause animations when tab is hidden
      document.querySelectorAll('.timeline-step').forEach(step => {
        step.style.animationPlayState = 'paused';
      });
    } else {
      // Resume animations when tab is visible
      document.querySelectorAll('.timeline-step').forEach(step => {
        step.style.animationPlayState = 'running';
      });
    }
  });

})();
