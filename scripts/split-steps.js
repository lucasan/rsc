import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file's directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function splitStepsFile() {
    try {
        // Read the main steps file
        const stepsData = await fs.readFile(join(__dirname, '../src/data/steps.json'), 'utf8');
        const steps = JSON.parse(stepsData);
        
        // Create output directory if it doesn't exist
        const outputDir = join(__dirname, '../src/data/steps');
        await fs.mkdir(outputDir, { recursive: true });
        
        // Process each step
        for (const step of steps) {
            const stepNumber = String(step.step_number).replace(/[^0-9]/g, '');
            const fileName = `${stepNumber}.json`;
            
            // Write individual step file
            await fs.writeFile(
                join(outputDir, fileName),
                JSON.stringify(step, null, 2),
                'utf8'
            );
            
            console.log(`Created ${fileName}`);
        }
        
        console.log('All steps have been split into individual files');
    } catch (error) {
        console.error('Error splitting files:', error);
    }
}

splitStepsFile(); 