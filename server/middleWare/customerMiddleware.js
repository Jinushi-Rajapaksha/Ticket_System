const Customer = require('../models/customer');

exports.getCustomerByUser = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ user: req.user.id });
    if (!customer) {
      return res
        .status(404)
        .json({ success: false, error: 'Customer not found' });
    }
    req.customer = customer;
    next();
  } catch (err) {
    console.error('Customer Middleware Error:', err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
