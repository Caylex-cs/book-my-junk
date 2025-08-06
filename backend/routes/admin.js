
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');
const { protect, isAdmin } = require('../middleware/authMiddleware.js');

router.get('/bookings', protect, isAdmin, adminController.getAllBookings);
router.put('/bookings/:id', protect, isAdmin, adminController.updateBookingStatus);
router.get('/dashboard-stats', protect, isAdmin, adminController.getDashboardStats);

module.exports = router;
