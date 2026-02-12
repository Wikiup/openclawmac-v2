/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                     SCROLL-DRIVEN ANIMATIONS ENGINE                           ║
 * ║                   High-Performance Scroll Event Handler                       ║
 * ║                                                                               ║
 * ║  Features: Horizontal Gallery, Pin/Scale, Parallax, Progress, Counters       ║
 * ║  Performance: RAF-throttled, IntersectionObserver, GPU-accelerated           ║
 * ║  Compatibility: iOS Safari, Chrome, Firefox, Edge                             ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

class ScrollDrivenAnimations {
  constructor() {
    this.scrollPos = 0;
    this.windowHeight = window.innerHeight;
    this.documentHeight = document.documentElement.scrollHeight;
    this.ticking = false;
    this.countersAnimated = new Set();
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    // Check for reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.prefersReducedMotion) {
      console.log('[ScrollDriven] Reduced motion detected - animations disabled');
      return;
    }

    this.setupScrollProgress();
    this.setupHorizontalGallery();
    this.setupPinnedSections();
    this.setupParallax();
    this.setupRevealAnimations();
    this.setupCounters();
    this.attachScrollListener();
    this.attachResizeListener();

    console.log('[ScrollDriven] Initialized successfully');
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SCROLL PROGRESS BAR & CIRCLE
     ═══════════════════════════════════════════════════════════════════════════ */

  setupScrollProgress() {
    // Linear progress bar (top of page)
    const progressFill = document.querySelector('.scroll-progress-fill');
    if (progressFill) {
      this.progressFill = progressFill;
    }

    // Circular progress indicator (bottom right)
    const progressCircle = document.querySelector('.scroll-progress-circle');
    if (progressCircle) {
      this.progressCircle = progressCircle;
      this.progressCirclePath = progressCircle.querySelector('.progress-fill');
      this.progressCircleRadius = 24;
      this.progressCircleCircumference = 2 * Math.PI * this.progressCircleRadius;
    }
  }

