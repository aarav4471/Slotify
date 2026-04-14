const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle distinct Zod validation errors (used later)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors
    });
  }

  // Handle MySQL duplicate key error (Race condition/Double booking)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      error: 'Conflict Error',
      message: 'This time slot is already booked. Please choose another one.'
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};

module.exports = { errorHandler };
