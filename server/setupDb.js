import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function setup() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Hoshimachi_0322',
    });

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'comlab_monitoring'}\``);
        await connection.query(`USE \`${process.env.DB_NAME || 'comlab_monitoring'}\``);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS students (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                program VARCHAR(50) NOT NULL,
                year VARCHAR(20) NOT NULL
            )
        `);
        console.log('Table `students` created or already exists.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS time_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id VARCHAR(50) NOT NULL,
                name VARCHAR(100) NOT NULL,
                program VARCHAR(50),
                year VARCHAR(20),
                date DATE NOT NULL,
                time_in TIME NOT NULL,
                FOREIGN KEY (student_id) REFERENCES students(id)
            )
        `);
        console.log('Table `time_logs` created or already exists.');

    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await connection.end();
    }
}

setup();
