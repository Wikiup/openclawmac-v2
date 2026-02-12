/* ============================================
   INTELLIGENT THEME SYSTEM - JAVASCRIPT
   Dark/Light mode with system preference detection
   2026 accessibility + personalization pattern
   ============================================ */

(function() {
  'use strict';

  // ========================================
  // CONFIGURATION
  // ========================================
  
  const THEME_CONFIG = {
    STORAGE_KEY: 'openclaw-theme-preference',
    THEMES: {
      LIGHT: 'light',
      DARK: 'dark',
      AUTO: 'auto'
    },
    ANIMATION_DURATION: 300,
    BADGE_SHOW_DURATION: 3000
  };

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  let currentTheme = null;
  let userPreference = null;
  let systemPreference = null;
  let themeToggleButton = null;
  let systemBadge = null;
  let badgeTimeout = null;

  // ========================================
  // INITIALIZATION
  // ========================================
  
  function init() {
    // Detect system preference IMMEDIATELY (before page render)
    detectSystemPreference();
    
    // Load user preference from localStorage
    loadUserPreference();
    
    // Apply initial theme (before DOM ready to prevent flash)
    applyInitialTheme();
    
    // Setup DOM when ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupDOM);
    } else {
      setupDOM();
    }
  }

  // ========================================
  // SYSTEM PREFERENCE DETECTION
  // ========================================
  
  function detectSystemPreference() {
    // Check if browser supports prefers-color-scheme
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      systemPreference = darkModeQuery.matches ? THEME_CONFIG.THEMES.DARK : THEME_CONFIG.THEMES.LIGHT;
      
      // Listen for system preference changes
      darkModeQuery.addEventListener('change', handleSystemPreferenceChange);
    } else {
      // Fallback to dark mode if not supported
      systemPreference = THEME_CONFIG.THEMES.DARK;
    }
  }

  function handleSystemPreferenceChange(e) {
    const newSystemPreference = e.matches ? THEME_CONFIG.THEMES.DARK : THEME_CONFIG.THEMES.LIGHT;
    
    console.log('System theme preference changed:', newSystemPreference);
    systemPreference = newSystemPreference;
    
    // Only update if user is on auto mode
    if (userPreference === THEME_CONFIG.THEMES.AUTO || userPreference === null) {
      applyTheme(systemPreference);
      showSystemBadge(`Auto-switched to ${systemPreference} mode`);
    }
  }

  // ========================================
  // USER PREFERENCE MANAGEMENT
  // ========================================
  
  function loadUserPreference() {
    try {
      const stored = localStorage.getItem(THEME_CONFIG.STORAGE_KEY);
      if (stored && Object.values(THEME_CONFIG.THEMES).includes(stored)) {
        userPreference = stored;
      } else {
        userPreference = THEME_CONFIG.THEMES.AUTO; // Default to auto
      }
    } catch (e) {
      console.warn('Unable to access localStorage for theme preference:', e);
      userPreference = THEME_CONFIG.THEMES.AUTO;
    }
  }

  function saveUserPreference(preference) {
    try {
      localStorage.setItem(THEME_CONFIG.STORAGE_KEY, preference);
      userPreference = preference;
    } catch (e) {
      console.warn('Unable to save theme preference to localStorage:', e);
    }
  }

  // ========================================
  // THEME APPLICATION
  // ========================================
  
  function applyInitialTheme() {
    // Determine which theme to apply
    let themeToApply;
    
    if (userPreference === THEME_CONFIG.THEMES.AUTO || userPreference === null) {
      themeToApply = systemPreference;
    } else {
      themeToApply = userPreference;
    }
    
    // Apply theme to document element IMMEDIATELY
    document.documentElement.setAttribute('data-theme', themeToApply);
    currentTheme = themeToApply;
  }

  function applyTheme(theme, animate = false) {
    if (theme === currentTheme) return; // No change needed
    
    // Add transition class if animating
    if (animate) {
      document.body.classList.add('theme-transitioning');
    }
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', theme);
    currentTheme = theme;
    
    // Update button tooltip
    if (themeToggleButton) {
      updateTooltip();
    }
    
    // Trigger pulse animation on toggle button
    if (animate && themeToggleButton) {
      themeToggleButton.classList.add('animating');
      setTimeout(() => {
        themeToggleButton.classList.remove('animating');
      }, 600);
    }
    
    // Remove transition class after animation
    if (animate) {
      setTimeout(() => {
        document.body.classList.remove('theme-transitioning');
      }, THEME_CONFIG.ANIMATION_DURATION);
    }
    
    // Dispatch custom event for other scripts to react
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme, userPreference } 
    }));
  }

  // ========================================
  // THEME TOGGLE
  // ========================================
  
  function toggleTheme() {
    let newPreference;
    let newTheme;
    
    // Cycle through: dark → light → auto (system)
    if (userPreference === THEME_CONFIG.THEMES.DARK) {
      newPreference = THEME_CONFIG.THEMES.LIGHT;
      newTheme = THEME_CONFIG.THEMES.LIGHT;
    } else if (userPreference === THEME_CONFIG.THEMES.LIGHT) {
      newPreference = THEME_CONFIG.THEMES.AUTO;
      newTheme = systemPreference; // Use system preference
      showSystemBadge(`Auto mode: following system (${systemPreference})`);
    } else {
      newPreference = THEME_CONFIG.THEMES.DARK;
      newTheme = THEME_CONFIG.THEMES.DARK;
    }
    
    // Save and apply
    saveUserPreference(newPreference);
    applyTheme(newTheme, true);
    
    // Haptic feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  // ========================================
  // DOM SETUP
  // ========================================
  
  function setupDOM() {
    createThemeToggleButton();
    createSystemBadge();
    setupKeyboardShortcuts();
    
    // Show initial preference badge
    if (userPreference === THEME_CONFIG.THEMES.AUTO) {
      setTimeout(() => {
        showSystemBadge(`Auto mode: following system (${currentTheme})`, 2000);
      }, 1000);
    }
  }

  function createThemeToggleButton() {
    // Check if button already exists
    themeToggleButton = document.getElementById('theme-toggle');
    
    if (!themeToggleButton) {
      // Create button
      themeToggleButton = document.createElement('button');
      themeToggleButton.id = 'theme-toggle';
      themeToggleButton.className = 'theme-toggle';
      themeToggleButton.setAttribute('aria-label', 'Toggle theme');
      themeToggleButton.setAttribute('type', 'button');
      
      // Create icon container
      const iconContainer = document.createElement('div');
      iconContainer.className = 'theme-toggle-icon';
      
      // Sun icon (light mode)
      const sunIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      sunIcon.classList.add('theme-icon-sun');
      sunIcon.setAttribute('viewBox', '0 0 24 24');
      sunIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
      
      // Moon icon (dark mode)
      const moonIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      moonIcon.classList.add('theme-icon-moon');
      moonIcon.setAttribute('viewBox', '0 0 24 24');
      moonIcon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      `;
      
      iconContainer.appendChild(sunIcon);
      iconContainer.appendChild(moonIcon);
      themeToggleButton.appendChild(iconContainer);
      
      // Add to page
      document.body.appendChild(themeToggleButton);
    }
    
    // Update tooltip
    updateTooltip();
    
    // Add click handler
    themeToggleButton.addEventListener('click', toggleTheme);
    
    // Add keyboard support
    themeToggleButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  function updateTooltip() {
    if (!themeToggleButton) return;
    
    let tooltipText;
    if (userPreference === THEME_CONFIG.THEMES.AUTO) {
      tooltipText = `Auto (${currentTheme})`;
    } else {
      tooltipText = currentTheme === THEME_CONFIG.THEMES.DARK ? 'Dark mode' : 'Light mode';
    }
    
    themeToggleButton.setAttribute('data-tooltip', tooltipText);
  }

  // ========================================
  // SYSTEM BADGE
  // ========================================
  
  function createSystemBadge() {
    systemBadge = document.createElement('div');
    systemBadge.className = 'theme-system-badge';
    systemBadge.setAttribute('role', 'status');
    systemBadge.setAttribute('aria-live', 'polite');
    document.body.appendChild(systemBadge);
  }

  function showSystemBadge(message, duration = THEME_CONFIG.BADGE_SHOW_DURATION) {
    if (!systemBadge) return;
    
    // Clear existing timeout
    if (badgeTimeout) {
      clearTimeout(badgeTimeout);
    }
    
    // Update message
    systemBadge.textContent = message;
    
    // Show badge
    setTimeout(() => {
      systemBadge.classList.add('show');
    }, 100);
    
    // Hide after duration
    badgeTimeout = setTimeout(() => {
      systemBadge.classList.remove('show');
    }, duration);
  }

  // ========================================
  // KEYBOARD SHORTCUTS
  // ========================================
  
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + Shift + L = Toggle theme
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  // ========================================
  // PUBLIC API
  // ========================================
  
  window.ThemeSystem = {
    getCurrentTheme: () => currentTheme,
    getUserPreference: () => userPreference,
    getSystemPreference: () => systemPreference,
    setTheme: (theme) => {
      if (Object.values(THEME_CONFIG.THEMES).includes(theme)) {
        saveUserPreference(theme);
        const themeToApply = theme === THEME_CONFIG.THEMES.AUTO ? systemPreference : theme;
        applyTheme(themeToApply, true);
      }
    },
    toggle: toggleTheme
  };

  // ========================================
  // EXECUTE
  // ========================================
  
  init();

})();
