export default class StepPanel {
    constructor(container, config) {
        this.container = container;
        this.config = config;
        this.isOpen = false;
        this.currentStep = null;
        this.isShowingOriginal = false;
        
        // Bind methods
        this.handleClose = this.handleClose.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.handleToggleOriginal = this.handleToggleOriginal.bind(this);
        
        // Add keyboard listener
        document.addEventListener('keydown', this.handleKeydown);
        
        this.touchStartY = 0;
        this.touchDeltaY = 0;
        
        // Store last focused element to restore focus on close
        this.lastFocusedElement = null;
    }
    
    open(step) {
        // Store currently focused element
        this.lastFocusedElement = document.activeElement;
        
        this.currentStep = step;
        this.isOpen = true;
        this.render();
        this.updateURL();
        
        // Focus the panel content after opening
        const panelContent = this.container.querySelector('.panel-content');
        if (panelContent) {
            panelContent.setAttribute('tabindex', '0');
            panelContent.focus();
        }
    }
    
    close() {
        if (!this.isOpen) return;
        
        const panel = this.container.querySelector('.transform');
        panel.classList.remove('show');
        
        setTimeout(() => {
            this.isOpen = false;
            this.currentStep = null;
            this.render();
            this.updateURL();
            
            // Restore focus to last focused element
            if (this.lastFocusedElement) {
                this.lastFocusedElement.focus();
            }
        }, 500);
    }
    
    handleClose() {
        this.close();
    }
    
    handleKeydown(e) {
        if (e.key === 'Escape' && this.isOpen) {
            this.close();
        }
    }
    
    handleOverlayClick(e) {
        // Only close if clicking the overlay (not the panel itself)
        if (e.target.classList.contains('overlay-bg')) {
            this.close();
        }
    }
    
    updateURL() {
        const url = new URL(window.location);
        if (this.isOpen && this.currentStep) {
            url.searchParams.set('step', this.currentStep.step_number);
        } else {
            url.searchParams.delete('step');
        }
        window.history.pushState({}, '', url);
    }
    
    handleToggleOriginal(e) {
        e.preventDefault();
        this.isShowingOriginal = !this.isShowingOriginal;
        this.render();
    }

    getStepContent() {
        // Helper to get either current or original content
        if (this.isShowingOriginal && this.currentStep.original) {
            return this.currentStep.original;
        }
        return {
            step_number: this.currentStep.step_number,
            quote: this.currentStep.quote,
            step_of_the_day: this.currentStep.step_of_the_day,
            action_step: this.currentStep.action_step,
            journal_entry: this.currentStep.journal_entry
        };
    }

