import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const EstudianteDashboard = () => {
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
  const [generandoPdf, setGenerandoPdf] = useState(false);

  const [matriculas, setMatriculas] = useState([]);
  const [calificacionesMap, setCalificacionesMap] = useState({});
  const [matriculaSeleccionada, setMatriculaSeleccionada] = useState(null);

  const PESOS = { PARCIAL_1: 0.20, PARCIAL_2: 0.20, TRABAJO: 0.20, EXAMEN_FINAL: 0.40 };
  const PESOS_M = { 1: 0.30, 2: 0.30, 3: 0.40 };
  const TIPOS_LABEL = { PARCIAL_1: "Parcial 1", PARCIAL_2: "Parcial 2", TRABAJO: "Trabajo", EXAMEN_FINAL: "Examen final" };
  const TIPOS = ["PARCIAL_1", "PARCIAL_2", "TRABAJO", "EXAMEN_FINAL"];

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
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const [perfilRes, matriculasRes] = await Promise.all([
          fetch(`http://localhost:8081/api/estudiantes/${id}`, { headers }),
          fetch(`http://localhost:8081/api/matriculas/estudiante/${id}`, { headers }),
        ]);
        if (!perfilRes.ok) throw new Error("Error al cargar el perfil");
        if (!matriculasRes.ok) throw new Error("Error al cargar matrículas");
        const perfilData = await perfilRes.json();
        const matriculasData = await matriculasRes.json();
        setPerfil(perfilData);
        const activas = matriculasData.filter(m => m.estado === "ACTIVO");
        setMatriculas(activas);
        setFormEdit({ correo: perfilData.correo, numeroCelular: perfilData.numeroCelular });

        // ✅ Carga todas las calificaciones de todas las matrículas automáticamente
        const token2 = localStorage.getItem("token");
        const calPromises = activas.map(m =>
          fetch(`http://localhost:8081/api/calificaciones/matricula/${m.id}`, {
            headers: { Authorization: `Bearer ${token2}` }
          }).then(r => r.json()).then(data => ({ id: m.id, data }))
        );
        const resultados = await Promise.all(calPromises);
        const mapa = {};
        resultados.forEach(r => { mapa[r.id] = r.data; });
        setCalificacionesMap(mapa);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ── Calcular promedio de un momento ──
  const calcularPromedioMomento = (cals, momento) => {
    const notas = cals.filter(c => c.momento === momento);
    if (notas.length < 4) return null;
    return Math.round(notas.reduce((acc, c) => acc + c.nota * PESOS[c.tipo], 0) * 100) / 100;
  };

  // ── Calcular nota final de una matrícula ──
  const calcularNotaFinal = (matriculaId) => {
    const cals = calificacionesMap[matriculaId] ?? [];
    let total = 0;
    for (let m = 1; m <= 3; m++) {
      const pm = calcularPromedioMomento(cals, m);
      if (pm === null) return null;
      total += pm * PESOS_M[m];
    }
    return Math.round(total * 100) / 100;
  };

  // ── Calcular promedio general ──
  const calcularPromedioGeneral = () => {
    const notas = matriculas.map(m => calcularNotaFinal(m.id)).filter(n => n !== null);
    if (notas.length === 0) return null;
    return Math.round(notas.reduce((a, b) => a + b, 0) / notas.length * 100) / 100;
  };

  // ── Cargar calificaciones bajo demanda ──
  const cargarCalificaciones = async (matriculaId) => {
    if (calificacionesMap[matriculaId]) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8081/api/calificaciones/matricula/${matriculaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setCalificacionesMap(prev => ({ ...prev, [matriculaId]: data }));
    } catch { alert("No se pudieron cargar las calificaciones"); }
  };

  // ── Generar PDF ──
  const generarPdf = () => {
    setGenerandoPdf(true);
    try {
      const promedioGeneral = calcularPromedioGeneral();
      const fecha = new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });

      const filasMaterias = matriculas.map(matricula => {
        const cals = calificacionesMap[matricula.id] ?? [];
        const notaFinal = calcularNotaFinal(matricula.id);
        const filasFilas = [1, 2, 3].map(momento => {
          const notas = cals.filter(c => c.momento === momento);
          const promMomento = calcularPromedioMomento(cals, momento);
          return `
            <tr>
              <td rowspan="1" style="padding:6px 10px;border:1px solid #ddd;font-size:12px;background:#f9f9f9;">Momento ${momento} (${momento === 3 ? "40%" : "30%"})</td>
              ${TIPOS.map(tipo => {
                const cal = notas.find(c => c.tipo === tipo);
                const nota = cal ? cal.nota.toFixed(1) : "—";
                const color = cal ? (cal.nota >= 3 ? "#27500A" : cal.nota >= 2 ? "#854F0B" : "#791F1F") : "#888";
                return `<td style="padding:6px 10px;border:1px solid #ddd;text-align:center;font-size:12px;color:${color};font-weight:500;">${nota}</td>`;
              }).join("")}
              <td style="padding:6px 10px;border:1px solid #ddd;text-align:center;font-size:12px;font-weight:600;color:${promMomento !== null ? (promMomento >= 3 ? "#27500A" : "#791F1F") : "#888"};">
                ${promMomento !== null ? promMomento.toFixed(2) : "—"}
              </td>
            </tr>
          `;
        }).join("");

        return `
          <div style="margin-bottom:24px;border:1px solid #ddd;border-radius:8px;overflow:hidden;">
            <div style="background:#004f39;color:white;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;font-size:14px;">${matricula.grupo?.materia?.nombre ?? "—"}</span>
              <span style="font-size:12px;">Grupo: ${matricula.grupo?.nombre ?? "—"} · Semestre: ${matricula.grupo?.semestre ?? "—"}</span>
            </div>
            <div style="padding:8px 16px;background:#f5faf8;font-size:12px;color:#555;">
              Profesor: ${matricula.grupo?.profesor?.nombreCompleto?.nombres ?? ""} ${matricula.grupo?.profesor?.nombreCompleto?.apellidos ?? ""}
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#e0f0ea;">
                  <th style="padding:8px 10px;border:1px solid #ddd;font-size:12px;text-align:left;">Momento</th>
                  ${TIPOS.map(t => `<th style="padding:8px 10px;border:1px solid #ddd;font-size:12px;text-align:center;">${TIPOS_LABEL[t]}<br><span style="font-weight:400;font-size:10px;">${t === "EXAMEN_FINAL" ? "40%" : "20%"}</span></th>`).join("")}
                  <th style="padding:8px 10px;border:1px solid #ddd;font-size:12px;text-align:center;">Promedio</th>
                </tr>
              </thead>
              <tbody>${filasFilas}</tbody>
            </table>
            <div style="padding:10px 16px;text-align:right;background:#f9f9f9;border-top:1px solid #ddd;">
              <span style="font-size:13px;color:#555;">Nota final: </span>
              <span style="font-size:18px;font-weight:700;color:${notaFinal !== null ? (notaFinal >= 3 ? "#27500A" : "#791F1F") : "#888"};">
                ${notaFinal !== null ? notaFinal.toFixed(2) : "Pendiente"}
              </span>
            </div>
          </div>
        `;
      }).join("");

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8"/>
          <title>Reporte de Calificaciones</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 32px; color: #151613; }
            @media print { body { margin: 16px; } }
          </style>
        </head>
        <body>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div>
              <h1 style="margin:0;font-size:20px;color:#004f39;">Sistema de Notas</h1>
              <p style="margin:4px 0 0;font-size:13px;color:#666;">Reporte oficial de calificaciones</p>
            </div>
            <div style="text-align:right;">
              <p style="margin:0;font-size:12px;color:#666;">Fecha: ${fecha}</p>
            </div>
          </div>

          <hr style="border:none;border-top:2px solid #004f39;margin:12px 0 20px;"/>

          <div style="background:#f5faf8;border:1px solid #c8e6c9;border-radius:8px;padding:16px;margin-bottom:24px;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div>
                <p style="margin:0 0 4px;font-size:11px;color:#666;text-transform:uppercase;">Estudiante</p>
                <p style="margin:0;font-size:15px;font-weight:600;">${perfil?.nombreCompleto?.nombres} ${perfil?.nombreCompleto?.apellidos}</p>
              </div>
              <div>
                <p style="margin:0 0 4px;font-size:11px;color:#666;text-transform:uppercase;">Programa académico</p>
                <p style="margin:0;font-size:15px;font-weight:600;">${perfil?.programa?.nombre ?? "—"}</p>
              </div>
              <div>
                <p style="margin:0 0 4px;font-size:11px;color:#666;text-transform:uppercase;">Documento</p>
                <p style="margin:0;font-size:14px;">${perfil?.tipoDocumento ?? ""} ${perfil?.documento ?? "—"}</p>
              </div>
              <div>
                <p style="margin:0 0 4px;font-size:11px;color:#666;text-transform:uppercase;">Correo</p>
                <p style="margin:0;font-size:14px;">${perfil?.correo ?? "—"}</p>
              </div>
            </div>
          </div>

          <h2 style="font-size:15px;color:#004f39;margin:0 0 16px;">Calificaciones por materia</h2>
          ${filasMaterias}

          <div style="margin-top:24px;background:${promedioGeneral !== null ? (promedioGeneral >= 3 ? "#EAF3DE" : "#FCEBEB") : "#f5f5f5"};border-radius:8px;padding:16px;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;color:#555;">Promedio general</p>
            <p style="margin:0;font-size:32px;font-weight:700;color:${promedioGeneral !== null ? (promedioGeneral >= 3 ? "#27500A" : "#791F1F") : "#888"};">
              ${promedioGeneral !== null ? promedioGeneral.toFixed(2) : "Pendiente"}
            </p>
          </div>

          <p style="margin-top:32px;font-size:11px;color:#aaa;text-align:center;">
            Documento generado automáticamente por el Sistema de Notas · ${fecha}
          </p>
        </body>
        </html>
      `;

      const ventana = window.open("", "_blank");
      ventana.document.write(html);
      ventana.document.close();
      ventana.focus();
      setTimeout(() => { ventana.print(); }, 500);
    } catch {
      alert("No se pudo generar el PDF");
    } finally {
      setGenerandoPdf(false);
    }
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8081/api/estudiantes/${id}`, {
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

  const handleGuardarEdicion = async () => {
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8081/api/estudiantes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(formEdit),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setPerfil(data);
      setEditando(false);
      alert("Datos actualizados correctamente");
    } catch { alert("No se pudo guardar los cambios"); }
    finally { setGuardando(false); }
  };
