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

(function() {
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
      const code = block.getAttribute('data-code');
      const language = block.getAttribute('data-language') || 'bash';
      const title = block.getAttribute('data-title') || 'Terminal';
      
      if (!code) return;
      
      // Generate HTML
      const html = createCodeBlockHTML(code, language, title);
      block.innerHTML = html;
      block.classList.add('code-block-initialized');
      
      // Setup copy button
      const copyBtn = block.querySelector('.code-copy-btn');
      if (copyBtn) {
        setupCopyButton(copyBtn, block);
      }
    });
  }

  function createCodeBlockHTML(code, language, title) {
    // Parse code into highlighted lines
    const lines = code.split('\n');
    const highlightedLines = lines.map(line => highlightSyntax(line, language));
    
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
        <pre><code>${highlightedLines.join('\n')}</code></pre>
      </div>
    `;
  }

  function highlightSyntax(line, language) {
    if (!line.trim()) return '<span class="code-line"></span>';
    
    let highlighted = line;
    
    if (language === 'bash' || language === 'shell' || language === 'terminal') {
      // Prompt
      highlighted = highlighted.replace(/^(\$|>)\s/, '<span class="code-prompt">$1</span> ');
      
      // Comments
      highlighted = highlighted.replace(/(#.*)$/, '<span class="code-comment">$1</span>');
      
      // Flags (--flag or -f)
      highlighted = highlighted.replace(/(\s)(--?[\w-]+)/g, '$1<span class="code-flag">$2</span>');
      
      // Common commands (npm, openclaw, etc.)
      highlighted = highlighted.replace(/\b(npm|npx|openclaw|git|curl|wget|brew|apt|sudo|cd|ls|mkdir|chmod)\b/g, 
        '<span class="code-command">$1</span>');
      
      // Strings in quotes
      highlighted = highlighted.replace(/(['"])([^'"]*)\1/g, 
        '<span class="code-string">$1$2$1</span>');
      
      // Paths (starting with / or ~)
      highlighted = highlighted.replace(/(\s)(\/[\w\/.-]*|~[\w\/.-]*)/g, 
        '$1<span class="code-path">$2</span>');
      
      // Success indicators (✓, ✔, [OK], SUCCESS)
      highlighted = highlighted.replace(/(✓|✔|\[OK\]|SUCCESS)/g, 
        '<span class="code-success">$1</span>');
      
      // Numbers
      highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, 
        '<span class="code-number">$1</span>');
    }
    
    return `<span class="code-line">${highlighted}</span>`;
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
