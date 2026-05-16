import api from '../utils/api';

/**
 * Servicio para manejar las peticiones relacionadas con Administradores
 * Basado en AdministradorController.java
 */
const administradorService = {
  
  /**
   * Completa el registro de un administrador (Título y Especialización)
   * POST /api/administradores
   */
  completarRegistro: async (datos) => {
    try {
      const response = await api.post('/administradores', datos);
      return response.data;
    } catch (error) {
      console.error('Error al completar registro de administrador:', error);
      throw error;
    }
  },

  /**
   * Obtiene el perfil de un administrador por ID
   * GET /api/administradores/{id}
   */
  obtenerPerfil: async (id) => {
    try {
      const response = await api.get(`/administradores/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener perfil del administrador ${id}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza los datos y foto de un administrador
   * PUT /api/administradores/{id}
   */
  actualizarPerfil: async (id, datos) => {
    try {
      const response = await api.put(`/administradores/${id}`, datos);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar perfil del administrador ${id}:`, error);
      throw error;
    }
  }
};

export default administradorService;
