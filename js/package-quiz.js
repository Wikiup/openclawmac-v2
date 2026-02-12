/**
 * SMART PACKAGE QUIZ SYSTEM
 * Interactive recommendation engine for service packages
 * 2026 conversion pattern - personalized guidance to reduce decision paralysis
 */

class PackageQuiz {
  constructor() {
    this.currentQuestion = 0;
    this.answers = {};
    this.questions = [
      {
        id: 'experience',
        text: 'How would you describe your technical experience?',
        options: [
          {
            value: 'beginner',
            title: 'Just Getting Started',
            description: 'New to terminal commands and AI tools. Need full guidance.',
            weight: { starter: 3, professional: 1, team: 0 }
          },
          {
            value: 'intermediate',
            title: 'Some Experience',
            description: 'Comfortable with basics, but want expert optimization.',
            weight: { starter: 2, professional: 3, team: 1 }
          },
          {
            value: 'advanced',
            title: 'Tech-Savvy',
            description: 'Know my way around, need custom workflows and automation.',
            weight: { starter: 0, professional: 2, team: 3 }
          }
        ]
      },
      {
        id: 'usage',
        text: 'How do you plan to use OpenClaw?',
        options: [
          {
            value: 'personal',
            title: 'Personal Productivity',
            description: 'Just me, occasional tasks, learning and exploration.',
            weight: { starter: 3, professional: 1, team: 0 }
          },
          {
            value: 'daily',
            title: 'Daily Workflow Tool',
            description: 'Regular use for work, need reliability and support.',
            weight: { starter: 1, professional: 3, team: 1 }
          },
          {
            value: 'team',
            title: 'Team/Business Use',
            description: 'Multiple users, shared templates, integration needs.',
            weight: { starter: 0, professional: 1, team: 3 }
          }
        ]
      },
      {
        id: 'priority',
        text: 'What matters most to you?',
        options: [
          {
            value: 'simple',
            title: 'Quick & Simple Setup',
            description: 'Get running fast with minimal complexity.',
            weight: { starter: 3, professional: 1, team: 0 }
          },
          {
            value: 'custom',
            title: 'Custom Configuration',
            description: 'Tailored workflows, privacy tuning, optimizations.',
            weight: { starter: 1, professional: 3, team: 2 }
          },
          {
            value: 'support',
            title: 'Ongoing Support',
            description: 'Know I can get help when things break or change.',
            weight: { starter: 0, professional: 2, team: 3 }
          }
        ]
      },
      {
        id: 'timeline',
        text: 'When do you need this ready?',
        options: [
          {
            value: 'asap',
            title: 'This Week',
            description: 'Need it working ASAP for an upcoming project.',
            weight: { starter: 2, professional: 3, team: 1 }
          },
          {
            value: 'soon',
            title: 'Next 2 Weeks',
            description: 'Planning ahead, want to get it right.',
            weight: { starter: 1, professional: 2, team: 2 }
          },
          {
            value: 'flexible',
            title: 'Flexible Timeline',
            description: 'No rush, can wait for the perfect setup.',
            weight: { starter: 1, professional: 1, team: 3 }
          }
        ]
      }
    ];
    
    this.packages = {
      starter: {
        name: 'Starter Package',
        icon: '🚀',
        description: 'Perfect for individuals getting started with OpenClaw. Basic setup with essential configuration.',
        price: '$149',
        features: [
          { icon: '⚙️', title: 'Core Installation', desc: 'OpenClaw installed and verified on your Mac' },
          { icon: '🔐', title: 'Privacy Basics', desc: 'Folder permissions and safe defaults configured' },
          { icon: '📖', title: 'Quick Start Guide', desc: 'Custom cheat sheet for your setup' },
          { icon: '💬', title: '7-Day Support', desc: 'Email support for initial questions' }
        ],
        duration: '1-2 hours',
        bookingLink: '#book'
      },
      professional: {
        name: 'Professional Package',
        icon: '⚡',
        description: 'Comprehensive setup for serious users. Custom workflows, privacy hardening, and extended support.',
        price: '$299',
        features: [
          { icon: '🎯', title: 'Custom Workflows', desc: 'Tailored templates for your use cases' },
          { icon: '🛡️', title: 'Privacy Hardening', desc: 'Advanced security and isolation tuning' },
          { icon: '🔄', title: 'Automation Setup', desc: 'Cron jobs, shortcuts, integrations' },
          { icon: '🎓', title: '30-Day Support', desc: 'Priority email + troubleshooting' }
        ],
        duration: '2-3 hours',
        bookingLink: '#book',
        popular: true
      },
      team: {
        name: 'Team Package',
        icon: '👥',
        description: 'Enterprise-ready deployment for teams. Multi-user setup, shared templates, and continuous support.',
        price: '$599+',
        features: [
          { icon: '🏢', title: 'Multi-User Setup', desc: 'Standardized config across team members' },
          { icon: '📚', title: 'Shared Templates', desc: 'Team workflow library and documentation' },
          { icon: '🔗', title: 'Integration Support', desc: 'Connect to Slack, GitHub, internal tools' },
          { icon: '♾️', title: '90-Day Support', desc: 'Dedicated Slack channel + updates' }
        ],
        duration: '4+ hours',
        bookingLink: '#book'
      }
    };
    
    this.init();
  }
  
