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

    // ── Scroll-triggered Reveal Animations (Minimal restorative fix) ──
    const revealElements = document.querySelectorAll('.fade-in, .reveal, .reveal-scale, .trust-stat, .comparison-feature');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;

                    // Unified mapping of trigger classes to their "active" counterparts
                    if (el.classList.contains('reveal') || el.classList.contains('reveal-scale')) {
                        el.classList.add('active');
                    } else if (el.classList.contains('fade-in')) {
                        el.classList.add('visible');
                    } else {
                        el.classList.add('revealed'); // For stats, features, etc.
                    }

                    revealObserver.unobserve(el);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: Show everything immediately if observer is missing
        revealElements.forEach(el => {
            el.classList.add('visible', 'active', 'revealed');
        });
    }

    // ── Booking Toggle (Austin / Remote) ──────────────────────
    const toggleBtns = document.querySelectorAll('.book__option');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('book__option--active'));
            btn.classList.add('book__option--active');
        });
    });

    // ── Wizard Step Navigation ────────────────────────────────
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const wizardProgress = document.getElementById('wizardProgress');
    let currentStep = 0;

    function goToStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= wizardSteps.length) return;

        // Hide all steps
        wizardSteps.forEach(step => step.classList.remove('active'));

        // Show target step
        wizardSteps[stepIndex].classList.add('active');
        currentStep = stepIndex;

        // Update progress bar
        if (wizardProgress) {
            const progress = ((stepIndex + 1) / wizardSteps.length) * 100;
            wizardProgress.style.width = `${progress}%`;
        }

        // Scroll the booking section into view
        const bookSection = document.getElementById('book');
        if (bookSection) {
            bookSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Next step buttons
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Validate current step has a selection
            const currentStepEl = wizardSteps[currentStep];
            const radios = currentStepEl.querySelectorAll('input[type="radio"]');

            if (radios.length > 0) {
                const selected = currentStepEl.querySelector('input[type="radio"]:checked');
                if (!selected) {
                    // Shake the step to indicate missing selection
                    currentStepEl.style.animation = 'shake 0.4s ease';
                    setTimeout(() => currentStepEl.style.animation = '', 400);
                    return;
                }
            }

            goToStep(currentStep + 1);
        });
    });

    // Back step buttons
    document.querySelectorAll('.back-step').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            goToStep(currentStep - 1);
        });
    });

    // Initialize progress bar
    if (wizardProgress) {
        wizardProgress.style.width = `${(1 / wizardSteps.length) * 100}%`;
    }
    // ── Form Submission ────────────────────────────────────────
    const form = document.getElementById('bookForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const button = form.querySelector('button[type="submit"]');
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Show loading state
            if (button) {
                button.disabled = true;
                button.innerText = 'Redirecting to calendar...';
            }

            // Build Calendly URL with prefilled fields
            // TODO: Replace 'openclawmac' with your actual Calendly handle
            const calendlyUrl = new URL('https://calendly.com/openclawmac/openclaw-install');
            if (data.name) calendlyUrl.searchParams.set('name', data.name);
            if (data.email) calendlyUrl.searchParams.set('email', data.email);

            // Trigger success celebration with particles (if available)
            if (button) {
                const rect = button.getBoundingClientRect();
                document.dispatchEvent(new CustomEvent('formSubmitSuccess', {
                    detail: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
                }));
            }

            // Brief delay for visual feedback, then redirect
            setTimeout(() => {
                window.location.href = calendlyUrl.toString();
            }, 800);
        });
    }

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
