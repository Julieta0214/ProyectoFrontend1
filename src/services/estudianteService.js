import api from '../utils/api';

/**
 * Servicio para manejar las peticiones relacionadas con Estudiantes
 * Basado en EstudianteController.java
 */
const estudianteService = {
  
  /**
   * Completa el registro de un estudiante vinculándolo a un programa
   * POST /api/estudiantes
   * @param {Object} data - { id, programaId }
   */
  completarRegistro: async (data) => {
    try {
      const response = await api.post('/estudiantes', data);
      return response.data;
    } catch (error) {
      console.error('Error al completar registro de estudiante:', error);
      throw error;
    }
  },

  /**
   * Obtiene el perfil de un estudiante por su ID
   * GET /api/estudiantes/{id}
   */
  obtenerPerfil: async (id) => {
    try {
      const response = await api.get(`/estudiantes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener perfil del estudiante ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza los datos y foto de un estudiante
   * PUT /api/estudiantes/{id}
   */
  actualizarPerfil: async (id, datos) => {
    try {
      const response = await api.put(`/estudiantes/${id}`, datos);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar perfil del estudiante ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lista todos los estudiantes registrados (para administradores)
   * GET /api/estudiantes
   */
  listarTodos: async () => {
    try {
      const response = await api.get('/estudiantes');
      return response.data;
    } catch (error) {
      console.error('Error al listar estudiantes:', error);
      throw error;
    }
  }
};

export default estudianteService;
