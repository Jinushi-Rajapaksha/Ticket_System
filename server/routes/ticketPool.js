const express = require('express');
const { getTicketPoolStatus } = require('../controllers/ticketPoolController');

const router = express.Router();

router.get('/status', getTicketPoolStatus);

module.exports = router;
