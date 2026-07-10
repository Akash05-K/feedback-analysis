const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const Admin = require('../models/Admin');

/**
 its read jwt token from the request header and verifies it in Admin Schema.
 On success, attaches the admin document without password to req.admin
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach admin to request, excluding password
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) {
      res.status(401);
      throw new Error('Not authorized, admin no longer exists');
    }
     next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token invalid or expired');
  }
});

module.exports = { protect };