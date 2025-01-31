import pkg from 'fs-extra';
const { readdir, copy } = pkg;
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function build() {
    try {
        // Run Vite build
        console.log('Building application...');
        await execPromise('npx vite build');

        // Copy steps data
        console.log('Copying steps data...');
        await copyDir('./src/data/steps', './dist/src/data/steps');


        // Copy months titles data
        console.log('Copying months titles data...');
        await copy('src/data/months_titles.json', 'dist/src/data/months_titles.json');

        console.log('Build complete! The dist folder contains:');
        const files = await readdir('dist');
        console.log(files);

    } catch (error) {
        console.error('Build failed:', error);
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

build(); 