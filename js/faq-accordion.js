/**
 * FAQ ACCORDION SYSTEM (Auto-scroll disabled)
 * Premium interactive Q&A with smooth animations
 */

class FAQAccordion {
  constructor(container, options = {}) {
    this.container = container;
    this.items = container.querySelectorAll('.faq-item');
    this.options = {
      accordionMode: true, // Auto-close others when one opens
      allowMultiple: false, // Allow multiple items open at once
      initiallyOpen: null, // Index or array of indices to open on load
      animationDuration: 500, // milliseconds
      scrollOffset: 80, // Offset when scrolling to item
      ...options
    };

    this.init();
  }

  init() {
    if (!this.container || this.items.length === 0) {
      console.warn('FAQ Accordion: No items found');
      return;
    }

    // Set up each item
    this.items.forEach((item, index) => {
      this.setupItem(item, index);
    });

    // Handle URL hash on load (DISABLED auto-scroll for hash)
    // this.handleUrlHash();

    // Listen for hash changes
    // window.addEventListener('hashchange', () => this.handleUrlHash());

    // Add keyboard navigation
    this.setupKeyboardNavigation();

    // Open initially specified items
    if (this.options.initiallyOpen !== null) {
      const indices = Array.isArray(this.options.initiallyOpen)
        ? this.options.initiallyOpen
        : [this.options.initiallyOpen];

      indices.forEach(index => {
        if (this.items[index]) {
          this.openItem(this.items[index], false);
        }
      });
    }

    console.log(`FAQ Accordion initialized with ${this.items.length} items`);
  }

  setupItem(item, index) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) {
      console.warn(`FAQ item ${index} missing question or answer`);
      return;
    }

    // Set unique ID if not present
    if (!item.id) {
      item.id = `faq-${index + 1}`;
    }

    // ARIA attributes
    const questionId = `faq-question-${index + 1}`;
    const answerId = `faq-answer-${index + 1}`;

    question.id = questionId;
    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('aria-controls', answerId);
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');

    answer.id = answerId;
    answer.setAttribute('aria-labelledby', questionId);
    answer.setAttribute('role', 'region');
    answer.setAttribute('aria-hidden', 'true');

    // Click handler
    question.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleItem(item);
    });

    // Keyboard handler (Enter/Space)
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggleItem(item);
      }
    });

    // Prevent scroll jumping during animation
    answer.style.overflow = 'hidden';
  }

  toggleItem(item) {
    const isActive = item.classList.contains('active');

    if (isActive) {
      this.closeItem(item);
    } else {
      // If accordion mode, close others first
      if (this.options.accordionMode && !this.options.allowMultiple) {
        this.items.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            this.closeItem(otherItem);
          }
        });
      }

      this.openItem(item, false); // Explicitly disable scroll
    }
  }

  openItem(item, shouldScroll = false) { // Default scroll to FALSE
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const content = answer.querySelector('.faq-answer-content');

    if (!question || !answer || !content) return;

    // Add active class
    item.classList.add('active');

    // Update ARIA
    question.setAttribute('aria-expanded', 'true');
    answer.setAttribute('aria-hidden', 'false');

    // Calculate content height
    const contentHeight = content.scrollHeight;

    // Animate max-height
    answer.style.maxHeight = contentHeight + 'px';

    // Optional smooth scroll to item (DISABLED by default)
    if (shouldScroll) {
      setTimeout(() => {
        const itemTop = item.getBoundingClientRect().top + window.pageYOffset;
        const scrollTo = itemTop - this.options.scrollOffset;

        /* window.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        }); */
      }, 100);
    }

    // Dispatch custom event
    item.dispatchEvent(new CustomEvent('faq:open', {
      detail: { item, index: Array.from(this.items).indexOf(item) }
    }));
  }

  closeItem(item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    // Remove active class
    item.classList.remove('active');

    // Update ARIA
    question.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');

    // Collapse
    answer.style.maxHeight = '0';

    // Dispatch custom event
    item.dispatchEvent(new CustomEvent('faq:close', {
      detail: { item, index: Array.from(this.items).indexOf(item) }
    }));
  }

  handleUrlHash() {
    // Disabled to prevent jump
  }

  setupKeyboardNavigation() {
    this.container.addEventListener('keydown', (e) => {
      const focusedQuestion = document.activeElement;

      if (!focusedQuestion.classList.contains('faq-question')) return;

      const currentItem = focusedQuestion.closest('.faq-item');
      const currentIndex = Array.from(this.items).indexOf(currentItem);

      let nextIndex = null;

      // Arrow Up: Previous item
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : this.items.length - 1;
      }

      // Arrow Down: Next item
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = currentIndex < this.items.length - 1 ? currentIndex + 1 : 0;
      }

      // Home: First item
      if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      }

      // End: Last item
      if (e.key === 'End') {
        e.preventDefault();
        nextIndex = this.items.length - 1;
      }

      // Focus next item
      if (nextIndex !== null) {
        const nextQuestion = this.items[nextIndex].querySelector('.faq-question');
        if (nextQuestion) {
          nextQuestion.focus();
        }
      }
    });
  }

  // Public API methods
  openAll() {
    this.items.forEach(item => this.openItem(item, false));
  }

  closeAll() {
    this.items.forEach(item => this.closeItem(item));
  }

  openByIndex(index) {
    if (this.items[index]) {
      this.openItem(this.items[index]);
    }
  }

  closeByIndex(index) {
    if (this.items[index]) {
      this.closeItem(this.items[index]);
    }
  }

  destroy() {
    this.items.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.replaceWith(question.cloneNode(true));
      }
    });
    console.log('FAQ Accordion destroyed');
  }

  // Static factory method
  static init(selector, options) {
    const container = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!container) {
      console.warn(`FAQ Accordion: Container "${selector}" not found`);
      return null;
    }

    return new FAQAccordion(container, options);
  }
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
}

function initFAQ() {
  const faqContainer = document.querySelector('.faq-accordion');

  if (faqContainer) {
    window.faqAccordion = FAQAccordion.init(faqContainer, {
      accordionMode: true,
      allowMultiple: false,
      animationDuration: 500,
      scrollOffset: 100
    });

    // Debug logging
    faqContainer.addEventListener('faq:open', (e) => {
      console.log('FAQ opened:', e.detail.index);
    });

    faqContainer.addEventListener('faq:close', (e) => {
      console.log('FAQ closed:', e.detail.index);
    });
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FAQAccordion;
}
