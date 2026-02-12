/**
 * Command Palette JavaScript
 * 
 * Premium 2026 SaaS Command Interface
 * Cmd/Ctrl+K keyboard-first navigation system
 * 
 * Features:
 * - Fuzzy search filtering
 * - Keyboard navigation (↑↓ + Enter)
 * - Focus trap accessibility
 * - Recent searches memory
 * - Smooth animations
 * - Mobile-optimized
 */

class CommandPalette {
  constructor() {
    this.isOpen = false;
    this.selectedIndex = 0;
    this.allCommands = [];
    this.filteredCommands = [];
    this.recentSearches = this.loadRecentSearches();
    
    this.init();
  }

  init() {
    this.createMarkup();
    this.defineCommands();
    this.attachEvents();
    this.renderCommands();
  }

  createMarkup() {
    const overlay = document.createElement('div');
    overlay.className = 'command-palette-overlay';
    overlay.innerHTML = `
      <div class="command-palette" role="dialog" aria-modal="true" aria-labelledby="command-palette-title">
        <div class="command-palette__search">
          <svg class="command-palette__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            class="command-palette__input" 
            placeholder="Search commands, pages, actions..."
            aria-label="Command search"
            id="command-palette-title"
          />
          <div class="command-palette__hint">
            <span class="command-palette__kbd">ESC</span> to close
          </div>
        </div>
        
        <div class="command-palette__results" role="listbox"></div>
        
        <div class="command-palette__footer">
          <div class="command-palette__footer-hint">
            <span class="command-palette__kbd">↑</span>
            <span class="command-palette__kbd">↓</span>
            <span>Navigate</span>
          </div>
          <div class="command-palette__footer-hint">
            <span class="command-palette__kbd">↵</span>
            <span>Select</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    this.overlay = overlay;
    this.palette = overlay.querySelector('.command-palette');
    this.input = overlay.querySelector('.command-palette__input');
    this.results = overlay.querySelector('.command-palette__results');
  }

  defineCommands() {
    this.allCommands = [
      // Navigation commands
      {
        id: 'nav-home',
        title: 'Go to Top',
        subtitle: 'Scroll to hero section',
        icon: '🏠',
        category: 'Navigation',
        action: () => this.navigate('#top'),
        keywords: ['home', 'top', 'start']
      },
      {
        id: 'nav-services',
        title: 'View Services',
        subtitle: 'See what\'s included',
        icon: '⚡',
        category: 'Navigation',
        action: () => this.navigate('#services'),
        keywords: ['services', 'features', 'what']
      },
      {
        id: 'nav-pricing',
        title: 'View Pricing',
        subtitle: 'See packages and rates',
        icon: '💰',
        category: 'Navigation',
        action: () => this.navigate('#pricing'),
        keywords: ['pricing', 'cost', 'price', 'packages']
      },
      {
        id: 'nav-booking',
        title: 'Book Appointment',
        subtitle: 'Schedule your setup',
        icon: '📅',
        category: 'Navigation',
        action: () => this.navigate('#booking'),
        keywords: ['book', 'schedule', 'appointment']
      },
      {
        id: 'nav-faq',
        title: 'Read FAQ',
        subtitle: 'Common questions',
        icon: '❓',
        category: 'Navigation',
        action: () => this.navigate('#faq'),
        keywords: ['faq', 'questions', 'help']
      },
      
      // Quick actions
      {
        id: 'action-book',
        title: 'Book Now',
        subtitle: 'Quick jump to booking form',
        icon: '🚀',
        category: 'Quick Actions',
        action: () => {
          this.navigate('#booking');
          setTimeout(() => {
            const nameInput = document.querySelector('#booking-form input[name="name"]');
            if (nameInput) nameInput.focus();
          }, 600);
        },
        keywords: ['book now', 'schedule', 'start']
      },
      {
        id: 'action-contact',
        title: 'Contact Support',
        subtitle: 'Get help or ask questions',
        icon: '💬',
        category: 'Quick Actions',
        action: () => {
          this.navigate('#booking');
          setTimeout(() => {
            const messageInput = document.querySelector('#booking-form textarea');
            if (messageInput) {
              messageInput.value = 'I have a question about ';
              messageInput.focus();
            }
          }, 600);
        },
        keywords: ['contact', 'support', 'help', 'message']
      },
      {
        id: 'action-call',
        title: 'Call Now',
        subtitle: 'Speak with support',
        icon: '📞',
        category: 'Quick Actions',
        action: () => {
          window.location.href = 'tel:+15129991234';
        },
        keywords: ['call', 'phone', 'speak', 'talk']
      },
      
      // External links
      {
        id: 'link-openclaw',
        title: 'OpenClaw Docs',
        subtitle: 'Learn about OpenClaw',
        icon: '📚',
        category: 'Resources',
        action: () => window.open('https://docs.openclaw.ai', '_blank'),
        keywords: ['docs', 'documentation', 'openclaw', 'learn']
      },
      {
        id: 'link-github',
        title: 'GitHub Repository',
        subtitle: 'View source code',
        icon: '💻',
        category: 'Resources',
        action: () => window.open('https://github.com/openclaw/openclaw', '_blank'),
        keywords: ['github', 'source', 'code', 'repo']
      },
      {
        id: 'link-discord',
        title: 'Join Discord',
        subtitle: 'Community support',
        icon: '💬',
        category: 'Resources',
        action: () => window.open('https://discord.com/invite/clawd', '_blank'),
        keywords: ['discord', 'community', 'chat']
      }
    ];
    
    this.filteredCommands = [...this.allCommands];
  }

  attachEvents() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.toggle();
      }
      
      // ESC to close
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
      
      // Arrow navigation when open
      if (this.isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.selectNext();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.selectPrevious();
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          this.executeSelected();
        }
      }
    });
    
    // Search input
    this.input.addEventListener('input', (e) => {
      this.filterCommands(e.target.value);
    });
    
    // Click outside to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
    
    // Prevent palette clicks from closing
    this.palette.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  filterCommands(query) {
    const lowerQuery = query.toLowerCase().trim();
    
    if (!lowerQuery) {
      this.filteredCommands = [...this.allCommands];
    } else {
      this.filteredCommands = this.allCommands.filter(cmd => {
        const titleMatch = cmd.title.toLowerCase().includes(lowerQuery);
        const subtitleMatch = cmd.subtitle.toLowerCase().includes(lowerQuery);
        const keywordMatch = cmd.keywords.some(kw => kw.includes(lowerQuery));
        return titleMatch || subtitleMatch || keywordMatch;
      });
    }
    
    this.selectedIndex = 0;
    this.renderCommands();
    this.saveRecentSearch(query);
  }

  renderCommands() {
    if (this.filteredCommands.length === 0) {
      this.results.innerHTML = `
        <div class="command-palette__empty">
          <svg class="command-palette__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>No commands found</div>
        </div>
      `;
      return;
    }
    
    // Group by category
    const categories = {};
    this.filteredCommands.forEach(cmd => {
      if (!categories[cmd.category]) {
        categories[cmd.category] = [];
      }
      categories[cmd.category].push(cmd);
    });
    
    // Render grouped commands
    let html = '';
    Object.keys(categories).forEach(category => {
      html += `<div class="command-palette__section">${category}</div>`;
      categories[category].forEach((cmd, index) => {
        const globalIndex = this.filteredCommands.indexOf(cmd);
        const isActive = globalIndex === this.selectedIndex;
        html += `
          <div 
            class="command-palette__item ${isActive ? 'active' : ''}" 
            data-index="${globalIndex}"
            role="option"
            aria-selected="${isActive}"
          >
            <div class="command-palette__item-icon">${cmd.icon}</div>
            <div class="command-palette__item-content">
              <div class="command-palette__item-title">${cmd.title}</div>
              <div class="command-palette__item-subtitle">${cmd.subtitle}</div>
            </div>
          </div>
        `;
      });
    });
    
    this.results.innerHTML = html;
    
    // Attach click handlers
    this.results.querySelectorAll('.command-palette__item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        this.selectedIndex = index;
        this.executeSelected();
      });
      
      item.addEventListener('mouseenter', () => {
        const index = parseInt(item.dataset.index);
        this.selectedIndex = index;
        this.updateSelection();
      });
    });
    
    // Scroll active item into view
    this.scrollToSelected();
  }

  updateSelection() {
    this.results.querySelectorAll('.command-palette__item').forEach((item, index) => {
      const itemIndex = parseInt(item.dataset.index);
      if (itemIndex === this.selectedIndex) {
        item.classList.add('active');
        item.setAttribute('aria-selected', 'true');
      } else {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
      }
    });
    this.scrollToSelected();
  }

  scrollToSelected() {
    const activeItem = this.results.querySelector('.command-palette__item.active');
    if (activeItem) {
      activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  selectNext() {
    this.selectedIndex = (this.selectedIndex + 1) % this.filteredCommands.length;
    this.updateSelection();
  }

  selectPrevious() {
    this.selectedIndex = (this.selectedIndex - 1 + this.filteredCommands.length) % this.filteredCommands.length;
    this.updateSelection();
  }

  executeSelected() {
    const command = this.filteredCommands[this.selectedIndex];
    if (command) {
      command.action();
      this.close();
    }
  }

  navigate(hash) {
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Update URL without triggering scroll
      history.pushState(null, null, hash);
    }
  }

  open() {
    this.isOpen = true;
    this.overlay.classList.add('active');
    this.palette.classList.add('active');
    
    // Focus input
    setTimeout(() => {
      this.input.focus();
    }, 100);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.overlay.classList.remove('active');
    this.palette.classList.remove('active');
    
    // Clear input
    this.input.value = '';
    this.filterCommands('');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  // Recent searches persistence
  loadRecentSearches() {
    try {
      const saved = localStorage.getItem('commandPaletteRecent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveRecentSearch(query) {
    if (!query.trim()) return;
    
    this.recentSearches = [
      query,
      ...this.recentSearches.filter(q => q !== query)
    ].slice(0, 5);
    
    try {
      localStorage.setItem('commandPaletteRecent', JSON.stringify(this.recentSearches));
    } catch {
      // Ignore storage errors
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.commandPalette = new CommandPalette();
  });
} else {
  window.commandPalette = new CommandPalette();
}
