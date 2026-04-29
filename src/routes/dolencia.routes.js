const express = require('express');
const router = express.Router();
const dolenciaController = require('../controllers/dolencia.controller');

/**
 * Rutas para el recurso de dolencias
 * Base path: /dolencias
 */

// GET /dolencias - Obtener todas las dolencias
router.get('/', (req, res, next) => dolenciaController.getAll(req, res, next));

// POST /dolencias/reload - Limpiar y recargar datos desde datos.json (DEBE IR ANTES DE /:nombre)
router.post('/reload', (req, res, next) => dolenciaController.reload(req, res, next));

// GET /dolencias/id/:id - Obtener una dolencia por ID (slug)
router.get('/id/:id', (req, res, next) => dolenciaController.getById(req, res, next));

// POST /dolencias - Crear una nueva dolencia
router.post('/', (req, res, next) => dolenciaController.create(req, res, next));

// GET /dolencias/:nombre - Obtener una dolencia específica por nombre
router.get('/:nombre', (req, res, next) => dolenciaController.getByNombre(req, res, next));

// PUT /dolencias/:nombre - Actualizar una dolencia
router.put('/:nombre', (req, res, next) => dolenciaController.update(req, res, next));

// DELETE /dolencias/:nombre - Eliminar una dolencia
router.delete('/:nombre', (req, res, next) => dolenciaController.delete(req, res, next));

module.exports = router;
