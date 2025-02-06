import Logger from './Logger.js';

const logger = new Logger('QuoteService');

export default class QuoteService {
    constructor(config) {
        this.config = config;
        this.quotes = new Map();
    }

    async loadQuotes() {
        if (this.quotes.size > 0) {
            return this.quotes;
        }

        try {
            const baseUrl = this.config.FIRESTORE_BASE_URL;
            const response = await fetch(`${baseUrl}/months`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            // Transform Firestore response
            if (data.documents) {
                data.documents.forEach(doc => {
                    const month = doc.name.split('/').pop(); // Get month from document path
                    const title = doc.fields.title.stringValue;
                    this.quotes.set(month.toLowerCase(), title);
                });
            }
            
            logger.debug('Loaded month quotes', { quotes: Array.from(this.quotes.entries()) });
            return this.quotes;
        } catch (error) {
            logger.error('Error loading quotes', { error });
            throw error;
        }
    }

    async getQuoteForMonth(month) {
        const quotes = await this.loadQuotes();
        const monthName = new Date(2024, month, 1)
            .toLocaleString('default', { month: 'long' })
            .toLowerCase();
        return quotes.get(monthName) || null;
    }
} 