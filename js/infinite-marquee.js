/**
 * INFINITE SCROLL MARQUEE SYSTEM
 * ================================
 * Premium 2026 SaaS pattern for continuous horizontal scrolling content.
 * Used by: Vercel, Linear, Stripe, Notion, Anthropic, OpenAI.
 * 
 * Features:
 * - Seamless infinite loop via content duplication
 * - Hover pause functionality
 * - Multiple speed presets
 * - Auto-init on page load
 * - Mobile-optimized performance
 * - Accessibility support
 * 
 * @version 1.0.0
 * @author Rick Sanchez
 */

class InfiniteMarquee {
  constructor() {
    this.marquees = [];
    this.initialized = false;
  }

  /**
   * Initialize all marquee instances on the page
   */
  init() {
    if (this.initialized) return;

    const marqueeContainers = document.querySelectorAll('.marquee-container');
    
    marqueeContainers.forEach((container, index) => {
      this.setupMarquee(container, index);
    });

    this.initialized = true;
    console.log(`✅ Infinite Marquee System initialized (${marqueeContainers.length} instances)`);
  }

  /**
   * Set up individual marquee instance
   * @param {HTMLElement} container - The marquee container element
   * @param {number} index - Container index
   */
  setupMarquee(container, index) {
    const track = container.querySelector('.marquee-track');
    if (!track) return;

    // Duplicate content for seamless infinite loop
    const originalContent = track.innerHTML;
    track.innerHTML = originalContent + originalContent;

    // Store reference
    this.marquees.push({
      container,
      track,
      index
    });

    // Add hover pause/play events
    this.addHoverEvents(track);

    // Add accessibility attributes
    this.addAccessibility(container, track);
  }

  /**
   * Add hover pause/play functionality
   * @param {HTMLElement} track - The marquee track element
   */
  addHoverEvents(track) {
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });

    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });
  }

  /**
   * Add accessibility attributes
   * @param {HTMLElement} container - The container element
   * @param {HTMLElement} track - The track element
   */
  addAccessibility(container, track) {
    container.setAttribute('aria-label', 'Scrolling content carousel');
    track.setAttribute('role', 'region');
    track.setAttribute('aria-live', 'off'); // Prevent screen reader announcement spam
  }

  /**
   * Dynamically create a marquee from data
   * @param {string} type - Marquee type (logo|testimonial|stat|feature)
   * @param {Array} items - Array of item data
   * @param {Object} options - Configuration options
   * @returns {HTMLElement} The created marquee section
   */
  static create(type, items, options = {}) {
    const {
      speed = 'normal', // fast|normal|slow
      reverse = false,
      title = '',
      subtitle = ''
    } = options;

    // Create section wrapper
    const section = document.createElement('section');
    section.className = 'marquee-section';

    // Add header if provided
    if (title || subtitle) {
      const header = document.createElement('div');
      header.className = 'marquee-section-header';
      
      if (title) {
        const titleEl = document.createElement('div');
        titleEl.className = 'marquee-section-title';
        titleEl.textContent = title;
        header.appendChild(titleEl);
      }
      
      if (subtitle) {
        const subtitleEl = document.createElement('div');
        subtitleEl.className = 'marquee-section-subtitle';
        subtitleEl.textContent = subtitle;
        header.appendChild(subtitleEl);
      }
      
      section.appendChild(header);
    }

    // Create container
    const container = document.createElement('div');
    container.className = 'marquee-container';

    // Create track
    const track = document.createElement('div');
    track.className = `marquee-track${speed === 'fast' ? ' marquee-fast' : speed === 'slow' ? ' marquee-slow' : ''}${reverse ? ' marquee-reverse' : ''}`;

    // Generate items based on type
    items.forEach(item => {
      const itemEl = InfiniteMarquee.createItem(type, item);
      track.appendChild(itemEl);
    });

    container.appendChild(track);
    section.appendChild(container);

    return section;
  }

  /**
   * Create individual marquee item based on type
   * @param {string} type - Item type
   * @param {Object} data - Item data
   * @returns {HTMLElement} The created item element
   */
  static createItem(type, data) {
    const item = document.createElement('div');
    item.className = 'marquee-item';

    switch (type) {
      case 'logo':
        item.innerHTML = `<img src="${data.src}" alt="${data.alt}" class="marquee-logo">`;
        break;

      case 'testimonial':
        item.className += ' marquee-testimonial';
        item.innerHTML = `
          <div class="marquee-quote">${data.quote}</div>
          <div class="marquee-author">
            <div class="marquee-avatar">${data.initials}</div>
            <div class="marquee-author-info">
              <div class="marquee-author-name">${data.name}</div>
              <div class="marquee-author-role">${data.role}</div>
            </div>
          </div>
        `;
        break;

      case 'stat':
        item.className += ' marquee-stat';
        item.innerHTML = `
          <div class="marquee-stat-value">${data.value}</div>
          <div class="marquee-stat-label">${data.label}</div>
        `;
        break;

      case 'feature':
        item.className += ' marquee-feature';
        item.innerHTML = `
          <div class="marquee-feature-icon">${data.icon}</div>
          <div class="marquee-feature-text">${data.text}</div>
        `;
        break;

      default:
        item.textContent = data.text || '';
    }

    return item;
  }

  /**
   * Pause all marquees
   */
  pauseAll() {
    this.marquees.forEach(({ track }) => {
      track.style.animationPlayState = 'paused';
    });
  }

  /**
   * Resume all marquees
   */
  resumeAll() {
    this.marquees.forEach(({ track }) => {
      track.style.animationPlayState = 'running';
    });
  }

  /**
   * Destroy all marquee instances
   */
  destroy() {
    this.marquees = [];
    this.initialized = false;
  }
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.marqueeSystem = new InfiniteMarquee();
    window.marqueeSystem.init();
  });
} else {
  window.marqueeSystem = new InfiniteMarquee();
  window.marqueeSystem.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InfiniteMarquee;
}
