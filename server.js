// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves frontend files

// 1. Get Student Name by SRN
app.get('/api/student/:srn', (req, res) => {
    const { srn } = req.params;
    db.get("SELECT name, section FROM students WHERE srn = ?", [srn], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: "Student not found" });
        res.json(row);
    });
});

// 2. Teacher Login (Sends subjects back)
app.post('/api/teacher/login', (req, res) => {
    const { teacher_id, password } = req.body;
    db.get("SELECT * FROM teachers WHERE teacher_id = ?", [teacher_id], (err, teacher) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!teacher || !bcrypt.compareSync(password, teacher.password_hash)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.json({ 
            message: "Login successful", 
            teacher: { 
                id: teacher.teacher_id, 
                name: teacher.name,
                subjects: teacher.subjects // e.g. "Web Development, Kotlin"
            } 
        });
    });
});

// 3. Get Student Attendance by Date
app.get('/api/attendance/student/:srn', (req, res) => {
    const { srn } = req.params;
    const { date } = req.query;

    let query = "SELECT date, status, subject FROM attendance WHERE srn = ?";
    let params = [srn];

    if (date) {
        query += " AND date = ?";
        params.push(date);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 4. Get Student list by Section & check lock status for specific subject
app.get('/api/attendance/section-status', (req, res) => {
    const { section, date, subject } = req.query;
    
    db.all("SELECT * FROM attendance WHERE section = ? AND date = ? AND subject = ?", [section, date, subject], (err, records) => {
        if (err) return res.status(500).json({ error: err.message });

        if (records.length > 0) {
            // Attendance already locked for this subject and date
            return res.json({ locked: true, records });
        } else {
            // Return student list to mark
            db.all("SELECT srn, name FROM students WHERE section = ?", [section], (err, students) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ locked: false, students });
            });
        }
    });
});

// 5. Submit Attendance (Lock it)
app.post('/api/attendance/submit', (req, res) => {
    const { section, date, subject, records } = req.body;

    db.get("SELECT 1 FROM attendance WHERE section = ? AND date = ? AND subject = ? LIMIT 1", [section, date, subject], (err, row) => {
        if (row) return res.status(400).json({ message: "Attendance for this date, section, and subject is locked!" });

        const stmt = db.prepare("INSERT INTO attendance (srn, section, date, status, subject) VALUES (?, ?, ?, ?, ?)");
        records.forEach(r => {
            stmt.run(r.srn, section, date, r.status, subject);
        });
        stmt.finalize();

        res.json({ message: "Attendance successfully submitted and locked!" });
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));