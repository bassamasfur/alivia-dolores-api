const admin = require('firebase-admin');
const path = require('path');

class FirebaseConfig {
  constructor() {
    this.db = null;
  }

  initialize() {
    try {
      // Inicializar Firebase Admin con credenciales
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
        path.join(__dirname, '../../serviceAccountKey.json');
      const serviceAccount = require(serviceAccountPath);
      
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
