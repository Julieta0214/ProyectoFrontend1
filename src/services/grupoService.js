import api from '../utils/api';

/**
 * Servicio para manejar las peticiones relacionadas con Grupos
 * Basado en GrupoController.java
 */
const grupoService = {
  
  /**
   * Lista todos los grupos (incluyendo inactivos)
   * GET /api/grupos
   */
  listarTodos: async () => {
    try {
      const response = await api.get('/grupos');
      return response.data;
    } catch (error) {
      console.error('Error al listar todos los grupos:', error);
      throw error;
    }
  },

  /**
   * Lista solo los grupos con estado ACTIVO
   * GET /api/grupos/activos
   */
  listarActivos: async () => {
    try {
      const response = await api.get('/grupos/activos');
      return response.data;
    } catch (error) {
      console.error('Error al listar grupos activos:', error);
      throw error;
    }
  },

  /**
   * Lista los grupos asignados a un profesor específico
   * GET /api/grupos/profesor/{profesorId}
   */
  listarPorProfesor: async (profesorId) => {
    try {
      const response = await api.get(`/grupos/profesor/${profesorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al listar grupos del profesor ${profesorId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene el detalle de un grupo por su ID
   * GET /api/grupos/{id}
   */
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/grupos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener grupo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo grupo
   * POST /api/grupos
   * @param {Object} data - Datos del grupo (nombre, semestre, cupoMaximo, materiaId, profesorId)
   */
  crear: async (data) => {
    try {
      const response = await api.post('/grupos', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear grupo:', error);
      throw error;
    }
  },

  /**
   * Actualiza los datos de un grupo existente
   * PUT /api/grupos/{id}
   */
  actualizar: async (id, data) => {
    try {
      const response = await api.put(`/grupos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar grupo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Desactiva (Eliminación lógica) un grupo
   * DELETE /api/grupos/{id}
   */
  desactivar: async (id) => {
    try {
      await api.delete(`/grupos/${id}`);
    } catch (error) {
      console.error(`Error al desactivar grupo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Activa un grupo que estaba desactivado
   * PUT /api/grupos/{id}/activar
   */
  activar: async (id) => {
    try {
      const response = await api.put(`/grupos/${id}/activar`);
      return response.data;
    } catch (error) {
      console.error(`Error al activar grupo ${id}:`, error);
      throw error;
    }
  }
};

export default grupoService;
