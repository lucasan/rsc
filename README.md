# 365 Steps Calendar

An interactive calendar application designed to display daily steps in a year-long program. The calendar provides an intuitive interface to navigate through steps, with features like keyboard navigation, step preview, and responsive design.

## Features

- 📅 Monthly calendar view
- 🔍 Step preview panel
- ⌨️ Full keyboard navigation
- 📱 Responsive design
- 🚀 Fast loading with data caching
- ♿ Accessibility features

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