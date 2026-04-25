import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const RecuperarContrasena = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [tokenValido, setTokenValido] = useState(null);
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const validar = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/recuperacion/validar/${token}`
        );
        const data = await response.json();
        setTokenValido(data.valido);
      } catch {
        setTokenValido(false);
      } finally {
        setLoading(false);
      }
    };
    validar();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!regex.test(nuevaContrasena)) {
      setError("Mínimo 8 caracteres, una mayúscula, un número y un carácter especial");
      return;
    }
    if (nuevaContrasena !== confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setGuardando(true);
    try {
      const response = await fetch("http://localhost:8081/api/recuperacion/cambiar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaContrasena }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "No se pudo cambiar la contraseña");
        return;
      }

      alert("Contraseña actualizada correctamente. Ya puedes iniciar sesión.");
      navigate("/login");
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setGuardando(false);
    }
  };