import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import ApiResponse from '../utils/apiResponse.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json(
      ApiResponse.error('Not authorized to access this route')
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (err) {
    return res.status(401).json(
      ApiResponse.error('Not authorized to access this route')
    );
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(
        ApiResponse.error(`User role ${req.user.role} is not authorized to access this route`)
      );
    }
    next();
  };
};