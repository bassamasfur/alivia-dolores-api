/**
 * Utilidad para generar slugs (IDs amigables)
 */

/**
 * Convierte un texto a un slug amigable
 * Ejemplo: "Dolor de Cabeza Tensional" -> "dolor-de-cabeza-tensional"
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    // Reemplazar caracteres especiales y espacios
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    // Reemplazar caracteres no alfanuméricos por guiones
    .replace(/[^a-z0-9]+/g, '-')
    // Eliminar guiones duplicados
    .replace(/-+/g, '-')
    // Eliminar guiones al inicio y final
    .replace(/^-|-$/g, '');
}

module.exports = {
  generateSlug
};
