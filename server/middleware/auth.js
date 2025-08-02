const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  console.log('Verifying token...');
  console.log('Headers:', req.headers);
  
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No authorization header found');
      return res.status(401).json({ 
        message: 'No token provided',
        error: 'NO_TOKEN' 
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('Invalid token format - missing Bearer prefix');
      return res.status(401).json({ 
        message: 'Invalid token format',
        error: 'INVALID_FORMAT' 
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found after Bearer prefix');
      return res.status(401).json({ 
        message: 'No token provided',
        error: 'NO_TOKEN' 
      });
    }

    console.log('Token found:', token.substring(0, 20) + '...');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully:', decoded);
      
      // Check if the decoded token has the required fields
      if (!decoded.userId) {
        console.log('Token missing userId');
        return res.status(401).json({ 
          message: 'Invalid token - missing userId',
          error: 'INVALID_TOKEN' 
        });
      }
      
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
      
      console.log('User attached to request:', req.user);
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired',
          error: 'TOKEN_EXPIRED' 
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token',
          error: 'INVALID_TOKEN' 
        });
      } else {
        return res.status(401).json({ 
          message: 'Token verification failed',
          error: 'TOKEN_VERIFICATION_FAILED' 
        });
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      message: 'Authentication error',
      error: error.message 
    });
  }
};

module.exports = { verifyToken };
