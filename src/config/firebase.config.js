const admin = require('firebase-admin');
const path = require('path');

class FirebaseConfig {
  constructor() {
    this.db = null;
  }

  initialize() {
    try {
      // Inicializar Firebase Admin con credenciales
      let serviceAccount;
      
      // En Vercel, usar la variable de entorno con el JSON completo
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        console.log('✅ Usando credenciales de Firebase desde variable de entorno');
      } else {
        // En local, usar el archivo
        const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
        serviceAccount = require(serviceAccountPath);
        console.log('✅ Usando credenciales de Firebase desde archivo local');
      }
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });

      this.db = admin.firestore();
      console.log('✅ Firebase inicializado correctamente');
      return this.db;
    } catch (error) {
      console.error('❌ Error al inicializar Firebase:', error.message);
      throw error;
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Firebase no ha sido inicializado. Llama a initialize() primero.');
    }
    return this.db;
  }
}

module.exports = new FirebaseConfig();
