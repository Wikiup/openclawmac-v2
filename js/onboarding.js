// Onboarding Flow Logic (Vanilla JS adaptation of Donor Component)

class OnboardingFlow {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 1;
        this.totalSteps = 5;
        this.state = {
            name: '',
            email: '',
            phone: '',
            macModel: '',
            package: '',
            goals: '',
            timeline: ''
        };
        
        // Load saved state
        const saved = localStorage.getItem('oc_onboarding_state');
        if (saved) {
            try { this.state = { ...this.state, ...JSON.parse(saved) }; } 
            catch (e) { console.error('Failed to load state', e); }
        }

        this.init();
    }

    init() {
        this.render();
        this.attachGlobalListeners();
    }

    saveState() {
        localStorage.setItem('oc_onboarding_state', JSON.stringify(this.state));
    }

    updateState(key, value) {
        this.state[key] = value;
        this.saveState();
        // Re-render only if needed (simple implementation re-renders all)
        // For performance, we could just update value, but re-render ensures validation state updates
        this.render(); 
    }

    nextStep() {
        if (this.currentStep < this.totalSteps && this.validateStep(this.currentStep)) {
            // Save Lead on Step 1 completion
            if (this.currentStep === 1) {
                this.submitLead(false); // Background save
            }
            this.currentStep++;
            this.render();
            window.scrollTo({ top: document.getElementById('book').offsetTop - 100, behavior: 'smooth' });
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.render();
        }
    }

    validateStep(step) {
        const s = this.state;
        switch(step) {
            case 1: return s.name && s.email && s.email.includes('@');
            case 2: return s.macModel;
            case 3: return s.package;
            case 4: return s.goals.length > 5;
            default: return true;
        }
    }

    async submitLead(isFinal) {
        const payload = new FormData();
        for (const [key, value] of Object.entries(this.state)) {
            payload.append(key, value);
        }
        
        // Custom message block
        const message = `
        Package: ${this.state.package}
        Mac: ${this.state.macModel}
        Goals: ${this.state.goals}
        Timeline: ${this.state.timeline}
        `;
        payload.append('message', message);
        payload.append('is_final', isFinal);

        try {
            await fetch('/api/submit', { method: 'POST', body: payload });
        } catch (e) {
            console.error('Submission error:', e);
        }

        if (isFinal) {
            // Redirect or show success
            this.container.innerHTML = this.renderSuccess();
            localStorage.removeItem('oc_onboarding_state'); // Clear state
            
            // Redirect to Calendly after 2s
            setTimeout(() => {
                const url = new URL('https://calendly.com/your-handle/openclaw-install');
                url.searchParams.set('name', this.state.name);
                url.searchParams.set('email', this.state.email);
                window.location.href = url.toString();
            }, 2000);
        }
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="onboarding-card">
                ${this.renderProgressBar()}
                <div class="step-content">
                    ${this.renderStep(this.currentStep)}
                </div>
                ${this.renderControls()}
            </div>
        `;
        
        // Re-attach listeners after render
        this.attachDynamicListeners();
    }

    renderProgressBar() {
        const progress = ((this.currentStep) / this.totalSteps) * 100;
        return `
            <div class="progress-track">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="step-indicator">Step ${this.currentStep} of ${this.totalSteps}</div>
        `;
    }

    renderStep(step) {
        const s = this.state;
        switch(step) {
            case 1: // Contact
                return `
                    <h3>Let's get started</h3>
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" class="input-field" value="${s.name}" oninput="window.onboard.updateState('name', this.value)" placeholder="Rick Sanchez">
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" class="input-field" value="${s.email}" oninput="window.onboard.updateState('email', this.value)" placeholder="rick@citadel.com">
                    </div>
                    <div class="form-group">
                        <label>Phone (Optional)</label>
                        <input type="tel" class="input-field" value="${s.phone}" oninput="window.onboard.updateState('phone', this.value)" placeholder="(512) 555-0137">
                    </div>
                `;
            case 2: // Mac Model
                const macs = ['MacBook Air', 'MacBook Pro', 'Mac mini', 'iMac', 'Mac Studio', 'Not sure'];
                return `
                    <h3>Which Mac are we tuning?</h3>
                    <div class="grid-options">
                        ${macs.map(m => `
                            <button class="option-card ${s.macModel === m ? 'selected' : ''}" 
                                onclick="window.onboard.updateState('macModel', '${m}')">
                                ${m}
                            </button>
                        `).join('')}
                    </div>
                `;
            case 3: // Package
                const pkgs = ['Quick Install ($149)', 'Pro Setup ($299)', 'Team / Power User ($799+)'];
                return `
                    <h3>Choose your package</h3>
                    <div class="grid-options vertical">
                        ${pkgs.map(p => `
                            <button class="option-card ${s.package === p ? 'selected' : ''}" 
                                onclick="window.onboard.updateState('package', '${p}')">
                                ${p}
                            </button>
                        `).join('')}
                    </div>
                `;
            case 4: // Goals
                return `
                    <h3>What are your goals?</h3>
                    <div class="form-group">
                        <textarea class="input-field" rows="4" 
                            oninput="window.onboard.updateState('goals', this.value)" 
                            placeholder="I want to automate my emails, organize my files...">${s.goals}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Timeline</label>
                        <select class="input-field" onchange="window.onboard.updateState('timeline', this.value)">
                            <option value="" ${!s.timeline ? 'selected' : ''}>Select timeline...</option>
                            <option value="ASAP" ${s.timeline==='ASAP' ? 'selected' : ''}>ASAP (This week)</option>
                            <option value="Soon" ${s.timeline==='Soon' ? 'selected' : ''}>Within 2 weeks</option>
                            <option value="Planning" ${s.timeline==='Planning' ? 'selected' : ''}>Just planning</option>
                        </select>
                    </div>
                `;
            case 5: // Review
                return `
                    <h3>Review & Submit</h3>
                    <div class="review-box">
                        <p><strong>Name:</strong> ${s.name}</p>
                        <p><strong>Email:</strong> ${s.email}</p>
                        <p><strong>Mac:</strong> ${s.macModel}</p>
                        <p><strong>Package:</strong> ${s.package}</p>
                        <p><strong>Goals:</strong> ${s.goals}</p>
                    </div>
                    <p class="fine-print">We'll review your setup and redirect you to book a time slot.</p>
                `;
        }
    }

    renderControls() {
        const isValid = this.validateStep(this.currentStep);
        const isLast = this.currentStep === this.totalSteps;
        
        return `
            <div class="controls">
                ${this.currentStep > 1 ? `<button class="btn-sec" onclick="window.onboard.prevStep()">Back</button>` : '<div></div>'}
                <button class="btn-pri ${!isValid ? 'disabled' : ''}" 
                    onclick="${isLast ? 'window.onboard.submitLead(true)' : 'window.onboard.nextStep()'}"
                    ${!isValid ? 'disabled' : ''}>
                    ${isLast ? 'Submit Application' : 'Continue →'}
                </button>
            </div>
        `;
    }

    renderSuccess() {
        return `
            <div class="success-view">
                <h3>Application Received!</h3>
                <p>Redirecting you to the calendar...</p>
                <div class="spinner"></div>
            </div>
        `;
    }

    attachGlobalListeners() {
        // Expose instance globally for inline onclicks (simple pattern)
        window.onboard = this;
    }
    
    attachDynamicListeners() {
        // Placeholder for more complex listeners
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('onboarding-app')) {
        new OnboardingFlow('onboarding-app');
    }
});
