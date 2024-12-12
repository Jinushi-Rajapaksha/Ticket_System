const Ticket = require('../models/ticketPool');
const Configuration = require('../models/configuration');
const { Mutex } = require('async-mutex');
const TicketHistory = require('../models/ticketHistory');

const ticketPoolMutex = new Mutex();

exports.getTicketPoolStatus = async (req, res) => {
  try {
    const availableTickets = await Ticket.countDocuments({ sold: false });
    const soldTickets = await Ticket.countDocuments({ sold: true });

    res.status(200).json({
      success: true,
      data: {
        availableTickets,
        soldTickets,
      },
    });
  } catch (err) {
    console.error('Error getting ticket pool status:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


exports.addTickets = async (vendorId, ticketAmount) => {
  const release = await ticketPoolMutex.acquire();
  try {
    // Get current configuration
    const config = await Configuration.findOne();
    if (!config) {
      throw new Error('Configuration not set.');
    }

    // Check if max capacity reached
    const ticketCount = await Ticket.countDocuments({ sold: false });
    if (ticketCount + ticketAmount > config.maxTicketCapacity) {
      throw new Error('Max ticket capacity reached.');
    }

    const tickets = [];
    for (let i = 0; i < ticketAmount; i++) {
      tickets.push({
        ticketId: `${Date.now()}-${Math.random()}`,
        vendorId,
      });
    }

    await Ticket.insertMany(tickets);

    console.log(`Vendor ${vendorId}: Added ${tickets.length} tickets.`);
  } finally {
    release();
  }
};

exports.removeTickets = async (customerId, ticketAmount) => {
  const release = await ticketPoolMutex.acquire();
  try {
    // Find the requested number of unsold tickets
    const tickets = await Ticket.find({ sold: false }).limit(ticketAmount);

    if (tickets.length === ticketAmount) {
      const ticketIds = tickets.map(ticket => ticket._id);
      await Ticket.updateMany(
        { _id: { $in: ticketIds } },
        { $set: { sold: true, customerId, soldAt: new Date() } }
      );

      console.log(`Customer ${customerId}: Purchased tickets ${ticketIds.join(', ')}.`);
      const updatedTickets = await Ticket.find({ _id: { $in: ticketIds } });
      return updatedTickets;
    } else {
      console.log(`Customer ${customerId}: Not enough tickets available.`);
      return null;
    }
  } finally {
    release();
  }
};

exports.cancelTicket = async (customerId, ticketId) => {
  const release = await ticketPoolMutex.acquire();
  try {
    // Find the ticket that matches the ticketId and customerId
    const ticket = await Ticket.findOne({ ticketId, customerId });

    if (ticket) {
      ticket.sold = false;
      ticket.customerId = null;
      ticket.soldAt = null;
      await ticket.save();

      console.log(`Customer ${customerId}: Cancelled ticket ${ticket.ticketId}.`);
      return ticket;
    } else {
      console.log(`Customer ${customerId}: Cannot cancel ticket ${ticketId} - not found or not owned by customer.`);
      return null;
    }
  } finally {
    release();
  }
};