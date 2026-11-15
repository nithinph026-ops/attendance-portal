// db.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database('./attendance.db');

db.serialize(() => {
    // 1. Create Students Table
    db.run(`CREATE TABLE IF NOT EXISTS students (
        srn TEXT PRIMARY KEY,
        name TEXT,
        section TEXT
    )`);

    // 2. Create Teachers Table
    db.run(`CREATE TABLE IF NOT EXISTS teachers (
        teacher_id TEXT PRIMARY KEY,
        name TEXT,
        password_hash TEXT,
        subjects TEXT
    )`);

    // 3. Create Attendance Table
    db.run(`CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        srn TEXT,
        section TEXT,
        date TEXT,
        status TEXT,
        subject TEXT,
        FOREIGN KEY(srn) REFERENCES students(srn)
    )`);

    // --- Insert All 59 Students (1ads03 Section) ---
    const studentStmt = db.prepare("INSERT OR IGNORE INTO students (srn, name, section) VALUES (?, ?, ?)");
    const students = [
        ["26SUUBEADS122", "LIKITH SIDDESH R", "1ads03"],
        ["26SUUBEADS123", "LOKESH S", "1ads03"],
        ["26SUUBEADS124", "MALLEM SAI SUSHANTH", "1ads03"],
        ["26SUUBEADS125", "MANASA T D", "1ads03"],
        ["26SUUBEADS126", "MANASA Y HIREMATH", "1ads03"],
        ["26SUUBEADS127", "MANOHAR", "1ads03"],
        ["26SUUBEADS128", "MANOJ E", "1ads03"],
        ["26SUUBEADS129", "MANUSHREE S M", "1ads03"],
        ["26SUUBEADS130", "MAYSAA IMEN", "1ads03"],
        ["26SUUBEADS131", "MEDA VENKATA VAIBHAV", "1ads03"],
        ["26SUUBEADS132", "MEDHA L", "1ads03"],
        ["26SUUBEADS133", "MEGHANA E", "1ads03"],
        ["26SUUBEADS134", "MEGHANA K C", "1ads03"],
        ["26SUUBEADS135", "MIDHUN KRISHNA M", "1ads03"],
        ["26SUUBEADS136", "MITHUN B S", "1ads03"],
        ["26SUUBEADS137", "MOHAMMED HATIF", "1ads03"],
        ["26SUUBEADS138", "MOHAMMED NAFIH", "1ads03"],
        ["26SUUBEADS139", "MOHAMMED RAFE Y M", "1ads03"],
        ["26SUUBEADS140", "MOHAMMED SINAN C H", "1ads03"],
        ["26SUUBEADS141", "MOHAMMED UMMAR FAROOQ", "1ads03"],
        ["26SUUBEADS142", "MOHITH REDDY P", "1ads03"],
        ["26SUUBEADS143", "MOHITH S", "1ads03"],
        ["26SUUBEADS144", "MOKSHA TEJASWI SANNIDHI", "1ads03"],
        ["26SUUBEADS145", "MONISH D E YEJAMAN", "1ads03"],
        ["26SUUBEADS146", "MONISHA R", "1ads03"],
        ["26SUUBEADS147", "MULA RAJA MUNI REDDY", "1ads03"],
        ["26SUUBEADS148", "MULLA MAHAMMAD MUDDASIR", "1ads03"],
        ["26SUUBEADS149", "MUNSHI ISMEHAN AZAD", "1ads03"],
        ["26SUUBEADS150", "MUSKAN GUPTA", "1ads03"],
        ["26SUUBEADS151", "NAGAMALLI SAHITHI", "1ads03"],
        ["26SUUBEADS152", "NAGEDLA DIVYA SREE", "1ads03"],
        ["26SUUBEADS153", "NAMRATHA B S", "1ads03"],
        ["26SUUBEADS154", "NANDHYALA BHARATH BHARATH", "1ads03"],
        ["26SUUBEADS155", "NARASIMHA K G", "1ads03"],
        ["26SUUBEADS156", "NARESH SEERVI", "1ads03"],
        ["26SUUBEADS157", "NAVEEN H M", "1ads03"],
        ["26SUUBEADS158", "NAYANA N N", "1ads03"],
        ["26SUUBEADS159", "NIKHIL GOWDA C", "1ads03"],
        ["26SUUBEADS160", "NIKHIL VENKATESH", "1ads03"],
        ["26SUUBEADS161", "NITHIN K NAIR", "1ads03"],
        ["26SUUBEADS162", "NITHIN N", "1ads03"],
        ["26SUUBEADS163", "NITHIN P H", "1ads03"],
        ["26SUUBEADS164", "NITHIN R", "1ads03"],
        ["26SUUBEADS165", "NITHIN R", "1ads03"],
        ["26SUUBEADS166", "NITHYA SHREE M S", "1ads03"],
        ["26SUUBEADS167", "NYPUNYA CHANDAN J A", "1ads03"],
        ["26SUUBEADS168", "P YASHWANTH SAI", "1ads03"],
        ["26SUUBEADS169", "PAVAN V", "1ads03"],
        ["26SUUBEADS170", "PAWAN KUMAR", "1ads03"],
        ["26SUUBEADS171", "POLAMREDDY HARSHINI", "1ads03"],
        ["26SUUBEADS172", "PRAJJWAL J", "1ads03"],
        ["26SUUBEADS173", "PRAJWAL C S", "1ads03"],
        ["26SUUBEADS174", "PRAJWAL G", "1ads03"],
        ["26SUUBEADS175", "PRAJWAL PARAPPA SHIDLYALI", "1ads03"],
        ["26SUUBEADS176", "PRANAY PAWAR", "1ads03"],
        ["26SUUBEADS177", "PRAVIN KUMAR S", "1ads03"],
        ["26SUUBEADS178", "PREETHAM M", "1ads03"],
        ["26SUUBEADS179", "PREETHAM GOWDA M S", "1ads03"],
        ["26SUUBEADS180", "PREETHAM K", "1ads03"]
    ];

    students.forEach(s => studentStmt.run(s[0], s[1], s[2]));
    studentStmt.finalize();

    // --- Insert Teachers with their assigned subjects and login names ---
    const defaultPasswordHash = bcrypt.hashSync("teacher123", 10);
    const teacherStmt = db.prepare("INSERT OR IGNORE INTO teachers (teacher_id, name, password_hash, subjects) VALUES (?, ?, ?, ?)");
    
    const teachers = [
        ["tejaswini", "Mrs. Tejaswini NS", defaultPasswordHash, "MAT"],
        ["nataraj", "Mr. Nataraj", defaultPasswordHash, "MES"],
        ["raghavendra", "Mr. Raghavendra N", defaultPasswordHash, "RES"],
        ["shivakumar", "Mr. Shivakumar E", defaultPasswordHash, "PSC"],
        ["gaganchandra", "Mr. Gaganchandra J Gowda", defaultPasswordHash, "BEC"],
        ["rajiv", "Dr. Rajiv S R", defaultPasswordHash, "ENVS"],
        ["hrd_trainer", "HRD Trainer", defaultPasswordHash, "ENG"],
        ["banushree", "Banushree", defaultPasswordHash, "ICN"],
        ["chandan", "Chandan", defaultPasswordHash, "KAN"]
    ];

    teachers.forEach(t => teacherStmt.run(t[0], t[1], t[2], t[3]));
    teacherStmt.finalize();

    console.log("Database initialized with 59 students and 9 teachers!");
});

module.exports = db;