import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const FormAdministrador = () => {
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

  return (
    <div>
      <h1>FormAdministrador</h1>
    </div>
  );
};
