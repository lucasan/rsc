import admin from 'firebase-admin';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file's directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../src/data/resilience-cal-firebase-adminsdk-fbsvc-a1c95f609e.json');
const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importSteps() {
  try {
    // Read all files from the steps directory
    const stepsDir = path.join(__dirname, '../src/data/steps');
    const files = await fs.readdir(stepsDir);
    
    // Process each file
    for (const file of files) {
      if (file.endsWith('.json')) {
        // Read the file content
        const content = await fs.readFile(path.join(stepsDir, file), 'utf8');
        const data = JSON.parse(content);
        
        // Get the step number from the filename (removing .json)
        const stepNumber = path.basename(file, '.json');
        
        // Add to Firestore
        await db.collection('steps').doc(stepNumber).set(data);
        console.log(`Imported step ${stepNumber}`);
      }
    }
    
    console.log('Import completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importSteps(); 