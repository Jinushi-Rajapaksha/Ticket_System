const mongoose = require('mongoose');

const ticketHistorySchema = new mongoose.Schema({
  vendorId: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('ticketHistory', ticketHistorySchema);
