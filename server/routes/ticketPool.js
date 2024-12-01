const express = require('express');
const { getTicketPoolStatus } = require('../controllers/ticketPoolController');

const router = express.Router();

// Get ticket pool status
router.get('/status', getTicketPoolStatus);

// router.post('/addTickets',addTickets);

// router.post('/removeTicket',removeTicket);

module.exports = router;
