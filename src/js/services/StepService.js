import Logger from './Logger.js';
import { getStepNumberForDate } from '../utils/dateUtils.js';
import { CONFIG } from '../config.js';

const logger = new Logger('StepService');

export default class StepService {
    constructor() {
        this.cache = new Map();
        this.loading = new Map();
        this.baseUrl = './src/data/steps';
    }

    async getStep(stepNumber) {
        try {
            logger.debug('Getting step', { stepNumber });

            // Validate input
            if (!this.isValidStepNumber(stepNumber)) {
                throw new Error(`Invalid step number: ${stepNumber}`);
            }

            // Check cache first
            if (this.cache.has(stepNumber)) {
                logger.debug('Cache hit', { stepNumber });
                return this.cache.get(stepNumber);
            }

            // Prevent duplicate fetches
            if (this.loading.has(stepNumber)) {
                logger.debug('Already loading', { stepNumber });
                return this.loading.get(stepNumber);
            }

            // Fetch and cache
            const fetchPromise = this.fetchStep(stepNumber);
            this.loading.set(stepNumber, fetchPromise);
            
            const step = await fetchPromise;
            logger.debug('Fetched step data', { stepNumber, step });
            this.cache.set(stepNumber, step);
            this.loading.delete(stepNumber);
            
            return step;
        } catch (error) {
            logger.error('Error getting step', { stepNumber, error });
            this.loading.delete(stepNumber);
            throw error;
        }
    }

    async fetchStep(stepNumber) {
        try {
            const url = `${this.baseUrl}/${stepNumber}.json`;
            logger.debug('Fetching step', { url, stepNumber });
            
            const response = await fetch(url);
            logger.debug('Fetch response', { 
                status: response.status, 
                ok: response.ok,
                stepNumber,
                url
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            logger.debug('Raw step data', { 
                stepNumber, 
                data,
                dataType: typeof data,
                hasStepNumber: !!data?.step_number,
                hasStepOfDay: !!data?.step_of_the_day
            });
            
            return this.validateStepData(data);
        } catch (error) {
            logger.error('Fetch error', { 
                stepNumber, 
                error: error.message,
                errorType: error.constructor.name,
                stack: error.stack
            });
            throw error;
        }
    }

    isValidStepNumber(number) {
        const num = Number(number);
        return !isNaN(num) && num >= 1 && num <= 365;
    }

    validateStepData(data) {
        logger.debug('Validating step data structure', {
            data,
            hasStepNumber: !!data?.step_number,
            hasStepOfDay: !!data?.step_of_the_day,
            stepNumberType: typeof data?.step_number,
            stepOfDayType: typeof data?.step_of_the_day
        });

        // Clean up step number - remove any non-numeric characters
        if (data.step_number) {
            data.step_number = String(data.step_number).replace(/[^0-9]/g, '');
        }

        if (!data.step_number || !data.step_of_the_day) {
            throw new Error(`Invalid step data structure: missing ${!data.step_number ? 'step_number' : 'step_of_the_day'}`);
        }
        
        logger.debug('Step data validated', { 
            stepNumber: data.step_number,
            title: data.step_of_the_day?.title,
            hasTitle: !!data.step_of_the_day?.title
        });
        return data;
    }

    clearCache() {
        logger.debug('Clearing cache');
        this.cache.clear();
        this.loading.clear();
    }

    // Future API methods can be added here
    setBaseUrl(url) {
        this.baseUrl = url;
    }

    // Method to get steps for a month
    async getStepsForMonth(year, month) {
        logger.debug('Getting steps for month', { year, month });
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        
        // Get all step numbers needed for this month
        const stepNumbers = new Set();
        const currentDate = new Date(firstDay);

        while (currentDate <= lastDay) {
            // Convert all dates to UTC midnight for comparison
            const currentUTC = new Date(Date.UTC(
                currentDate.getUTCFullYear(),
                currentDate.getUTCMonth(),
                currentDate.getUTCDate()
            ));
            const startUTC = new Date(Date.UTC(
                CONFIG.PROGRAM_START_DATE.getUTCFullYear(),
                CONFIG.PROGRAM_START_DATE.getUTCMonth(),
                CONFIG.PROGRAM_START_DATE.getUTCDate()
            ));
            const endUTC = new Date(Date.UTC(
                CONFIG.PROGRAM_END_DATE.getUTCFullYear(),
                CONFIG.PROGRAM_END_DATE.getUTCMonth(),
                CONFIG.PROGRAM_END_DATE.getUTCDate()
            ));

            // Compare UTC dates
            if (currentUTC >= startUTC && currentUTC <= endUTC) {
                const stepNumber = getStepNumberForDate(CONFIG.PROGRAM_START_DATE, currentDate);
                if (stepNumber && stepNumber > 0) {
                    stepNumbers.add(stepNumber);
                }
            } else {
                logger.debug('Skipping date: Program start date', { date: startUTC.toISOString() });
                logger.debug('Skipping date: Program end date', { date: endUTC.toISOString() });
                logger.debug('Skipping date: Current date', { date: currentUTC.toISOString() });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        const promises = Array.from(stepNumbers).map(number => this.getStep(number));
        const steps = await Promise.all(promises);
        return steps.filter(Boolean);
    }
} 