    render() {
        if (!this.isOpen) {
            this.container.innerHTML = '';
            return;
        }
        
        const step = this.getStepContent();
        
        const toggleButton = this.currentStep.original ? `
            <button 
                class="group flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200
                text-gray-600 hover:text-blue-600 hover:bg-blue-50
                text-sm font-medium hidden md:flex mb-6"
                aria-label="${this.isShowingOriginal ? 'View simplified version' : this.config.ORIGINAL_VERSION_TEXT}"
            >
                ${this.isShowingOriginal ? 
                    `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>` : 
                    `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>`
                }
                ${this.isShowingOriginal ? this.config.SIMPLIFIED_VERSION_TEXT : this.config.ORIGINAL_VERSION_TEXT}
            </button>
            <button 
                class="group flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200
                text-gray-600 hover:text-blue-600 hover:bg-blue-50
                text-sm font-medium md:hidden mb-4"
                aria-label="${this.isShowingOriginal ? 'View simplified version' : this.config.ORIGINAL_VERSION_TEXT_MOBILE}"
            >
                ${this.isShowingOriginal ? 
                    `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>` : 
                    `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>`
                }
                ${this.isShowingOriginal ? this.config.SIMPLIFIED_VERSION_TEXT_MOBILE : this.config.ORIGINAL_VERSION_TEXT_MOBILE}
            </button>
        ` : '';

        this.container.innerHTML = `
            <div class="panel-content fixed inset-0 bg-black bg-opacity-50 transition-opacity overlay-bg">
                <div class="fixed inset-y-0 right-0 w-full md:max-w-4xl bg-white shadow-xl transform transition-transform duration-500 overflow-y-auto">
                    <!-- Decorative top bar -->
                    <div class="hidden md:block h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                    
                    <div class="relative p-4 md:p-12">
                        <!-- Mobile header -->
                        <div class="flex items-center justify-between md:hidden mb-4">
                            <div class="text-sm font-medium text-blue-600">
                                Step ${step.step_number}
                            </div>
                            <button 
                                class="mobile-close p-2 text-gray-500 hover:text-gray-700"
                                aria-label="Close panel"
                            >
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Desktop close button -->
                        <button 
                            class="desktop-close absolute right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 hidden md:block"
                            aria-label="Close panel"
                        >
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        ${toggleButton}
                        
                        <!-- Content for both mobile and desktop -->
                        <div class="space-y-8 max-w-2xl focus:outline-none"
                             tabindex="0"
                             role="region"
                             aria-label="Step details">
                            <!-- Step number (desktop only) -->
                            <div class="hidden md:block text-sm font-medium text-blue-600 tracking-wide uppercase">
                                Step ${step.step_number}
                            </div>
                            
                            <!-- Title -->
                            <h2 class="text-xl md:text-3xl font-bold text-gray-900 leading-tight">
                                ${step.step_of_the_day.title}
                            </h2>

                            <!-- Quote -->
                            ${step.quote ? `
                                <blockquote class="relative">
                                <svg class="absolute -top-6 -start-8 size-16 text-gray-200" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z" fill="currentColor"></path>
                                </svg>

                                <div class="relative z-10">
                                    <p class="text-gray-600 sm:text-xl"><em>
                                        ${step.quote}
                                    </em></p>
                                </div>
                                </blockquote>
                            ` : ''}
                            
                            <!-- Review and Appreciate -->
                            ${step.review_and_appreciate ? `
                                <div class="panel-section md:bg-transparent md:p-0">
                                    <h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-3">Review and Appreciate</h3>
                                    <p class="text-gray-600 leading-relaxed">${step.review_and_appreciate}</p>
                                </div>
                            ` : ''}
                            
                            <!-- Main content -->
                            <div class="panel-section md:bg-transparent md:p-0">
                                <h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-3">Today's Step</h3>
                                <p class="text-gray-600 leading-relaxed">${step.step_of_the_day.content}</p>
                            </div>
                            
                            <!-- Action step -->
                            <div class="panel-section md:bg-blue-50 md:p-6 md:rounded-xl">
                                <h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-3">
                                    <span class="md:text-blue-600">Action Step</span>
                                </h3>
                                <p class="text-gray-600 md:text-gray-700 leading-relaxed">${step.action_step}</p>
                            </div>
                            
                            <!-- Journal entry -->
                            <div class="panel-section md:bg-gray-50 md:p-6 md:rounded-xl">
                                <h3 class="text-lg md:text-xl font-semibold text-gray-800 mb-3">Journal Entry</h3>
                                <p class="text-gray-600 leading-relaxed">${step.journal_entry}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.container.querySelectorAll('.mobile-close, .desktop-close').forEach(button => {
            button.addEventListener('click', this.handleClose);
        });
        this.container.querySelector('.overlay-bg').addEventListener('click', this.handleOverlayClick);
        
        // Add toggle event listener if original content exists
        if (this.currentStep.original) {
            this.container.querySelectorAll('button[aria-label]').forEach(button => {
                if (button.classList.contains('mobile-close') || button.classList.contains('desktop-close')) return;
                button.addEventListener('click', this.handleToggleOriginal);
            });
        }

        // Animation timing
        const panel = this.container.querySelector('.transform');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                panel.classList.add('show');
            });
        });
    }

    addTouchHandlers() {
        const panel = this.container.querySelector('.transform');
        panel.addEventListener('touchstart', this.handleTouchStart);
        panel.addEventListener('touchmove', this.handleTouchMove);
        panel.addEventListener('touchend', this.handleTouchEnd);
    }

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchMove(e) {
        this.touchDeltaY = e.touches[0].clientY - this.touchStartY;
        if (this.touchDeltaY > 0) { // Only allow downward swipe
            e.preventDefault();
            const panel = this.container.querySelector('.transform');
            panel.style.transform = `translateY(${this.touchDeltaY}px)`;
        }
    }

    handleTouchEnd() {
        const panel = this.container.querySelector('.transform');
        if (this.touchDeltaY > 100) { // If dragged down more than 100px
            this.close();
        } else {
            panel.style.transform = ''; // Reset position
        }
        this.touchDeltaY = 0;
    }
} 