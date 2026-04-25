import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const ProfesorDashboard = () => {
  const navigate = useNavigate();
  const id = localStorage.getItem("id");
  const fileInputRef = useRef(null);
  const { darkMode, toggleDarkMode } = useTheme();

  const [perfil, setPerfil] = useState(null);
  const [seccion, setSeccion] = useState("perfil");
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // ── Estados de grupos y calificaciones ──
  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [matriculasGrupo, setMatriculasGrupo] = useState([]);
  const [calificacionesGrupo, setCalificacionesGrupo] = useState([]);
  const [momentoActivo, setMomentoActivo] = useState(1);
  const [loadingGrupo, setLoadingGrupo] = useState(false);
  const [guardandoNota, setGuardandoNota] = useState(false);

  const TIPOS = ["PARCIAL_1", "PARCIAL_2", "TRABAJO", "EXAMEN_FINAL"];
  const TIPOS_LABEL = {
    PARCIAL_1: "Parcial 1",
    PARCIAL_2: "Parcial 2",
    TRABAJO: "Trabajo",
    EXAMEN_FINAL: "Examen final",
  };
  const PESOS = { PARCIAL_1: 0.20, PARCIAL_2: 0.20, TRABAJO: 0.20, EXAMEN_FINAL: 0.40 };
  const PESOS_MOMENTO = { 1: 0.30, 2: 0.30, 3: 0.40 };

  // ── Estilos dinámicos ──
  const bg = "var(--color-primario)";
  const cardBg = darkMode ? "#2a2a2a" : "white";
  const cardBorder = darkMode ? "1px solid rgba(93,206,165,0.2)" : "1px solid rgba(0,79,57,0.15)";
  const textoP = "var(--color-acento)";
  const textoS = "var(--color-secundario)";
  const metricaBg = darkMode ? "#333" : "var(--color-primario)";
  const inputStyle = {
    width: "100%", padding: "8px 10px",
    border: darkMode ? "1px solid rgba(93,206,165,0.3)" : "1px solid rgba(0,79,57,0.3)",
    borderRadius: "8px", fontSize: "14px", color: textoP,
    background: darkMode ? "#333" : "white", boxSizing: "border-box",
  };
  const btnPrimario = {
    background: textoS, color: darkMode ? "#1a1a1a" : "white",
    border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px",
  };
  const btnSecundario = {
    background: "none", border: `1px solid ${textoS}`, color: textoS,
    padding: "6px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px",
  };

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const [perfilRes, gruposRes] = await Promise.all([
          fetch(`http://localhost:8081/api/profesores/${id}`, { headers }),
          fetch(`http://localhost:8081/api/grupos/profesor/${id}`, { headers }),
        ]);
        if (!perfilRes.ok) throw new Error("Error al cargar el perfil");
        if (!gruposRes.ok) throw new Error("Error al cargar grupos");
        const perfilData = await perfilRes.json();
        const gruposData = await gruposRes.json();
        setPerfil(perfilData);
        setGrupos(gruposData);
        setFormEdit({
          correo: perfilData.correo,
          numeroCelular: perfilData.numeroCelular,
          tituloProfesional: perfilData.tituloProfesional,
          especializacion: perfilData.especializacion,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [id]);

  // ── Cargar matriculas y calificaciones del grupo ──
  const seleccionarGrupo = async (grupo) => {
    setGrupoSeleccionado(grupo);
    setLoadingGrupo(true);
    setMomentoActivo(1);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [matriculasRes, calificacionesRes] = await Promise.all([
        fetch(`http://localhost:8081/api/matriculas/grupo/${grupo.id}`, { headers }),
        fetch(`http://localhost:8081/api/calificaciones/grupo/${grupo.id}`, { headers }),
      ]);
      const matriculasData = await matriculasRes.json();
      const calificacionesData = await calificacionesRes.json();
      setMatriculasGrupo(matriculasData.filter(m => m.estado === "ACTIVO"));
      setCalificacionesGrupo(calificacionesData);
    } catch {
      alert("No se pudo cargar la información del grupo");
    } finally {
      setLoadingGrupo(false);
    }
  };

  // ── Obtener nota de un estudiante en un momento y tipo ──
  const getNota = (matriculaId, momento, tipo) => {
    const cal = calificacionesGrupo.find(
      c => c.matricula.id === matriculaId && c.momento === momento && c.tipo === tipo
    );
    return cal ? cal.nota : "";
  };

  // ── Calcular promedio de un momento para una matrícula ──
  const calcularPromedioMomento = (matriculaId, momento) => {
    let total = 0;
    let tieneTodas = true;
    for (const tipo of TIPOS) {
      const nota = getNota(matriculaId, momento, tipo);
      if (nota === "") { tieneTodas = false; break; }
      total += nota * PESOS[tipo];
    }
    return tieneTodas ? (Math.round(total * 100) / 100) : null;
  };

  // ── Calcular nota final ──
  const calcularNotaFinal = (matriculaId) => {
    let total = 0;
    for (let m = 1; m <= 3; m++) {
      const pm = calcularPromedioMomento(matriculaId, m);
      if (pm === null) return null;
      total += pm * PESOS_MOMENTO[m];
    }
    return Math.round(total * 100) / 100;
  };

  // ── Registrar nota ──
  const registrarNota = async (matriculaId, momento, tipo, nota) => {
    if (nota === "" || isNaN(nota)) return;
    const notaNum = parseFloat(nota);
    if (notaNum < 0 || notaNum > 5) { alert("La nota debe estar entre 0.0 y 5.0"); return; }
    setGuardandoNota(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/calificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          matriculaId: String(matriculaId),
          momento: String(momento),
          tipo,
          nota: String(notaNum),
        }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setCalificacionesGrupo(prev => {
        const existe = prev.findIndex(c => c.matricula.id === matriculaId && c.momento === momento && c.tipo === tipo);
        if (existe >= 0) {
          const nuevas = [...prev];
          nuevas[existe] = data;
          return nuevas;
        }
        return [...prev, data];
      });
    } catch {
      alert("No se pudo guardar la nota");
    } finally {
      setGuardandoNota(false);
    }
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8081/api/profesores/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ foto: reader.result }),
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        setPerfil(data);
        alert("Foto actualizada correctamente");
      } catch { alert("No se pudo actualizar la foto"); }
    };
    reader.readAsDataURL(file);
  };
