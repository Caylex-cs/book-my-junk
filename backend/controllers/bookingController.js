
const Booking = require('../models/booking.js');
const db = require('../database/database.js');

const createBooking = (req, res) => {
    const { junkType, pickupDate, address } = req.body;
    const userId = req.userId; // From auth middleware

    Booking.createBooking(userId, junkType, pickupDate, address, (err, booking) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating booking', error: err });
        }
        res.status(201).json({ message: 'Booking created successfully', bookingId: booking.id });
    });
};

const getBookings = (req, res) => {
    const userId = req.userId; // From auth middleware
    const { search, status, dateFilter } = req.query;

    let sql = 'SELECT * FROM bookings WHERE userId = ?';
    const params = [userId];

    if (search) {
        sql += ' AND (junkType LIKE ? OR address LIKE ?)';
        params.push(`%${search}%`);
        params.push(`%${search}%`);
    }

    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }

    if (dateFilter) {
        const now = new Date();
        let startDate, endDate;

        switch (dateFilter) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
                break;
            case 'week':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
                break;
            case 'past':
                endDate = now; // All dates up to now
                startDate = new Date(0); // Epoch, very old date
                break;
        }

        if (startDate && endDate) {
            sql += ' AND pickupDate BETWEEN ? AND ?';
            params.push(startDate.toISOString());
            params.push(endDate.toISOString());
        }
    }

    sql += ' ORDER BY pickupDate DESC'; // Sort by date, most recent first

    console.log('SQL Query:', sql);
    console.log('SQL Params:', params);

    db.all(sql, params, (err, bookings) => {
        if (err) {
            console.error('Error retrieving bookings:', err);
            return res.status(500).json({ message: 'Error retrieving bookings', error: err });
        }
        console.log('Bookings fetched for user:', userId, bookings);
        res.status(200).json(bookings);
    });
};

const updateBooking = (req, res) => {
    const bookingId = req.params.id;
    const { junkType, pickupDate, address, status } = req.body;
    const userId = req.userId; // From auth middleware

    Booking.updateBooking(bookingId, userId, junkType, pickupDate, address, status, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating booking', error: err });
        }
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Booking not found or not authorized to update.' });
        }
        res.status(200).json({ message: 'Booking updated successfully.' });
    });
};

const deleteBooking = (req, res) => {
    const bookingId = req.params.id;
    const userId = req.userId; // From auth middleware

    Booking.deleteBooking(bookingId, userId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting booking', error: err });
        }
        if (result.changes === 0) {
            return res.status(404).json({ message: 'Booking not found or not authorized to delete.' });
        }
        res.status(200).json({ message: 'Booking deleted successfully.' });
    });
};

module.exports = {
    createBooking,
    getBookings,
    updateBooking,
    deleteBooking
};
