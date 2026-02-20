/**
 * INTERACTIVE CODE BLOCKS
 * Sprint #39 — 2026-02-10 6:30 AM
 * 
 * Functionality:
 * - One-click copy to clipboard
 * - Animated success feedback
 * - Keyboard accessibility
 * - Auto-initialization on DOM ready
 * 
 * Usage:
 * <div class="code-block-wrapper" data-code="npm install -g openclaw">
 *   [auto-generated HTML]
 * </div>
 */

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

  function initCodeBlocks() {
    // Find all code block wrappers
    const codeBlocks = document.querySelectorAll('.code-block-wrapper');

    codeBlocks.forEach(block => {
      const copyBtn = block.querySelector('.code-copy-btn');
      if (copyBtn) {
        setupCopyButton(copyBtn, block);
      }
    });

    // Auto-generate code blocks from data attributes
    generateCodeBlocks();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COPY FUNCTIONALITY
  // ═══════════════════════════════════════════════════════════════════════════

  function setupCopyButton(button, block) {
    button.addEventListener('click', async () => {
      // Get the code content
      const codeElement = block.querySelector('.code-block-content pre');
      if (!codeElement) return;

      // Extract plain text (remove syntax highlighting)
      const codeText = extractPlainText(codeElement);

      try {
        // Copy to clipboard
        await navigator.clipboard.writeText(codeText);

        // Success feedback
        showSuccessFeedback(button);
      } catch (err) {
        console.error('Failed to copy:', err);

        // Fallback: select text
        fallbackCopy(codeElement);
        showSuccessFeedback(button);
      }
    });

    // Keyboard accessibility
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  function extractPlainText(element) {
    // Clone to avoid modifying original
    const clone = element.cloneNode(true);

    // Remove prompts ($ or >)
    const prompts = clone.querySelectorAll('.code-prompt');
    prompts.forEach(p => p.remove());

    // Get text content and clean up
    let text = clone.textContent || clone.innerText;
    text = text.trim();

    return text;
  }

  function fallbackCopy(element) {
    // Old-school selection + copy
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }

    selection.removeAllRanges();
  }

  function showSuccessFeedback(button) {
    // Add copied class
    button.classList.add('copied');

    // Change text
    const textSpan = button.querySelector('span');
    const originalText = textSpan ? textSpan.textContent : 'Copy';
    if (textSpan) {
      textSpan.textContent = 'Copied!';
    }

    // Reset after 2 seconds
    setTimeout(() => {
      button.classList.remove('copied');
      if (textSpan) {
        textSpan.textContent = originalText;
      }
    }, 2000);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTO-GENERATION FROM DATA ATTRIBUTES
  // ═══════════════════════════════════════════════════════════════════════════

  function generateCodeBlocks() {
    const blocks = document.querySelectorAll('[data-code]:not(.code-block-initialized)');

    blocks.forEach(block => {
      let code = block.getAttribute('data-code');
      const language = block.getAttribute('data-language') || 'bash';
      const title = block.getAttribute('data-title') || 'Terminal';

      if (!code) return;

      // Strip any existing HTML tags from data-code to prevent issues
      code = code.replace(/<[^>]*>/g, '');

      // Generate structural HTML (header + empty pre)
      const html = createCodeBlockHTML(code, language, title);
      block.innerHTML = html;

      // Build highlighted code lines using safe DOM API
      const pre = block.querySelector('.code-block-content pre');
      if (pre) {
        buildHighlightedCode(pre, code, language);
      }

      block.classList.add('code-block-initialized');

      // Setup copy button
      const copyBtn = block.querySelector('.code-copy-btn');
      if (copyBtn) {
        setupCopyButton(copyBtn, block);
      }
    });
  }

  function createCodeBlockHTML(code, language, title) {
    return `
      <div class="code-block-header">
        <div class="code-block-title">
          <div class="terminal-dots">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
          </div>
          ${title}
        </div>
        <button class="code-copy-btn" aria-label="Copy code to clipboard">
          <svg class="copy-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy</span>
        </button>
      </div>
      <div class="code-block-content">
        <pre></pre>
      </div>
    `;
  }

  /**
   * Build highlighted lines using DOM API to avoid regex interference.
   * Each line is a <div> with spans created via createElement, so no
   * chance of regex matching inside already-inserted tag attributes.
   */
  function buildHighlightedCode(pre, code, language) {
    const lines = code.split('\n');

    lines.forEach(line => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'code-line';

      if (!line.trim()) {
        lineDiv.innerHTML = '&nbsp;';
        pre.appendChild(lineDiv);
        return;
      }

      if (language === 'bash' || language === 'shell' || language === 'terminal') {
        // Check for prompt at start
        const promptMatch = line.match(/^(\$|>)\s(.*)/);
        if (promptMatch) {
          const prompt = document.createElement('span');
          prompt.className = 'code-prompt';
          prompt.textContent = promptMatch[1];
          lineDiv.appendChild(prompt);
          lineDiv.appendChild(document.createTextNode(' '));

          // Add the rest of the command as a span 
          const cmd = document.createElement('span');
          cmd.className = 'code-command';
          cmd.textContent = promptMatch[2];
          lineDiv.appendChild(cmd);
        } else if (line.match(/^[✓✔]/)) {
          // Success lines
          const success = document.createElement('span');
          success.className = 'code-success';
          success.textContent = line;
          lineDiv.appendChild(success);
        } else if (line.match(/^#/)) {
          // Comment lines
          const comment = document.createElement('span');
          comment.className = 'code-comment';
          comment.textContent = line;
          lineDiv.appendChild(comment);
        } else if (line.match(/^[?🔗🧠🤖🎉]/)) {
          // Interactive/status lines
          const status = document.createElement('span');
          status.className = 'code-string';
          status.textContent = line;
          lineDiv.appendChild(status);
        } else {
          lineDiv.textContent = line;
        }
      } else {
        lineDiv.textContent = line;
      }

      pre.appendChild(lineDiv);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════════

  window.CodeBlocks = {
    init: initCodeBlocks,
    generateCodeBlocks: generateCodeBlocks
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTO-INIT
  // ═══════════════════════════════════════════════════════════════════════════

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeBlocks);
  } else {
    initCodeBlocks();
  }

})();
