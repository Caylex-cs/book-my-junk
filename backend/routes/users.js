
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', protect, userController.updateUserProfile);
router.put('/password', protect, userController.changePassword);
router.delete('/', protect, userController.deleteUserAccount);
router.get('/dashboard-stats', protect, userController.getDashboardStats);

module.exports = router;
