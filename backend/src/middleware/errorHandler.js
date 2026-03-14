const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  if (status >= 500) {
    logger.error('Server error', {
      code,
      message,
      stack: err.stack,
      url: req.url,
      method: req.method,
    });
  } else {
    logger.warn('Client error', { code, message, url: req.url });
  }

  res.status(status).json({
    status: 'error',
    code,
    message: status >= 500 ? 'An unexpected error occurred. Please try again later.' : message,
    ...(process.env.NODE_ENV === 'development' && status >= 500 ? { stack: err.stack } : {}),
  });
}

function notFoundHandler(req, res) {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.url} not found`,
  });
}

module.exports = { errorHandler, notFoundHandler };
