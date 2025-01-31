import Logger from './Logger.js';

const logger = new Logger('QuoteService');

export default class QuoteService {
    constructor() {
        this.quotes = null;
        this.baseUrl = './src/data';
    }

    async loadQuotes() {
        if (this.quotes) {
            return this.quotes;
        }

        try {
            const response = await fetch(`${this.baseUrl}/months_titles.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.quotes = data[0]; // The JSON contains a single object in an array
            logger.debug('Loaded month quotes', { quotes: this.quotes });
            return this.quotes;
        } catch (error) {
            logger.error('Error loading quotes', { error });
            throw error;
        }
    }

    async getQuoteForMonth(month) {
        const quotes = await this.loadQuotes();
        const monthName = new Date(2024, month, 1).toLocaleString('default', { month: 'long' });
        return quotes[monthName] || null;
    }
} 