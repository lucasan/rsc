import StepService from './services/StepService.js';

export class Config {
    constructor(options = {}) {
        this.FIREBASE_PROJECT_ID = options.projectId || '';
        this.PROGRAM_START_DATE = new Date(options.startDate) || new Date(Date.now());
        this.TOTAL_STEPS = 365;
        
        // Default text for the original version toggle
        this.ORIGINAL_VERSION_TEXT = options.originalVersionText || 
            "View original text from the book";
        
        // Optional shorter text for mobile
        this.ORIGINAL_VERSION_TEXT_MOBILE = options.originalVersionTextMobile || 
            "View original version";
            
        // Text for returning to simplified version
        this.SIMPLIFIED_VERSION_TEXT = options.simplifiedVersionText ||
            "Back to simplified version";
            
        // Optional shorter text for mobile when returning
        this.SIMPLIFIED_VERSION_TEXT_MOBILE = options.simplifiedVersionTextMobile ||
            "Back";
    }

    get PROGRAM_END_DATE() {
        const endDate = new Date(this.PROGRAM_START_DATE);
        endDate.setUTCDate(endDate.getUTCDate() + 364); // 365 days - 1 since we count the start date
        return endDate;
    }

    get FIRESTORE_BASE_URL() {
        if (!this.FIREBASE_PROJECT_ID) {
            throw new Error('Firebase Project ID is required');
        }
        return `https://firestore.googleapis.com/v1/projects/${this.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
    }
}

// Create a main library class that initializes everything
export class ResilienceCalendar {
    constructor(options = {}) {
        if (!options.projectId) {
            throw new Error('Firebase Project ID is required');
        }
        this.config = new Config(options);
        this.stepService = new StepService(this.config);
        // Add other services as needed
    }

    // Public API methods
    async getStep(stepNumber) {
        return this.stepService.getStep(stepNumber);
    }

    async getStepsForMonth(year, month) {
        return this.stepService.getStepsForMonth(year, month);
    }
} 