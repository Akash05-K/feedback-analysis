/**
 * DIAGNOSTIC SCRIPT — run this to find out exactly why login is failing.
 * Usage: node diagnose-login.js
 *
 * Delete this file once the issue is fixed — it's not part of the app.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const TEST_EMAIL = process.env.ADMIN_EMAIL;
const TEST_PASSWORD = process.env.ADMIN_PASSWORD;

const run = async () => {
  console.log('--- Diagnostic Start ---');
  console.log('MONGO_URI in use:', process.env.MONGO_URI);
  console.log('ADMIN_EMAIL in .env:', JSON.stringify(TEST_EMAIL));
  console.log('ADMIN_PASSWORD in .env:', JSON.stringify(TEST_PASSWORD));
  console.log('');

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB successfully.');
  console.log('Database name:', mongoose.connection.name);
  console.log('');

  const allAdmins = await Admin.find({}).select('+password');
  console.log('Total admin documents found in DB:', allAdmins.length);

  if (allAdmins.length === 0) {
    console.log('');
    console.log('>>> PROBLEM FOUND: No Admin document exists in this database.');
    console.log('>>> FIX: run "npm run seed:admin"');
    process.exit(0);
  }

  for (const admin of allAdmins) {
    console.log('---');
    console.log('Stored email:', JSON.stringify(admin.email));
    console.log('Stored name:', admin.name);
    console.log('Password hash starts with:', admin.password.substring(0, 10) + '...');

    const normalizedTestEmail = TEST_EMAIL.trim().toLowerCase();
    const emailMatches = admin.email === normalizedTestEmail;
    console.log('Does stored email match .env ADMIN_EMAIL (normalized)?', emailMatches);

    const passwordMatches = await admin.matchPassword(TEST_PASSWORD);
    console.log('Does .env ADMIN_PASSWORD match the stored hash?', passwordMatches);

    if (emailMatches && passwordMatches) {
      console.log('');
      console.log('>>> This admin SHOULD be able to log in with the .env credentials.');
      console.log('>>> If login still fails in the browser, the backend server is likely');
      console.log('>>> running OLD CODE (not restarted) or hitting a DIFFERENT database');
      console.log('>>> than this script just connected to. Double check MONGO_URI matches');
      console.log('>>> in both places, and fully restart "npm run dev".');
    } else if (emailMatches && !passwordMatches) {
      console.log('');
      console.log('>>> PROBLEM FOUND: Email matches, but password does NOT match.');
      console.log('>>> This admin was created with a DIFFERENT password than what is');
      console.log('>>> currently in .env. Run the reset command below, then reseed.');
    } else if (!emailMatches) {
      console.log('');
      console.log('>>> PROBLEM FOUND: Stored email does not match .env ADMIN_EMAIL.');
    }
  }

  console.log('');
  console.log('--- Diagnostic End ---');
  process.exit(0);
};

run().catch((err) => {
  console.error('Diagnostic script failed:', err.message);
  process.exit(1);
});