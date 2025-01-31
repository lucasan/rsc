export default class StepPanel {
    constructor(container) {
        this.container = container;
        this.isOpen = false;
        this.currentStep = null;
        
        // Bind methods
        this.handleClose = this.handleClose.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        
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
    
    render() {
        if (!this.isOpen) {
            this.container.innerHTML = '';
            return;
        }
        
        const step = this.currentStep;
        
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
                        
                        <!-- Content for both mobile and desktop -->
                        <div class=" space-y-8 max-w-2xl focus:outline-none"
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
        
        // Add event listeners to both close buttons
        this.container.querySelectorAll('.mobile-close, .desktop-close').forEach(button => {
            button.addEventListener('click', this.handleClose);
        });
        this.container.querySelector('.overlay-bg').addEventListener('click', this.handleOverlayClick);

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