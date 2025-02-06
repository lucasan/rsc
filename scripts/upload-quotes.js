import admin from 'firebase-admin';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../src/data/resilience-cal-firebase-adminsdk-fbsvc-a1c95f609e.json');
const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadQuotes() {
    try {
        // Read the JSON file
        const quotesPath = path.join(__dirname, '../src/data/months_titles.json');
        const quotesData = await fs.readFile(quotesPath, 'utf8');
        const monthsData = JSON.parse(quotesData)[0];

        console.log('Uploading quotes to Firestore...');

        // Create a batch for all operations
        const batch = db.batch();

        // Prepare all month documents
        for (const [month, title] of Object.entries(monthsData)) {
            const monthId = month.toLowerCase();
            const monthRef = db.collection('months').doc(monthId);
            
            console.log(`Preparing ${monthId}...`);
            
            batch.set(monthRef, {
                title: title
            }, { merge: true });
        }

        // Commit the batch
        await batch.commit();
        console.log('All quotes uploaded successfully!');

    } catch (error) {
        console.error('Error uploading quotes:', error);
        process.exit(1);
    } finally {
        // Clean up Firebase connection
        await admin.app().delete();
    }
}

uploadQuotes(); 