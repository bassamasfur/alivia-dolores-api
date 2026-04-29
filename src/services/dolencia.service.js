const firebaseConfig = require('../config/firebase.config');
const Dolencia = require('../models/dolencia.model');
const { generateSlug } = require('../utils/slug');

/**
 * Servicio para operaciones CRUD de dolencias en Firebase
 */
class DolenciaService {
  constructor() {
    this.collectionName = 'dolencias';
  }

  getCollection() {
    const db = firebaseConfig.getDb();
    return db.collection(this.collectionName);
  }

  /**
   * Obtener todas las dolencias
   */
  async getAll() {
    try {
      const snapshot = await this.getCollection().get();
      
      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Error al obtener dolencias: ${error.message}`);
    }
  }

  /**
   * Obtener una dolencia por ID (slug)
   */
  async getById(id) {
    try {
      const doc = await this.getCollection().doc(id).get();

      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Error al buscar dolencia: ${error.message}`);
    }
  }

  /**
   * Obtener una dolencia por nombre
   */
  async getByNombre(nombre) {
    try {
      const id = generateSlug(nombre);
      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error al buscar dolencia: ${error.message}`);
    }
  }

  /**
   * Crear una nueva dolencia
   */
  async create(data) {
    try {
      // Validar datos
      const validation = Dolencia.validate(data);
      if (!validation.isValid) {
        throw new Error(`Validación fallida: ${validation.errors.join(', ')}`);
      }

      // Generar ID (slug) basado en el nombre
      const id = generateSlug(data.nombre);

      // Verificar si ya existe
      const existing = await this.getById(id);
      if (existing) {
        throw new Error(`Ya existe una dolencia con el nombre: ${data.nombre}`);
      }

      const dolencia = new Dolencia(data);
      
      // Usar set() con ID personalizado en lugar de add()
      await this.getCollection().doc(id).set({
        ...dolencia.toFirestore(),
        createdAt: new Date().toISOString()
      });

      return {
        id: id,
        ...data
      };
    } catch (error) {
      throw new Error(`Error al crear dolencia: ${error.message}`);
    }
  }

  /**
   * Actualizar una dolencia por ID o nombre
   */
  async updateByNombre(nombre, data) {
    try {
      const id = generateSlug(nombre);
      const existing = await this.getById(id);
      
      if (!existing) {
        throw new Error(`No se encontró la dolencia: ${nombre}`);
      }

      // Validar datos de actualización
      const dataToUpdate = { ...existing, ...data };
      const validation = Dolencia.validate(dataToUpdate);
      if (!validation.isValid) {
        throw new Error(`Validación fallida: ${validation.errors.join(', ')}`);
      }

      const dolencia = new Dolencia(dataToUpdate);
      await this.getCollection().doc(id).update(dolencia.toFirestore());

      return {
        id: id,
        ...dataToUpdate
      };
    } catch (error) {
      throw new Error(`Error al actualizar dolencia: ${error.message}`);
    }
  }

  /**
   * Eliminar una dolencia por nombre
   */
  async deleteByNombre(nombre) {
    try {
      const id = generateSlug(nombre);
      const existing = await this.getById(id);
      
      if (!existing) {
        throw new Error(`No se encontró la dolencia: ${nombre}`);
      }

      await this.getCollection().doc(id).delete();
      
      return {
        message: `Dolencia "${nombre}" eliminada correctamente`,
        id: id
      };
    } catch (error) {
      throw new Error(`Error al eliminar dolencia: ${error.message}`);
    }
  }

  /**
   * Cargar datos iniciales desde un array
   */
  async loadInitialData(dolenciasArray) {
    try {
      const results = {
        success: [],
        errors: []
      };

      for (const dolenciaData of dolenciasArray) {
        try {
          const id = generateSlug(dolenciaData.nombre);
          
          // Verificar si ya existe
          const existing = await this.getById(id);
          
          if (!existing) {
            await this.create(dolenciaData);
            results.success.push(`${dolenciaData.nombre} (ID: ${id})`);
          } else {
            results.errors.push({
              nombre: dolenciaData.nombre,
              id: id,
              error: 'Ya existe'
            });
          }
        } catch (error) {
          results.errors.push({
            nombre: dolenciaData.nombre,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Error al cargar datos iniciales: ${error.message}`);
    }
  }

  /**
   * Eliminar todas las dolencias
   */
  async deleteAll() {
    try {
      const snapshot = await this.getCollection().get();
      const deletePromises = [];

      snapshot.docs.forEach((doc) => {
        deletePromises.push(doc.ref.delete());
      });

      await Promise.all(deletePromises);

      return {
        message: `Se eliminaron ${snapshot.size} dolencias`,
        count: snapshot.size
      };
    } catch (error) {
      throw new Error(`Error al eliminar todas las dolencias: ${error.message}`);
    }
  }

  /**
   * Resetear: eliminar todo y cargar datos desde un array
   */
  async resetAndLoad(dolenciasArray) {
    try {
      // Primero eliminar todo
      const deleteResult = await this.deleteAll();
      console.log(`✅ ${deleteResult.message}`);

      // Luego cargar los nuevos datos
      const results = {
        deleted: deleteResult.count,
        success: [],
        errors: []
      };

      for (const dolenciaData of dolenciasArray) {
        try {
          const id = generateSlug(dolenciaData.nombre);
          await this.create(dolenciaData);
          results.success.push(`${dolenciaData.nombre} (ID: ${id})`);
        } catch (error) {
          results.errors.push({
            nombre: dolenciaData.nombre,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Error al resetear y cargar datos: ${error.message}`);
    }
  }
}

module.exports = new DolenciaService();
