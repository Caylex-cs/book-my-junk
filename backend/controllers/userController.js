
const User = require('../models/user.js');
const Booking = require('../models/booking.js');
const bcrypt = require('bcryptjs');

const getUserProfile = (req, res) => {
    User.getUserById(req.userId, (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ username: user.username, role: user.role });
    });
};

const updateUserProfile = (req, res) => {
    const { username } = req.body;
    User.updateUser(req.userId, username, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating user profile', error: err });
        }
        if (result.changes === 0) {
            return res.status(404).json({ message: 'User not found or no changes made.' });
        }
        res.status(200).json({ message: 'Profile updated successfully.' });
    });
};

const changePassword = (req, res) => {
    const { currentPassword, newPassword } = req.body;

    User.getUserById(req.userId, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        const passwordIsValid = bcrypt.compareSync(currentPassword, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Incorrect current password.' });
        }

        User.updatePassword(req.userId, newPassword, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error changing password', error: err });
            }
            if (result.changes === 0) {
                return res.status(404).json({ message: 'User not found or no changes made.' });
            }
            res.status(200).json({ message: 'Password changed successfully.' });
        });
    });
};

const deleteUserAccount = (req, res) => {
    User.deleteUser(req.userId, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting account', error: err });
        }
        if (result.changes === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'Account deleted successfully.' });
    });
};

const getDashboardStats = (req, res) => {
    Booking.getBookingsByUserId(req.userId, (err, bookings) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching dashboard stats', error: err });
        }

        let totalPickups = bookings.length;
        let upcomingPickups = 0;
        let totalSpent = 0;

        bookings.forEach(booking => {
            if (booking.status === 'pending' || booking.status === 'confirmed') {
                upcomingPickups++;
            }
            totalSpent += booking.price || 0; // Ensure price is a number, default to 0 if null/undefined
        });

        res.status(200).json({
            totalPickups,
            upcomingPickups,
            totalSpent: totalSpent.toFixed(2) // Format to 2 decimal places
        });
    });
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    changePassword,
    deleteUserAccount,
    getDashboardStats
};
