/**
 * TYPOGRAPHY ANIMATION SYSTEM - JAVASCRIPT
 * 2026 Premium SaaS Interactive Text
 * 
 * Handles:
 * - Text scrambling (Matrix decode effect)
 * - Split text reveal (character/word animations)
 * - Typewriter progressive reveal
 * - Text morphing/cycling
 * - Scroll-triggered animations
 * - Performance optimizations
 */

class TypographyAnimations {
    constructor() {
        this.observers = [];
        this.activeAnimations = new Set();
        this.init();
    }

    init() {
        // Wait for DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Check for reduced motion preference
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (this.prefersReducedMotion) {
            console.log('[Typography] Reduced motion enabled - animations disabled');
            return;
        }

        // Initialize all animation types
        this.initScrambleText();
        this.initRevealText();
        this.initTypewriter();
        this.initTextMorph();
        this.initScrollReveal();
        
        console.log('[Typography] Animation system initialized');
    }

    /**
     * SCRAMBLE TEXT EFFECT
     * Decodes text character-by-character with random characters
     */
    initScrambleText() {
        const elements = document.querySelectorAll('[data-scramble]');
        
        elements.forEach(el => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.activeAnimations.has(el)) {
                        this.scrambleText(el);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(el);
            this.observers.push(observer);
        });
    }

    scrambleText(element) {
        this.activeAnimations.add(element);
        const originalText = element.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        const duration = parseInt(element.dataset.scrambleDuration) || 2000;
        const iterations = Math.ceil(duration / 50);
        
        element.classList.add('text-scramble');
        element.innerHTML = '';
        
        // Create char spans
        const charSpans = originalText.split('').map(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
            element.appendChild(span);
            return span;
        });
        
        let iteration = 0;
        const interval = setInterval(() => {
            charSpans.forEach((span, index) => {
                if (originalText[index] === ' ') {
                    span.textContent = ' ';
                    return;
                }
                
                // Gradually reveal correct characters
                const progress = iteration / iterations;
                const charProgress = index / charSpans.length;
                
                if (progress > charProgress) {
                    span.textContent = originalText[index];
                    span.classList.remove('scrambling');
                } else {
                    span.textContent = chars[Math.floor(Math.random() * chars.length)];
                    span.classList.add('scrambling');
                }
            });
            
            iteration++;
            
            if (iteration > iterations) {
                clearInterval(interval);
                charSpans.forEach((span, i) => {
                    span.textContent = originalText[i];
                });
                this.activeAnimations.delete(element);
            }
        }, 50);
    }

    /**
     * REVEAL TEXT EFFECT
     * Split text into words/chars and animate sequentially
     */
    initRevealText() {
        const elements = document.querySelectorAll('[data-reveal]');
        
        elements.forEach(el => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.activeAnimations.has(el)) {
                        this.revealText(el);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(el);
            this.observers.push(observer);
        });
    }

    revealText(element) {
        this.activeAnimations.add(element);
        const splitType = element.dataset.reveal || 'word'; // 'word' or 'char'
        const originalText = element.textContent;
        
        element.classList.add('text-reveal');
        element.innerHTML = '';
        
        if (splitType === 'char') {
            originalText.split('').forEach(char => {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char === ' ' ? '\u00A0' : char;
                element.appendChild(span);
            });
        } else {
            originalText.split(' ').forEach((word, i) => {
                if (i > 0) element.appendChild(document.createTextNode(' '));
                const span = document.createElement('span');
                span.className = 'word';
                span.textContent = word;
                element.appendChild(span);
            });
        }
        
        // Trigger animation
        requestAnimationFrame(() => {
            element.classList.add('active');
            setTimeout(() => this.activeAnimations.delete(element), 1000);
        });
    }

    /**
     * TYPEWRITER EFFECT
     * Progressive character-by-character reveal
     */
    initTypewriter() {
        const elements = document.querySelectorAll('[data-typewriter]');
        
        elements.forEach(el => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.activeAnimations.has(el)) {
                        this.typewriterText(el);
                        observer.unobserve(el);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(el);
            this.observers.push(observer);
        });
    }

    typewriterText(element) {
        this.activeAnimations.add(element);
        const originalText = element.textContent;
        const speed = parseInt(element.dataset.typewriterSpeed) || 50;
        
        element.classList.add('text-typewriter', 'typing');
        element.textContent = '';
        
        let index = 0;
        const interval = setInterval(() => {
            if (index < originalText.length) {
                element.textContent += originalText[index];
                index++;
            } else {
                clearInterval(interval);
                element.classList.remove('typing');
                element.classList.add('complete');
                this.activeAnimations.delete(element);
            }
        }, speed);
    }

    /**
     * TEXT MORPH EFFECT
     * Cycle through multiple text states
     */
    initTextMorph() {
        const elements = document.querySelectorAll('[data-morph]');
        
        elements.forEach(el => {
            const texts = el.dataset.morph.split('|');
            if (texts.length < 2) return;
            
            let currentIndex = 0;
            element.classList.add('text-morph');
            
            const morphInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % texts.length;
                this.morphToText(el, texts[currentIndex]);
            }, parseInt(el.dataset.morphInterval) || 3000);
            
            // Store interval for cleanup if needed
            el.dataset.morphIntervalId = morphInterval;
        });
    }

    morphToText(element, newText) {
        element.classList.add('morphing');
        
        setTimeout(() => {
            element.textContent = newText;
            element.classList.remove('morphing');
        }, 300);
    }

    /**
     * SCROLL REVEAL
     * Fade in text on scroll into view
     */
    initScrollReveal() {
        const elements = document.querySelectorAll('[data-scroll-reveal]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        elements.forEach(el => {
            el.classList.add('text-scroll-reveal');
            observer.observe(el);
        });
        
        this.observers.push(observer);
    }

    /**
     * UTILITY: Split text into spans
     */
    splitText(element, type = 'word') {
        const originalText = element.textContent;
        element.innerHTML = '';
        
        if (type === 'char') {
            return originalText.split('').map(char => {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = char === ' ' ? '\u00A0' : char;
                element.appendChild(span);
                return span;
            });
        } else {
            const spans = [];
            originalText.split(' ').forEach((word, i) => {
                if (i > 0) element.appendChild(document.createTextNode(' '));
                const span = document.createElement('span');
                span.className = 'word';
                span.textContent = word;
                element.appendChild(span);
                spans.push(span);
            });
            return spans;
        }
    }

    /**
     * CLEANUP
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.activeAnimations.clear();
        
        // Clear any morph intervals
        document.querySelectorAll('[data-morph-interval-id]').forEach(el => {
            clearInterval(parseInt(el.dataset.morphIntervalId));
        });
    }
}

// Initialize on load
const typographyAnimations = new TypographyAnimations();

// Export for manual control if needed
window.TypographyAnimations = TypographyAnimations;
window.typographyAnimations = typographyAnimations;
