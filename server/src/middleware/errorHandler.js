export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan.`
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error('SERVER ERROR:', err);

  const statusCode = err.statusCode || res.statusCode >= 400 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server.',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
