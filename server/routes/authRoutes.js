const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { OAuth2Client } = require('google-auth-library');
const { generateVerificationCode, sendVerificationEmail } = require('../services/emailService');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const axios = require('axios');
const userController = require('../controllers/userController');

// Debug middleware - log all requests to auth routes
router.use((req, res, next) => {
  console.log('\nAuth Route Hit:');
  console.log('  Method:', req.method);
  console.log('  Path:', req.originalUrl);
  console.log('  Base URL:', req.baseUrl);
  console.log('  Route Path:', req.route?.path);
  console.log('  Headers:', JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('  Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Test route to verify auth router is working
router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Auth routes are working' });
});

// Function to verify reCAPTCHA token
async function verifyRecaptcha(token) {
  try {
    const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token
      }
    });
    
    console.log('reCAPTCHA verification response:', response.data);
    return response.data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password, captchaToken, skipCaptcha } = req.body;
    console.log('\nLogin attempt details:');
    console.log('Email:', email);
    console.log('Password provided:', password ? 'Yes' : 'No');
    console.log('Captcha token provided:', captchaToken ? 'Yes' : 'No');
    console.log('Skip captcha:', skipCaptcha);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Special case for admin account
    if (email === '1801101934@student.buksu.edu.ph') {
      console.log('Admin login attempt detected');
      
      // Find or create admin user
      let user = await User.findOne({ email });
      console.log('Existing admin user found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('Creating admin user...');
        // Create admin user if doesn't exist
        user = new User({
          email: '1801101934@student.buksu.edu.ph',
          password: await bcrypt.hash('anypassword123', 10),
          role: 'admin',
          name: 'Admin User',
          school_id: 'ADMIN-001',
          account_agreement: true
        });
        await user.save();
        console.log('Admin user created successfully');
      }

      // For admin, generate token without password check
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          role: 'admin'
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      console.log('Admin login successful');
      console.log('User details:', {
        id: user._id,
        email: user.email,
        role: user.role
      });

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

    // Regular user login flow
    console.log('\nChecking captcha requirements:');
    console.log('skipCaptcha value:', skipCaptcha);
    console.log('skipCaptcha type:', typeof skipCaptcha);
    console.log('skipCaptcha === true:', skipCaptcha === true);
    console.log('skipCaptcha !== true:', skipCaptcha !== true);
    console.log('captchaToken value:', captchaToken);
    console.log('Full request body:', JSON.stringify(req.body, null, 2));

    // Check captcha requirements
    if (!skipCaptcha) {
      if (!captchaToken) {
        console.log('Captcha token is required but not provided');
        return res.status(400).json({ message: 'Please complete the captcha verification first' });
      }

      // Verify the captcha token with Google
      const isCaptchaValid = await verifyRecaptcha(captchaToken);
      if (!isCaptchaValid) {
        console.log('Captcha verification failed');
        return res.status(400).json({ message: 'Captcha verification failed. Please try again.' });
      }
    }

    console.log('Captcha verification passed, proceeding with login');

    // Find user and verify password
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Block login if email is not verified
    if (!user.isEmailVerified) {
      console.log('Login attempt for unverified email:', email);
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    // Generate token for regular users
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', email);
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
    console.error('Login error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Google login route
router.post('/google-login', express.json(), async (req, res) => {
  console.log('\nGoogle login route hit');
  console.log('Request body:', req.body);
  
  try {
    const { token } = req.body;
    if (!token) {
      console.log('No token provided in request');
      return res.status(400).json({ message: 'No token provided' });
    }

    console.log('Verifying token with Google...');
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    console.log('Google payload received:', {
      email: payload.email,
      name: payload.name
    });

    // Check if user exists
    let user = await User.findOne({ email: payload.email });
    console.log('Existing user found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found - registration required');
      return res.status(401).json({ 
        message: 'Please register first before using Google login',
        email: payload.email
      });
    }

    // Create JWT token with all necessary user data
    const jwtToken = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('JWT token created for user:', user.email);

    // Return the same response format as manual login
    const response = {
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ 
      message: 'Google authentication failed', 
      error: error.message
    });
  }
});

// Registration route
router.post('/register', async (req, res) => {
  console.log('\nRegister route hit');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const {
      name,
      school_id,
      email,
      password,
      role,
      account_agreement,
      contact_number,
      department,
      position,
      program,
      year_level,
      section,
      academic_year,
      isGoogleUser
    } = req.body;

    console.log('Parsed registration data:', {
      name,
      school_id,
      email,
      role,
      hasPassword: !!password,
      isGoogleUser
    });

    // Validate required fields
    if (!name || !email) {
      console.log('Missing required fields');
      return res.status(400).json({
        message: 'Please provide all required fields: name and email',
        received: {
          hasName: !!name,
          hasEmail: !!email
        }
      });
    }

    // Additional validation for non-Google users
    if (!isGoogleUser && (!school_id || !password)) {
      console.log('Missing required fields for regular registration');
      return res.status(400).json({
        message: 'Please provide all required fields: name, school ID, email, and password',
        received: {
          hasName: !!name,
          hasSchoolId: !!school_id,
          hasEmail: !!email,
          hasPassword: !!password
        }
      });
    }

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({
      $or: [{ email }, { school_id: school_id || null }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        if (existingUser.isEmailVerified) {
          return res.status(409).json({
            message: 'Email already registered and verified.'
          });
        } else {
          return res.status(409).json({
            message: 'Email already registered but not yet verified'
          });
        }
      }
      if (existingUser.school_id === school_id) {
        return res.status(409).json({
          message: 'School ID already registered'
        });
      }
    }

    // Create new user
    const userData = {
      name,
      school_id,
      email,
      password,
      role: role || 'student',
      account_agreement,
      contact_number: contact_number || '',
      department: department || '',
      position: position || '',
      program: program || 'Not Specified',
      year_level: year_level || 'Not Specified',
      section: section || 'Not Specified',
      academic_year: academic_year || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      isGoogleUser: isGoogleUser || false,
      isEmailVerified: false
    };

    const user = new User(userData);
    await user.save();

    // Generate and send verification code
    if (!isGoogleUser) {
      const verificationCode = generateVerificationCode();
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1);

      user.emailVerificationCode = verificationCode;
      user.emailVerificationExpires = expirationTime;
      await user.save();

      // Send verification email
      await sendVerificationEmail(email, verificationCode);
    } else {
      // Google users are automatically verified
      user.isEmailVerified = true;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Password reset code verification routes
router.post('/request-password-reset', userController.requestPasswordResetCode);
router.post('/verify-reset-code', userController.verifyPasswordResetCode);

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  console.log('\nGet current user route hit');
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error while getting user data' });
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
      email,
      faculty_id
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (faculty_id) user.faculty_id = faculty_id;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Export the router
console.log('Auth routes loaded and exported');
module.exports = router;