  updateScrollProgress() {
    const scrollPercent = (this.scrollPos / (this.documentHeight - this.windowHeight)) * 100;
    
    // Update linear bar
    if (this.progressFill) {
      this.progressFill.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    // Update circular indicator
    if (this.progressCircle && this.progressCirclePath) {
      const offset = this.progressCircleCircumference - (scrollPercent / 100) * this.progressCircleCircumference;
      this.progressCirclePath.style.strokeDashoffset = offset;
      
      // Show/hide based on scroll position
      if (this.scrollPos > 300) {
        this.progressCircle.classList.add('visible');
      } else {
        this.progressCircle.classList.remove('visible');
      }
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     HORIZONTAL SCROLL GALLERY (Apple Product Showcase Pattern)
     ═══════════════════════════════════════════════════════════════════════════ */

  setupHorizontalGallery() {
    const galleries = document.querySelectorAll('.scroll-gallery');
    
    galleries.forEach(gallery => {
      const track = gallery.querySelector('.scroll-gallery__track');
      const dots = gallery.querySelectorAll('.scroll-gallery__dot');
      
      if (!track || dots.length === 0) return;

      // Update active dot on scroll
      track.addEventListener('scroll', () => {
        const trackWidth = track.scrollWidth - track.clientWidth;
        const scrollPercent = track.scrollLeft / trackWidth;
        const activeIndex = Math.round(scrollPercent * (dots.length - 1));
        
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === activeIndex);
        });
      });

      // Click dots to scroll to items
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          const items = track.querySelectorAll('.scroll-gallery__item');
          if (items[index]) {
            items[index].scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'center'
            });
          }
        });
      });

      // Keyboard navigation (arrow keys)
      track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const items = track.querySelectorAll('.scroll-gallery__item');
          const currentIndex = Math.round(track.scrollLeft / items[0].offsetWidth);
          const newIndex = e.key === 'ArrowLeft' 
            ? Math.max(0, currentIndex - 1)
            : Math.min(items.length - 1, currentIndex + 1);
          
          items[newIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     PINNED SECTIONS (Sticky Scroll with Scale Effects)
     ═══════════════════════════════════════════════════════════════════════════ */

  setupPinnedSections() {
    this.pinnedSections = document.querySelectorAll('.scroll-pin-section');
  }

  updatePinnedSections() {
    this.pinnedSections.forEach(section => {
      const content = section.querySelector('.scroll-pin-content');
      if (!content) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const progress = Math.max(0, Math.min(1, 1 - (rect.top / (sectionHeight - this.windowHeight))));

      // Scale effect based on scroll progress
      // 0.8 at start -> 1.0 at middle -> 0.8 at end
      const scaleProgress = 1 - Math.abs(progress - 0.5) * 2;
      const scale = 0.8 + (scaleProgress * 0.2);
      
      content.style.transform = `translateY(-50%) scale(${scale})`;
      content.style.opacity = scaleProgress;
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     PARALLAX LAYERS (Multi-Speed Scroll Depth)
     ═══════════════════════════════════════════════════════════════════════════ */

  setupParallax() {
    this.parallaxLayers = {
      slow: document.querySelectorAll('.parallax-layer--slow'),
      medium: document.querySelectorAll('.parallax-layer--medium'),
      fast: document.querySelectorAll('.parallax-layer--fast')
    };
  }

  updateParallax() {
    const speeds = {
      slow: 0.2,
      medium: 0.5,
      fast: 0.8
    };

    Object.keys(this.parallaxLayers).forEach(speed => {
      this.parallaxLayers[speed].forEach(layer => {
        const rect = layer.parentElement.getBoundingClientRect();
        const offset = (this.windowHeight - rect.top) * speeds[speed];
        layer.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     REVEAL ANIMATIONS (IntersectionObserver-based)
     ═══════════════════════════════════════════════════════════════════════════ */

  setupRevealAnimations() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if (revealElements.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    this.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Optional: unobserve after reveal (one-time animation)
          // this.revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      this.revealObserver.observe(el);
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     NUMBER COUNTERS (Scroll-Triggered Count-Up)
     ═══════════════════════════════════════════════════════════════════════════ */

  setupCounters() {
    const counters = document.querySelectorAll('.scroll-counter');
    
    if (counters.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    this.counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.countersAnimated.has(entry.target)) {
          this.animateCounter(entry.target);
          this.countersAnimated.add(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(counter => {
      this.counterObserver.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target')) || 100;
    const duration = parseInt(element.getAttribute('data-duration')) || 2000;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutCubic)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * target);
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };
    
    requestAnimationFrame(updateCounter);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     SCROLL EVENT HANDLER (RAF-throttled)
     ═══════════════════════════════════════════════════════════════════════════ */

  attachScrollListener() {
    window.addEventListener('scroll', () => {
      this.scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.updateScrollProgress();
          this.updatePinnedSections();
          this.updateParallax();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });

    // Initial update
    this.scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    this.updateScrollProgress();
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RESIZE HANDLER
     ═══════════════════════════════════════════════════════════════════════════ */

  attachResizeListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.windowHeight = window.innerHeight;
        this.documentHeight = document.documentElement.scrollHeight;
        this.updateScrollProgress();
      }, 250);
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     PUBLIC API
     ═══════════════════════════════════════════════════════════════════════════ */

  destroy() {
    if (this.revealObserver) this.revealObserver.disconnect();
    if (this.counterObserver) this.counterObserver.disconnect();
    console.log('[ScrollDriven] Destroyed');
  }

  reset() {
    this.countersAnimated.clear();
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.classList.remove('revealed');
    });
    this.setupRevealAnimations();
    this.setupCounters();
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   AUTO-INITIALIZE
   ═══════════════════════════════════════════════════════════════════════════ */

const scrollDrivenAnimations = new ScrollDrivenAnimations();

// Expose to global scope for debugging
if (typeof window !== 'undefined') {
  window.ScrollDrivenAnimations = scrollDrivenAnimations;
}
