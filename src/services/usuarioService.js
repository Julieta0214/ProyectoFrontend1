import api from '../utils/api';

/**
 * Servicio para manejar la gestión general de Usuarios
 * Basado en UsuarioController.java
 */
const usuarioService = {
  
  /**
   * Guarda o registra un nuevo usuario (Registro inicial)
   * POST /api/usuarios
   * @param {Object} usuario - Datos del usuario (nombres, apellidos, correo, contraseña, etc.)
   */
  guardar: async (usuario) => {
    try {
      const response = await api.post('/usuarios', usuario);
      return response.data;
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      throw error;
    }
  },

  /**
   * Lista todos los usuarios registrados (formato DDTO)
   * GET /api/usuarios
   */
  listar: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      throw error;
    }
  },

  /**
   * Asigna un rol a un usuario (Esto lo activa automáticamente en el backend)
   * PUT /api/usuarios/{id}/rol
   * @param {number} id - ID del usuario
   * @param {string} rol - El rol a asignar (ADMINISTRADOR, PROFESOR, ESTUDIANTE)
   */
  asignarRol: async (id, rol) => {
    try {
      const response = await api.put(`/usuarios/${id}/rol`, { rol });
      return response.data;
    } catch (error) {
      console.error(`Error al asignar rol ${rol} al usuario ${id}:`, error);
      throw error;
    }
  },

  /**
   * Envía el correo con el enlace para completar el registro
   * POST /api/usuarios/{id}/enviar-correo
   */
  enviarCorreo: async (id) => {
    try {
      await api.post(`/usuarios/${id}/enviar-correo`);
    } catch (error) {
      console.error(`Error al enviar correo al usuario ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca un usuario a través del token enviado en el correo de registro
   * GET /api/usuarios/token/{token}
   */
  buscarPorToken: async (token) => {
    try {
      const response = await api.get(`/usuarios/token/${token}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar usuario por token:', error);
      throw error;
    }
  }
};

export default usuarioService;
