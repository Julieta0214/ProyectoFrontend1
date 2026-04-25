import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");
  const [enviandoRecuperacion, setEnviandoRecuperacion] = useState(false);
  const [mensajeRecuperacion, setMensajeRecuperacion] = useState("");

  const [formData, setFormData] = useState({ correo: '', contraseña: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.rol);
      localStorage.setItem("id", data.id);
      localStorage.setItem("nombres", data.nombres);
      localStorage.setItem("apellidos", data.apellidos);
      switch (data.rol) {
        case "ESTUDIANTE": navigate("/dashboard/estudiante"); break;
        case "PROFESOR": navigate("/dashboard/profesor"); break;
        case "ADMINISTRADOR": navigate("/admonMain"); break;
        case "SUPER_ADMIN": navigate("/admonMain"); break;
        default: setError("Rol no reconocido");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    }
  };

  const handleRecuperacion = async (e) => {
    e.preventDefault();
    setEnviandoRecuperacion(true);
    setMensajeRecuperacion("");
    try {
      const response = await fetch("http://localhost:8081/api/recuperacion/solicitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correoRecuperacion }),
      });
