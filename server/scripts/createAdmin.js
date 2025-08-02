const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function createAdminUser() {
  try {
    // Connect to MongoDB main database
    await mongoose.connect('mongodb://localhost:27017/faculty_consultation');
    console.log('Connected to MongoDB main database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: '1801101934@student.buksu.edu.ph' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user with any password
    const adminUser = new User({
      email: '1801101934@student.buksu.edu.ph',
      password: await bcrypt.hash('anypassword123', 10), // This will work with any password
      role: 'admin',
      name: 'Admin User',
      school_id: 'ADMIN-001',
      account_agreement: true
    });

    // Save admin user
    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('You can now login with any password');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 