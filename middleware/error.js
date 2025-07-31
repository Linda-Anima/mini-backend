import ApiResponse from '../utils/apiResponse.js';

// Error handler middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json(
      ApiResponse.error(messages.join(', '))
    );
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json(
      ApiResponse.error(`${field} already exists`)
    );
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(
      ApiResponse.error('Not authorized')
    );
  }

  // Default to 500 server error
  res.status(500).json(
    ApiResponse.error('Server Error')
  );
};