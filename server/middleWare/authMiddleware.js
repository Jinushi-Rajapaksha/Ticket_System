const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from Bearer token
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ success: false, error: 'Not authorized to access this route' });
  }
};

// Authorize middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user role is in the list of allowed roles
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, error: 'User not authorized to access this route' });
    }
    next();
  };
};