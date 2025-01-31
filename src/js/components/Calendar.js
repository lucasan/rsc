import { getStepNumberForDate } from '../utils/dateUtils.js'
import DayCell from './DayCell.js'
import { CONFIG } from '../config.js'
import StepPanel from './StepPanel.js'
import StepService from '../services/StepService.js'
import Logger from '../services/Logger.js'
import QuoteService from '../services/QuoteService.js'
import { getStepFromUrl } from '../utils/urlUtils.js'
import { getDateForStepNumber } from '../utils/dateUtils.js'

const logger = new Logger('Calendar')

export default class Calendar {
    constructor(container) {
        this.container = container;
        this.currentDate = new Date();
        this.currentDate.setFullYear(CONFIG.PROGRAM_START_DATE.getFullYear());
        this.selectedDate = null;
        this.startDate = CONFIG.PROGRAM_START_DATE;
        
        // Bind event handlers to this instance
        this.handleClick = this.handleClick.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        
        // Add event listeners
        this.container.addEventListener('click', this.handleClick);
        container.setAttribute('tabindex', '0');
        container.addEventListener('keydown', this.handleKeydown);
        
        // Initialize services
        this.stepService = new StepService();
        this.monthSteps = new Map();
        this.quoteService = new QuoteService();
        
        // Initialize step panel
        this.panelContainer = document.createElement('div');
        document.body.appendChild(this.panelContainer);
        this.stepPanel = new StepPanel(this.panelContainer);
        logger.debug('Calendar constructor');
        // Check URL for step number
        const stepFromUrl = getStepFromUrl();
        logger.debug('stepFromUrl', stepFromUrl);
        if (stepFromUrl) {
            const dateForStep = getDateForStepNumber(this.startDate, stepFromUrl);
            logger.debug('dateForStep', dateForStep);
            this.currentDate = new Date(dateForStep.getFullYear(), dateForStep.getMonth(), 1);
            logger.debug('this.currentDate', this.currentDate);
            this.selectedDate = dateForStep;
            logger.debug('this.selectedDate', this.selectedDate);
        }
        
        // Initial render
        (async () => {
            await this.render();
            if (this.selectedDate) {
                await this.selectDate(this.selectedDate);
            }
        })();
    }

    async loadCurrentMonthSteps() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        logger.debug('Starting to load month steps', { year, month });
        
