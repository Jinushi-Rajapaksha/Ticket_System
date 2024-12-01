const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerId: {
    type: Number,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model('Customer', CustomerSchema);
