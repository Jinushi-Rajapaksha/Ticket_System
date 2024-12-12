const User = require('../models/user'); 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Vendor = require('../models/vendor');
const Customer = require('../models/customer');

dotenv.config();

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });

  res.status(statusCode).json({
    success: true,
    token,
  });
};

// Register a new customer
exports.registerCustomer = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, error: 'User already exists' });
    }

    user = await User.create({
      name,
      email,
      password, 
      role: 'customer',
    });

  const customerCount = await Customer.countDocuments();
  await Customer.create({
    user: user._id,
    customerId: customerCount + 1,
    retrievalInterval: 1000,
  });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Register a new vendor
exports.registerVendor = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, error: 'User already exists' });
    }

    user = await User.create({
      name,
      email,
      password,
      role: 'vendor',
    });

    // Create Vendor entry
  const vendorCount = await Vendor.countDocuments();
  await Vendor.create({
    user: user._id,
    vendorId: vendorCount + 1,
    ticketsPerRelease: 5, 
    releaseInterval: 2000, 
  });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get current logged in user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
