const express = require('express');
const { registerCustomer,registerVendor, login, getUser } = require('../controllers/authController');
const {protect} = require('../middleWare/authMiddleware');

const router = express.Router();

router.post('/register/customer', registerCustomer);

router.post('/register/vendor', registerVendor);

router.post('/login', login);

router.get('/user', protect, getUser);

module.exports = router;
