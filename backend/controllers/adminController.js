
const db = require('../database/database.js');

const getAllBookings = (req, res) => {
    let sql = 'SELECT b.*, u.username FROM bookings b JOIN users u ON b.userId = u.id WHERE 1=1';
    const params = [];

    // Search by customer name (username)
    if (req.query.search) {
        sql += ' AND u.username LIKE ?';
        params.push(`%${req.query.search}%`);
    }

    // Filter by status
    if (req.query.status && req.query.status !== '') {
        sql += ' AND b.status = ?';
        params.push(req.query.status);
    }

    // Filter by junk type
    if (req.query.junkType && req.query.junkType !== '') {
        sql += ' AND b.junkType LIKE ?';
        params.push(`%${req.query.junkType}%`);
    }

    // Filter by date range
    if (req.query.dateFilter && req.query.dateFilter !== '') {
        const now = new Date();
        let startDate, endDate;

        switch (req.query.dateFilter) {
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
            // No 'past' filter needed as we're filtering by future dates
        }

        if (startDate && endDate) {
            sql += ' AND b.pickupDate BETWEEN ? AND ?';
            params.push(startDate.toISOString());
            params.push(endDate.toISOString());
        }
    }

    // Order by pickupDate (newest first)
    sql += ' ORDER BY b.pickupDate DESC';

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving all bookings', error: err });
        }
        res.status(200).json(rows);
    });
};

const updateBookingStatus = (req, res) => {
    const bookingId = req.params.id;
    const { status } = req.body;

    const sql = 'UPDATE bookings SET status = ? WHERE id = ?';
    db.run(sql, [status, bookingId], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error updating booking status', error: err });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Booking not found.' });
        }
        res.status(200).json({ message: 'Booking status updated successfully.' });
    });
};

module.exports = {
    getAllBookings,
    updateBookingStatus
};
