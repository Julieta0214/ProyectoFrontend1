import api from '../utils/api';

/**
 * Servicio para manejar la autenticación
 * Basado en AuthController.java
 */
const authService = {
  
  /**
   * Inicia sesión en el sistema
   * POST /api/auth/login
   * @param {Object} credentials - Objeto con correo y contraseña
   */
  login: async (credentials) => {
    try {
      // credentials debe ser { correo, contraseña }
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // El error 401 y 403 vendrán en error.response.data.error
      console.error('Error en el login:', error);
      throw error;
    }
  },

  /**
   * Cierra la sesión limpiando el almacenamiento local
   */
  logout: () => {
    localStorage.clear();
    window.location.href = '/login';
  }
};

export default authService;
