const mongoose = require('mongoose');

const ConfigurationSchema = new mongoose.Schema({
  totalTickets: {
    type: Number,
    required: true,
  },
  ticketReleaseRate: {
    type: Number,
    required: true,
  },
  customerRetrievalRate: {
    type: Number,
    required: true,
  },
  maxTicketCapacity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Configuration', ConfigurationSchema);