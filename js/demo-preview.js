/* =================================================================
   DEMO PREVIEW CONTROLLER - Interactive Installation Showcase
   Sprint #35 | 2026-02-10 5:27 AM | Rick Sanchez
   ================================================================= */

(function() {
  'use strict';

  // DEMO SCRIPT - Installation sequence with benefits
  const DEMO_SCRIPT = [
    {
      step: 1,
      lines: [
        { type: 'comment', text: '# Step 1: Initial Setup' },
        { type: 'prompt', text: '$ ', command: 'npm install -g openclaw', delay: 50 },
        { type: 'output', text: '📦 Downloading OpenClaw package...', delay: 800 },
        { type: 'output', text: '⚙️  Installing dependencies...', delay: 1200 },
        { type: 'success', text: '✓ OpenClaw installed successfully', delay: 600 }
      ],
      benefit: 0, // Activate first benefit card
      progress: 25
    },
    {
      step: 2,
      lines: [
        { type: 'comment', text: '# Step 2: Configuration' },
        { type: 'prompt', text: '$ ', command: 'openclaw init', delay: 50 },
        { type: 'output', text: '🔧 Creating workspace...', delay: 800 },
        { type: 'output', text: '📝 Generating config files...', delay: 1000 },
        { type: 'output', text: '🔐 Setting up secure environment...', delay: 1200 },
        { type: 'success', text: '✓ Workspace configured at ~/.openclaw', delay: 600 }
      ],
      benefit: 1,
      progress: 50
    },
    {
      step: 3,
      lines: [
        { type: 'comment', text: '# Step 3: Connect AI Model' },
        { type: 'prompt', text: '$ ', command: 'openclaw config set model claude-sonnet-4', delay: 50 },
        { type: 'output', text: '🤖 Connecting to Claude Sonnet 4...', delay: 1000 },
        { type: 'output', text: '🔗 API key validated', delay: 800 },
        { type: 'success', text: '✓ Model configured successfully', delay: 600 }
      ],
      benefit: 2,
      progress: 75
    },
    {
      step: 4,
      lines: [
        { type: 'comment', text: '# Step 4: Launch!' },
        { type: 'prompt', text: '$ ', command: 'openclaw start', delay: 50 },
        { type: 'output', text: '🚀 Starting OpenClaw gateway...', delay: 800 },
        { type: 'output', text: '📡 Listening on localhost:3000', delay: 1000 },
        { type: 'output', text: '🧠 AI agent ready', delay: 800 },
        { type: 'success', text: '✓ OpenClaw is running! Open http://localhost:3000', delay: 800 }
      ],
      benefit: 3,
      progress: 100
    }
  ];

  // BENEFIT DATA
  const BENEFITS = [
    {
      icon: '🏗️',
      title: 'Zero-Configuration Install',
      description: 'One command gets you a fully functional AI workspace. No manual config files or complex setup required.'
    },
    {
      icon: '🔐',
      title: 'Privacy-First Architecture',
      description: 'Your API keys stay local, encrypted at rest. OpenClaw never phones home with your data or credentials.'
    },
    {
      icon: '🧠',
      title: 'Production-Ready AI',
      description: 'Connect to Claude, GPT-4, or local models instantly. Switch providers without breaking your workflows.'
    },
    {
      icon: '⚡',
      title: 'Ready to Automate',
      description: 'Pre-configured skills, memory system, and workflow templates. Start building automations immediately.'
    }
  ];

  // STATE
  let currentStepIndex = 0;
  let isPlaying = false;
  let isPaused = false;
  let currentLineIndex = 0;
  let animationTimeout = null;
  let typingTimeout = null;

  // DOM ELEMENTS (will be initialized on DOMContentLoaded)
  let terminalBody = null;
  let progressFill = null;
  let benefitCards = null;
  let stepDots = null;
  let playBtn = null;
  let resetBtn = null;

  // INITIALIZE
  function init() {
    // Find DOM elements
    terminalBody = document.querySelector('.demo-terminal-body');
    progressFill = document.querySelector('.demo-progress-fill');
    benefitCards = document.querySelectorAll('.demo-benefit-card');
    stepDots = document.querySelectorAll('.demo-step');
    playBtn = document.querySelector('.demo-control-btn.play');
    resetBtn = document.querySelector('.demo-control-btn.reset');

    if (!terminalBody) return; // Demo section not on page

    // Bind controls
    if (playBtn) {
      playBtn.addEventListener('click', togglePlayPause);
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', resetDemo);
    }

    // Start demo automatically when scrolled into view
    setupScrollTrigger();
  }

  // SETUP SCROLL TRIGGER (auto-play on first view)
  function setupScrollTrigger() {
    const demoSection = document.querySelector('.demo-preview-section');
    if (!demoSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isPlaying && currentStepIndex === 0) {
            // Auto-start demo on first view
            setTimeout(() => {
              startDemo();
            }, 500);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(demoSection);
  }

  // PLAY/PAUSE TOGGLE
  function togglePlayPause() {
    if (!isPlaying && currentStepIndex === 0) {
      startDemo();
    } else if (isPlaying && !isPaused) {
      pauseDemo();
    } else if (isPaused) {
      resumeDemo();
    }
  }

  // START DEMO
  function startDemo() {
    isPlaying = true;
    isPaused = false;
    updatePlayButton();
    playStep(currentStepIndex);
  }

  // PAUSE DEMO
  function pauseDemo() {
    isPaused = true;
    updatePlayButton();
    clearTimeout(animationTimeout);
    clearTimeout(typingTimeout);
  }

  // RESUME DEMO
  function resumeDemo() {
    isPaused = false;
    updatePlayButton();
    playStep(currentStepIndex);
  }

  // RESET DEMO
  function resetDemo() {
    // Clear all timeouts
    clearTimeout(animationTimeout);
    clearTimeout(typingTimeout);

    // Reset state
    isPlaying = false;
    isPaused = false;
    currentStepIndex = 0;
    currentLineIndex = 0;

    // Clear terminal
    if (terminalBody) {
      terminalBody.innerHTML = '';
    }

    // Reset progress
    if (progressFill) {
      progressFill.style.width = '0%';
    }

    // Reset benefit cards
    if (benefitCards) {
      benefitCards.forEach(card => card.classList.remove('active'));
    }

    // Reset step dots
    if (stepDots) {
      stepDots.forEach(dot => {
        dot.classList.remove('active', 'completed');
      });
    }

    updatePlayButton();
  }

  // UPDATE PLAY BUTTON TEXT
  function updatePlayButton() {
    if (!playBtn) return;

    if (!isPlaying) {
      playBtn.innerHTML = '▶️ Play Demo';
      playBtn.classList.remove('playing');
    } else if (isPaused) {
      playBtn.innerHTML = '▶️ Resume';
      playBtn.classList.remove('playing');
    } else {
      playBtn.innerHTML = '⏸️ Pause';
      playBtn.classList.add('playing');
    }
  }

  // PLAY STEP
  function playStep(stepIndex) {
    if (isPaused || stepIndex >= DEMO_SCRIPT.length) {
      if (stepIndex >= DEMO_SCRIPT.length) {
        // Demo complete
        isPlaying = false;
        updatePlayButton();
      }
      return;
    }

    const step = DEMO_SCRIPT[stepIndex];

    // Update step indicator
    updateStepIndicator(step.step);

    // Play lines sequentially
    playLines(step.lines, 0, () => {
      // After all lines, activate benefit and update progress
      activateBenefit(step.benefit);
      updateProgress(step.progress);

      // Mark step as completed
      if (stepDots && stepDots[stepIndex]) {
        stepDots[stepIndex].classList.remove('active');
        stepDots[stepIndex].classList.add('completed');
      }

      // Move to next step after delay
      animationTimeout = setTimeout(() => {
        currentStepIndex++;
        playStep(currentStepIndex);
      }, 1500);
    });
  }

  // PLAY LINES (recursive typewriter effect)
  function playLines(lines, lineIndex, onComplete) {
    if (isPaused || lineIndex >= lines.length) {
      if (lineIndex >= lines.length && onComplete) {
        onComplete();
      }
      return;
    }

    const line = lines[lineIndex];
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';

    if (line.type === 'prompt') {
      // Typewriter effect for commands
      const promptSpan = document.createElement('span');
      promptSpan.className = 'terminal-prompt';
      promptSpan.textContent = line.text;
      lineEl.appendChild(promptSpan);

      const commandSpan = document.createElement('span');
      commandSpan.className = 'terminal-command';
      lineEl.appendChild(commandSpan);

      const cursor = document.createElement('span');
      cursor.className = 'terminal-cursor';
      lineEl.appendChild(cursor);

      terminalBody.appendChild(lineEl);
      terminalBody.scrollTop = terminalBody.scrollHeight;

      // Type command character by character
      typeText(commandSpan, line.command, line.delay || 50, () => {
        cursor.remove();
        typingTimeout = setTimeout(() => {
          playLines(lines, lineIndex + 1, onComplete);
        }, 300);
      });
    } else {
      // Instant display for output/comments
      lineEl.className = `terminal-line terminal-${line.type}`;
      lineEl.textContent = line.text;
      terminalBody.appendChild(lineEl);
      terminalBody.scrollTop = terminalBody.scrollHeight;

      typingTimeout = setTimeout(() => {
        playLines(lines, lineIndex + 1, onComplete);
      }, line.delay || 600);
    }
  }

  // TYPEWRITER EFFECT
  function typeText(element, text, delay, onComplete) {
    let charIndex = 0;

    function typeChar() {
      if (isPaused) {
        typingTimeout = setTimeout(typeChar, 100);
        return;
      }

      if (charIndex < text.length) {
        element.textContent += text[charIndex];
        charIndex++;
        typingTimeout = setTimeout(typeChar, delay);
      } else if (onComplete) {
        onComplete();
      }
    }

    typeChar();
  }

  // ACTIVATE BENEFIT CARD
  function activateBenefit(benefitIndex) {
    if (!benefitCards) return;

    benefitCards.forEach((card, index) => {
      if (index === benefitIndex) {
        card.classList.add('active');
      }
    });
  }

  // UPDATE PROGRESS BAR
  function updateProgress(percentage) {
    if (!progressFill) return;
    progressFill.style.width = percentage + '%';
  }

  // UPDATE STEP INDICATOR
  function updateStepIndicator(stepNumber) {
    if (!stepDots) return;

    stepDots.forEach((dot, index) => {
      if (index === stepNumber - 1) {
        dot.classList.add('active');
      }
    });
  }

  // AUTO-INIT ON DOM READY
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // EXPOSE PUBLIC API
  window.DemoPreview = {
    start: startDemo,
    pause: pauseDemo,
    reset: resetDemo
  };

})();
