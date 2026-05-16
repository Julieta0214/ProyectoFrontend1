import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import Notifications from "../../components/Notifications";

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
  const [errorState, setErrorState] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [matriculas, setMatriculas] = useState([]);
  const [calificacionesMap, setCalificacionesMap] = useState({});
  const [matriculaSeleccionada, setMatriculaSeleccionada] = useState(null);

  const PESOS = {
    PARCIAL_1: 0.2,
    PARCIAL_2: 0.2,
    TRABAJO: 0.2,
    EXAMEN_FINAL: 0.4,
  };
  const PESOS_M = { 1: 0.3, 2: 0.3, 3: 0.4 };
  const TIPOS_LABEL = {
    PARCIAL_1: "Parcial 1",
    PARCIAL_2: "Parcial 2",
    TRABAJO: "Trabajo",
    EXAMEN_FINAL: "Examen final",
  };
  const TIPOS = ["PARCIAL_1", "PARCIAL_2", "TRABAJO", "EXAMEN_FINAL"];

  const bg = "var(--color-primario)";
  const cardBg = darkMode ? "#2a2a2a" : "white";
  const cardBorder = darkMode
    ? "1px solid rgba(93,206,165,0.2)"
    : "1px solid rgba(0,79,57,0.15)";
  const textoP = "var(--color-acento)";
  const textoS = "var(--color-secundario)";
  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    border: darkMode
      ? "1px solid rgba(93,206,165,0.3)"
      : "1px solid rgba(0,79,57,0.3)",
    borderRadius: "8px",
    fontSize: "14px",
    color: textoP,
    background: darkMode ? "#333" : "white",
    boxSizing: "border-box",
  };
  const btnPrimario = {
    background: textoS,
    color: darkMode ? "#1a1a1a" : "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  };
  const btnSecundario = {
    background: "none",
    border: `1px solid ${textoS}`,
    color: textoS,
    padding: "6px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        const allUsersRaw = localStorage.getItem("usuarios_db");
        const allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];
        if (!Array.isArray(allUsers))
          throw new Error("Base de datos de usuarios corrupta");

        const found = allUsers.find((u) => String(u.id) === String(id));

        const allMatriculasRaw = localStorage.getItem("matriculas_db");
        const allMatriculas = allMatriculasRaw
          ? JSON.parse(allMatriculasRaw)
          : [];

        const allCalsRaw = localStorage.getItem("calificaciones_db");
        const allCals = allCalsRaw ? JSON.parse(allCalsRaw) : {};

        const misMatriculas = Array.isArray(allMatriculas)
          ? allMatriculas.filter((m) => {
              const estId = m.estudianteId || (m.estudiante && m.estudiante.id);
              return String(estId) === String(id) && m.estado === "ACTIVO";
            })
          : [];

        setPerfil(found || null);
        setMatriculas(misMatriculas);
        setFormEdit({
          correo: found?.correo || "",
          numeroCelular: found?.numeroCelular || "",
        });
        setCalificacionesMap(allCals);
      } catch (err) {
        console.error("Error en EstudianteDashboard:", err);
        setErrorState("Error al cargar los datos: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getGrupoId = (m) => m.grupoId || (m.grupo && m.grupo.id);

  const calcularPromedioMomento = (matriculaId, momento) => {
    const matricula = matriculas.find(
      (m) => String(m.id) === String(matriculaId),
    );
    if (!matricula) return null;
    const gId = getGrupoId(matricula);
    const cals = (calificacionesMap[gId] || []).filter(
      (c) =>
        String(c.matriculaId) === String(matriculaId) && c.momento === momento,
    );
    if (cals.length < 4) return null;
    return (
      Math.round(
        cals.reduce((acc, c) => acc + c.nota * PESOS[c.tipo], 0) * 100,
      ) / 100
    );
  };

  const calcularNotaFinal = (matriculaId) => {
    let total = 0;
    let count = 0;
    for (let m = 1; m <= 3; m++) {
      const pm = calcularPromedioMomento(matriculaId, m);
      if (pm !== null) {
        total += pm * PESOS_M[m];
        count++;
      }
    }
    return count === 3 ? Math.round(total * 100) / 100 : null;
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
  const getApellidos = (u) =>
    u?.apellidos || u?.nombreCompleto?.apellidos || "";
  const iniciales = perfil
    ? `${getNombres(perfil)[0] ?? ""}${getApellidos(perfil)[0] ?? ""}`
    : "ES";

  if (loading)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: textoS }}>Cargando perfil...</p>
      </main>
    );
  if (errorState)
    return (
      <main
        style={{
          minHeight: "100vh",
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "red" }}>{errorState}</p>
      </main>
    );

  return (
    <main style={{ minHeight: "100vh", background: bg, padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            color: textoS,
            fontSize: "22px",
            fontWeight: "500",
            margin: 0,
          }}
        >
          Sistema de Notas
        </h1>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Notifications />
          <button onClick={toggleDarkMode} style={btnSecundario}>
            {darkMode ? "☀ Modo claro" : "☾ Modo oscuro"}
          </button>
          <button onClick={handleLogout} style={btnSecundario}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div
            style={{
              background: cardBg,
              border: cardBorder,
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            <div
              onClick={() => fileInputRef.current.click()}
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                margin: "0 auto 8px",
                overflow: "hidden",
                background: darkMode ? "#3a3a3a" : "#E6F1FB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: `2px solid ${textoS}`,
              }}
            >
              {perfil?.foto ? (
                <img
                  src={perfil.foto}
                  alt="Foto"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span
                  style={{ fontWeight: "500", fontSize: "18px", color: textoS }}
                >
                  {iniciales}
                </span>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFotoChange}
            />
            <p
              style={{
                margin: "0 0 2px",
                fontWeight: "500",
                fontSize: "14px",
                color: textoP,
              }}
            >
              {getNombres(perfil)} {getApellidos(perfil)}
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: textoS }}>
              Estudiante
            </p>
          </div>

          {["perfil", "materias", "notas"].map((s) => (
            <button
              key={s}
              onClick={() => setSeccion(s)}
              style={{
                background: seccion === s ? textoS : cardBg,
                color:
                  seccion === s ? (darkMode ? "#1a1a1a" : "white") : textoP,
                border: cardBorder,
                borderRadius: "8px",
                padding: "10px 14px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: seccion === s ? "500" : "400",
                textTransform: "capitalize",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div
          style={{
            background: cardBg,
            border: cardBorder,
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          {seccion === "perfil" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "500",
                    color: textoP,
                  }}
                >
                  Mi perfil
                </h2>
                {!editando ? (
                  <button onClick={() => setEditando(true)} style={btnPrimario}>
                    Editar datos
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setEditando(false)}
                      style={btnSecundario}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleGuardarEdicion}
                      disabled={guardando}
                      style={btnPrimario}
                    >
                      {guardando ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                {[
                  { label: "Nombres", value: getNombres(perfil) },
                  { label: "Apellidos", value: getApellidos(perfil) },
                  { label: "Correo", value: perfil?.correo, key: "correo" },
                  {
                    label: "Celular",
                    value: perfil?.numeroCelular,
                    key: "numeroCelular",
                  },
                ].map((campo) => (
                  <div key={campo.label}>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "12px",
                        color: textoS,
                        fontWeight: "500",
                      }}
                    >
                      {campo.label}
                    </p>
                    {editando && campo.key ? (
                      <input
                        value={formEdit[campo.key] || ""}
                        onChange={(e) =>
                          setFormEdit({
                            ...formEdit,
                            [campo.key]: e.target.value,
                          })
                        }
                        style={inputStyle}
                      />
                    ) : (
                      <p style={{ margin: 0, fontSize: "14px", color: textoP }}>
                        {campo.value ?? "—"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {seccion === "materias" && (
            <div>
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "18px",
                  fontWeight: "500",
                  color: textoP,
                }}
              >
                Mis materias
              </h2>
              <div style={{ display: "grid", gap: "12px" }}>
                {matriculas.map((m) => {
                  const gr = m.grupo || {};
                  return (
                    <div
                      key={m.id}
                      style={{
                        background: darkMode ? "#333" : "var(--color-primario)",
                        border: cardBorder,
                        borderRadius: "12px",
                        padding: "16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            margin: "0 0 4px",
                            fontWeight: "500",
                            fontSize: "15px",
                            color: textoP,
                          }}
                        >
                          {gr.materia?.nombre || "Cálculo Diferencial"}
                        </p>
                        <p
                          style={{
                            margin: "0 0 2px",
                            fontSize: "13px",
                            color: textoS,
                          }}
                        >
                          Grupo: {gr.nombre} · Profesor:{" "}
                          {getNombres(gr.profesor)} {getApellidos(gr.profesor)}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setMatriculaSeleccionada(m);
                          setSeccion("notas");
                        }}
                        style={btnPrimario}
                      >
                        Ver notas
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {seccion === "notas" && (
            <div>
              <h2
                style={{
                  marginBottom: "20px",
                  fontSize: "18px",
                  fontWeight: "500",
                  color: textoP,
                }}
              >
                Calificaciones{" "}
                {matriculaSeleccionada?.grupo?.materia?.nombre || "—"}
              </h2>
              {matriculaSeleccionada ? (
                <div style={{ display: "grid", gap: "15px" }}>
                  {[1, 2, 3].map((momento) => (
                    <div
                      key={momento}
                      style={{
                        padding: "15px",
                        border: cardBorder,
                        borderRadius: "8px",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "600",
                          marginBottom: "10px",
                          color: textoP,
                        }}
                      >
                        Momento {momento}
                      </p>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, 1fr)",
                          gap: "10px",
                        }}
                      >
                        {TIPOS.map((t) => {
                          const gId = getGrupoId(matriculaSeleccionada);
                          const cals = (calificacionesMap[gId] || []).find(
                            (c) =>
                              String(c.matriculaId) ===
                                String(matriculaSeleccionada.id) &&
                              c.momento === momento &&
                              c.tipo === t,
                          );
                          return (
                            <div
                              key={t}
                              style={{
                                textAlign: "center",
                                padding: "8px",
                                background: darkMode ? "#333" : "#f5f5f5",
                                borderRadius: "8px",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "10px",
                                  color: textoS,
                                  margin: "0 0 4px",
                                }}
                              >
                                {TIPOS_LABEL[t]}
                              </p>
                              <p
                                style={{
                                  fontWeight: "600",
                                  color: textoP,
                                  margin: 0,
                                }}
                              >
                                {cals?.nota || "—"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      <p
                        style={{
                          marginTop: "10px",
                          fontSize: "13px",
                          textAlign: "right",
                          color: textoS,
                        }}
                      >
                        Promedio Momento:{" "}
                        <strong style={{ color: textoP }}>
                          {calcularPromedioMomento(
                            matriculaSeleccionada.id,
                            momento,
                          ) || "—"}
                        </strong>
                      </p>
                    </div>
                  ))}
                  <div
                    style={{
                      padding: "20px",
                      background: textoS,
                      color: "white",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 5px",
                        fontSize: "14px",
                        opacity: 0.9,
                      }}
                    >
                      Nota Final Acumulada
                    </p>
                    <p
                      style={{ fontSize: "32px", fontWeight: "700", margin: 0 }}
                    >
                      {calcularNotaFinal(matriculaSeleccionada.id) || "—"}
                    </p>
                  </div>
                </div>
              ) : (
                <p style={{ color: textoS }}>
                  Selecciona una materia para ver tus calificaciones.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default EstudianteDashboard;
