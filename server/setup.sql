-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS comlab_monitoring;
USE comlab_monitoring;

-- Create the students table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    program VARCHAR(50) NOT NULL,
    year VARCHAR(20) NOT NULL
);

-- Create the time_logs table
CREATE TABLE IF NOT EXISTS time_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    program VARCHAR(50),
    year VARCHAR(20),
    date DATE NOT NULL,
    time_in TIME NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE IF NOT EXISTS admin_credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);