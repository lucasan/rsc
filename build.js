import { build } from 'vite';
import pkg from 'fs-extra';
const { readdir, copy, ensureDir } = pkg;
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildLibrary() {
    try {
        // Run Vite build
        console.log('Building library...');
        await build();

        // Copy and modify index.html for production
        console.log('Creating production index.html...');
        let indexContent = await pkg.readFile('index.html', 'utf8');
        
        // Replace the development script with production one
        indexContent = indexContent.replace(
            '<script type="module" src="/src/main.js"></script>',
            `<link rel="stylesheet" href="./resilience-calendar.css">
            <script src="./resilience-calendar.iife.js"></script>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    initResilienceCalendar({
                        container: 'calendar',
                        projectId: 'resilience-cal',
                        startDate: '2025-01-14T00:00:00.000Z'
                    });
                });
            </script>`
        );

        await pkg.writeFile('dist/index.html', indexContent);

        // Ensure data directory exists
        await ensureDir('dist/src/data');

        // Copy months titles data
        console.log('Copying months titles data...');
        await copy('src/data/months_titles.json', 'dist/src/data/months_titles.json');

        console.log('Build complete! The dist folder contains:');
        const files = await readdir('dist');
        console.log(files);

    } catch (e) {
        console.error('Build failed:', e);
        process.exit(1);
    }
}

function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            console.log(stdout);
            resolve();
        });
    });
}

function copyDir(src, dest) {
    return new Promise((resolve, reject) => {
        copy(src, dest, {
            recursive: true,
            overwrite: true
        }, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

buildLibrary(); 