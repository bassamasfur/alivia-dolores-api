const fs = require('fs');
const path = require('path');
const dolenciaService = require('../services/dolencia.service');

/**
 * Utilidad para cargar datos iniciales desde datos.json a Firebase
 */
async function initializeDataFromJson() {
  try {
    console.log('📁 Cargando datos desde datos.json...');
    
    // Leer el archivo datos.json
    const dataPath = path.join(__dirname, '../../datos.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const jsonData = JSON.parse(rawData);

    if (!jsonData.dolencias || !Array.isArray(jsonData.dolencias)) {
      throw new Error('El archivo datos.json no tiene el formato esperado');
    }

    console.log(`📊 Se encontraron ${jsonData.dolencias.length} dolencias`);
    
    // Cargar datos a Firebase
    const results = await dolenciaService.loadInitialData(jsonData.dolencias);

    console.log('\n✅ Proceso completado:');
    console.log(`   - Cargadas exitosamente: ${results.success.length}`);
    console.log(`   - Errores: ${results.errors.length}`);

    if (results.success.length > 0) {
      console.log('\n✓ Dolencias cargadas:');
      results.success.forEach(nombre => console.log(`   - ${nombre}`));
    }

    if (results.errors.length > 0) {
      console.log('\n⚠ Errores encontrados:');
      results.errors.forEach(({ nombre, error }) => {
        console.log(`   - ${nombre}: ${error}`);
      });
    }

    return results;
  } catch (error) {
    console.error('❌ Error al inicializar datos:', error.message);
    throw error;
  }
}

module.exports = {
  initializeDataFromJson
};
