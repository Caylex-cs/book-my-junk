
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/Users/kanaktilotia/Documents/Cursor/book-my-junk-main 2/backend/database/main.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the main database.');
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        junkType TEXT NOT NULL,
        pickupDate TEXT NOT NULL,
        address TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        price REAL,
        FOREIGN KEY (userId) REFERENCES users (id)
    )`);
});

module.exports = db;
