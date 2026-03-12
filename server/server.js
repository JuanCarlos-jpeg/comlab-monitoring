import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import csv from 'csv-parser';
import * as xlsx from 'xlsx';
import { Readable } from 'stream';
import bcrypt from 'bcryptjs';
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

        // Validate Headers by normalizing keys from the first row and trimming values
        const normalizedData = studentsData.map(row => {
            const normalizedRow = {};
            for (const key in row) {
                // Ensure values are nicely trimmed, specifically vital for keys like ID
                normalizedRow[key.trim()] = typeof row[key] === 'string' ? row[key].trim() : String(row[key] || '').trim();
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

            // 1. Clear existing time_logs and students completely
            await connection.query(`DELETE FROM time_logs`);
            await connection.query(`DELETE FROM students`);

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

// ─── Staff Login ──────────────────────────────────────────────────────────────

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Fallback default account (env-configurable) — acts as the master_admin
    const defaultUser = process.env.DEFAULT_ADMIN_USER || 'admin';
    const defaultPass = process.env.DEFAULT_ADMIN_PASS || 'admin123';
    if (username === defaultUser && password === defaultPass) {
        return res.json({ message: 'Login successful.', user: { id: 0, username: defaultUser, role: 'master_admin' } });
    }

    try {
        const [rows] = await db.query(
            'SELECT id, username, password, role FROM admin_credentials WHERE username = ?',
            [username]
        );
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
        const match = await bcrypt.compare(password, rows[0].password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }
        res.json({ message: 'Login successful.', user: { id: rows[0].id, username: rows[0].username, role: rows[0].role } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



// ─── Admin Credentials (Staff) ────────────────────────────────────────────────

app.get('/api/admin-credentials', async (req, res) => {
    // In a real app we would use middleware to get requester ID and check their role.
    // Since we're keeping it simple, the frontend passes the requester's role in query params.
    const requesterRole = req.query.role || 'staff';
    try {
        let query = 'SELECT id, username, role, created_at FROM admin_credentials ORDER BY id ASC';

        // admin can't see master_admin or other admins (depending on specific requirement, here we'll let them see staff and maybe other admins if they want, but master_admin is hidden)
        // For strict 3-tier: admin manages staff. So admin only sees role='staff'
        if (requesterRole === 'admin') {
            query = "SELECT id, username, role, created_at FROM admin_credentials WHERE role = 'staff' ORDER BY id ASC";
        } else if (requesterRole === 'staff') {
            // staff shouldn't even call this, but if they do, return empty or 403
            return res.status(403).json({ message: 'Forbidden' });
        }

        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching admin credentials:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/admin-credentials', async (req, res) => {
    const { username, password, role, requesterRole } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Authorization checks
    const targetRole = role || 'staff';
    if (requesterRole === 'staff') {
        return res.status(403).json({ message: 'Staff cannot create accounts.' });
    }
    if (requesterRole === 'admin' && targetRole !== 'staff') {
        return res.status(403).json({ message: 'Admins can only create staff accounts.' });
    }

    try {
        const hashed = await bcrypt.hash(password, 12);
        await db.query(
            'INSERT INTO admin_credentials (username, password, role) VALUES (?, ?, ?)',
            [username, hashed, targetRole]
        );
        res.status(201).json({ message: 'Staff account created successfully.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username already exists.' });
        }
        console.error('Error creating admin credential:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.delete('/api/admin-credentials/:id', async (req, res) => {
    const requesterRole = req.query.role || 'staff';
    const targetId = req.params.id;

    if (requesterRole === 'staff') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        // Find target user's role
        const [targetRows] = await db.query('SELECT role FROM admin_credentials WHERE id = ?', [targetId]);
        if (targetRows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const targetRole = targetRows[0].role;

        // admin cannot delete master_admin or admin
        if (requesterRole === 'admin' && targetRole !== 'staff') {
            return res.status(403).json({ message: 'Cannot delete an account with higher or equal privileges.' });
        }

        const [result] = await db.query('DELETE FROM admin_credentials WHERE id = ?', [targetId]);
        res.json({ message: 'Staff account deleted.' });
    } catch (error) {
        console.error('Error deleting admin credential:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ─── Students ─────────────────────────────────────────────────────────────────

app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM students ORDER BY id ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/students', async (req, res) => {
    const { id, name, program, year } = req.body;
    if (!id || !name || !program || !year) {
        return res.status(400).json({ message: 'ID, name, program, and year are required.' });
    }
    if (!/^\d+$/.test(String(id))) {
        return res.status(400).json({ message: 'Student ID must be numeric.' });
    }
    try {
        await db.query(
            'INSERT INTO students (id, name, program, year) VALUES (?, ?, ?, ?)',
            [String(id), name, program, String(year)]
        );
        res.status(201).json({ message: 'Student created successfully.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Student ID already exists.' });
        }
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Student not found.' });
        }
        res.json({ message: 'Student deleted.' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
