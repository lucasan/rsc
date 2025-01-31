const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export default class Logger {
    constructor(context) {
        this.context = context;
    }

    debug(message, data = {}) {
        if (!IS_PRODUCTION) {
            console.log(`🔵 [${this.context}]`, message, data);
        }
    }

    error(message, data = {}) {
        if (!IS_PRODUCTION) {
            console.error(`🔴 [${this.context}]`, message, data);
        }
    }

    warn(message, data = {}) {
        console.warn(`🟡 [${this.context}] ${message}`, data);
    }
} 