import api from '../utils/api';

/**
 * Servicio para manejar la recuperación de contraseñas
 * Basado en RecuperacionController.java
 */
const recuperacionService = {
  
  /**
   * Solicita el envío de un correo de recuperación
   * POST /api/recuperacion/solicitar
   * @param {string} correo - El correo electrónico del usuario
   */
  solicitarRecuperacion: async (correo) => {
    try {
      const response = await api.post('/recuperacion/solicitar', { correo });
      return response.data;
    } catch (error) {
      console.error('Error al solicitar recuperación:', error);
      throw error;
    }
  },

  /**
   * Valida si un token de recuperación sigue siendo válido
   * GET /api/recuperacion/validar/{token}
   */
  validarToken: async (token) => {
    try {
      const response = await api.get(`/recuperacion/validar/${token}`);
      return response.data; // Devuelve { valido: true/false }
    } catch (error) {
      console.error('Error al validar token de recuperación:', error);
      throw error;
    }
  },

  /**
   * Cambia la contraseña usando el token validado
   * POST /api/recuperacion/cambiar
   * @param {string} token - El token de recuperación
   * @param {string} nuevaContrasena - La nueva contraseña a establecer
   */
  cambiarContrasena: async (token, nuevaContrasena) => {
    try {
      const response = await api.post('/recuperacion/cambiar', { token, nuevaContrasena });
      return response.data;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }
};

export default recuperacionService;
