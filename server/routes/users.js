const express = require('express');
const { protect } = require('../middleWare/authMiddleware');
const { authorize } = require('../middleWare/roleMiddleware');

const router = express.Router();

//  protected route
router.get('/dashboard', protect, (req, res) => {
  res.json({
    success: true,
    message: `Welcome to the dashboard, ${req.user.name}!`,
    user: req.user,
  });
});

//  route only accessible to vendors
router.post('/vendor-action', protect, authorize('vendor'), (req, res) => {
  res.json({
    success: true,
    message: `Vendor-specific action performed by ${req.user.name}`,
  });
});

// route only accessible to customers
router.post('/customer-action', protect, authorize('customer'), (req, res) => {
  res.json({
    success: true,
    message: `Customer-specific action performed by ${req.user.name}`,
  });
});

module.exports = router;
