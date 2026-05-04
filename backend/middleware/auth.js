import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid token. User not found.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired.' 
      });
    }
    return res.status(500).json({ 
      error: 'Token verification failed.' 
    });
  }
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Check if user is room owner
export const isRoomOwner = async (req, res, next) => {
  try {
    const Room = (await import('../models/Room.js')).default;
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ 
        error: 'Room not found.' 
      });
    }

    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Access denied. Only room owner can perform this action.' 
      });
    }

    req.room = room;
    next();
  } catch (error) {
    return res.status(500).json({ 
      error: 'Error checking room ownership.' 
    });
  }
};

// Check if user is room participant
export const isRoomParticipant = async (req, res, next) => {
  try {
    const Room = (await import('../models/Room.js')).default;
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ 
        error: 'Room not found.' 
      });
    }

    const isParticipant = room.participants.some(p => 
      p.user.toString() === req.user._id.toString() && p.isActive
    );

    if (!isParticipant && room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Access denied. You are not a participant in this room.' 
      });
    }

    req.room = room;
    next();
  } catch (error) {
    return res.status(500).json({ 
      error: 'Error checking room participation.' 
    });
  }
};

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Rate limiting middleware (basic implementation)
export const rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(ip)) {
      requests.set(ip, requests.get(ip).filter(timestamp => timestamp > windowStart));
    } else {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip);
    
    if (userRequests.length >= max) {
      return res.status(429).json({ 
        error: 'Too many requests. Please try again later.' 
      });
    }

    userRequests.push(now);
    next();
  };
}; 