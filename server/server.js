import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
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
