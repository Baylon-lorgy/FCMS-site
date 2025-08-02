const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const axios = require('axios');

// Debug middleware
router.use((req, res, next) => {
  console.log('\nAuth Route Hit:');
  console.log('Method:', req.method);
  console.log('Path:', req.originalUrl);
  console.log('Body:', req.body);
  next();
});

// Test route
router.get('/test', (req, res) => {
  console.log('Auth test route hit');
  res.json({ message: 'Auth routes are working' });
});

// Registration route
router.post('/register', async (req, res) => {
  console.log('Register route hit with body:', JSON.stringify(req.body, null, 2));
  try {
    const { lastName, firstName, middleInitial, school_id, email, password, role, yearLevel } = req.body;

    // Log the received data
    console.log('Received registration data:', {
      lastName,
      firstName,
      middleInitial,
      school_id,
      email,
      role,
      yearLevel,
      hasPassword: !!password
    });

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { school_id }
      ]
    });
    
    if (existingUser) {
      console.log('Existing user found:', existingUser.email);
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
      if (existingUser.school_id === school_id) {
        return res.status(400).json({ message: 'User already exists with this school ID' });
      }
    }

    // Construct full name
    const name = middleInitial 
      ? `${lastName}, ${firstName} ${middleInitial}.`
      : `${lastName}, ${firstName}`;

    // Create base user data with role-specific defaults
    const userData = {
      email,
      name,
      school_id,
      password,
      role: role || 'student',
      account_agreement: true,
      contact_number: '',
      department: role === 'faculty' ? 'Information Technology' : '',
      position: role === 'faculty' ? 'Professor' : '',
      program: role === 'student' ? 'BSIT' : 'Not Specified',
      year_level: role === 'student' ? yearLevel : 'Not Specified',
      section: role === 'student' ? 'A' : 'Not Specified',
      academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      isGoogleUser: false
    };

    console.log('Creating user with data:', userData);
    const user = new User(userData);
    await user.save();
    console.log('User saved successfully');

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        school_id: user.school_id
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    console.error('Error details:', error);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message,
      details: error.errors || error.code
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Special case for admin email - only check email
    if (email === '1801101934@student.buksu.edu.ph') {
      let user = await User.findOne({ email });
      
      if (!user) {
        // Create admin user if doesn't exist
        user = new User({
          email,
          password: await bcrypt.hash('123456', 10),
          role: 'admin',
          name: 'Admin User',
          school_id: 'ADMIN-001',
          account_agreement: true
        });
        await user.save();
      }

      // Generate admin token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: 'admin'
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: 'admin'
        }
      });
    }

    // Regular login flow - only check email and password
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Use the comparePassword method from the User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Google Sign-In route
router.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Decode the token to get user info
    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const { email, name } = decoded;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Determine role based on email
      let role = 'student';
      if (email === '1801101934@student.buksu.edu.ph') {
        role = 'admin';
      }

      // Create new user if doesn't exist
      user = new User({
        email,
        name,
        school_id: email.split('@')[0], // Use email prefix as school_id
        role: role, // Assign determined role
        isGoogleUser: true,
        password: await bcrypt.hash(Math.random().toString(36), 10), // Random password for Google users
        account_agreement: true
      });
      await user.save();
    }

    // Generate JWT token
    const authToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Server error during Google login' });
  }
});

// Get faculty profile
router.get('/faculty-profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
});

// Update faculty profile
router.put('/faculty-profile', verifyToken, async (req, res) => {
  try {
    const {
      name,
      contact_number,
      department,
      position,
      office_hours,
      specialization,
      consultation_hours
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (contact_number) user.contact_number = contact_number;
    if (department) user.department = department;
    if (position) user.position = position;
    if (office_hours) user.office_hours = office_hours;
    if (specialization) user.specialization = specialization;
    if (consultation_hours) user.consultation_hours = consultation_hours;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get all students (for faculty view)
router.get('/students', verifyToken, async (req, res) => {
  try {
    // Verify user is faculty
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied. Faculty only.' });
    }

    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ name: 1 });
    
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Update user role
router.put('/update-role/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { role } = req.body;

    if (!['admin', 'faculty', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ 
      message: 'Role updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Failed to update role', error: error.message });
  }
});

// Create admin user
router.post('/create-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // If user exists, update their role to admin
      user.role = 'admin';
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      user = new User({
        email,
        password: hashedPassword,
        role: 'admin',
        name: 'Admin User',
        school_id: 'ADMIN-' + Date.now(),
        account_agreement: true
      });
    }

    await user.save();
    console.log('Admin user created/updated:', { email: user.email, role: user.role });

    res.json({ 
      message: 'Admin user created/updated successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Failed to create admin user', error: error.message });
  }
});

// Add reCAPTCHA verification endpoint
router.post('/verify-recaptcha', async (req, res) => {
  const { recaptchaToken } = req.body;
  console.log('Received token from frontend:', recaptchaToken);
  if (!recaptchaToken) {
    return res.status(400).json({ success: false, error: 'No token provided' });
  }
  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );
    console.log('reCAPTCHA verification response:', response.data);
    if (response.data.success) {
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: response.data['error-codes'] });
    }
  } catch (err) {
    console.error('reCAPTCHA verification error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Make sure to export the router
module.exports = router;