        try {
            const steps = await this.stepService.getStepsForMonth(year, month);
            logger.debug('Got steps from service', { count: steps.length, steps });
            
            this.monthSteps.clear();
            steps.forEach(step => {
                // Convert step number to string when storing
                const stepNumber = String(step.step_number);
                logger.debug('Adding step to month cache', { 
                    stepNumber,
                    title: step.step_of_the_day?.title 
                });
                this.monthSteps.set(stepNumber, step);
            });
            
            logger.debug('Finished loading month steps', { 
                count: this.monthSteps.size,
                cached: Array.from(this.monthSteps.keys())
            });
        } catch (error) {
            logger.error('Failed to load month steps', { error });
        }
    }

    async getStepForDate(date) {
        try {
            const stepNumber = getStepNumberForDate(this.startDate, date);
            if (!stepNumber) return null;

            // Convert to string when checking cache
            const stepNumberStr = String(stepNumber);
            
            // First check monthSteps cache
            if (this.monthSteps.has(stepNumberStr)) {
                logger.debug('Cache hit for step', { stepNumber, stepNumberStr });
                return this.monthSteps.get(stepNumberStr);
            }

            // If it's for the current month, load all month steps
            const isSameMonth = date.getMonth() === this.currentDate.getMonth() 
                && date.getFullYear() === this.currentDate.getFullYear();
            
            if (isSameMonth) {
                await this.loadCurrentMonthSteps();
                return this.monthSteps.get(stepNumberStr);
            }

            // If it's for a different month, get individual step
            return await this.stepService.getStep(stepNumber);
        } catch (error) {
            logger.error('Error getting step for date', { date, error });
            return null;
        }
    }

    async createNavigation() {
        const firstMonth = new Date(CONFIG.PROGRAM_START_DATE);
        firstMonth.setDate(1);
        
        const lastMonth = new Date(CONFIG.PROGRAM_END_DATE);
        lastMonth.setDate(1);
        
        const isFirstMonth = this.currentDate.getFullYear() === firstMonth.getFullYear() 
            && this.currentDate.getMonth() === firstMonth.getMonth();
        
        const isLastMonth = this.currentDate.getFullYear() === lastMonth.getFullYear() 
            && this.currentDate.getMonth() === lastMonth.getMonth();

        // Get quote for current month
        const quote = await this.quoteService.getQuoteForMonth(this.currentDate.getMonth());

        return `
            <div class="space-y-4 mb-6">
                <div class="flex items-center justify-between px-2">
                    <button 
                        class="prev-month p-3 hover:bg-gray-100 rounded-full transition-colors duration-200 ${isFirstMonth ? 'opacity-50 cursor-not-allowed' : ''}"
                        tabindex="0"
                        aria-label="Previous month"
                        ${isFirstMonth ? 'disabled' : ''}
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <h2 class="text-2xl font-bold text-gray-800" id="current-month">
                        ${this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button 
                        class="next-month p-3 hover:bg-gray-100 rounded-full transition-colors duration-200 ${isLastMonth ? 'opacity-50 cursor-not-allowed' : ''}"
                        tabindex="0"
                        aria-label="Next month"
                        ${isLastMonth ? 'disabled' : ''}
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>
                <div class="flex justify-center mt-2">
                    <button 
                        class="go-to-today px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm"
                        tabindex="0"
                        aria-label="Go to today's step"
                    >
                        Go to Today's Step
                    </button>
                </div>
                <div class="px-4 py-3 bg-gray-50 rounded-lg">
                    <blockquote class="text-sm italic text-gray-600 text-center">
                        <p class="mb-2">"${quote || 'The journey of a thousand miles begins with a single step.'}"</p>
                        <footer class="text-xs text-gray-500">― Monthly Wisdom</footer>
                    </blockquote>
                </div>
            </div>
        `;
    }

    createWeekHeaders() {
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return `
            <div class="grid grid-cols-7 gap-2 mb-4">
                ${weekdays.map(day => `
                    <div class="text-center text-gray-500 font-semibold tracking-wider text-sm">
                        ${day}
                    </div>
                `).join('')}
            </div>
        `;
    }

    getDaysInMonth(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        return { daysInMonth, startingDay };
    }

    async createCalendarGrid() {
        const { daysInMonth, startingDay } = this.getDaysInMonth(this.currentDate);
        let days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = new DayCell(null, { isEmpty: true });
            days.push(emptyCell.render());
        }

        // First, ensure we have all steps for this month
        await this.loadCurrentMonthSteps();

        // Now create cells using cached data
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const stepNumber = getStepNumberForDate(this.startDate, date);
            
            // Convert stepNumber to string when retrieving
            const step = stepNumber ? this.monthSteps.get(String(stepNumber)) : null;
            
            logger.debug('Creating cell with step data', { 
                date, 
                stepNumber, 
                hasStep: !!step,
                title: step?.step_of_the_day?.title 
            });

            const cell = new DayCell(date, {
                isToday: this.isToday(date),
                isSelected: this.isSelected(date),
                stepNumber: stepNumber,
                stepTitle: step?.step_of_the_day?.title || null
            });
            days.push(cell.render());
        }

        return `
            <div class="grid grid-cols-7 gap-1 md:gap-2">
                ${days.join('')}
                </div>
        `;
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    isSelected(date) {
        return this.selectedDate && date.toDateString() === this.selectedDate.toDateString();
    }

    async handleClick(e) {
        // Handle day cell clicks only
        const dayCell = e.target.closest('.day-cell');
        if (dayCell && dayCell.dataset.date) {
            this.selectDate(new Date(dayCell.dataset.date));
        }
    }

    handleKeydown(e) {
        // Only handle arrow keys if the calendar container itself is focused
        if (document.activeElement === this.container) {
            if (!this.selectedDate) {
                // If no date is selected, start with today or first of month
                this.selectedDate = this.isToday(this.currentDate) ? 
                    new Date() : 
                    new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
                this.render();
                return;
            }

            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.navigateDate(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.navigateDate(1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateDate(-7);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateDate(7);
                    break;
                case 'Enter':
                case ' ': // Space key
                    e.preventDefault();
                    if (this.selectedDate) {
                        this.selectDate(this.selectedDate);
                    }
                    break;
            }
        }
    }
    
    navigateDate(days) {
        const newDate = new Date(this.selectedDate);
        newDate.setDate(newDate.getDate() + days);
        
        // If date change requires month change
        if (newDate.getMonth() !== this.currentDate.getMonth()) {
            this.currentDate = newDate;
        }
        this.selectedDate = newDate;
        this.render();
        
        // Ensure selected date is visible
        const selectedCell = this.container.querySelector(`[data-date="${newDate.toISOString()}"]`);
        if (selectedCell) {
            selectedCell.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    async navigateMonth(delta) {
        const newDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + delta, 1);
        
        // Calculate first and last valid months
        const firstMonth = new Date(CONFIG.PROGRAM_START_DATE);
        firstMonth.setDate(1);
        
        const lastMonth = new Date(CONFIG.PROGRAM_END_DATE);
        lastMonth.setDate(1);
        
        // Allow navigation to the first month
        if (newDate < firstMonth) {
            this.currentDate = firstMonth;
        } else if (newDate > lastMonth) {
            this.currentDate = lastMonth;
        } else {
            this.currentDate = newDate;
        }
        
        await this.loadCurrentMonthSteps();
        await this.render();
    }

    async render() {
        this.container.innerHTML = `
            <div class="calendar-container p-6 bg-white rounded-xl shadow-lg">
                ${await this.createNavigation()}
                ${this.createWeekHeaders()}
                ${await this.createCalendarGrid()}
            </div>
        `;
        
        // Re-attach event listeners for navigation buttons
        const prevButton = this.container.querySelector('.prev-month');
        const nextButton = this.container.querySelector('.next-month');
        const todayButton = this.container.querySelector('.go-to-today');
        
        prevButton?.addEventListener('click', () => this.navigateMonth(-1));
        prevButton?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.navigateMonth(-1);
            }
        });
        
        nextButton?.addEventListener('click', () => this.navigateMonth(1));
        nextButton?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.navigateMonth(1);
            }
        });

        todayButton?.addEventListener('click', () => this.goToToday());
        todayButton?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.goToToday();
            }
        });

        // Add focus styles and event listeners to day cells
        this.addEventListeners();

        // Focus the selected date if calendar is focused
        const selectedCell = this.container.querySelector(`[data-date="${this.selectedDate?.toISOString()}"]`);
        if (selectedCell) {
            selectedCell.setAttribute('tabindex', '0');
            if (document.activeElement === this.container) {
                selectedCell.focus();
            }
        }
    }

    addEventListeners() {
        const dayCells = this.container.querySelectorAll('.day-cell[data-date]');
        dayCells.forEach((cell, index) => {
            // Make all day cells focusable
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('role', 'button');
            cell.setAttribute('aria-label', `${new Date(cell.dataset.date).getDate()}`);
            
            // Remove any existing listeners before adding new ones
            const newCell = cell.cloneNode(true);
            cell.parentNode.replaceChild(newCell, cell);
            
            newCell.addEventListener('click', () => this.selectDate(new Date(newCell.dataset.date)));
            newCell.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.selectDate(new Date(newCell.dataset.date));
                }
            });
        });
    }

    async selectDate(date) {
        // Ensure the selected date is within the current month
        if (date.getMonth() !== this.currentDate.getMonth() || date.getFullYear() !== this.currentDate.getFullYear()) {
            this.currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
            await this.loadCurrentMonthSteps();
            await this.render();
        }

        // Select the date
        const step = await this.getStepForDate(date);
        if (step) {
            this.stepPanel.open(step);
        }
    }

    async goToToday() {
        const today = new Date();
        const stepNumber = getStepNumberForDate(this.startDate, today);
        if (stepNumber) {
            const dateForStep = getDateForStepNumber(this.startDate, stepNumber);
            this.currentDate = new Date(dateForStep.getFullYear(), dateForStep.getMonth(), 1);
            this.selectedDate = dateForStep;
            await this.loadCurrentMonthSteps();
            await this.render();
            await this.selectDate(this.selectedDate);
        }
    }
} 