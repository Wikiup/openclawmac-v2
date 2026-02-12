/**
 * FORM INTERACTIONS - Premium 2026 SaaS-tier input animations
 * Features: Floating labels, validation, shake error, success checkmark
 */

(function() {
  'use strict';

  // CONFIG
  const CONFIG = {
    groupSelector: '.form-group',
    inputSelector: 'input:not([type="radio"]):not([type="checkbox"]), textarea',
    errorClass: 'is-error',
    successClass: 'is-valid',
    filledClass: 'is-filled',
    focusedClass: 'is-focused'
  };

  // STATE
  let validationTimers = new WeakMap();

  // INIT
  function init() {
    const formGroups = document.querySelectorAll(CONFIG.groupSelector);
    
    formGroups.forEach(group => {
      const input = group.querySelector(CONFIG.inputSelector);
      const label = group.querySelector('label');
      
      if (!input || !label) return;
      
      // Auto-resize textareas
      if (input.tagName === 'TEXTAREA') {
        autoResizeTextarea(input);
      }
      
      // Check initial state (autofill, pre-filled)
      // checkFloatingState(group, input); // DISABLED: Prevents potential layout shift/focus
      
      // Focus events
      input.addEventListener('focus', () => {
        group.classList.add('is-focused');
        group.classList.remove('is-error');
      });
      
      input.addEventListener('blur', () => {
        group.classList.remove('is-focused');
        checkFloatingState(group, input);
        
        // Validate on blur
        if (input.hasAttribute('required')) {
          scheduleValidation(group, input);
        }
      });
      
      // Input events
      input.addEventListener('input', () => {
        checkFloatingState(group, input);
        
        if (input.hasAttribute('required')) {
          scheduleValidation(group, input);
        }
      });
      
      // Autofill detection (DISABLED to prevent scroll jump)
      // detectAutofill(group, input);
    });
    
    // Add shake animation style
    addShakeStyle();

    // Setup form submission handling
    setupFormSubmission();
    
    // Setup character counters
    setupCharCounters();
  }

  function checkFloatingState(group, input) {
    if (input.value.trim() !== '') {
      group.classList.add('is-filled');
    } else {
      group.classList.remove('is-filled');
      group.classList.remove('is-valid');
    }
  }

  /* 
  function detectAutofill(group, input) {
     // DISABLED: Autofill detection can sometimes cause focus jumps
  }
  */

  function scheduleValidation(group, input) {
    // Debounce validation
    if (validationTimers.has(input)) {
      clearTimeout(validationTimers.get(input));
    }
    
    const timer = setTimeout(() => {
      validateInput(group, input);
    }, 800);
    
    validationTimers.set(input, timer);
  }

  function validateInput(group, input) {
    const value = input.value.trim();
    const type = input.type;
    const isRequired = input.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';

    // Basic required check
    if (isRequired && value === '') {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email check
    if (isValid && type === 'email' && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email';
      }
    }

    // Phone check (basic)
    if (isValid && type === 'tel' && value !== '') {
      const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    // Min length check
    if (isValid && input.hasAttribute('minlength')) {
      const minLength = parseInt(input.getAttribute('minlength'));
      if (value.length < minLength) {
        isValid = false;
        errorMessage = `Minimum ${minLength} characters required`;
      }
    }

    // Update UI
    const errorDisplay = group.querySelector('.form-error-message');
    
    if (!isValid) {
      group.classList.add('is-error');
      group.classList.remove('is-valid');
      if (errorDisplay) errorDisplay.textContent = errorMessage;
    } else {
      group.classList.remove('is-error');
      if (value !== '') {
        group.classList.add('is-valid');
      }
      if (errorDisplay) errorDisplay.textContent = '';
    }

    return isValid;
  }

  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    
    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    });
  }

  function setupFormSubmission() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        let isFormValid = true;
        
        // Validate all fields
        const groups = form.querySelectorAll(CONFIG.groupSelector);
        groups.forEach(group => {
          const input = group.querySelector(CONFIG.inputSelector);
          if (input && input.hasAttribute('required')) {
            if (!validateInput(group, input)) {
              isFormValid = false;
              // Add shake animation
              group.style.animation = 'none';
              group.offsetHeight; /* trigger reflow */
              group.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
            }
          }
        });

        if (!isFormValid) {
          e.preventDefault();
          
          // Scroll to first error (DISABLED to prevent jump on load, only on explicit submit)
          /*
          const firstError = form.querySelector('.is-error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          */
          
          return;
        }
      });
    });
  }
  
  function setupCharCounters() {
    const inputs = document.querySelectorAll('[data-char-count]');
    
    inputs.forEach(input => {
      const limit = parseInt(input.getAttribute('maxlength')) || 0;
      if (!limit) return;
      
      const counter = document.createElement('div');
      counter.className = 'char-counter';
      counter.textContent = `0/${limit}`;
      
      input.parentNode.appendChild(counter);
      
      input.addEventListener('input', () => {
        const current = input.value.length;
        counter.textContent = `${current}/${limit}`;
        
        if (current >= limit) {
          counter.classList.add('is-limit');
        } else {
          counter.classList.remove('is-limit');
        }
      });
    });
  }

  function addShakeStyle() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0); }
        20%, 80% { transform: translate3d(2px, 0, 0); }
        30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
        40%, 60% { transform: translate3d(4px, 0, 0); }
      }
      
      .form-group.is-error label { color: #ef4444; }
      .form-group.is-error input, 
      .form-group.is-error textarea { 
        border-color: #ef4444; 
        box-shadow: 0 0 0 1px #ef4444;
      }
      
      .form-group.is-valid input, 
      .form-group.is-valid textarea { 
        border-color: #10b981; 
      }
      
      .form-error-message {
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        min-height: 1.2em;
        transition: all 0.3s ease;
      }
      
      .char-counter {
        text-align: right;
        font-size: 0.75rem;
        color: var(--text-tertiary);
        margin-top: 0.25rem;
      }
      
      .char-counter.is-limit {
        color: #ef4444;
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
