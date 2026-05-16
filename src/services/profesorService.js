import api from '../utils/api';

/**
 * Servicio para manejar las peticiones relacionadas con Profesores
 * Basado en ProfesorController.java
 */
const profesorService = {
  
  /**
   * Completa el registro de un profesor (Título y Especialización)
   * POST /api/profesores
   * @param {Object} data - { id, tituloProfesional, especializacion }
   */
  completarRegistro: async (data) => {
    try {
      const response = await api.post('/profesores', data);
      return response.data;
    } catch (error) {
      console.error('Error al completar registro de profesor:', error);
      throw error;
    }
  },

  /**
   * Obtiene el perfil de un profesor por su ID
   * GET /api/profesores/{id}
   */
  obtenerPerfil: async (id) => {
    try {
      const response = await api.get(`/profesores/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener perfil del profesor ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza los datos y foto de un profesor
   * PUT /api/profesores/{id}
   */
  actualizarPerfil: async (id, datos) => {
    try {
      const response = await api.put(`/profesores/${id}`, datos);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar perfil del profesor ${id}:`, error);
      throw error;
    }
  },

  /**
   * Lista todos los profesores registrados (para administradores)
   * GET /api/profesores
   */
  listarTodos: async () => {
    try {
      const response = await api.get('/profesores');
      return response.data;
    } catch (error) {
      console.error('Error al listar profesores:', error);
      throw error;
    }
  }
};

export default profesorService;
