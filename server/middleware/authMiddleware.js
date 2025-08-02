const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  console.log('Auth Middleware - Headers:', req.headers);

  try {
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth Middleware - Token:', token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth Middleware - Decoded Token:', decoded);

      // Get user from token
      const userId = decoded.userId;
      if (!userId) {
        console.log('Auth Middleware - No user ID in token');
        return res.status(401).json({ message: 'Not authorized, invalid token format' });
      }

      const user = await User.findById(userId).select('-password');
      console.log('Auth Middleware - User:', user);

      if (!user) {
        console.log('Auth Middleware - User not found');
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Add user and role to request object
      req.user = user;
      req.user.role = decoded.role || user.role; // Use role from token or fallback to user role
      console.log('Auth Middleware - User role:', req.user.role);
      next();
    } else {
      console.log('Auth Middleware - No token provided');
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (error) {
    console.error('Auth Middleware - Error:', error);
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Not authorized, invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Not authorized, token expired' });
    } else {
      res.status(401).json({ message: 'Not authorized', error: error.message });
    }
  }
};

// Admin middleware
const adminOnly = async (req, res, next) => {
  try {
    console.log('Admin Middleware - Checking access for:', req.user?.email);
    // Check if user exists and is admin
    if (!req.user || req.user.email !== '1801101934@student.buksu.edu.ph') {
      console.log('Admin Middleware - Access denied:', req.user?.email);
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    console.log('Admin Middleware - Access granted');
    next();
  } catch (error) {
    console.error('Admin Middleware - Error:', error);
    res.status(403).json({ message: 'Access denied', error: error.message });
  }
};

module.exports = { protect, adminOnly };
