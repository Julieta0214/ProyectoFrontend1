import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const FormEstudiante = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [programas, setProgramas] = useState([]);
  const [programaId, setProgramaId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sinProgramas, setSinProgramas] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Carga usuario y programas al mismo tiempo
        const [usuarioRes, programasRes] = await Promise.all([
          fetch(`http://localhost:8081/api/usuarios/token/${token}`),
          fetch(`http://localhost:8081/api/programas/activos`),
        ]);

        if (!usuarioRes.ok) throw new Error("Token inválido o expirado");

        const usuarioData = await usuarioRes.json();
        const programasData = await programasRes.json();

        setUsuario(usuarioData);
        setProgramas(programasData);

        if (programasData.length === 0) setSinProgramas(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!programaId) {
      alert("Debes seleccionar un programa académico");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/api/estudiantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: String(usuario.id),
          programaId: String(programaId),
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

  return (
    <div>
      <h1>FormEstudiante</h1>
    </div>
  );
};
