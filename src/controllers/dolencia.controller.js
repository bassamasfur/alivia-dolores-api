const dolenciaService = require('../services/dolencia.service');

/**
 * Controlador para las operaciones de dolencias
 */
class DolenciaController {
  /**
   * GET /dolencias - Obtener todas las dolencias
   */
  async getAll(req, res, next) {
    try {
      const dolencias = await dolenciaService.getAll();
      
      res.status(200).json({
        success: true,
        count: dolencias.length,
        data: dolencias
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /dolencias/:nombre - Obtener una dolencia por nombre
   */
  async getByNombre(req, res, next) {
    try {
      const { nombre } = req.params;
      const dolencia = await dolenciaService.getByNombre(nombre);

      if (!dolencia) {
        return res.status(404).json({
          success: false,
          message: `No se encontró la dolencia: ${nombre}`
        });
      }

      res.status(200).json({
        success: true,
        data: dolencia
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /dolencias/id/:id - Obtener una dolencia por ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const dolencia = await dolenciaService.getById(id);

      if (!dolencia) {
        return res.status(404).json({
          success: false,
          message: `No se encontró la dolencia con ID: ${id}`
        });
      }

      res.status(200).json({
        success: true,
        data: dolencia
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /dolencias - Crear una nueva dolencia
   */
  async create(req, res, next) {
    try {
      const dolencia = await dolenciaService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Dolencia creada correctamente',
        data: dolencia
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /dolencias/:nombre - Actualizar una dolencia
   */
  async update(req, res, next) {
    try {
      const { nombre } = req.params;
      const dolencia = await dolenciaService.updateByNombre(nombre, req.body);

      res.status(200).json({
        success: true,
        message: 'Dolencia actualizada correctamente',
        data: dolencia
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /dolencias/:nombre - Eliminar una dolencia
   */
  async delete(req, res, next) {
    try {
      const { nombre } = req.params;
      const result = await dolenciaService.deleteByNombre(nombre);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /dolencias/reload - Limpiar y recargar datos desde datos.json
   */
  async reload(req, res, next) {
    try {
      const fs = require('fs');
      const path = require('path');

      // Leer datos.json
      const dataPath = path.join(__dirname, '../../datos.json');
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const jsonData = JSON.parse(rawData);

      if (!jsonData.dolencias || !Array.isArray(jsonData.dolencias)) {
        return res.status(400).json({
          success: false,
          message: 'El archivo datos.json no tiene el formato esperado'
        });
      }

      const results = await dolenciaService.resetAndLoad(jsonData.dolencias);

      res.status(200).json({
        success: true,
        message: 'Datos recargados correctamente',
        deleted: results.deleted,
        loaded: results.success.length,
        errors: results.errors.length,
        data: {
          success: results.success,
          errors: results.errors
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DolenciaController();
