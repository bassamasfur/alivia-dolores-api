/**
 * Middleware para manejo centralizado de errores
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);

  // Errores de validación
  if (err.message.includes('Validación fallida')) {
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      message: err.message
    });
  }

  // Recurso no encontrado
  if (err.message.includes('No se encontró')) {
    return res.status(404).json({
      success: false,
      error: 'Recurso no encontrado',
      message: err.message
    });
  }

  // Duplicado
  if (err.message.includes('Ya existe')) {
    return res.status(409).json({
      success: false,
      error: 'Conflicto',
      message: err.message
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error inesperado'
  });
};

/**
 * Middleware para rutas no encontradas
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada',
    message: `No se encontró la ruta: ${req.method} ${req.url}`
  });
};

module.exports = {
  errorHandler,
  notFound
};
