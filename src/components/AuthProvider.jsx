import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { showAlert } from "../utils/alerts";
import api from "../utils/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      return {
        id: localStorage.getItem("id"),
        rol: localStorage.getItem("rol"),
        nombres: localStorage.getItem("nombres"),
        apellidos: localStorage.getItem("apellidos"),
        token: token,
      };
    }
    return null;
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (correo, contraseña) => {
    setLoading(true);
    try {
      // Intentar login con la API
      const response = await api.post("/auth/login", { correo, contraseña });
      const { token, usuario } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("rol", usuario.rol);
      localStorage.setItem("id", usuario.id);
      localStorage.setItem("nombres", usuario.nombres);
      localStorage.setItem("apellidos", usuario.apellidos);

      setUser({ ...usuario, token });
      
      let targetUrl = "/dashboard";
      if (usuario.rol === "ESTUDIANTE") targetUrl = "/dashboard/estudiante";
      if (usuario.rol === "PROFESOR") targetUrl = "/dashboard/profesor";
      if (usuario.rol === "ADMINISTRADOR" || usuario.rol === "SUPER_ADMIN") targetUrl = "/admonMain";

      showAlert({
        title: "¡Bienvenido!",
        text: `Hola ${usuario.nombres}, has iniciado sesión correctamente.`,
        icon: "success",
        navigate,
        url: targetUrl,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      
      // Fallback para mock si la API falla
      const usuarios = JSON.parse(localStorage.getItem("usuarios_db") || "[]");
      const usuarioMock = usuarios.find(u => u.correo === correo && u.contraseña === contraseña);

      if (usuarioMock) {
        localStorage.setItem("token", usuarioMock.token || "fake-token");
        localStorage.setItem("rol", usuarioMock.rol);
        localStorage.setItem("id", usuarioMock.id);
        localStorage.setItem("nombres", usuarioMock.nombres);
        localStorage.setItem("apellidos", usuarioMock.apellidos);

        setUser(usuarioMock);

        let targetUrl = "/dashboard";
        if (usuarioMock.rol === "ESTUDIANTE") targetUrl = "/dashboard/estudiante";
        if (usuarioMock.rol === "PROFESOR") targetUrl = "/dashboard/profesor";
        if (usuarioMock.rol === "ADMINISTRADOR" || usuarioMock.rol === "SUPER_ADMIN") targetUrl = "/admonMain";

        showAlert({
          title: "¡Bienvenido! (Modo Mock)",
          text: `Hola ${usuarioMock.nombres}, has iniciado sesión correctamente.`,
          icon: "success",
          navigate,
          url: targetUrl,
        });
        return true;
      }

      showAlert({
        title: "Error de acceso",
        text: "Correo o contraseña incorrectos",
        icon: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("id");
    localStorage.removeItem("nombres");
    localStorage.removeItem("apellidos");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
