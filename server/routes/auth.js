const express = require('express');
const { registerCustomer,registerVendor, login, getUser } = require('../controllers/authController');
const {protect} = require('../middleWare/authMiddleware');

const router = express.Router();

// Customer Registration
router.post('/register/customer', registerCustomer);

// Vendor Registration
router.post('/register/vendor', registerVendor);

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/user', protect, getUser);

module.exports = router;
