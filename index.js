/* ═══════════════════════════════════════════════════════════════
   OpenClaw Mac — Landing Page Scripts
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Smooth Scroll (anchor links) ───────────────────────────
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      const progress = (scrollTop / (scrollHeight - clientHeight));
      if (scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;
    }, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                closeMobileMenu();
                return;
            }
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                closeMobileMenu();
            }
        });
    });

    // ── Sticky Nav Background ──────────────────────────────────
    const nav = document.getElementById('nav');
    const scrollThreshold = 40;

    function updateNav() {
        if (window.scrollY > scrollThreshold) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();

    // ── Mobile Menu Toggle ─────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
    }

    // Close mobile menu when clicking links inside it
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ── Scroll-triggered Fade-in (Intersection Observer) ──────
    const fadeElements = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show everything immediately
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // ── Booking Toggle (Austin / Remote) ──────────────────────
    const toggleBtns = document.querySelectorAll('.book__option');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('book__option--active'));
            btn.classList.add('book__option--active');
        });
    });

    // ── Wizard Logic (Disabled) ─────────────────────────────
    /* 
     * The old wizard logic was causing scroll jumps because it calls
     * scrollIntoView() on initialization.
     * 
     * Since the wizard HTML might still exist or be hidden, we ensure
     * this block doesn't execute scroll logic on load.
     */
    
    /*
    const steps = document.querySelectorAll('.wizard-step');
    const progressBar = document.getElementById('wizardProgress');
    let currentStep = 0;

    function updateWizard() {
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('active');
                // Smooth scroll to top of form if needed
                // step.scrollIntoView({ behavior: 'smooth', block: 'center' }); // THIS WAS THE CULPRIT
            } else {
                step.classList.remove('active');
            }
        });

        if (progressBar) {
            const progress = ((currentStep + 1) / steps.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    // Initialize first step
    if (steps.length > 0) {
        updateWizard();
    }
    */

    // ── Form Submission ────────────────────────────────────────
    const form = document.getElementById('bookForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const button = form.querySelector('button[type="submit"]');
        
        // Use micro-interactions loading state
        if (window.showLoadingState) {
            window.showLoadingState(button, 'Scheduling...');
        } else {
            button.disabled = true;
            button.innerText = 'Scheduling...';
        }

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Construct message
            const message = `
New Booking Request:
- Package: ${data.package}
- Mac: ${data.macModel}
- Goals: ${data.goals}
- Location: ${document.querySelector('.book__option--active')?.dataset.value || 'Austin'}
            `.trim();

            formData.set('message', message);

            const response = await fetch('/api/submit', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Trigger success celebration with particles
                const rect = button.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                
                // Dispatch custom event for particle system
                document.dispatchEvent(new CustomEvent('formSubmitSuccess', {
                    detail: { x, y }
                }));
                
                // Show success animation (if available)
                if (window.showSuccessAnimation) {
                    window.showSuccessAnimation(document.body, 'Booking submitted! Redirecting to calendar...');
                }
                
                // Redirect to Calendly
                const calendlyUrl = new URL('https://calendly.com/your-handle/openclaw-install');
                calendlyUrl.searchParams.set('name', data.name);
                calendlyUrl.searchParams.set('email', data.email);
                
                setTimeout(() => {
                    window.location.href = calendlyUrl.toString();
                }, 2000);
            } else {
                throw new Error('API failed');
            }
        } catch (error) {
            console.error(error);
            
            // Hide loading, show error
            if (window.hideLoadingState) {
                window.hideLoadingState(button);
            }
            
            // Show toast notification (if available)
            const toast = document.createElement('div');
            toast.className = 'toast toast-warning';
            toast.textContent = 'Redirecting to manual scheduling...';
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('toast-exit');
                setTimeout(() => toast.remove(), 300);
            }, 2500);
            
            setTimeout(() => {
                window.location.href = 'https://calendly.com/your-handle/openclaw-install';
            }, 3000);
        }
    });

    // ── Spotlight Buttons ──────────────────────────────────────
    const spotlightButtons = document.querySelectorAll('.btn--primary');
    
    spotlightButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            btn.style.setProperty('--x', `${x}px`);
            btn.style.setProperty('--y', `${y}px`);
            
            // Subtle magnetic pull (optional, reduced strength to avoid jitter)
            const cx = x - rect.width / 2;
            const cy = y - rect.height / 2;
            btn.style.transform = `translate(${cx * 0.1}px, ${cy * 0.1}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            // Reset spotlight to center
            btn.style.setProperty('--x', '50%');
            btn.style.setProperty('--y', '50%');
        });
    });

    // ── Spotlight Effect (Cards) ───────────────────────────────
    const spotlightCards = document.querySelectorAll('.feature-card, .pricing-card, .deep-card');

    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ── Typewriter Effect ──────────────────────────────────────
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const phrases = [
            "AI agents.",
            "for 1/10th the cost.",
            "autonomous workers.",
            "digital employees."
        ];
        
        let phraseIndex = 0;
        // Start from full length of first phrase (assumed to match HTML)
        let charIndex = phrases[0].length;
        let isDeleting = false;
        
        function type() {
            const currentPhrase = phrases[phraseIndex];
            let typeSpeed = 100;
            
            if (isDeleting) {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }
            
            setTimeout(type, typeSpeed);
        }
        
        // Start loop after initial delay
        setTimeout(() => {
            isDeleting = true; // Start by deleting "AI Assistant"
            type();
        }, 3000);
    }

    // ── 3D Tilt for Pricing Cards (Added by Rick) ────────────────
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation. Max rotation is 8 degrees.
            const rotateX = ((y - centerY) / centerY) * -4; 
            const rotateY = ((x - centerX) / centerX) * 4;

            // Apply the transform
            // We use perspective to create the 3D effect
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Reset the transform when mouse leaves
            card.style.transform = '';
        });
    });

});
