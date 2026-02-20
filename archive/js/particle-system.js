/**
 * PARTICLE SYSTEM
 * Interactive particle effects for premium engagement
 * Inspired by Stripe, Linear, and Notion celebration UX
 */

class ParticleSystem {
    constructor() {
        this.container = null;
        this.particles = [];
        this.maxParticles = 200;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        // Create particle container
        this.container = document.createElement('div');
        this.container.className = 'particle-container';
        document.body.appendChild(this.container);
        
        // Initialize ambient particles (desktop only)
        if (!this.isReducedMotion && window.innerWidth > 768) {
            this.createAmbientParticles();
        }
        
        // Attach event listeners
        this.attachEventListeners();
    }
    
    createAmbientParticles() {
        const count = 12;
        const colors = ['purple', 'blue', 'cyan'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = `particle ambient particle-${colors[i % colors.length]}`;
                
                // Random position in hero area
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * (window.innerHeight * 0.6); // Top 60%
                const size = 20 + Math.random() * 40;
                
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                particle.style.animationDuration = `${15 + Math.random() * 10}s`;
                
                this.container.appendChild(particle);
                this.particles.push(particle);
            }, i * 100);
        }
    }
    
    attachEventListeners() {
        // CTA button clicks → confetti burst
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.cta-button, .btn-primary, .book-button');
            if (target && !this.isReducedMotion) {
                this.createConfettiBurst(e.clientX, e.clientY);
            }
        });
        
        // Form submission success → celebration
        document.addEventListener('formSubmitSuccess', (e) => {
            if (!this.isReducedMotion) {
                this.createSuccessCelebration(e.detail?.x || window.innerWidth / 2, e.detail?.y || window.innerHeight / 2);
            }
        });
        
        // Mouse trail on interactive elements (desktop only)
        if (!this.isReducedMotion && window.innerWidth > 768) {
            let lastTrailTime = 0;
            document.addEventListener('mousemove', (e) => {
                const now = Date.now();
                if (now - lastTrailTime < 50) return; // Throttle
                lastTrailTime = now;
                
                const target = e.target.closest('.card, .feature-card, .pricing-card');
                if (target && Math.random() > 0.7) { // 30% chance
                    this.createTrailParticle(e.clientX, e.clientY);
                }
            });
        }
        
        // Cleanup old particles periodically
        setInterval(() => this.cleanup(), 5000);
    }
    
    createConfettiBurst(x, y, count = 30) {
        const colors = ['purple', 'blue', 'green', 'yellow', 'orange', 'cyan'];
        const shapes = ['confetti-circle', 'confetti-square', 'confetti-triangle'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const color = colors[Math.floor(Math.random() * colors.length)];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];
                
                particle.className = `particle confetti ${shape} particle-${color}`;
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                
                // Random spread
                const angle = (Math.random() * 360) * (Math.PI / 180);
                const velocity = 100 + Math.random() * 200;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;
                
                particle.style.setProperty('--tx', `${tx}px`);
                particle.style.setProperty('--ty', `${ty}px`);
                particle.style.animationDuration = `${2 + Math.random() * 2}s`;
                particle.style.animationDelay = `${Math.random() * 0.1}s`;
                
                this.container.appendChild(particle);
                this.particles.push(particle);
                
                // Auto-remove
                setTimeout(() => {
                    particle.remove();
                    this.particles = this.particles.filter(p => p !== particle);
                }, 3500);
            }, i * 15);
        }
    }
    
    createSuccessCelebration(x, y) {
        // Success checkmark
        const celebration = document.createElement('div');
        celebration.className = 'celebration-container';
        
        const checkmark = document.createElement('div');
        checkmark.className = 'success-checkmark';
        celebration.appendChild(checkmark);
        
        celebration.style.left = `${x}px`;
        celebration.style.top = `${y}px`;
        
        document.body.appendChild(celebration);
        
        // Burst particles
        this.createBurstParticles(x, y, 16);
        
        // Confetti
        this.createConfettiBurst(x, y, 50);
        
        // Success rings
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const ring = document.createElement('div');
                ring.className = 'particle success-ring';
                ring.style.left = `${x - 40}px`;
                ring.style.top = `${y - 40}px`;
                ring.style.width = '80px';
                ring.style.height = '80px';
                ring.style.animationDelay = `${i * 0.1}s`;
                
                this.container.appendChild(ring);
                
                setTimeout(() => ring.remove(), 1000);
            }, i * 100);
        }
        
        // Remove celebration after animation
        setTimeout(() => celebration.remove(), 2000);
    }
    
    createBurstParticles(x, y, count = 12) {
        const colors = ['purple', 'blue', 'cyan'];
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const color = colors[i % colors.length];
            
            particle.className = `particle burst particle-${color}`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = '12px';
            particle.style.height = '12px';
            
            const angle = (i / count) * 360 * (Math.PI / 180);
            const distance = 80 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            this.container.appendChild(particle);
            this.particles.push(particle);
            
            setTimeout(() => {
                particle.remove();
                this.particles = this.particles.filter(p => p !== particle);
            }, 1000);
        }
    }
    
    createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle trail';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = '6px';
        particle.style.height = '6px';
        
        this.container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 700);
    }
    
    createSparkles(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle sparkle';
                
                const offsetX = (Math.random() - 0.5) * 60;
                const offsetY = (Math.random() - 0.5) * 60;
                
                particle.style.left = `${x + offsetX}px`;
                particle.style.top = `${y + offsetY}px`;
                particle.style.width = '16px';
                particle.style.height = '16px';
                particle.style.animationDelay = `${Math.random() * 0.2}s`;
                
                this.container.appendChild(particle);
                
                setTimeout(() => particle.remove(), 800);
            }, i * 50);
        }
    }
    
    cleanup() {
        // Remove particles that have been around too long
        if (this.particles.length > this.maxParticles) {
            const excess = this.particles.length - this.maxParticles;
            for (let i = 0; i < excess; i++) {
                const particle = this.particles.shift();
                if (particle && particle.parentNode) {
                    particle.remove();
                }
            }
        }
    }
    
    // Public API for manual triggers
    triggerConfetti(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        this.createConfettiBurst(x, y);
    }
    
    triggerSuccess(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        this.createSuccessCelebration(x, y);
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.particleSystem = new ParticleSystem();
    });
} else {
    window.particleSystem = new ParticleSystem();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}
