
const db = require('../database/database.js');

const createBooking = (userId, junkType, pickupDate, address, price, callback) => {
    const sql = 'INSERT INTO bookings (userId, junkType, pickupDate, address, price) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [userId, junkType, pickupDate, address, price], function(err) {
        callback(err, { id: this.lastID });
    });
};

const getBookingsByUserId = (userId, callback) => {
    const sql = 'SELECT * FROM bookings WHERE userId = ?';
    db.all(sql, [userId], (err, rows) => {
        console.log('Raw rows from db.all:', rows);
        callback(err, rows);
    });
};

const updateBooking = (bookingId, userId, junkType, pickupDate, address, status, price, callback) => {
    const sql = 'UPDATE bookings SET junkType = ?, pickupDate = ?, address = ?, status = ?, price = ? WHERE id = ? AND userId = ?';
    db.run(sql, [junkType, pickupDate, address, status, price, bookingId, userId], function(err) {
        callback(err, { changes: this.changes });
    });
};

const deleteBooking = (bookingId, userId, callback) => {
    const sql = 'DELETE FROM bookings WHERE id = ? AND userId = ?';
    db.run(sql, [bookingId, userId], function(err) {
        callback(err, { changes: this.changes });
    });
};

module.exports = {
    createBooking,
    getBookingsByUserId,
    updateBooking,
    deleteBooking
};
