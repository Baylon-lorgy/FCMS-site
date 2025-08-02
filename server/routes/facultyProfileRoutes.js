const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// Debug middleware
router.use((req, res, next) => {
  console.log('\nFaculty Profile Route Hit:');
  console.log('Method:', req.method);
  console.log('Path:', req.originalUrl);
  console.log('Headers:', req.headers);
  next();
});

// Get faculty profile
router.get('/faculty-profile', verifyToken, async (req, res) => {
  try {
    console.log('Fetching faculty profile for user:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found with ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    // Ensure department and contact_number are always present in the response
    const userObj = user.toObject();
    if (userObj.department === undefined) userObj.department = '';
    if (userObj.contact_number === undefined) userObj.contact_number = '';
    console.log('Found user:', userObj);
    res.json(userObj);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update faculty profile
router.put('/faculty-profile', verifyToken, async (req, res) => {
  try {
    console.log('Updating faculty profile for user:', req.user.id);
    console.log('Update data:', req.body);
    
    const {
      name,
      email,
      faculty_id,
      department,
      contact_number
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found with ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (faculty_id) user.faculty_id = faculty_id;
    if (department !== undefined) user.department = department;
    if (contact_number !== undefined) user.contact_number = contact_number;

    await user.save();
    console.log('Profile updated successfully:', user);
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

module.exports = router; 