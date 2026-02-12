/**
 * ROI Calculator - AI Agency vs Human Team
 * Updated: 2026-02-12
 * 
 * Calculates annual savings of replacing/augmenting human staff with AI agents.
 */

class ROICalculator {
  constructor() {
    this.staffSlider = document.getElementById('roi-hours-slider'); // Reused ID for staff count
    this.salarySlider = document.getElementById('roi-rate-slider'); // Reused ID for salary
    this.staffValue = document.getElementById('roi-hours-value');
    this.salaryValue = document.getElementById('roi-rate-value');
    
    // Result elements
    this.humanCostEl = document.getElementById('roi-yearly-loss'); // Human Team Cost
    this.aiCostEl = document.getElementById('roi-monthly-loss'); // AI Running Cost (misnamed in HTML but used for AI cost)
    this.netSavingsEl = document.getElementById('roi-net-savings');
    
    // Chart elements
    this.humanCostBar = document.getElementById('roi-bar-manual-cost');
    this.aiCostBar = document.getElementById('roi-bar-service-cost');
    this.savingsBar = document.getElementById('roi-bar-savings');
    this.humanCostBarValue = document.getElementById('roi-bar-manual-value');
    this.aiCostBarValue = document.getElementById('roi-bar-service-value');
    this.savingsBarValue = document.getElementById('roi-bar-savings-value');
    
    // Constants
    this.SETUP_FEE = 299; // One-time setup
    this.MONTHLY_AI_COST = 50; // Est. API costs per agent/month
    
    this.init();
  }
  
  init() {
    // Add event listeners
    if (this.staffSlider && this.salarySlider) {
        this.staffSlider.addEventListener('input', () => this.updateDisplay());
        this.salarySlider.addEventListener('input', () => this.updateDisplay());
    }
    
    // Initial calculation
    this.updateDisplay();
  }
  
  updateDisplay() {
    if (!this.staffSlider || !this.salarySlider) return;

    const staffCount = parseInt(this.staffSlider.value);
    const avgSalary = parseInt(this.salarySlider.value);
    
    // Update labels
    if (this.staffValue) this.staffValue.textContent = staffCount === 1 ? '1 person' : `${staffCount} people`;
    if (this.salaryValue) this.salaryValue.textContent = `$${avgSalary.toLocaleString()}`;
    
    // Calculate Costs
    const annualHumanCost = staffCount * avgSalary;
    
    // AI Cost: Setup + (Monthly API * 12 * Agent Count)
    // Assuming 1 AI agent replaces/augments 1 human role for this model
    const annualAiCost = this.SETUP_FEE + (this.MONTHLY_AI_COST * 12 * staffCount);
    
    const annualSavings = annualHumanCost - annualAiCost;
    
    // Update Text Results
    this.animateValue(this.humanCostEl, annualHumanCost, '$', '/year');
    this.animateValue(this.aiCostEl, annualAiCost, '$', '/year');
    this.animateValue(this.netSavingsEl, annualSavings, '$', '/year');
    
    // Update Chart
    this.updateChart(annualHumanCost, annualAiCost, annualSavings);
  }
  
  animateValue(element, targetValue, prefix = '', suffix = '') {
    if (!element) return;
    // Simple update for now to avoid complexity/glitches
    element.textContent = `${prefix}${Math.round(targetValue).toLocaleString()}${suffix}`;
  }
  
  updateChart(humanCost, aiCost, savings) {
    if (!this.humanCostBar) return;

    // Normalize heights (max 150px for chart)
    const maxValue = Math.max(humanCost, aiCost, savings);
    
    const humanHeight = (humanCost / maxValue) * 150;
    const aiHeight = Math.max(10, (aiCost / maxValue) * 150); // Min height for visibility
    const savingsHeight = (savings / maxValue) * 150;
    
    // Update Heights
    this.humanCostBar.style.height = `${humanHeight}px`;
    this.aiCostBar.style.height = `${aiHeight}px`;
    this.savingsBar.style.height = `${savingsHeight}px`;
    
    // Update Labels
    this.humanCostBarValue.textContent = `-$${(humanCost/1000).toFixed(0)}k`;
    this.aiCostBarValue.textContent = `-$${(aiCost/1000).toFixed(1)}k`;
    this.savingsBarValue.textContent = `+$${(savings/1000).toFixed(0)}k`;
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ROICalculator());
} else {
  new ROICalculator();
}
