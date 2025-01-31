export const CONFIG = {
    // Program configuration
    PROGRAM_START_DATE: new Date(Date.UTC(2025, 0, 30)), // January 30, 2025 00:00:00 UTC
    get PROGRAM_END_DATE() {
        const endDate = new Date(Date.UTC(2025, 0, 30)); // Create fresh UTC date
        endDate.setUTCDate(endDate.getUTCDate() + 364); // Add days in UTC
        return endDate;
    },
    
    // Other global settings can go here
    TOTAL_STEPS: 365
}; 