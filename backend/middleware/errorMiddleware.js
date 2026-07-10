/**
  Handles requests to routes that dont exist.
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
  // Multer errors -file too large, wrong field name, etc. arrive with no
  // status code set on `res`, so map them to 400 explicitly.
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  }


  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };