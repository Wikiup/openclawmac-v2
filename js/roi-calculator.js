/**
 * ROI Calculator (Auto-focus Disabled)
 * Removes focus-stealing behavior on initialization.
 */

class ROICalculator {
  constructor() {
    this.hoursSlider = document.getElementById('roi-hours-slider');
    this.rateSlider = document.getElementById('roi-rate-slider');
    this.hoursValue = document.getElementById('roi-hours-value');
    this.rateValue = document.getElementById('roi-rate-value');
    
    // Result elements
    this.monthlyLossEl = document.getElementById('roi-monthly-loss');
    this.yearlyLossEl = document.getElementById('roi-yearly-loss');
    this.breakEvenEl = document.getElementById('roi-breakeven');
    this.netSavingsEl = document.getElementById('roi-net-savings');
    this.ctaSavingsEl = document.getElementById('roi-cta-savings');
    
    // Chart elements
    this.manualCostBar = document.getElementById('roi-bar-manual-cost');
    this.serviceCostBar = document.getElementById('roi-bar-service-cost');
    this.savingsBar = document.getElementById('roi-bar-savings');
    this.manualCostValue = document.getElementById('roi-bar-manual-value');
    this.serviceCostValue = document.getElementById('roi-bar-service-value');
    this.savingsValue = document.getElementById('roi-bar-savings-value');
    
    // Service pricing (configurable)
    this.serviceCost = 149; // OpenClaw Mac base service cost
    
    this.init();
  }
  
  init() {
    // Set initial values
    this.updateDisplay();
    
    // Add event listeners
    if (this.hoursSlider && this.rateSlider) {
        this.hoursSlider.addEventListener('input', () => this.updateDisplay());
        this.rateSlider.addEventListener('input', () => this.updateDisplay());
    }
    
    // Trigger initial animation
    setTimeout(() => this.animateChart(), 500);
  }
  
  updateDisplay() {
    if (!this.hoursSlider || !this.rateSlider) return;

    const hours = parseFloat(this.hoursSlider.value);
    const rate = parseFloat(this.rateSlider.value);
    
    // Update slider value displays
    if (this.hoursValue) this.hoursValue.textContent = hours;
    if (this.rateValue) this.rateValue.textContent = `$${rate}`;
    
    // Calculate costs
    const monthlyLoss = hours * rate;
    const yearlyLoss = monthlyLoss * 12;
    const breakEvenMonths = Math.ceil(this.serviceCost / monthlyLoss);
    const netSavingsYear = yearlyLoss - this.serviceCost;
    
    // Update result displays with animation
    this.animateValue(this.monthlyLossEl, monthlyLoss, '$', '/month');
    this.animateValue(this.yearlyLossEl, yearlyLoss, '$', '/year');
    this.animateValue(this.breakEvenEl, breakEvenMonths, '', breakEvenMonths === 1 ? ' month' : ' months');
    this.animateValue(this.netSavingsEl, netSavingsYear, '$', '/year');
    this.animateValue(this.ctaSavingsEl, netSavingsYear, '$', '');
    
    // Update chart
    this.updateChart(monthlyLoss, netSavingsYear);
  }
  
  animateValue(element, targetValue, prefix = '', suffix = '') {
    if (!element) return;
    const currentValue = parseFloat(element.getAttribute('data-value') || '0');
    const duration = 800;
    const steps = 30;
    const increment = (targetValue - currentValue) / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const animate = () => {
      if (currentStep < steps) {
        currentStep++;
        const newValue = currentValue + (increment * currentStep);
        element.textContent = `${prefix}${Math.round(newValue).toLocaleString()}${suffix}`;
        requestAnimationFrame(animate);
      } else {
        element.textContent = `${prefix}${Math.round(targetValue).toLocaleString()}${suffix}`;
        element.setAttribute('data-value', targetValue);
      }
    };
    
    animate();
  }
  
  updateChart(monthlyLoss, netSavings) {
    if (!this.manualCostBar) return;

    // Calculate yearly values for chart
    const manualYearlyCost = monthlyLoss * 12;
    const serviceCost = this.serviceCost;
    const savings = netSavings;
    
    // Normalize heights (max 200px)
    const maxValue = Math.max(manualYearlyCost, serviceCost, savings);
    const manualHeight = (manualYearlyCost / maxValue) * 180;
    const serviceHeight = (serviceCost / maxValue) * 180;
    const savingsHeight = (savings / maxValue) * 180;
    
    // Update bar heights
    this.manualCostBar.style.height = `${manualHeight}px`;
    this.serviceCostBar.style.height = `${serviceHeight}px`;
    this.savingsBar.style.height = `${Math.max(0, savingsHeight)}px`;
    
    // Update bar values
    this.manualCostValue.textContent = `-$${Math.round(manualYearlyCost).toLocaleString()}`;
    this.serviceCostValue.textContent = `-$${serviceCost}`;
    this.savingsValue.textContent = `+$${Math.round(Math.max(0, savings)).toLocaleString()}`;
  }
  
  animateChart() {
    // Trigger initial chart animation by updating display
    this.updateDisplay();
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ROICalculator();
  });
} else {
  new ROICalculator();
}

// Export for external access
window.ROICalculator = ROICalculator;
