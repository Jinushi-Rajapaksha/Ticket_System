const express = require('express');
const {
  addTickets,
  startVendor,
  stopVendor,
  getHistory
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleWare/authMiddleware');
const { getVendorByUser } = require('../middleWare/vendorMiddleware');
const { check } = require('express-validator');

const router = express.Router();

router.use(protect, authorize('vendor'), getVendorByUser);

// Add tickets with validation
router.post(
  '/addTickets',
  [
    check('ticketAmount', 'Please provide a valid ticket amount.')
      .isInt({ gt: 0 })
      .withMessage('Ticket amount must be a positive integer.'),
  ],
  addTickets
);

router.post('/start', startVendor);

router.post('/stop', stopVendor);

router.get('/history', getHistory);

module.exports = router;
