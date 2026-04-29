const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dolenciaRoutes = require('./routes/dolencia.routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');

/**
 * Configuración de la aplicación Express
 */
function createApp() {
  const app = express();

  // Middlewares globales
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Logging de requests
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // Ruta de health check
  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  });

  // Rutas principales
  app.use('/dolencias', dolenciaRoutes);

  // Manejo de rutas no encontradas
  app.use(notFound);

  // Manejo de errores
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
