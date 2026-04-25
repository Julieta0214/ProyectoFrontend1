import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const FormProfesor = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [tituloProfesional, setTituloProfesional] = useState("");
  const [especializacion, setEspecializacion] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/usuarios/token/${token}`
        );
        if (!response.ok) throw new Error("Token inválido o expirado");
        const data = await response.json();
        setUsuario(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [token]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/api/profesores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: usuario.id,
          tituloProfesional,
          especializacion,
        }),
      });

      if (!response.ok) throw new Error("Error al completar registro");

      alert("Registro completado correctamente");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("No se pudo completar el registro.");
    }
  };
