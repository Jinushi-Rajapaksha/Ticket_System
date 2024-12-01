const Vendor = require('../models/vendor');

exports.getVendorByUser = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, error: 'Vendor not found' });
    }
    req.vendor = vendor;
    next();
  } catch (err) {
    console.error('Vendor Middleware Error:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
