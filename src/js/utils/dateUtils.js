/**
 * Calculate days between two dates
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {number} Number of days between dates
 */
export function daysBetweenDates(startDate, endDate) {
    // Create new dates to avoid modifying originals
    const start = new Date(startDate.getTime());
    const end = new Date(endDate.getTime());
    
    // Set to midnight
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    // Calculate difference
    const diffTime = end - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get step number for a given date based on start date
 * @param {Date} startDate User's start date
 * @param {Date} currentDate Date to get step for
 * @returns {number|null} Step number (1-365) or null if out of range
 */
export function getStepNumberForDate(startDate, currentDate) {
    console.log('🟩 [10] getStepNumberForDate inputs:', {
        startDate: startDate.toISOString(),
        currentDate: currentDate.toISOString()
    });

    // Create UTC dates to avoid timezone issues
    const start = new Date(Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth(),
        startDate.getUTCDate()
    ));
    
    const current = new Date(Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate()
    ));

    // Early return for dates before start
    if (current < start) {
        return null;
    }

    // If same day, return step 1
    if (current.getTime() === start.getTime()) {
        return 1;
    }

    // Calculate days since start
    const days = Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const stepNumber = days + 1;

    console.log('🟩 [11] Date calculations:', {
        start: start.toISOString(),
        current: current.toISOString(),
        days,
        stepNumber,
        valid: stepNumber >= 1 && stepNumber <= 365
    });

    return stepNumber >= 1 && stepNumber <= 365 ? stepNumber : null;
}

/**
 * Get date for a specific step number based on start date
 * @param {Date} startDate User's start date
 * @param {number} stepNumber Step number (1-365)
 * @returns {Date} Date for that step
 */
export function getDateForStepNumber(startDate, stepNumber) {
    if (stepNumber < 1 || stepNumber > 365) {
        throw new Error('Step number must be between 1 and 365');
    }
    const result = new Date(startDate);
    result.setDate(startDate.getDate() + (stepNumber - 1));
    return result;
} 