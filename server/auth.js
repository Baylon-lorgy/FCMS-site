const { OAuth2Client } = require('google-auth-library');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleToken(req, res) {
  try {
    console.log('Request body:', req.body);
    const { token } = req.body;

    if (!token) {
      console.error('No token provided in request body');
      return res.status(400).json({ 
        message: 'Token is required',
        error: 'No token provided in request' 
      });
    }

    // Log the Google Client ID being used (first 20 chars)
    console.log('Using Google Client ID:', process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...');

    try {
      // Verify the token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      console.log('Google payload received:', {
        email: payload.email,
        name: payload.name,
        sub: payload.sub
      });

      if (!payload.email_verified) {
        return res.status(400).json({
          message: 'Email not verified with Google',
          error: 'Email verification required'
        });
      }

      // Find or create user
      let user = await User.findOne({ email: payload.email });

      if (!user) {
        user = new User({
          email: payload.email,
          name: payload.name,
          profilePicture: payload.picture,
          googleId: payload.sub,
          isGoogleUser: true,
          role: 'student'
        });

        try {
          await user.save();
          console.log('New user created:', user.email);
        } catch (saveError) {
          console.error('Error saving user:', saveError);
          return res.status(500).json({
            message: 'Error creating user account',
            error: saveError.message
          });
        }
      } else {
        // Update existing user's Google-specific fields
        user.googleId = payload.sub;
        user.isGoogleUser = true;
        user.profilePicture = payload.picture;
        await user.save();
        console.log('Existing user updated:', user.email);
      }

      // Generate JWT token
      const authToken = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          school_id: user.school_id
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('Authentication successful for:', user.email);

      return res.status(200).json({
        message: 'Authentication successful',
        token: authToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          profilePicture: user.profilePicture
        }
      });

    } catch (verificationError) {
      console.error('Token verification failed:', verificationError);
      return res.status(401).json({
        message: 'Invalid token',
        error: verificationError.message
      });
    }

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      message: 'Server error during authentication',
      error: error.message
    });
  }
}

const verifyUser = async (req, res, next) => {
    // No user verification needed
    next();
};

// Token verification endpoint
const verifyTokenEndpoint = async (req, res) => {
  try {
    console.log('Token verification request received');
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token provided in Authorization header');
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token received:', token.substring(0, 20) + '...');

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
        school_id: decoded.school_id
      });
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.error('User not found for ID:', decoded.userId);
      return res.status(401).json({ message: 'User not found' });
    }

    // Verify user data matches token
    if (user.email !== decoded.email || user.role !== decoded.role) {
      console.error('User data mismatch:', {
        tokenEmail: decoded.email,
        userEmail: user.email,
        tokenRole: decoded.role,
        userRole: user.role
      });
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('User verified:', {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
      school_id: user.school_id
    });

    res.json({
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        school_id: user.school_id
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      valid: false,
      message: 'Token verification failed',
      error: error.message 
    });
  }
};

module.exports = { verifyGoogleToken, verifyUser, verifyTokenEndpoint };
