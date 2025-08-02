const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateVerificationCode, sendVerificationEmail } = require('../services/emailService');

// Send verification code
router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1); // Code expires in 1 hour

    // Update user with verification code
    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpires = expirationTime;
    await user.save();

    // Send verification email
    const emailSent = await sendVerificationEmail(email, verificationCode);
    if (!emailSent) {
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Error in send-verification:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify email code
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if verification code exists and hasn't expired
    if (!user.emailVerificationCode || !user.emailVerificationExpires) {
      return res.status(400).json({ message: 'No verification code found. Please request a new one.' });
    }

    // Check if code has expired
    if (new Date() > user.emailVerificationExpires) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    // Check if code matches
    if (user.emailVerificationCode !== code.toUpperCase()) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Update user as verified
    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error in verify:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 