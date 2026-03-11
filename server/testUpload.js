import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runTest() {
    try {
        console.log('Testing CSV Upload...');

        // 1. Create a mock CSV
        const csvContent = `ID,Name,Program,Year
TEST-001,John Doe,BSCS,3
TEST-002,Jane Smith,BSIT,2
TEST-003,Bob Brown,BSCpE,1`;

        fs.writeFileSync('test1.csv', csvContent);

        // 2. Upload the CSV
        const formData = new FormData();
        formData.append('file', fs.createReadStream('test1.csv'));

        const response = await fetch('http://localhost:5000/api/students/import', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        console.log('Valid CSV Response:', response.status, result);

        // 3. Create a bad CSV (missing headers)
        console.log('\\nTesting Invalid CSV Upload...');
        const badCsvContent = `ID,FirstName,Program,Year
TEST-004,Alice,BSCS,1`;
        fs.writeFileSync('bad.csv', badCsvContent);

        const badFormData = new FormData();
        badFormData.append('file', fs.createReadStream('bad.csv'));

        const badResponse = await fetch('http://localhost:5000/api/students/import', {
            method: 'POST',
            body: badFormData,
        });

        const badResult = await badResponse.json();
        console.log('Invalid CSV Response:', badResponse.status, badResult);

        console.log('\\nChecking Database contents directly via db.js...');
        const db = (await import('./db.js')).default;
        const [rows] = await db.query('SELECT * FROM students WHERE id LIKE "TEST-%"');
        console.log('DB rows inserted:', rows);

        // Clean up mock files
        fs.unlinkSync('test1.csv');
        fs.unlinkSync('bad.csv');
        process.exit(0);
    } catch (e) {
        console.error('Test failed:', e);
        process.exit(1);
    }
}

// Wait a bit for server to be ready
setTimeout(runTest, 2000);