  init() {
    this.container = document.getElementById('package-quiz');
    if (!this.container) return;
    
    this.render();
    this.attachEventListeners();
  }
  
  render() {
    const progress = ((this.currentQuestion) / this.questions.length) * 100;
    
    this.container.innerHTML = `
      <div class="quiz-container">
        <div class="quiz-header">
          <h2>Find Your Perfect Package</h2>
          <p>Answer 4 quick questions to get a personalized recommendation</p>
        </div>
        
        <div class="quiz-progress">
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${progress}%"></div>
          </div>
          <div class="progress-text">
            <div class="progress-steps">
              ${this.questions.map((_, i) => `
                <div class="progress-step ${i < this.currentQuestion ? 'completed' : ''} ${i === this.currentQuestion ? 'active' : ''}"></div>
              `).join('')}
            </div>
            <span>${this.currentQuestion} of ${this.questions.length}</span>
          </div>
        </div>
        
        <div id="quiz-content">
          ${this.renderQuestion()}
        </div>
      </div>
    `;
  }
  
  renderQuestion() {
    if (this.currentQuestion >= this.questions.length) {
      return this.renderResults();
    }
    
    const question = this.questions[this.currentQuestion];
    const selectedValue = this.answers[question.id];
    
    return `
      <div class="quiz-question">
        <div class="question-number">Question ${this.currentQuestion + 1}/${this.questions.length}</div>
        <div class="question-text">${question.text}</div>
        
        <div class="quiz-options">
          ${question.options.map(option => `
            <div class="quiz-option ${selectedValue === option.value ? 'selected' : ''}" 
                 data-value="${option.value}">
              <div class="option-radio"></div>
              <div class="option-content">
                <div class="option-title">${option.title}</div>
                <div class="option-description">${option.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="quiz-navigation">
          <button class="quiz-nav-btn btn-back" ${this.currentQuestion === 0 ? 'disabled' : ''}>
            ← Back
          </button>
          <button class="quiz-nav-btn btn-next" ${!selectedValue ? 'disabled' : ''}>
            ${this.currentQuestion === this.questions.length - 1 ? 'See Results →' : 'Next →'}
          </button>
        </div>
      </div>
    `;
  }
  
  renderResults() {
    const recommendation = this.calculateRecommendation();
    const pkg = this.packages[recommendation];
    
    return `
      <div class="quiz-results">
        <div class="results-header">
          <div class="results-icon">${pkg.icon}</div>
          <div class="results-title">We recommend the</div>
          <div class="results-package">${pkg.name}</div>
          <div class="results-description">${pkg.description}</div>
        </div>
        
        <div class="results-features">
          <h3>What's Included</h3>
          <div class="feature-list">
            ${pkg.features.map(feature => `
              <div class="feature-item">
                <div class="feature-icon">${feature.icon}</div>
                <div class="feature-text">
                  <strong>${feature.title}</strong>
                  <span>${feature.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="results-meta" style="text-align: center; margin: 2rem 0; padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="display: flex; justify-content: center; align-items: center; gap: 2rem; flex-wrap: wrap;">
            <div>
              <div style="font-size: 0.875rem; color: rgba(255,255,255,0.6); margin-bottom: 0.25rem;">Investment</div>
              <div style="font-size: 1.75rem; font-weight: 700; color: #fff;">${pkg.price}</div>
            </div>
            <div style="width: 1px; height: 40px; background: rgba(255,255,255,0.1);"></div>
            <div>
              <div style="font-size: 0.875rem; color: rgba(255,255,255,0.6); margin-bottom: 0.25rem;">Session Time</div>
              <div style="font-size: 1.75rem; font-weight: 700; color: #fff;">${pkg.duration}</div>
            </div>
          </div>
        </div>
        
        <div class="results-actions">
          <a href="${pkg.bookingLink}" class="results-cta primary">
            Book ${pkg.name} →
          </a>
          <button class="results-cta secondary" onclick="window.packageQuiz.viewAllPackages()">
            Compare All Packages
          </button>
        </div>
        
        <div class="restart-quiz">
          <button onclick="window.packageQuiz.restart()">← Retake Quiz</button>
        </div>
      </div>
    `;
  }
  
  calculateRecommendation() {
    const scores = { starter: 0, professional: 0, team: 0 };
    
    // Calculate weighted scores based on answers
    this.questions.forEach(question => {
      const answer = this.answers[question.id];
      if (!answer) return;
      
      const option = question.options.find(opt => opt.value === answer);
      if (!option) return;
      
      Object.keys(option.weight).forEach(pkg => {
        scores[pkg] += option.weight[pkg];
      });
    });
    
    // Find package with highest score
    let recommended = 'professional'; // default
    let maxScore = 0;
    
    Object.keys(scores).forEach(pkg => {
      if (scores[pkg] > maxScore) {
        maxScore = scores[pkg];
        recommended = pkg;
      }
    });
    
    return recommended;
  }
  
  attachEventListeners() {
    // Option selection
    this.container.addEventListener('click', (e) => {
      const option = e.target.closest('.quiz-option');
      if (!option) return;
      
      const question = this.questions[this.currentQuestion];
      if (!question) return;
      
      const value = option.dataset.value;
      
      // Update answer
      this.answers[question.id] = value;
      
      // Update UI
      this.container.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      option.classList.add('selected');
      
      // Enable next button
      const nextBtn = this.container.querySelector('.btn-next');
      if (nextBtn) nextBtn.disabled = false;
      
      // Auto-advance after short delay (optional UX enhancement)
      setTimeout(() => {
        if (this.currentQuestion < this.questions.length - 1) {
          this.next();
        }
      }, 600);
    });
    
    // Navigation
    this.container.addEventListener('click', (e) => {
      if (e.target.closest('.btn-next')) {
        e.preventDefault();
        this.next();
      }
      if (e.target.closest('.btn-back')) {
        e.preventDefault();
        this.back();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.container.querySelector('.quiz-question')) return;
      
      const question = this.questions[this.currentQuestion];
      if (!question) return;
      
      // Number keys 1-3 for quick selection
      if (e.key >= '1' && e.key <= '3') {
        const index = parseInt(e.key) - 1;
        if (question.options[index]) {
          const option = this.container.querySelectorAll('.quiz-option')[index];
          if (option) option.click();
        }
      }
      
      // Arrow keys
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        const nextBtn = this.container.querySelector('.btn-next');
        if (nextBtn && !nextBtn.disabled) {
          nextBtn.click();
        }
      }
      if (e.key === 'ArrowLeft') {
        const backBtn = this.container.querySelector('.btn-back');
        if (backBtn && !backBtn.disabled) {
          backBtn.click();
        }
      }
    });
  }
  
  next() {
    const question = this.questions[this.currentQuestion];
    if (!question || !this.answers[question.id]) return;
    
    // Animate out current question
    const questionEl = this.container.querySelector('.quiz-question');
    if (questionEl) {
      questionEl.classList.add('fade-out');
    }
    
    setTimeout(() => {
      this.currentQuestion++;
      this.render();
      this.attachEventListeners();
      
      // Scroll to top of quiz
      this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }
  
  back() {
    if (this.currentQuestion <= 0) return;
    
    const questionEl = this.container.querySelector('.quiz-question');
    if (questionEl) {
      questionEl.classList.add('fade-out');
    }
    
    setTimeout(() => {
      this.currentQuestion--;
      this.render();
      this.attachEventListeners();
    }, 300);
  }
  
  restart() {
    this.currentQuestion = 0;
    this.answers = {};
    this.render();
    this.attachEventListeners();
    this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  viewAllPackages() {
    // Scroll to pricing section
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.packageQuiz = new PackageQuiz();
  });
} else {
  window.packageQuiz = new PackageQuiz();
}
