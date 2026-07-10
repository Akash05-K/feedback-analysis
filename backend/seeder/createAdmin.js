const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

    if (existingAdmin) {
      console.log('Admin already exists. No action taken.');
      process.exit(0);
    }

    const admin = await Admin.create({
      name: process.env.ADMIN_NAME || 'College Administrator',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD, // hashed automatically by the pre-save hook
    });

    console.log('Admin account created successfully:');
    console.log(`  Name:  ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error creating admin: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();