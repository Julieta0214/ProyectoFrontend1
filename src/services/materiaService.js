import api from '../utils/api';

/**
 * Servicio para manejar las peticiones relacionadas con Materias (Asignaturas)
 * Basado en MateriaController.java
 */
const materiaService = {
  
  /**
   * Obtiene el catálogo global de todas las materias
   * GET /api/materias
   */
  listarTodas: async () => {
    try {
      const response = await api.get('/materias');
      return response.data;
    } catch (error) {
      console.error('Error al listar todas las materias:', error);
      throw error;
    }
  },

  /**
   * Obtiene solo las materias con estado ACTIVO
   * GET /api/materias/activas
   */
  listarActivas: async () => {
    try {
      const response = await api.get('/materias/activas');
      return response.data;
    } catch (error) {
      console.error('Error al listar materias activas:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva materia en el catálogo global
   * POST /api/materias
   * @param {string} nombre - Nombre de la materia
   */
  crear: async (nombre) => {
    try {
      const response = await api.post('/materias', { nombre });
      return response.data;
    } catch (error) {
      console.error('Error al crear materia:', error);
      throw error;
    }
  },

  /**
   * Actualiza el nombre de una materia existente
   * PUT /api/materias/{id}
   */
  actualizar: async (id, nombre) => {
    try {
      const response = await api.put(`/materias/${id}`, { nombre });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar materia ${id}:`, error);
      throw error;
    }
  },

  /**
   * Desactiva una materia del catálogo
   * DELETE /api/materias/{id}
   */
  desactivar: async (id) => {
    try {
      await api.delete(`/materias/${id}`);
    } catch (error) {
      console.error(`Error al desactivar materia ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lista las materias asociadas a un programa académico específico
   * GET /api/materias/programa/{programaId}
   */
  listarPorPrograma: async (programaId) => {
    try {
      const response = await api.get(`/materias/programa/${programaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al listar materias del programa ${programaId}:`, error);
      throw error;
    }
  },

  /**
   * Asigna una materia existente a un programa académico
   * POST /api/materias/programa/{programaId}/asignar/{materiaId}
   */
  asignarAPrograma: async (programaId, materiaId) => {
    try {
      const response = await api.post(`/materias/programa/${programaId}/asignar/${materiaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al asignar materia ${materiaId} al programa ${programaId}:`, error);
      throw error;
    }
  },

  /**
   * Quita la asociación de una materia con un programa académico
   * DELETE /api/materias/programa/{programaId}/quitar/{materiaId}
   */
  quitarDePrograma: async (programaId, materiaId) => {
    try {
      await api.delete(`/materias/programa/${programaId}/quitar/${materiaId}`);
    } catch (error) {
      console.error(`Error al quitar materia ${materiaId} del programa ${programaId}:`, error);
      throw error;
    }
  }
};

export default materiaService;
