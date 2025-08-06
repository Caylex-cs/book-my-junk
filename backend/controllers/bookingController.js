
const Booking = require('../models/booking.js');

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

    Booking.getBookingsByUserId(userId, (err, bookings) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving bookings', error: err });
        }
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
