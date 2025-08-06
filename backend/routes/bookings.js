
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/', protect, bookingController.createBooking);
router.get('/', protect, bookingController.getBookings);
router.put('/:id', protect, bookingController.updateBooking);
router.delete('/:id', protect, bookingController.deleteBooking);

module.exports = router;
