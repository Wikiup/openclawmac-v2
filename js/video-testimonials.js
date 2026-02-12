/**
 * VIDEO TESTIMONIALS INTERACTIVE SYSTEM
 * Sprint #41 - 2026-02-10 6:57 AM
 * 
 * Manages interactive video testimonial cards with:
 * - Auto-play preview on hover
 * - Fullscreen modal playback
 * - Touch-optimized mobile interactions
 * - Keyboard navigation
 * - Accessibility support
 */

class VideoTestimonials {
  constructor() {
    this.cards = [];
    this.modal = null;
    this.currentVideo = null;
    this.isTouchDevice = 'ontouchstart' in window;
    
    this.init();
  }

  init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.createModal();
    this.initCards();
    this.bindEvents();
  }

  /**
   * Create fullscreen modal structure
   */
  createModal() {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Video testimonial player');
    
    modal.innerHTML = `
      <div class="video-modal__container">
        <button class="video-modal__close" aria-label="Close video"></button>
        <video class="video-modal__video" controls playsinline></video>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.modal = modal;
  }

  /**
   * Initialize all video testimonial cards
   */
  initCards() {
    const cards = document.querySelectorAll('.video-testimonial');
    
    cards.forEach((card, index) => {
      const video = card.querySelector('.video-testimonial__video');
      const placeholder = card.querySelector('.video-testimonial__placeholder');
      
      if (!video) return;

      // Prepare video
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';

      // Mark as loaded when ready
      video.addEventListener('loadeddata', () => {
        video.classList.add('loaded');
      });

      // Load video metadata
      video.load();

      this.cards.push({
        element: card,
        video: video,
        placeholder: placeholder,
        videoSrc: video.dataset.src || video.src,
        index: index
      });
    });
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Card interactions
    this.cards.forEach(card => {
      // Click to fullscreen
      card.element.addEventListener('click', (e) => {
        this.openModal(card);
      });

      // Hover preview (desktop only)
      if (!this.isTouchDevice) {
        card.element.addEventListener('mouseenter', () => {
          this.playPreview(card);
        });

        card.element.addEventListener('mouseleave', () => {
          this.pausePreview(card);
        });
      }

      // Keyboard navigation
      card.element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openModal(card);
        }
      });

      // Make focusable
      card.element.setAttribute('tabindex', '0');
      card.element.setAttribute('role', 'button');
      card.element.setAttribute('aria-label', `Play video testimonial ${card.index + 1}`);
    });

    // Modal close
    const closeBtn = this.modal.querySelector('.video-modal__close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
    });

    // Click backdrop to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('video-modal--active')) {
        this.closeModal();
      }
    });

    // Modal video ended
    const modalVideo = this.modal.querySelector('.video-modal__video');
    modalVideo.addEventListener('ended', () => {
      // Auto-close on end (optional)
      // this.closeModal();
    });
  }

  /**
   * Play preview on hover
   */
  playPreview(card) {
    if (!card.video || this.isTouchDevice) return;

    try {
      card.video.currentTime = 0;
      const playPromise = card.video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Preview autoplay prevented:', err);
        });
      }

      card.element.classList.add('video-testimonial--playing');
    } catch (err) {
      console.log('Preview play error:', err);
    }
  }

  /**
   * Pause preview on mouse leave
   */
  pausePreview(card) {
    if (!card.video) return;

    try {
      card.video.pause();
      card.video.currentTime = 0;
      card.element.classList.remove('video-testimonial--playing');
    } catch (err) {
      console.log('Preview pause error:', err);
    }
  }

  /**
   * Open fullscreen modal
   */
  openModal(card) {
    const modalVideo = this.modal.querySelector('.video-modal__video');
    
    // Set video source
    modalVideo.src = card.videoSrc;
    modalVideo.load();

    // Show modal
    this.modal.classList.add('video-modal--active');
    document.body.style.overflow = 'hidden';

    // Play video
    const playPromise = modalVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log('Modal play error:', err);
      });
    }

    this.currentVideo = card;

    // Focus trap
    const closeBtn = this.modal.querySelector('.video-modal__close');
    setTimeout(() => closeBtn.focus(), 100);

    // Analytics (optional)
    this.trackEvent('video_opened', {
      index: card.index,
      src: card.videoSrc
    });
  }

  /**
   * Close fullscreen modal
   */
  closeModal() {
    const modalVideo = this.modal.querySelector('.video-modal__video');
    
    // Pause and reset
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modalVideo.src = '';

    // Hide modal
    this.modal.classList.remove('video-modal--active');
    document.body.style.overflow = '';

    // Return focus to card
    if (this.currentVideo) {
      setTimeout(() => {
        this.currentVideo.element.focus();
      }, 100);
    }

    this.currentVideo = null;

    // Analytics (optional)
    this.trackEvent('video_closed');
  }

  /**
   * Analytics helper (stub)
   */
  trackEvent(eventName, data = {}) {
    // Integration point for analytics
    console.log('Video Testimonials Event:', eventName, data);
    
    // Example: Google Analytics
    // if (window.gtag) {
    //   gtag('event', eventName, data);
    // }
  }

  /**
   * Cleanup
   */
  destroy() {
    // Pause all videos
    this.cards.forEach(card => {
      if (card.video) {
        card.video.pause();
      }
    });

    // Remove modal
    if (this.modal && this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal);
    }

    this.cards = [];
    this.modal = null;
    this.currentVideo = null;
  }
}

// Auto-initialize
let videoTestimonialsInstance = null;

function initVideoTestimonials() {
  if (document.querySelector('.video-testimonials')) {
    videoTestimonialsInstance = new VideoTestimonials();
  }
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVideoTestimonials);
} else {
  initVideoTestimonials();
}

// Export for external use
window.VideoTestimonials = VideoTestimonials;
