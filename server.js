require('dotenv').config();
const createApp = require('./src/app');
const firebaseConfig = require('./src/config/firebase.config');
const { initializeDataFromJson } = require('./src/utils/initializeData');

const PORT = process.env.PORT || 3000;

/**
 * Función para iniciar el servidor
 */
async function startServer() {
  try {
    console.log('🚀 Iniciando servidor...\n');

    // Inicializar Firebase
    firebaseConfig.initialize();

    // Crear aplicación Express
    const app = createApp();

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`\n✅ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`   - Health check: http://localhost:${PORT}/health`);
      console.log(`   - Dolencias API: http://localhost:${PORT}/dolencias`);
      console.log('\n📝 Endpoints disponibles:');
      console.log(`   GET    http://localhost:${PORT}/dolencias`);
      console.log(`   GET    http://localhost:${PORT}/dolencias/id/:id`);
      console.log(`   GET    http://localhost:${PORT}/dolencias/:nombre`);
      console.log(`   POST   http://localhost:${PORT}/dolencias/reload`);
      console.log(`   POST   http://localhost:${PORT}/dolencias`);
      console.log(`   PUT    http://localhost:${PORT}/dolencias/:nombre`);
      console.log(`   DELETE http://localhost:${PORT}/dolencias/:nombre`);
      console.log('\n💡 Tip: Para cargar datos iniciales, ejecuta: npm run load-data\n');
    });

    // Manejo de señales de terminación
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM recibido. Cerrando servidor...');
      server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n👋 SIGINT recibido. Cerrando servidor...');
      server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
}

// Script para cargar datos iniciales
if (process.argv.includes('--load-data')) {
  (async () => {
    try {
      firebaseConfig.initialize();
      await initializeDataFromJson();
      process.exit(0);
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  })();
} else {
  startServer();
}
