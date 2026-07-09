/**
 * Handles requests to routes that don't exist.like here the there is no student route
 */
const notFound = (req, res, next) => {
 const error = new Error(`Route not found - ${req.originalUrl}`);
 res.status(404);
 next(error);
};
/**
 * Centralized error handler. Any error thrown or passed to next(error)
 * anywhere in the app ends up here, formatted consistently.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server-Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };