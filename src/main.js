import './style.css'
import { ResilienceCalendar } from './js/config.js'
import Calendar from './js/components/Calendar.js'
import Logger from './js/services/Logger.js'

const logger = new Logger('Main')

// Create the global object first
const ResilienceCalendarLib = {
  initResilienceCalendar: function(options = {}) {
    const { container, projectId, startDate } = options;
    
    try {
      const resilienceCalendar = new ResilienceCalendar({
        projectId,
        startDate
      });

      const calendarElement = document.getElementById(container);
      const calendarUI = new Calendar(calendarElement, resilienceCalendar.config);

      return resilienceCalendar;
    } catch (error) {
      console.error('Error initializing calendar:', error);
      throw error;
    }
  },
  ResilienceCalendar
};

// Expose to window
if (typeof window !== 'undefined') {
  Object.assign(window, ResilienceCalendarLib);
}

// In development, initialize immediately
if (import.meta.env.DEV) {
  document.addEventListener('DOMContentLoaded', function() {
    initResilienceCalendar({
      container: 'calendar',
      projectId: 'resilience-cal',
      startDate: '2025-01-14T00:00:00.000Z'
    });
  });
}

export default ResilienceCalendarLib; 