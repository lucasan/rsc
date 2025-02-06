window.initResilienceCalendar = function(options = {}) {
    const { container, projectId, startDate } = options;
    
    try {
        // Initialize ResilienceCalendar with config
        const resilienceCalendar = new ResilienceCalendar({
            projectId,
            startDate
        });

        // Pass the config to Calendar component
        const calendarElement = document.getElementById(container);
        const calendarUI = new Calendar(calendarElement, resilienceCalendar.config);

        // ... rest of initialization
        return resilienceCalendar;
    } catch (error) {
        logger.error('Error initializing calendar:', error);
        throw error;
    }
} 