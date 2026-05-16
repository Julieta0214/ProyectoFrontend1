import api from '../utils/api';

/**
 * Servicio para manejar las peticiones relacionadas con Matrículas
 * Basado en MatriculaController.java
 */
const matriculaService = {
  
  /**
   * Lista todas las matrículas registradas en el sistema
   * GET /api/matriculas
   */
  listarTodas: async () => {
    try {
      const response = await api.get('/matriculas');
      return response.data;
    } catch (error) {
      console.error('Error al listar todas las matrículas:', error);
      throw error;
    }
  },

  /**
   * Lista los estudiantes matriculados en un grupo específico
   * GET /api/matriculas/grupo/{grupoId}
   */
  listarPorGrupo: async (grupoId) => {
    try {
      const response = await api.get(`/matriculas/grupo/${grupoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al listar matrículas del grupo ${grupoId}:`, error);
      throw error;
    }
  },

  /**
   * Lista los grupos en los que está matriculado un estudiante específico
   * GET /api/matriculas/estudiante/{estudianteId}
   */
  listarPorEstudiante: async (estudianteId) => {
    try {
      const response = await api.get(`/matriculas/estudiante/${estudianteId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al listar matrículas del estudiante ${estudianteId}:`, error);
      throw error;
    }
  },

  /**
   * Realiza la matrícula de un estudiante en un grupo
   * POST /api/matriculas
   * @param {Object} data - { grupoId, estudianteId }
   */
  matricular: async (data) => {
    try {
      const response = await api.post('/matriculas', data);
      return response.data;
    } catch (error) {
      console.error('Error al realizar matrícula:', error);
      throw error;
    }
  },

  /**
   * Retira a un estudiante de un grupo (Eliminación lógica o física según backend)
   * DELETE /api/matriculas/{id}
   */
  retirar: async (id) => {
    try {
      await api.delete(`/matriculas/${id}`);
    } catch (error) {
      console.error(`Error al retirar matrícula ${id}:`, error);
      throw error;
    }
  }
};

export default matriculaService;
