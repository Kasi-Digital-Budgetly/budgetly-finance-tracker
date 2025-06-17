// Handles 404 Not Found errors
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware (our errorHandler)
};

// Generic error handling middleware
const errorHandler = (err, req, res, next) => {
  // If status code is 200, but an error occurred, change to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message, // Send the error message
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Send stack trace only in development
  });
};

export { notFound, errorHandler };