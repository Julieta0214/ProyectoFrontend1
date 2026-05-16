import api from '../utils/api';

/**
 * Servicio genérico para realizar peticiones CRUD (GET, POST, PUT, DELETE)
 */
const crudService = {
  // --- PETICIÓN GET (Obtener datos) ---
  getAll: async (url) => {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error en GET ${url}:`, error);
      throw error;
    }
  },

  getById: async (url, id) => {
    try {
      const response = await api.get(`${url}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error en GET ${url}/${id}:`, error);
      throw error;
    }
  },

  // --- PETICIÓN POST (Crear datos) ---
  create: async (url, data) => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      console.error(`Error en POST ${url}:`, error);
      throw error;
    }
  },

  // --- PETICIÓN PUT (Actualizar datos completos) ---
  update: async (url, id, data) => {
    try {
      const response = await api.put(`${url}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error en PUT ${url}/${id}:`, error);
      throw error;
    }
  },

  // --- PETICIÓN PATCH (Actualización parcial) ---
  patch: async (url, id, data) => {
    try {
      const response = await api.patch(`${url}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error en PATCH ${url}/${id}:`, error);
      throw error;
    }
  },

  // --- PETICIÓN DELETE (Eliminar datos) ---
  delete: async (url, id) => {
    try {
      const response = await api.delete(`${url}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error en DELETE ${url}/${id}:`, error);
      throw error;
    }
  }
};

export default crudService;
