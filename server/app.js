// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('./models/User');
const connectDB = require('./db/db');

// Load environment variables
dotenv.config();
console.log('Environment variables loaded');

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();
console.log('Express app created');

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`\n[${new Date().toISOString()}] Request received:`);
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Original URL:', req.originalUrl);
  console.log('Base URL:', req.baseUrl);
  console.log('Path:', req.path);
  if (req.body) console.log('Body:', req.body);
  next();
});

// Remove Cross-Origin-Opener-Policy header if present (for development)
app.use((req, res, next) => {
  res.removeHeader && res.removeHeader('Cross-Origin-Opener-Policy');
  next();
});

// CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Body parsing middleware with increased limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Test route to verify server is running
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Server is running!' });
});

// Debug route to list all registered routes
app.get('/api/debug/routes', (req, res) => {
  const routes = [];
  const processStack = (stack, basePath = '') => {
    stack.forEach(middleware => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
        routes.push({
          path: basePath + middleware.route.path,
          methods: methods,
          name: middleware.name
        });
      } else if (middleware.name === 'router') {
        let path = basePath;
        if (middleware.regexp) {
          path += middleware.regexp.source.replace(/\\\//g, '/').replace(/\^|\$/g, '');
        }
        processStack(middleware.handle.stack, path);
      }
    });
  };
  processStack(app._router.stack);
  res.json(routes);
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const facultyProfileRoutes = require('./routes/facultyProfileRoutes');
const emailVerificationRoutes = require('./routes/emailVerification');
const messageRoutes = require('./routes/messageRoutes');

// Mount routes
console.log('Mounting routes...');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api', facultyRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api', facultyProfileRoutes);
app.use('/api/email', emailVerificationRoutes);
app.use('/api/messages', messageRoutes);
console.log('Routes mounted successfully');

// Print registered routes with more detail
console.log('\nRegistered routes with details:');
const printRoutes = (stack, basePath = '') => {
  stack.forEach(middleware => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
      console.log(`${methods} ${basePath}${middleware.route.path} (${middleware.name || 'unnamed'})`);
    } else if (middleware.name === 'router') {
      let path = basePath;
      if (middleware.regexp) {
        path += middleware.regexp.source.replace(/\\\//g, '/').replace(/\^|\$/g, '');
      }
      console.log(`\nRouter mounted at: ${path}`);
      printRoutes(middleware.handle.stack, path);
    }
  });
};
printRoutes(app._router.stack);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Original URL:', req.originalUrl);
  console.log('Base URL:', req.baseUrl);
  console.log('Path:', req.path);
  console.log('Headers:', req.headers);
  console.log('Router stack:', app._router.stack.map(layer => ({
    path: layer.route?.path,
    methods: layer.route?.methods
  })));
  
  res.status(404).json({ 
    message: 'Route not found', 
    path: req.url,
    method: req.method,
    availableRoutes: app._router.stack
      .filter(layer => layer.route)
      .map(layer => ({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods)
      }))
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\nServer is running on port ${PORT}`);
  console.log('\nAvailable routes:');
  console.log('GET  /api/test');
  console.log('POST /api/auth/register');
  console.log('POST /api/auth/login');
  console.log('GET  /api/schedules');
  console.log('GET  /api/subjects');
  console.log('GET  /api/auth/faculty-profile');
  console.log('PUT  /api/auth/faculty-profile');
});

module.exports = app;
