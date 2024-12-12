const express = require('express');
const { purchaseTickets, cancelTicket,viewPurchasedTickets } = require('../controllers/customerController');
const { protect, authorize } = require('../middleWare/authMiddleware');
const { getCustomerByUser } = require('../middleWare/customerMiddleware');
const { check } = require('express-validator');

const router = express.Router();

// Middleware to get customer by user
router.use(protect, authorize('customer'), getCustomerByUser);

router.post(
    '/purchase',
    [
      check('ticketAmount', 'Please provide a valid ticket amount.')
        .isInt({ gt: 0 })
        .withMessage('Ticket amount must be a positive integer.'),
    ],
    purchaseTickets
  );

router.get('/purchased-tickets', protect, authorize('customer'), viewPurchasedTickets);

router.post('/cancel', cancelTicket);

module.exports = router;

