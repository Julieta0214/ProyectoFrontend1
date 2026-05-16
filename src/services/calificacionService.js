import api from '../utils/api';

/**
 * Servicio para manejar las calificaciones (Notas)
 * Basado en CalificacionController.java
 */
const calificacionService = {
  
  /**
   * Obtiene la lista de calificaciones de un estudiante por su ID de matrícula
   * GET /api/calificaciones/matricula/{matriculaId}
   */
  listarPorMatricula: async (matriculaId) => {
    try {
      const response = await api.get(`/calificaciones/matricula/${matriculaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al listar calificaciones por matrícula ${matriculaId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene la lista de calificaciones de un grupo completo (para profesores)
   * GET /api/calificaciones/grupo/{grupoId}
   */
  listarPorGrupo: async (grupoId) => {
    try {
      const response = await api.get(`/calificaciones/grupo/${grupoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al listar calificaciones por grupo ${grupoId}:`, error);
      throw error;
    }
  },

  /**
   * Registra o actualiza una nota
   * POST /api/calificaciones
   * @param {Object} data - { matriculaId, momento, tipo, nota }
   */
  registrar: async (data) => {
    try {
      const response = await api.post('/calificaciones', data);
      return response.data;
    } catch (error) {
      console.error('Error al registrar calificación:', error);
      throw error;
    }
  },

  /**
   * Obtiene el resumen de notas finales y promedios por momento
   * GET /api/calificaciones/matricula/{matriculaId}/nota-final
   */
  obtenerResumenFinal: async (matriculaId) => {
    try {
      const response = await api.get(`/calificaciones/matricula/${matriculaId}/nota-final`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener nota final de matrícula ${matriculaId}:`, error);
      throw error;
    }
  }
};

export default calificacionService;
