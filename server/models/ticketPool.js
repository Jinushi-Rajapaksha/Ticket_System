const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
  },
  vendorId: {
    type: Number,
    required: true,
  },
  sold: {
    type: Boolean,
    default: false,
  },
  customerId: {
    type: Number,
    default: null,
  },
  soldAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('Ticket', TicketSchema);
