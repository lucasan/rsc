import Logger from '../services/Logger.js';

const logger = new Logger('DayCell');

export default class DayCell {
    constructor(date, options = {}) {
        this.date = date;
        this.isToday = options.isToday || false;
        this.isSelected = options.isSelected || false;
        this.stepNumber = options.stepNumber;
        this.stepTitle = options.stepTitle;
        this.isEmpty = options.isEmpty || false;
    }

    render() {
        if (this.isEmpty) {
            return '<div class="p-2 md:p-4 border border-transparent"></div>';
        }

        const day = this.date.getDate();
        
        logger.debug('Rendering cell with:', { 
            day,
            stepNumber: this.stepNumber,
            stepTitle: this.stepTitle,
            hasTitle: !!this.stepTitle
        });
        
        return `
            <div class="day-cell relative border rounded-lg transition-all duration-200
                aspect-square w-[40px] md:w-auto md:min-h-[100px] 
                flex items-center justify-center md:block
                ${this.isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-100 hover:border-blue-300'}
                ${this.isSelected ? 'bg-blue-100 border-blue-400' : ''}
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                cursor-pointer p-2 md:overflow-clip"
                data-date="${this.date.toISOString()}"
                role="button"
                aria-label="${day}${this.stepNumber ? ` - Step ${this.stepNumber}` : ''}"
            >
                <span class="text-sm ${this.isToday ? 'font-bold' : ''}">${day}</span>
                ${this.stepNumber ? `
                    <div class="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-600 md:hidden"></div>
                    <div class="text-xs hidden md:block p-2">
                        <span class="font-medium text-blue-600">Step ${this.stepNumber}</span>
                        ${this.stepTitle ? `
                            <p class="mt-1 text-gray-600 line-clamp-5 overflow-hidden">${this.stepTitle}</p>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }
} 