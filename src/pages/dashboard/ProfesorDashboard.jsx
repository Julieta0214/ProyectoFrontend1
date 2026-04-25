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
  const [errorState, setErrorState] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [grupos, setGrupos] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
  const [matriculasGrupo, setMatriculasGrupo] = useState([]);
  const [calificacionesGrupo, setCalificacionesGrupo] = useState([]);
  const [momentoActivo, setMomentoActivo] = useState(1);
  const [loadingGrupo, setLoadingGrupo] = useState(false);

  const TIPOS = ["PARCIAL_1", "PARCIAL_2", "TRABAJO", "EXAMEN_FINAL"];
  const TIPOS_LABEL = { PARCIAL_1: "Parcial 1", PARCIAL_2: "Parcial 2", TRABAJO: "Trabajo", EXAMEN_FINAL: "Examen final" };
  const PESOS = { PARCIAL_1: 0.20, PARCIAL_2: 0.20, TRABAJO: 0.20, EXAMEN_FINAL: 0.40 };
  const PESOS_MOMENTO = { 1: 0.30, 2: 0.30, 3: 0.40 };

  const bg = "var(--color-primario)";
  const cardBg = darkMode ? "#2a2a2a" : "white";
  const cardBorder = darkMode ? "1px solid rgba(93,206,165,0.2)" : "1px solid rgba(0,79,57,0.15)";
  const textoP = "var(--color-acento)";
  const textoS = "var(--color-secundario)";
  const inputStyle = { width: "100%", padding: "8px 10px", border: darkMode ? "1px solid rgba(93,206,165,0.3)" : "1px solid rgba(0,79,57,0.3)", borderRadius: "8px", fontSize: "14px", color: textoP, background: darkMode ? "#333" : "white", boxSizing: "border-box" };
  const btnPrimario = { background: textoS, color: darkMode ? "#1a1a1a" : "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" };
  const btnSecundario = { background: "none", border: `1px solid ${textoS}`, color: textoS, padding: "6px 16px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" };

  useEffect(() => {
    const fetchData = () => {
      try {
        const allUsersRaw = localStorage.getItem("usuarios_db");
        const allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];
        if (!Array.isArray(allUsers)) throw new Error("Base de datos de usuarios corrupta");

        const found = allUsers.find((u) => String(u.id) === String(id));
        
        const allGruposRaw = localStorage.getItem("grupos_db");
        const allGrupos = allGruposRaw ? JSON.parse(allGruposRaw) : [];
        
        const misGrupos = Array.isArray(allGrupos) 
          ? allGrupos.filter(g => {
              const profId = g.profesorId || (g.profesor && g.profesor.id);
              return String(profId) === String(id);
            })
          : [];

        setPerfil(found || null);
        setGrupos(misGrupos);
        setFormEdit({ 
          correo: found?.correo || "", 
          numeroCelular: found?.numeroCelular || "", 
          tituloProfesional: found?.tituloProfesional || "", 
          especializacion: found?.especializacion || "" 
        });
      } catch (err) {
        console.error("Error en ProfesorDashboard:", err);
        setErrorState("Error al cargar datos: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const seleccionarGrupo = (grupo) => {
    setGrupoSeleccionado(grupo);
    setLoadingGrupo(true);
    setMomentoActivo(1);
    
    setTimeout(() => {
      const allMatriculas = JSON.parse(localStorage.getItem("matriculas_db") || "[]");
      const allCals = JSON.parse(localStorage.getItem("calificaciones_db") || "{}");
      
      const matriculas = allMatriculas.filter(m => {
        const gId = m.grupoId || (m.grupo && m.grupo.id);
        return String(gId) === String(grupo.id) && m.estado === "ACTIVO";
      });
      
      setMatriculasGrupo(matriculas);
      setCalificacionesGrupo(allCals[grupo.id] || []);
      setLoadingGrupo(false);
    }, 300);
  };

  const getNota = (matriculaId, momento, tipo) => {
    const cal = calificacionesGrupo.find((c) => String(c.matriculaId) === String(matriculaId) && c.momento === momento && c.tipo === tipo);
    return cal ? cal.nota : "";
  };

  const calcularPromedioMomento = (matriculaId, momento) => {
    let total = 0;
    let count = 0;
    for (const tipo of TIPOS) {
      const nota = getNota(matriculaId, momento, tipo);
      if (nota !== "") {
        total += parseFloat(nota) * PESOS[tipo];
        count++;
      }
    }
    return count === TIPOS.length ? Math.round(total * 100) / 100 : null;
  };

  const calcularNotaFinal = (matriculaId) => {
    let total = 0;
    let count = 0;
    for (let m = 1; m <= 3; m++) {
      const pm = calcularPromedioMomento(matriculaId, m);
      if (pm !== null) {
        total += pm * PESOS_MOMENTO[m];
        count++;
      }
    }
    return count === 3 ? Math.round(total * 100) / 100 : null;
  };

  const registrarNota = (matriculaId, momento, tipo, nota) => {
    if (nota === "" || isNaN(nota)) return;
    const notaNum = parseFloat(nota);
    if (notaNum < 0 || notaNum > 5) { alert("La nota debe estar entre 0.0 y 5.0"); return; }
    
    const allCals = JSON.parse(localStorage.getItem("calificaciones_db") || "{}");
    const grupoId = grupoSeleccionado.id;
    
    if (!allCals[grupoId]) allCals[grupoId] = [];
    
    const idx = allCals[grupoId].findIndex((c) => String(c.matriculaId) === String(matriculaId) && c.momento === momento && c.tipo === tipo);
    const nuevaCal = { id: `${matriculaId}-${momento}-${tipo}`, matriculaId, momento, tipo, nota: notaNum };
    
    if (idx >= 0) allCals[grupoId][idx] = nuevaCal;
    else allCals[grupoId].push(nuevaCal);
    
    localStorage.setItem("calificaciones_db", JSON.stringify(allCals));
    setCalificacionesGrupo([...allCals[grupoId]]);
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const usuarios = JSON.parse(localStorage.getItem("usuarios_db") || "[]");
      const idx = usuarios.findIndex((u) => String(u.id) === String(id));
      if (idx >= 0) { 
        usuarios[idx].foto = reader.result; 
        localStorage.setItem("usuarios_db", JSON.stringify(usuarios)); 
        setPerfil({ ...usuarios[idx] }); 
      }
      alert("Foto actualizada correctamente");
    };
    reader.readAsDataURL(file);
  };

  const handleGuardarEdicion = () => {
    setGuardando(true);
    setTimeout(() => {
      const usuarios = JSON.parse(localStorage.getItem("usuarios_db") || "[]");
      const idx = usuarios.findIndex((u) => String(u.id) === String(id));
      if (idx >= 0) {
        usuarios[idx] = { ...usuarios[idx], ...formEdit };
        localStorage.setItem("usuarios_db", JSON.stringify(usuarios));
        setPerfil(usuarios[idx]);
      }
      setEditando(false);
      setGuardando(false);
      alert("Datos actualizados correctamente");
    }, 400);
  };

  const handleLogout = () => { 
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("id");
    localStorage.removeItem("nombres");
    localStorage.removeItem("apellidos");
    navigate("/login"); 
  };

  const getNombres = (u) => u?.nombres || u?.nombreCompleto?.nombres || "";
  const getApellidos = (u) => u?.apellidos || u?.nombreCompleto?.apellidos || "";
  const iniciales = perfil ? `${getNombres(perfil)[0] ?? ""}${getApellidos(perfil)[0] ?? ""}` : "PR";

  if (loading) return <main style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: textoS }}>Cargando perfil...</p></main>;
  if (errorState) return <main style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: "red" }}>{errorState}</p></main>;

  const secciones = [{ id: "perfil", label: "Mi perfil" }, { id: "grupos", label: "Mis grupos" }, { id: "calificaciones", label: "Calificaciones" }];

  return (
    <main style={{ minHeight: "100vh", background: bg, padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ color: textoS, fontSize: "22px", fontWeight: "500", margin: 0 }}>Sistema de Notas</h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button onClick={toggleDarkMode} style={btnSecundario}>{darkMode ? "☀ Modo claro" : "☾ Modo oscuro"}</button>
          <button onClick={handleLogout} style={btnSecundario}>Cerrar sesión</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "16px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ background: cardBg, border: cardBorder, borderRadius: "12px", padding: "16px", marginBottom: "8px", textAlign: "center" }}>
            <div onClick={() => fileInputRef.current.click()} style={{ width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 8px", overflow: "hidden", background: darkMode ? "#3a3a3a" : "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px solid ${textoS}` }}>
              {perfil?.foto ? <img src={perfil.foto} alt="Foto" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontWeight: "500", fontSize: "18px", color: textoS }}>{iniciales}</span>}
            </div>
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={handleFotoChange} />
            <p style={{ margin: "0 0 2px", fontWeight: "500", fontSize: "14px", color: textoP }}>{getNombres(perfil)} {getApellidos(perfil)}</p>
            <p style={{ margin: 0, fontSize: "12px", color: textoS }}>Profesor</p>
          </div>

          {secciones.map(item => (
            <button key={item.id} onClick={() => setSeccion(item.id)} style={{ background: seccion === item.id ? textoS : cardBg, color: seccion === item.id ? (darkMode ? "#1a1a1a" : "white") : textoP, border: cardBorder, borderRadius: "8px", padding: "10px 14px", textAlign: "left", cursor: "pointer", fontSize: "14px", fontWeight: seccion === item.id ? "500" : "400" }}>
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ background: cardBg, border: cardBorder, borderRadius: "12px", padding: "24px" }}>
          {seccion === "perfil" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "500", color: textoP }}>Mi perfil</h2>
                {!editando
                  ? <button onClick={() => setEditando(true)} style={btnPrimario}>Editar datos</button>
                  : <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => setEditando(false)} style={btnSecundario}>Cancelar</button>
                      <button onClick={handleGuardarEdicion} disabled={guardando} style={btnPrimario}>{guardando ? "Guardando..." : "Guardar"}</button>
                    </div>
                }
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { label: "Nombres", value: getNombres(perfil), key: null },
                  { label: "Apellidos", value: getApellidos(perfil), key: null },
                  { label: "Documento", value: perfil?.documento, key: null },
                  { label: "Tipo documento", value: perfil?.tipoDocumento, key: null },
                  { label: "Correo", value: perfil?.correo, key: "correo" },
                  { label: "Celular", value: perfil?.numeroCelular, key: "numeroCelular" },
                  { label: "Título profesional", value: perfil?.tituloProfesional, key: "tituloProfesional" },
                  { label: "Especialización", value: perfil?.especializacion, key: "especializacion" },
                ].map(campo => (
                  <div key={campo.label}>
                    <p style={{ margin: "0 0 4px", fontSize: "12px", color: textoS, fontWeight: "500" }}>{campo.label}</p>
                    {editando && campo.key
                      ? <input value={formEdit[campo.key] || ""} onChange={e => setFormEdit({ ...formEdit, [campo.key]: e.target.value })} style={inputStyle} />
                      : <p style={{ margin: 0, fontSize: "14px", color: textoP }}>{campo.value ?? "—"}</p>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          {seccion === "grupos" && (
            <div>
              <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "500", color: textoP }}>Mis grupos</h2>
              <div style={{ display: "grid", gap: "12px" }}>
                {grupos.map(grupo => (
                  <div key={grupo.id} style={{ background: darkMode ? "#333" : "var(--color-primario)", border: cardBorder, borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: "0 0 4px", fontWeight: "500", fontSize: "15px", color: textoP }}>{grupo.nombre}</p>
                      <p style={{ margin: "0 0 2px", fontSize: "13px", color: textoS }}>{grupo.materia?.nombre || "Cálculo Diferencial"}</p>
                    </div>
                    <button onClick={() => { seleccionarGrupo(grupo); setSeccion("calificaciones"); }} style={btnPrimario}>Ver calificaciones</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {seccion === "calificaciones" && (
            <div>
              <h2 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "500", color: textoP }}>Calificaciones {grupoSeleccionado ? `— ${grupoSeleccionado.nombre}` : ""}</h2>
              <select value={grupoSeleccionado?.id ?? ""} onChange={e => { const g = grupos.find(gr => String(gr.id) === e.target.value); if (g) seleccionarGrupo(g); }} style={{ ...inputStyle, marginBottom: "20px" }}>
                <option value="">— Selecciona un grupo —</option>
                {grupos.map(g => (<option key={g.id} value={g.id}>{g.nombre} — {g.materia?.nombre || "Cálculo Diferencial"}</option>))}
              </select>

              {loadingGrupo ? (
                <p style={{ color: textoS }}>Cargando datos del grupo...</p>
              ) : (
                grupoSeleccionado && (
                  <>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                      {[1, 2, 3].map(m => (
                        <button key={m} onClick={() => setMomentoActivo(m)} style={{ ...btnSecundario, background: momentoActivo === m ? textoS : "none", color: momentoActivo === m ? "white" : textoS }}>Momento {m}</button>
                      ))}
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{ background: textoS, color: "white" }}>
                          <tr>
                            <th style={{ padding: "10px", textAlign: "left" }}>Estudiante</th>
                            {TIPOS.map(t => <th key={t} style={{ padding: "10px" }}>{TIPOS_LABEL[t]}</th>)}
                            <th style={{ padding: "10px" }}>Promedio</th>
                            <th style={{ padding: "10px" }}>Final</th>
                          </tr>
                        </thead>
                        <tbody>
                          {matriculasGrupo.map(m => {
                            const est = m.estudiante || {};
                            return (
                              <tr key={m.id} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "10px" }}>{getNombres(est)} {getApellidos(est)}</td>
                                {TIPOS.map(t => (
                                  <td key={t} style={{ padding: "10px", textAlign: "center" }}>
                                    <input type="number" step="0.1" defaultValue={getNota(m.id, momentoActivo, t)} onBlur={e => registrarNota(m.id, momentoActivo, t, e.target.value)} style={{ width: "50px", textAlign: "center", border: "1px solid #ccc", borderRadius: "4px" }} />
                                  </td>
                                ))}
                                <td style={{ padding: "10px", textAlign: "center" }}>{calcularPromedioMomento(m.id, momentoActivo) || "—"}</td>
                                <td style={{ padding: "10px", textAlign: "center" }}>{calcularNotaFinal(m.id) || "—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfesorDashboard;
