const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');

/**
   Authenticated admin and return JWT
 */
const loginAdmin = asyncHandler(async (req, res) => {
  // Validate request body 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { email, password } = req.body;

  const normalizedEmail = email.trim().toLowerCase();

  const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');

  if (!admin) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const isPasswordCorrect = await admin.matchPassword(password);

  if (!isPasswordCorrect) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.status(200).json({
    success: true,
    data: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    },
  });
});

/**
     Get currently logged-in admin's profile
 */
const getMe = asyncHandler(async (req, res) => {
  // req.admin is attached by the `protect` middleware
  res.status(200).json({
    success: true,
    data: {
      _id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
    },
  });
});

module.exports = { loginAdmin, getMe };