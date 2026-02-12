/* ═══════════════════════════════════════════════════════════════
   FORM MICRO-INTERACTIONS CONTROLLER
   Premium 2026 SaaS-tier input animations
   Handles: floating labels, validation states, character counters,
   submit button loading, autofill detection
   ═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    floatingLabelSelector: '.form-group',
    inputSelector: 'input:not([type="radio"]):not([type="checkbox"]), textarea',
    textareaMaxChars: 500,
    emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phonePattern: /^[\d\s\-\(\)]+$/,
    submitButtonSelector: 'button[type="submit"]',
    validationDelay: 500 // ms after typing stops
  };

  // State
  let validationTimers = new Map();

  /* ═══════════════════════════════════════════════════════════════
     FLOATING LABELS
     ═══════════════════════════════════════════════════════════════ */

  function initFloatingLabels() {
    const formGroups = document.querySelectorAll(CONFIG.floatingLabelSelector);
    
    formGroups.forEach(group => {
      const input = group.querySelector(CONFIG.inputSelector);
      const label = group.querySelector('label');
      
      if (!input || !label) return;
      
      // Add floating-label class
      group.classList.add('floating-label');
      
      // Mark textarea groups
      if (input.tagName === 'TEXTAREA') {
        group.classList.add('has-textarea');
      }
      
      // Check initial state (autofill, pre-filled)
      checkFloatingState(group, input);
      
      // Focus events
      input.addEventListener('focus', () => {
        group.classList.add('is-focused');
        group.classList.remove('is-error');
      });
      
      input.addEventListener('blur', () => {
        group.classList.remove('is-focused');
        checkFloatingState(group, input);
        
        // Trigger validation on blur
        if (input.hasAttribute('required')) {
          scheduleValidation(group, input);
        }
      });
      
      // Input events (for real-time state updates)
      input.addEventListener('input', () => {
        checkFloatingState(group, input);
        
        // Clear error state when user starts typing
        if (group.classList.contains('is-error')) {
          group.classList.remove('is-error');
          removeErrorMessage(group);
        }
        
        // Schedule validation
        if (input.hasAttribute('required')) {
          scheduleValidation(group, input);
        }
      });
      
      // Autofill detection
      detectAutofill(group, input);
    });
  }

  function checkFloatingState(group, input) {
    if (input.value.trim() !== '') {
      group.classList.add('is-filled');
    } else {
      group.classList.remove('is-filled');
      group.classList.remove('is-valid');
    }
  }

  function detectAutofill(group, input) {
    // Check periodically for autofill
    const checkAutofill = () => {
      try {
        // Chrome autofill detection
        if (input.matches(':-webkit-autofill')) {
          group.classList.add('is-filled');
        }
        
        // Firefox/Safari fallback
        if (input.value && !group.classList.contains('is-focused')) {
          group.classList.add('is-filled');
        }
      } catch (e) {
        // Fallback for browsers that don't support :-webkit-autofill
        if (input.value) {
          group.classList.add('is-filled');
        }
      }
    };
    
    // Check on load and periodically
    checkAutofill();
    setTimeout(checkAutofill, 100);
    setTimeout(checkAutofill, 500);
  }

  /* ═══════════════════════════════════════════════════════════════
     VALIDATION
     ═══════════════════════════════════════════════════════════════ */

  function scheduleValidation(group, input) {
    // Clear existing timer
    if (validationTimers.has(input)) {
      clearTimeout(validationTimers.get(input));
    }
    
    // Schedule new validation
    const timer = setTimeout(() => {
      validateInput(group, input);
    }, CONFIG.validationDelay);
    
    validationTimers.set(input, timer);
  }

  function validateInput(group, input) {
    const value = input.value.trim();
    const type = input.type;
    const isRequired = input.hasAttribute('required');
    
    // Skip validation if empty and not required
    if (!value && !isRequired) {
      group.classList.remove('is-valid', 'is-error');
      removeErrorMessage(group);
      return true;
    }
    
    let isValid = true;
    let errorMsg = '';
    
    // Required field check
    if (isRequired && !value) {
      isValid = false;
      errorMsg = 'This field is required';
    }
    
    // Email validation
    else if (type === 'email' && value) {
      if (!CONFIG.emailPattern.test(value)) {
        isValid = false;
        errorMsg = 'Please enter a valid email address';
      }
    }
    
    // Phone validation (basic)
    else if (type === 'tel' && value) {
      if (!CONFIG.phonePattern.test(value) || value.length < 10) {
        isValid = false;
        errorMsg = 'Please enter a valid phone number';
      }
    }
    
    // Min length check
    if (input.hasAttribute('minlength')) {
      const minLength = parseInt(input.getAttribute('minlength'));
      if (value.length < minLength) {
        isValid = false;
        errorMsg = `Minimum ${minLength} characters required`;
      }
    }
    
    // Update UI
    if (isValid && value) {
      group.classList.add('is-valid');
      group.classList.remove('is-error');
      removeErrorMessage(group);
    } else if (!isValid) {
      group.classList.add('is-error');
      group.classList.remove('is-valid');
      showErrorMessage(group, errorMsg);
    }
    
    return isValid;
  }

  function showErrorMessage(group, message) {
    // Remove existing error message
    removeErrorMessage(group);
    
    // Create and insert error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.textContent = message;
    
    const input = group.querySelector(CONFIG.inputSelector);
    if (input) {
      input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }
  }

  function removeErrorMessage(group) {
    const existingError = group.querySelector('.form-error-message');
    if (existingError) {
      existingError.remove();
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     CHARACTER COUNTER
     ═══════════════════════════════════════════════════════════════ */

  function initCharacterCounters() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
      const maxChars = parseInt(textarea.getAttribute('maxlength')) || CONFIG.textareaMaxChars;
      
      // Create counter element
      const counter = document.createElement('div');
      counter.className = 'form-counter';
      counter.textContent = `0 / ${maxChars}`;
      
      // Insert after textarea
      const formGroup = textarea.closest('.form-group');
      if (formGroup) {
        formGroup.appendChild(counter);
      }
      
      // Update counter on input
      textarea.addEventListener('input', () => {
        const currentLength = textarea.value.length;
        counter.textContent = `${currentLength} / ${maxChars}`;
        
        // Warning state (80% reached)
        if (currentLength >= maxChars * 0.8 && currentLength < maxChars) {
          counter.classList.add('counter-warning');
          counter.classList.remove('counter-danger');
        }
        // Danger state (at limit)
        else if (currentLength >= maxChars) {
          counter.classList.add('counter-danger');
          counter.classList.remove('counter-warning');
        }
        // Normal state
        else {
          counter.classList.remove('counter-warning', 'counter-danger');
        }
      });
      
      // Set maxlength attribute if not present
      if (!textarea.hasAttribute('maxlength')) {
        textarea.setAttribute('maxlength', maxChars);
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     SUBMIT BUTTON LOADING STATE
     ═══════════════════════════════════════════════════════════════ */

  function initSubmitButton() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const submitButton = form.querySelector(CONFIG.submitButtonSelector);
      if (!submitButton) return;
      
      form.addEventListener('submit', async (e) => {
        // Don't prevent default - let the actual form submission happen
        // Just add visual feedback
        
        // Validate all required fields first
        const formGroups = form.querySelectorAll('.form-group');
        let hasErrors = false;
        
        formGroups.forEach(group => {
          const input = group.querySelector(CONFIG.inputSelector);
          if (input && input.hasAttribute('required')) {
            if (!validateInput(group, input)) {
              hasErrors = true;
            }
          }
        });
        
        // If there are errors, prevent submission
        if (hasErrors) {
          e.preventDefault();
          
          // Scroll to first error
          const firstError = form.querySelector('.is-error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          
          return;
        }
        
        // Add loading state
        submitButton.classList.add('is-loading');
        submitButton.disabled = true;
        
        // Store original text
        const originalText = submitButton.textContent;
        
        // Note: The actual form submission will continue
        // The loading state will be cleared by page navigation
        // If using AJAX, you'd handle the response here
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     SELECTION CARD ANIMATIONS
     ═══════════════════════════════════════════════════════════════ */

  function initSelectionCards() {
    const selectionCards = document.querySelectorAll('.selection-card');
    
    selectionCards.forEach(card => {
      const input = card.querySelector('input[type="radio"], input[type="checkbox"]');
      if (!input) return;
      
      // Add ripple effect on click
      card.addEventListener('click', (e) => {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.className = 'selection-ripple';
        
        // Position ripple at click point
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          animation: rippleEffect 0.6s ease-out;
          z-index: 0;
        `;
        
        card.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
    
    // Add ripple animation to stylesheet (if not exists)
    if (!document.querySelector('#ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.textContent = `
        @keyframes rippleEffect {
          from {
            transform: scale(0);
            opacity: 1;
          }
          to {
            transform: scale(1);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     ACCESSIBILITY ENHANCEMENTS
     ═══════════════════════════════════════════════════════════════ */

  function initAccessibility() {
    // Add aria-invalid to error inputs
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const formGroup = mutation.target;
          const input = formGroup.querySelector(CONFIG.inputSelector);
          
          if (!input) return;
          
          if (formGroup.classList.contains('is-error')) {
            input.setAttribute('aria-invalid', 'true');
          } else {
            input.removeAttribute('aria-invalid');
          }
        }
      });
    });
    
    // Observe all form groups
    document.querySelectorAll('.form-group').forEach(group => {
      observer.observe(group, { attributes: true, attributeFilter: ['class'] });
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     INITIALIZATION
     ═══════════════════════════════════════════════════════════════ */

  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }
    
    // Initialize all features
    initFloatingLabels();
    initCharacterCounters();
    initSubmitButton();
    initSelectionCards();
    initAccessibility();
    
    console.log('✨ Form Micro-interactions initialized');
  }

  // Auto-initialize
  init();

  // Expose API for manual control (if needed)
  window.FormInteractions = {
    validateInput,
    showErrorMessage,
    removeErrorMessage
  };

})();
