const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const { verifyToken } = require('../middleware/auth');
const { sendAnnouncementToAll, sendTestEmail, verifyTransporter } = require('../utils/emailService');

// Test email configuration and sending - accessible to admins only
router.get('/test-email', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get the recipient email from query param or use the requester's email
    const recipientEmail = req.query.email || req.user.email;
    
    if (!recipientEmail) {
      return res.status(400).json({ 
        message: 'No recipient email provided. Please specify ?email=youremail@example.com in the URL' 
      });
    }

    // First verify the transporter connection
    const connectionVerified = await verifyTransporter();
    
    if (!connectionVerified) {
      return res.status(500).json({ 
        message: 'Email service connection failed. Check server logs and email credentials in .env file',
        envStatus: {
          EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not set',
          EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set' : 'Not set'
        }
      });
    }

    // Send a test email
    const result = await sendTestEmail(recipientEmail);
    
    if (result.success) {
      res.json({ 
        message: `Test email sent successfully to ${recipientEmail}`,
        details: result
      });
    } else {
      res.status(500).json({ 
        message: 'Failed to send test email',
        details: result
      });
    }
  } catch (error) {
    console.error('Error in test-email route:', error);
    res.status(500).json({ 
      message: 'Server error during email test',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get all messages (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new message/report - No auth required to allow students to submit reports
router.post('/', async (req, res) => {
  try {
    console.log('Received message data:', req.body);
    
    const { 
      userId, 
      userName, 
      userEmail, 
      title, 
      message, 
      emoji,
      reportType,
      sender,
      date,
      sendToAll  // New parameter to indicate if announcement should be sent to all users
    } = req.body;

    // Create new message
    const newMessage = new Message({
      userId: userId || null,
      userName: userName || 'Anonymous User',
      userEmail: userEmail || 'No email provided',
      title: title || 'User Report',
      message: message || 'No additional details provided',
      emoji: emoji || null,
      reportType: reportType || 'User Report',
      sender: sender || 'Anonymous User',
      date: date || new Date()
    });

    // Save the message
    const savedMessage = await newMessage.save();
    console.log('Message saved:', savedMessage);
    
    // Handle sending announcement to all users via email if requested
    let emailResult = null;
    if (sendToAll === true && reportType === 'Announcement') {
      console.log('Sending announcement to all users via email');
      emailResult = await sendAnnouncementToAll({
        subject: title,
        content: message,
        createdAt: new Date(),
      });
      console.log('Email sending result:', emailResult);
    }
    
    // Return response with email sending status if applicable
    if (emailResult) {
      res.status(201).json({
        message: savedMessage,
        emailSent: emailResult.success,
        emailDetails: emailResult
      });
    } else {
      res.status(201).json(savedMessage);
    }
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark message as read
router.put('/:id/read', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const message = await Message.findByIdAndUpdate(
      req.params.id, 
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all messages as read
router.put('/read-all', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    await Message.updateMany(
      { isRead: false }, 
      { isRead: true }
    );

    res.json({ message: 'All messages marked as read' });
  } catch (error) {
    console.error('Error marking all messages as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a message
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 