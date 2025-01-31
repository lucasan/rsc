import './style.css'
import { getStepNumberForDate, getDateForStepNumber } from './js/utils/dateUtils'
import Calendar from './js/components/Calendar.js'
import { CONFIG } from './js/config.js'
import Logger from './js/services/Logger.js'

const logger = new Logger('Main')

// Test UI for date utilities
function createTestUI() {
    const testDiv = document.createElement('div')
    testDiv.className = 'mt-8 p-4 bg-white rounded-lg shadow'
    testDiv.innerHTML = `
        <h2 class="text-xl font-bold mb-4">Date Utils Test</h2>
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Start Date:</label>
                <input type="date" id="startDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Current Date:</label>
                <input type="date" id="currentDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
            </div>
            <div id="result" class="mt-4 p-4 bg-gray-50 rounded"></div>
        </div>
    `
    document.getElementById('app').appendChild(testDiv)

    // Add event listeners
    const startDateInput = document.getElementById('startDate')
    const currentDateInput = document.getElementById('currentDate')
    const resultDiv = document.getElementById('result')

    function updateResult() {
        const startDate = new Date(startDateInput.value)
        const currentDate = new Date(currentDateInput.value)
        
        if (startDateInput.value && currentDateInput.value) {
            const stepNumber = getStepNumberForDate(startDate, currentDate)
            const calculatedDate = stepNumber ? getDateForStepNumber(startDate, stepNumber) : null
            
            resultDiv.innerHTML = `
                <p>Step Number: ${stepNumber || 'Out of range'}</p>
                ${stepNumber ? `<p>Verified Date: ${calculatedDate.toLocaleDateString()}</p>` : ''}
            `
        }
    }

    startDateInput.addEventListener('change', updateResult)
    currentDateInput.addEventListener('change', updateResult)

    // Set default dates
    startDateInput.value = new Date().toISOString().split('T')[0]
    currentDateInput.value = new Date().toISOString().split('T')[0]
    updateResult()
}

// Initialize
async function init() {
    try {
        // Initialize calendar
        const calendarContainer = document.getElementById('calendar')
        const calendar = new Calendar(calendarContainer)

        // Listen for date selection
        calendarContainer.addEventListener('dateSelected', (e) => {
            logger.debug('Selected date:', e.detail.date)
        })

    } catch (error) {
        logger.error('Error initializing calendar:', error)
    }
}

init() 