/* ═══════════════════════════════════════════════════════════════
   STATS DASHBOARD - Animation Controller
   ═══════════════════════════════════════════════════════════════
   
   Handles animated count-up numbers, scroll reveals, and real-time
   status updates for the stats dashboard.
   
   FEATURES:
   - Scroll-triggered counter animations (easeOutQuart easing)
   - IntersectionObserver for reveal triggers
   - RAF-optimized number counting
   - Configurable animation duration and easing
   - Prevents re-triggering on already-counted elements
   
   Sprint #33 - 2026-02-10 04:57 AM
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  // CONFIGURATION
  // ─────────────────────────────────────────────────────────────

  const CONFIG = {
    animationDuration: 2000, // ms for count-up animation
    observerThreshold: 0.3, // Trigger when 30% visible
    observerRootMargin: '0px 0px -10% 0px', // Bottom margin for trigger
  };

  // ─────────────────────────────────────────────────────────────
  // EASING FUNCTIONS
  // ─────────────────────────────────────────────────────────────

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  // ─────────────────────────────────────────────────────────────
  // ANIMATED COUNTER
  // ─────────────────────────────────────────────────────────────

  function animateCounter(element, target, duration = CONFIG.animationDuration) {
    // Prevent re-animation
    if (element.dataset.counted === 'true') return;
    element.dataset.counted = 'true';

    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);

      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  // ─────────────────────────────────────────────────────────────
  // SCROLL REVEAL OBSERVER
  // ─────────────────────────────────────────────────────────────

  function initScrollReveal() {
    const statCards = document.querySelectorAll('.stat-card');
    const availabilityBar = document.querySelector('.availability-bar');

    if (!statCards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add reveal class
            entry.target.classList.add('revealed');

            // Trigger counter animation if it's a stat card
            if (entry.target.classList.contains('stat-card')) {
              const numberElement = entry.target.querySelector('.stat-number');
              if (numberElement && numberElement.dataset.target) {
                const targetValue = parseInt(numberElement.dataset.target, 10);
                animateCounter(numberElement, targetValue);
              }
            }

            // Unobserve after reveal
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: CONFIG.observerThreshold,
        rootMargin: CONFIG.observerRootMargin,
      }
    );

    // Observe all stat cards
    statCards.forEach((card) => observer.observe(card));

    // Observe availability bar if present
    if (availabilityBar) {
      availabilityBar.style.opacity = '0';
      availabilityBar.style.transform = 'translateY(20px)';
      availabilityBar.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

      const barObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              barObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      barObserver.observe(availabilityBar);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // REAL-TIME AVAILABILITY UPDATE (OPTIONAL)
  // ─────────────────────────────────────────────────────────────

  function updateAvailability() {
    const slotsElement = document.querySelector('.availability-slots');
    if (!slotsElement) return;

    // This would connect to a real API in production
    // For now, we'll use static data with realistic variation

    const currentHour = new Date().getHours();
    let slots = 3; // Default available slots

    // Simulate realistic availability based on time of day
    if (currentHour >= 9 && currentHour < 12) {
      slots = 2; // Morning rush
    } else if (currentHour >= 14 && currentHour < 17) {
      slots = 1; // Afternoon busy
    } else if (currentHour >= 18 || currentHour < 9) {
      slots = 4; // Evening/night more available
    }

    // Update text
    const slotText = slots === 1 ? '1 spot left' : `${slots} spots left`;
    slotsElement.textContent = slotText;

    // Update color based on urgency
    const bar = document.querySelector('.availability-bar');
    if (slots <= 1) {
      // High urgency - switch to orange/red
      bar.style.background = 'rgba(251, 146, 60, 0.05)';
      bar.style.borderColor = 'rgba(251, 146, 60, 0.2)';
      slotsElement.style.background = 'rgba(251, 146, 60, 0.1)';
      slotsElement.style.color = '#fb923c';
    }
  }

  // ─────────────────────────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────────────────────────

  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initScrollReveal();
        updateAvailability();
      });
    } else {
      initScrollReveal();
      updateAvailability();
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────

  window.StatsDashboard = {
    init,
    animateCounter,
    updateAvailability,
  };

  // Auto-init
  init();
})();
