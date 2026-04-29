/**
 * Modelo de Dolencia
 * Define la estructura y validaciones de una dolencia
 */
class Dolencia {
  constructor(data) {
    this.nombre = data.nombre;
    this.comer_mas = data.comer_mas || [];
    this.evitar = data.evitar || [];
    this.por_que = data.por_que;
    this.receta_titulo = data.receta_titulo;
    this.receta_pasos = data.receta_pasos;
    this.red_flag = data.red_flag;
  }

  /**
   * Valida que los datos de la dolencia sean correctos
   */
  static validate(data) {
    const errors = [];

    if (!data.nombre || typeof data.nombre !== 'string' || data.nombre.trim() === '') {
      errors.push('El nombre es requerido y debe ser un texto válido');
    }

    if (data.comer_mas && !Array.isArray(data.comer_mas)) {
      errors.push('comer_mas debe ser un array');
    }

    if (data.evitar && !Array.isArray(data.evitar)) {
      errors.push('evitar debe ser un array');
    }

    if (!data.por_que || typeof data.por_que !== 'string') {
      errors.push('por_que es requerido y debe ser un texto válido');
    }

    if (!data.receta_titulo || typeof data.receta_titulo !== 'string') {
      errors.push('receta_titulo es requerido');
    }

    if (!data.receta_pasos || typeof data.receta_pasos !== 'string') {
      errors.push('receta_pasos es requerido');
    }

    if (!data.red_flag || typeof data.red_flag !== 'string') {
      errors.push('red_flag es requerido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Convierte el objeto a formato para Firebase
   */
  toFirestore() {
    return {
      nombre: this.nombre,
      comer_mas: this.comer_mas,
      evitar: this.evitar,
      por_que: this.por_que,
      receta_titulo: this.receta_titulo,
      receta_pasos: this.receta_pasos,
      red_flag: this.red_flag,
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Crea una instancia desde un documento de Firebase
   */
  static fromFirestore(doc) {
    const data = doc.data();
    return new Dolencia({
      id: doc.id,
      ...data
    });
  }
}

module.exports = Dolencia;
