import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import csv from 'csv-parser';
import * as xlsx from 'xlsx';
import { Readable } from 'stream';
import db from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Routes
app.post('/api/students/import', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
        let studentsData = [];

        if (fileExtension === 'csv') {
            await new Promise((resolve, reject) => {
                const results = [];
                Readable.from(req.file.buffer)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', () => {
                        studentsData = results;
                        resolve();
                    })
                    .on('error', reject);
            });
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            studentsData = xlsx.utils.sheet_to_json(sheet, { defval: "" });
        } else {
            return res.status(400).json({ message: 'Invalid file format. Please upload a CSV or Excel file.' });
        }

        if (studentsData.length === 0) {
            return res.status(400).json({ message: 'Uploaded file is empty' });
        }

        // Validate Headers by normalizing keys from the first row
        const normalizedData = studentsData.map(row => {
            const normalizedRow = {};
            for (const key in row) {
                normalizedRow[key.trim()] = row[key];
            }
            return normalizedRow;
        });

        const firstRow = normalizedData[0];
        const requiredHeaders = ['ID', 'Name', 'Program', 'Year'];
        const hasValidHeaders = requiredHeaders.every(header => Object.keys(firstRow).includes(header));

        if (!hasValidHeaders) {
            return res.status(400).json({
                message: 'Invalid headers. Expected exact columns: ID, Name, Program, Year'
            });
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            // 1. Delete students who DO NOT have any time records
            // We use a subquery to find students with logs, and delete those not in the subquery
            await connection.query(`
                DELETE FROM students 
                WHERE id NOT IN (SELECT DISTINCT student_id FROM time_logs)
            `);

            // 2. Upsert the new students from the uploaded file
            for (const student of normalizedData) {
                // Ignore empty rows
                if (!student.ID || !student.Name) continue;

                await connection.query(`
                    INSERT INTO students (id, name, program, year) 
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                    name = VALUES(name), program = VALUES(program), year = VALUES(year)
                `, [student.ID, student.Name, student.Program, student.Year]);
            }

            await connection.commit();
            res.json({ message: 'Students list successfully updated and database overwritten' });
        } catch (dbError) {
            await connection.rollback();
            throw dbError; // pass to outer try-catch
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Error importing students:', error);
        res.status(500).json({ message: 'Server error during import', error: error.message });
    }
});

app.get('/api/students/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Student not found' });
        }
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ message: 'Server error fetching student data', error: error.message });
    }
});

app.post('/api/time-in', async (req, res) => {
    const { studentId, name, program, year, date, timeIn } = req.body;
    try {
        await db.query(
            'INSERT INTO time_logs (student_id, name, program, year, date, time_in) VALUES (?, ?, ?, ?, ?, ?)',
            [studentId, name, program, year, date, timeIn]
        );
        res.json({ message: 'Time in recorded successfully' });
    } catch (error) {
        console.error('Error recording time in:', error);
        res.status(500).json({ message: 'Server error recording time in', error: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
