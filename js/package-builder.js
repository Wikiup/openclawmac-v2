/**
 * INTERACTIVE SERVICE PACKAGE BUILDER
 * Sprint #43 - 2026-02-10 7:27 AM
 * 
 * CONVERSION PSYCHOLOGY:
 * Service configurators increase conversion 35-55% vs static pricing because:
 * - Visual customization creates psychological ownership (endowment effect)
 * - Step-by-step reduces decision paralysis (progressive disclosure)
 * - Real-time pricing builds transparency and trust
 * - Interaction time correlates with purchase intent
 * 
 * PATTERN REFERENCE:
 * - Stripe Atlas (business setup configurator)
 * - Webflow (site plan builder)
 * - Shopify (plan customizer)
 * - Tesla (car configurator)
 */

(function() {
  'use strict';

  // Configuration
  const SERVICES = {
    basic: {
      id: 'basic',
      name: 'Basic Setup',
      icon: '⚡',
      description: 'Essential OpenClaw installation and configuration',
      price: 149,
      features: [
        'OpenClaw installation',
        'Basic configuration',
        'Single-agent setup',
        '1 hour consultation'
      ]
    },
    standard: {
      id: 'standard',
      name: 'Standard Package',
      icon: '🚀',
      description: 'Complete setup with custom agent configuration',
      price: 299,
      features: [
        'Full OpenClaw setup',
        'Custom agent configuration',
        'Multi-skill integration',
        '2 hours consultation',
        'Follow-up support'
      ]
    },
    premium: {
      id: 'premium',
      name: 'Premium Package',
      icon: '💎',
      description: 'Enterprise-grade deployment with full customization',
      price: 499,
      features: [
        'Enterprise deployment',
        'Custom skill development',
        'Workflow automation',
        'Security hardening',
        '4 hours consultation',
        '30-day priority support'
      ]
    }
  };

  const ADDONS = [
    {
      id: 'skills',
      name: 'Custom Skills Package',
      description: '3 custom skills tailored to your workflow',
      price: 199
    },
    {
      id: 'automation',
      name: 'Workflow Automation',
      description: 'Automated cron jobs and integrations',
      price: 149
    },
    {
      id: 'training',
      name: 'Team Training Session',
      description: '2-hour training for your team',
      price: 99
    },
    {
      id: 'migration',
      name: 'Data Migration',
      description: 'Migrate from existing assistant tools',
      price: 129
    },
    {
      id: 'security',
      name: 'Security Audit',
      description: 'Comprehensive security review',
      price: 179
    },
    {
      id: 'support',
      name: 'Extended Support',
      description: '90-day priority support package',
      price: 249
    }
  ];

  const SCHEDULE_OPTIONS = [
    {
      id: 'asap',
      name: 'ASAP',
      description: 'Next available slot (24-48 hours)'
    },
    {
      id: 'thisweek',
      name: 'This Week',
      description: 'Within 7 days'
    },
    {
      id: 'nextweek',
      name: 'Next Week',
      description: '7-14 days from now'
    },
    {
      id: 'flexible',
      name: 'Flexible',
      description: 'I\'ll coordinate timing later'
    }
  ];

  // State
  let currentStep = 1;
  const totalSteps = 4;
  let selectedService = null;
  let selectedAddons = new Set();
  let selectedSchedule = null;

  // Initialize
  function init() {
    renderBuilder();
    attachEventListeners();
    updateProgress();
  }

  // Render the complete builder structure
  function renderBuilder() {
    const container = document.getElementById('package-builder-container');
    if (!container) return;

    container.innerHTML = `
      <div class="package-builder-card">
        <!-- Progress Indicator -->
        <div class="builder-progress">
          <div class="progress-line" id="progress-line"></div>
          ${Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => `
            <div class="progress-step" data-step="${step}">
              <div class="step-circle">${step}</div>
              <div class="step-label">${getStepLabel(step)}</div>
            </div>
          `).join('')}
        </div>

        <!-- Step Content -->
        <div class="builder-steps">
          <!-- Step 1: Service Type -->
          <div class="builder-step active" data-step="1">
            <h3 class="step-title">Choose Your Service Package</h3>
            <p class="step-description">Select the package that best fits your needs</p>
            <div class="service-type-grid" id="service-type-grid">
              ${Object.values(SERVICES).map(service => `
                <div class="service-type-card" data-service-id="${service.id}" tabindex="0" role="button" aria-pressed="false">
                  <span class="service-icon">${service.icon}</span>
                  <h3>${service.name}</h3>
                  <p>${service.description}</p>
                  <div class="service-price">$${service.price}</div>
                  <div class="service-price-note">one-time fee</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Step 2: Add-ons -->
          <div class="builder-step" data-step="2">
            <h3 class="step-title">Enhance Your Package</h3>
            <p class="step-description">Add optional services to maximize your setup (optional)</p>
            <div class="addons-grid" id="addons-grid">
              ${ADDONS.map(addon => `
                <div class="addon-item" data-addon-id="${addon.id}" tabindex="0" role="checkbox" aria-checked="false">
                  <div class="addon-checkbox"></div>
                  <div class="addon-info">
                    <h4>${addon.name}</h4>
                    <p>${addon.description}</p>
                    <div class="addon-price">+$${addon.price}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Step 3: Schedule -->
          <div class="builder-step" data-step="3">
            <h3 class="step-title">When Should We Start?</h3>
            <p class="step-description">Choose your preferred timeline</p>
            <div class="schedule-options" id="schedule-options">
              ${SCHEDULE_OPTIONS.map(option => `
                <div class="schedule-option" data-schedule-id="${option.id}" tabindex="0" role="button" aria-pressed="false">
                  <h4>${option.name}</h4>
                  <p>${option.description}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Step 4: Review -->
          <div class="builder-step" data-step="4">
            <h3 class="step-title">Review Your Package</h3>
            <p class="step-description">Confirm your selections before booking</p>
            <div class="package-summary" id="package-summary">
              <!-- Dynamic content will be inserted here -->
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="builder-nav">
          <button class="btn-builder btn-back" id="btn-back" disabled>
            ← Back
          </button>
          <button class="btn-builder btn-next" id="btn-next">
            Next →
          </button>
        </div>
      </div>
    `;
  }

  // Get step label
  function getStepLabel(step) {
    const labels = ['Service', 'Add-ons', 'Schedule', 'Review'];
    return labels[step - 1] || '';
  }

  // Attach event listeners
  function attachEventListeners() {
    // Service type selection
    document.querySelectorAll('.service-type-card').forEach(card => {
      card.addEventListener('click', () => selectService(card.dataset.serviceId));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectService(card.dataset.serviceId);
        }
      });
    });

    // Add-on selection
    document.querySelectorAll('.addon-item').forEach(item => {
      item.addEventListener('click', () => toggleAddon(item.dataset.addonId));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleAddon(item.dataset.addonId);
        }
      });
    });

    // Schedule selection
    document.querySelectorAll('.schedule-option').forEach(option => {
      option.addEventListener('click', () => selectSchedule(option.dataset.scheduleId));
      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectSchedule(option.dataset.scheduleId);
        }
      });
    });

    // Navigation buttons
    document.getElementById('btn-back').addEventListener('click', prevStep);
    document.getElementById('btn-next').addEventListener('click', nextStep);

    // Progress step clicks
    document.querySelectorAll('.progress-step').forEach(step => {
      step.addEventListener('click', () => {
        const targetStep = parseInt(step.dataset.step);
        if (targetStep < currentStep) {
          goToStep(targetStep);
        }
      });
    });
  }

  // Select service
  function selectService(serviceId) {
    selectedService = serviceId;
    
    // Update UI
    document.querySelectorAll('.service-type-card').forEach(card => {
      const isSelected = card.dataset.serviceId === serviceId;
      card.classList.toggle('selected', isSelected);
      card.setAttribute('aria-pressed', isSelected);
    });

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentStep === 1) {
        nextStep();
      }
    }, 400);
  }

  // Toggle add-on
  function toggleAddon(addonId) {
    if (selectedAddons.has(addonId)) {
      selectedAddons.delete(addonId);
    } else {
      selectedAddons.add(addonId);
    }

    // Update UI
    const item = document.querySelector(`.addon-item[data-addon-id="${addonId}"]`);
    const isSelected = selectedAddons.has(addonId);
    item.classList.toggle('selected', isSelected);
    item.setAttribute('aria-checked', isSelected);
  }

  // Select schedule
  function selectSchedule(scheduleId) {
    selectedSchedule = scheduleId;
    
    // Update UI
    document.querySelectorAll('.schedule-option').forEach(option => {
      const isSelected = option.dataset.scheduleId === scheduleId;
      option.classList.toggle('selected', isSelected);
      option.setAttribute('aria-pressed', isSelected);
    });

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentStep === 3) {
        nextStep();
      }
    }, 400);
  }

  // Navigate to next step
  function nextStep() {
    // Validation
    if (currentStep === 1 && !selectedService) {
      alert('Please select a service package');
      return;
    }
    if (currentStep === 3 && !selectedSchedule) {
      alert('Please select a schedule');
      return;
    }

    if (currentStep === totalSteps) {
      completeBooking();
      return;
    }

    goToStep(currentStep + 1);
  }

  // Navigate to previous step
  function prevStep() {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }

  // Go to specific step
  function goToStep(step) {
    currentStep = step;

    // Update step visibility
    document.querySelectorAll('.builder-step').forEach(stepEl => {
      stepEl.classList.toggle('active', parseInt(stepEl.dataset.step) === currentStep);
    });

    // Update navigation buttons
    document.getElementById('btn-back').disabled = currentStep === 1;
    
    const btnNext = document.getElementById('btn-next');
    if (currentStep === totalSteps) {
      btnNext.textContent = 'Complete Booking →';
      btnNext.className = 'btn-builder btn-complete';
    } else {
      btnNext.textContent = 'Next →';
      btnNext.className = 'btn-builder btn-next';
    }

    // Update progress
    updateProgress();

    // Render review if on last step
    if (currentStep === totalSteps) {
      renderReview();
    }

    // Scroll to top
    document.querySelector('.package-builder-card').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }

  // Update progress indicator
  function updateProgress() {
    const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
    const progressLine = document.getElementById('progress-line');
    if (progressLine) {
      progressLine.style.width = progressPercent + '%';
    }

    // Update step states
    document.querySelectorAll('.progress-step').forEach(stepEl => {
      const stepNum = parseInt(stepEl.dataset.step);
      stepEl.classList.toggle('active', stepNum === currentStep);
      stepEl.classList.toggle('completed', stepNum < currentStep);
    });
  }

  // Render review summary
  function renderReview() {
    const summaryContainer = document.getElementById('package-summary');
    if (!summaryContainer) return;

    const service = SERVICES[selectedService];
    const addons = Array.from(selectedAddons).map(id => 
      ADDONS.find(addon => addon.id === id)
    );
    const schedule = SCHEDULE_OPTIONS.find(opt => opt.id === selectedSchedule);

    const basePrice = service.price;
    const addonsPrice = addons.reduce((sum, addon) => sum + addon.price, 0);
    const totalPrice = basePrice + addonsPrice;

    summaryContainer.innerHTML = `
      <div class="summary-section">
        <div class="summary-label">Selected Package</div>
        <div class="summary-value">${service.icon} ${service.name}</div>
        <ul class="summary-list">
          ${service.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>

      ${addons.length > 0 ? `
        <div class="summary-section">
          <div class="summary-label">Add-ons (${addons.length})</div>
          <ul class="summary-list">
            ${addons.map(addon => `
              <li>${addon.name} <span style="color: #7c3aed;">+$${addon.price}</span></li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <div class="summary-section">
        <div class="summary-label">Timeline</div>
        <div class="summary-value">${schedule.name}</div>
        <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6); margin-top: 4px;">
          ${schedule.description}
        </p>
      </div>

      <div class="total-price-section">
        <div class="total-label">Total Investment</div>
        <div class="total-price">$${totalPrice}</div>
      </div>
    `;
  }

  // Complete booking
  function completeBooking() {
    const service = SERVICES[selectedService];
    const addons = Array.from(selectedAddons).map(id => 
      ADDONS.find(addon => addon.id === id)
    );
    const schedule = SCHEDULE_OPTIONS.find(opt => opt.id === selectedSchedule);
    const totalPrice = service.price + addons.reduce((sum, addon) => sum + addon.price, 0);

    // Create package summary for form
    const packageSummary = {
      service: service.name,
      addons: addons.map(a => a.name),
      schedule: schedule.name,
      total: totalPrice
    };

    // Store in sessionStorage for booking form
    sessionStorage.setItem('packageSelection', JSON.stringify(packageSummary));

    // Scroll to booking form
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      
      // Pre-fill package info in booking form message
      setTimeout(() => {
        const messageField = document.querySelector('textarea[name="message"]');
        if (messageField && messageField.value.trim() === '') {
          messageField.value = `I'd like to book the ${service.name} package.\n\n` +
            `Add-ons: ${addons.length > 0 ? addons.map(a => a.name).join(', ') : 'None'}\n` +
            `Timeline: ${schedule.name}\n` +
            `Total: $${totalPrice}`;
          messageField.focus();
        }
      }, 800);
    }

    // Show success toast
    showToast('Package configured! Please fill out the booking form below.', 'success');
  }

  // Show toast notification
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(20, 25, 35, 0.95)'};
      color: #fff;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(20px);
      z-index: 10000;
      font-size: 15px;
      font-weight: 500;
      animation: slideIn 0.4s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Add slide animations to page
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

})();
