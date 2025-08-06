
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

router.post('/signup', authController.signup);
router.post('/admin/login', authController.adminLogin);
router.post('/customer/login', authController.customerLogin);

module.exports = router;
