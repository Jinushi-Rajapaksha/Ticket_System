const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  vendorId: {
    type: Number,
    required: true,
    unique: true,
  },
  ticketsPerRelease: {
    type: Number,
    required: true,
    default: 5,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Vendor', VendorSchema);
