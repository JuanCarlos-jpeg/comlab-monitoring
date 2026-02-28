import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/status', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json({ status: 'API is running', db: 'Connected successfully' });
    } catch (err) {
        res.status(500).json({ status: 'API is running', db: 'Connection failed', error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
