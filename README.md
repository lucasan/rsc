# Steps Calendar

Steps Calendar is a web application designed to help users track daily steps over a year-long program. The application is built using modern web technologies and provides a user-friendly interface for navigating through daily steps.

## Features

- **Daily Step Tracking:** View and track daily steps for a 365-day program.
- **Responsive Design:** Works seamlessly on both desktop and mobile devices.
- **Dynamic Navigation:** Navigate through months and view specific steps using URL parameters.
- **Customizable Start Date:** Set the initial program start date using a global variable.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:lucasan/rsc.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Usage

#### Running the Development Server

To start the development server, run:

```bash
npm run dev
```

This will start the server and open the application in your default web browser.

#### Building for Production

To build the application for production, run:

```bash
npm run build
```

This will generate the production-ready files in the `dist` directory.

#### Deploying to GitHub Pages

To deploy the application to GitHub Pages, run:

```bash
npm run deploy
```

## Configuration

### Program Start Date

The program's start date can be configured in `src/js/config.js`:

```javascript
export const CONFIG = {
    PROGRAM_START_DATE: new Date('2025-01-30'),
    // other configuration options...
};
```

This date determines "Step 1" of the program. All subsequent steps are calculated from this date.

### Step Data Structure

Steps are stored as individual JSON files in `src/data/steps/`. Each step file follows this format:

```json
{
  "step_number": "1",
  "review_and_appreciate": "Text for review section...",
  "step_of_the_day": {
    "title": "Step Title",
    "content": "Main step content..."
  },
  "action_step": "Action step text...",
  "journal_entry": "Journal prompt..."
}
```

## Project Structure

```
project-root/
├── src/
│ ├── js/
│ │ ├── components/    # UI components
│ │ ├── services/      # Data and utility services
│ │ └── utils/         # Helper functions
│ ├── data/
│ │ └── steps/         # Step JSON files
│ ├── style.css        # Global styles
│ └── main.js          # Application entry point
├── dist/              # Production build output
├── scripts/           # Build and utility scripts
└── index.html         # Main HTML template
```

## Usage

### Navigation

- **Mouse**: Click on dates to view steps
- **Keyboard**: 
  - Arrow keys to move between dates
  - Enter/Space to select a date
  - Tab to navigate focusable elements
  - Esc to close step panel

### Step Panel

- Opens automatically when a valid step is selected
- Displays step details including title, content, and actions
- Closes with the X button or by clicking outside

## Development

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-directory]
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run preview`: Preview production build locally

## Deployment

The `dist` folder contains all necessary files for deployment. Upload its contents to any static hosting service:

- GitHub Pages
- Netlify
- Vercel
- Any web server

## Troubleshooting

Common issues and solutions:

1. **Steps not loading**
   - Check network requests
   - Verify JSON file structure
   - Clear browser cache

2. **Build failures**
   - Ensure all dependencies are installed
   - Check for syntax errors
   - Verify file paths

3. **Development server issues**
   - Clear npm cache
   - Check port availability
   - Verify Node.js version