import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root', // Set to root as requested
    database: process.env.DB_NAME || 'comlab_monitoring',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true // Ensure dates stay as strings to prevent timezone shifts
});

export default pool;
