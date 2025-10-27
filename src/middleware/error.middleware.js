
module.exports = (err, req, res, next) => {
  console.error('🔥 Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server error 💥',
  });
};
