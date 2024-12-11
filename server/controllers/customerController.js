const { removeTickets,cancelTicket } = require('./ticketPoolController');
const { validationResult } = require('express-validator');
const Configuration = require('../models/configuration');
const Ticket = require('../models/ticketPool');

const customerLastPurchase = {};

exports.purchaseTickets = async (req, res) => {
  const customerId = req.customer.customerId;
  const { ticketAmount } = req.body;

  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Fetch the configuration
    const config = await Configuration.findOne();
    if (!config) {
      return res.status(500).json({ success: false, error: 'Configuration not set.' });
    }

    // Implement rate limiting based on customerRetrievalRate
    const currentTime = Date.now();
    const lastPurchaseTime = customerLastPurchase[customerId] || 0;
    const timeSinceLastPurchase = currentTime - lastPurchaseTime;

    if (timeSinceLastPurchase < config.customerRetrievalRate) {
      const waitTime = config.customerRetrievalRate - timeSinceLastPurchase;
      return res.status(429).json({
        success: false,
        error: `Please wait ${waitTime} milliseconds before making another purchase.`,
      });
    }

    // Update last purchase time
    customerLastPurchase[customerId] = currentTime;

    const tickets = await removeTickets(customerId, ticketAmount);
    if (tickets && tickets.length > 0) {
      const ticketIds = tickets.map(ticket => ticket.ticketId);
      res.status(200).json({
        success: true,
        message: `Purchased tickets: ${ticketIds.join(', ')}.`,
        tickets: ticketIds,
      });
    } else {
      res.status(400).json({ success: false, error: 'Not enough tickets available.' });
    }
  } catch (err) {
    console.error('Error purchasing tickets:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.viewPurchasedTickets = async (req, res) => {
  const customerId = req.customer.customerId; // Assuming req.customer is set by your auth middleware

  try {
    // Find all tickets belonging to this customer that are sold
    const purchasedTickets = await Ticket.find({ customerId, sold: true });

    res.status(200).json({
      success: true,
      data: purchasedTickets.map(ticket => ({
        ticketId: ticket.ticketId,
        soldAt: ticket.soldAt,
        vendorId: ticket.vendorId,
      })),
    });
  } catch (err) {
    console.error('Error viewing purchased tickets:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.cancelTicket = async (req, res) => {
  const customerId = req.customer.customerId;
  const { ticketId } = req.body;

  // Validate ticketId
  if (!ticketId) {
    return res.status(400).json({ success: false, error: 'ticketId is required.' });
  }

  try {
    const ticket = await cancelTicket(customerId, ticketId);
    if (ticket) {
      res.status(200).json({ success: true, message: `Cancelled ticket ${ticket.ticketId}.` });
    } else {
      res.status(400).json({ success: false, error: 'Ticket not found or not owned by customer.' });
    }
  } catch (err) {
    console.error('Error cancelling ticket:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};