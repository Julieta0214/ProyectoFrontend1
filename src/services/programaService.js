import api from '../utils/api';

/**
 * Servicio para manejar los Programas Académicos
 * Basado en ProgramaAcademicoController.java
 */
const programaService = {
  
  /**
   * Obtiene la lista de programas académicos con estado ACTIVO
   * Útil para el selector del formulario de registro de estudiantes
   * GET /api/programas/activos
   */
  listarActivos: async () => {
    try {
      const response = await api.get('/programas/activos');
      return response.data;
    } catch (error) {
      console.error('Error al listar programas activos:', error);
      throw error;
    }
  },

  /**
   * Obtiene la lista de todos los programas (activos e inactivos)
   * GET /api/programas
   */
  listarTodos: async () => {
    try {
      const response = await api.get('/programas');
      return response.data;
    } catch (error) {
      console.error('Error al listar todos los programas:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo programa académico
   * POST /api/programas
   * @param {Object} programa - Datos del programa (nombre, modalidad, descripción, etc.)
   */
  crear: async (programa) => {
    try {
      const response = await api.post('/programas', programa);
      return response.data;
    } catch (error) {
      console.error('Error al crear programa académico:', error);
      throw error;
    }
  },

  /**
   * Actualiza los datos de un programa existente
   * PUT /api/programas/{id}
   */
  actualizar: async (id, datos) => {
    try {
      const response = await api.put(`/programas/${id}`, datos);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar programa ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina o desactiva un programa académico
   * DELETE /api/programas/{id}
   */
  eliminar: async (id) => {
    try {
      await api.delete(`/programas/${id}`);
    } catch (error) {
      console.error(`Error al eliminar programa ${id}:`, error);
      throw error;
    }
  }
};

export default programaService;
