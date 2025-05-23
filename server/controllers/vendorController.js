const { addTickets } = require('./ticketPoolController');
const { validationResult } = require('express-validator');
const Ticket = require('../models/ticketPool');
const Configuration = require('../models/configuration');
const { Mutex } = require('async-mutex');
const TicketHistory = require('../models/ticketHistory');

const ticketPoolMutex = new Mutex();
const vendorIntervals = {}; // In-memory storage for vendors' interval IDs

exports.addTickets = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const vendorId = req.vendor.vendorId;
  const { ticketAmount } = req.body;

  try {
    await addTickets(vendorId, ticketAmount);
    res.status(200).json({ success: true, message: `Added ${ticketAmount} tickets.` });
  } catch (err) {
    console.error('Error adding tickets:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.startVendor = async (req, res) => {
  try {
    const vendor = req.vendor;

    if (vendor.isActive) {
      return res.status(400).json({ success: false, error: 'Vendor is already active.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { ticketAmount } = req.body;
    if (ticketAmount !== undefined) {
      vendor.ticketsPerRelease = ticketAmount;
    }

    const config = await Configuration.findOne();
    if (!config) {
      return res.status(500).json({ success: false, error: 'Configuration not set.' });
    }

    vendor.isActive = true;
    await vendor.save();

    const intervalId = setInterval(async () => {
      const release = await ticketPoolMutex.acquire();
      try {
        const ticketCount = await Ticket.countDocuments({ sold: false });
        if (ticketCount + ticketAmount > config.maxTicketCapacity) {
          console.log('Max ticket capacity reached. Cannot add more tickets.');
          return;
        }

        // Add tickets
        const tickets = [];
        for (let i = 0; i < ticketAmount; i++) {
          tickets.push({
            ticketId: `${Date.now()}-${Math.random()}`,
            vendorId: vendor.vendorId,
          });
        }
        await Ticket.insertMany(tickets);
        await TicketHistory.create({
          vendorId: vendor.vendorId,
          count: tickets.length, 
          date: new Date()
        });

        console.log(`Vendor ${vendor.vendorId}: Added ${tickets.length} tickets.`);
      } catch (err) {
        console.error('Error adding tickets:', err);
      } finally {
        release();
      }
    }, config.ticketReleaseRate); 

    // Store intervalId in memory
    vendorIntervals[vendor.vendorId] = intervalId;

    res.status(200).json({ success: true, message: 'Vendor started releasing tickets automatically.' });
  } catch (err) {
    console.error('Error starting vendor:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.stopVendor = async (req, res) => {
  try {
    const vendor = req.vendor;

    if (!vendor.isActive) {
      return res.status(400).json({ success: false, error: 'Vendor is not active.' });
    }

    // Get the intervalId from memory
    const intervalId = vendorIntervals[vendor.vendorId];
    if (intervalId) {
      clearInterval(intervalId);
      delete vendorIntervals[vendor.vendorId];
    }

    vendor.isActive = false;
    await vendor.save();

    res.status(200).json({ success: true, message: 'Vendor stopped releasing tickets.' });
  } catch (err) {
    console.error('Error stopping vendor:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const vendor = req.vendor;
    const history = await TicketHistory.find({ vendorId: vendor.vendorId }).sort({ date: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
