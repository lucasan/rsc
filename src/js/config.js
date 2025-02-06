export const CONFIG = {
    // Use a global variable if defined, otherwise default to January 1st of the current year
    PROGRAM_START_DATE: new Date(window.INITIAL_PROGRAM_START_DATE) || new (Date().getFullYear(), 0, 1),

    // Use the start date variable to calculate the end date
    get PROGRAM_END_DATE() {
        console.log('🟩 [10] Global date', window.INITIAL_PROGRAM_START_DATE);
        console.log('🟩 [10] PROGRAM_END_DATE', this.PROGRAM_START_DATE);
        const endDate = new Date(this.PROGRAM_START_DATE);
        endDate.setUTCDate(endDate.getUTCDate() + 364); // 365 days - 1 since we count the start date
        console.log('🟩 [10] PROGRAM_END_DATE', endDate);
        return endDate;
    },
    
    // Other global settings can go here
    TOTAL_STEPS: 365,
    
    // Add Firebase config
    FIREBASE_PROJECT_ID: "resilience-cal",
    get FIRESTORE_BASE_URL() {
        return `https://firestore.googleapis.com/v1/projects/${this.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
    }
}; 