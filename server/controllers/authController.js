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

// @desc    Register a new customer
// @route   POST /api/auth/register/customer
// @access  Public
exports.registerCustomer = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, error: 'User already exists' });
    }

    // Create new user with role set to 'customer'
    user = await User.create({
      name,
      email,
      password, // Remember to hash passwords in production
      role: 'customer',
    });

     // Create Customer entry
  const customerCount = await Customer.countDocuments();
  await Customer.create({
    user: user._id,
    customerId: customerCount + 1,
    retrievalInterval: 1000, // Default or get from req.body
  });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Register a new vendor
// @route   POST /api/auth/register/vendor
// @access  Public (or Protected, see note below)
exports.registerVendor = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, error: 'User already exists' });
    }

    // Create new user with role set to 'vendor'
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
    ticketsPerRelease: 5, // Default or get from req.body
    releaseInterval: 2000, // Default or get from req.body
  });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: 'Please provide email and password' });
  }

  try {
    // Check for user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
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

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
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
