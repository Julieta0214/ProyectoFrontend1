import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showAlert } from "../utils/alerts";
import { useAuth } from "../context/AuthContext";

// ── Unificación de base de datos local ──
const inicializarDB = () => {
  // ... (keeping the initialization logic as is for now as it's used as mock DB)
  if (!localStorage.getItem("usuarios_db")) {
    const usuarios = [
      {
        id: "1",
        correo: import.meta.env.VITE_ADMIN_CORREO || "admin@sistema.edu",
        contraseña: import.meta.env.VITE_ADMIN_PASSWORD || "Admin123!",
        rol: "ADMINISTRADOR",
        nombres: import.meta.env.VITE_ADMIN_NOMBRES || "Carlos",
        apellidos: import.meta.env.VITE_ADMIN_APELLIDOS || "Administrador",
        token: import.meta.env.VITE_ADMIN_TOKEN || "token-admin-001",
      },
      {
        id: "2",
        correo: import.meta.env.VITE_PROFESOR_CORREO || "profesor@sistema.edu",
        contraseña: import.meta.env.VITE_PROFESOR_PASSWORD || "Profesor1!",
        rol: "PROFESOR",
        nombres: import.meta.env.VITE_PROFESOR_NOMBRES || "Ana",
        apellidos: import.meta.env.VITE_PROFESOR_APELLIDOS || "García",
        token: import.meta.env.VITE_PROFESOR_TOKEN || "token-profesor-002",
      },
      {
        id: "3",
        correo: import.meta.env.VITE_ESTUDIANTE_CORREO || "estudiante@sistema.edu",
        contraseña: import.meta.env.VITE_ESTUDIANTE_PASSWORD || "Estudiante1!",
        rol: "ESTUDIANTE",
        nombres: import.meta.env.VITE_ESTUDIANTE_NOMBRES || "Luis",
        apellidos: import.meta.env.VITE_ESTUDIANTE_APELLIDOS || "Martínez",
        token: import.meta.env.VITE_ESTUDIANTE_TOKEN || "token-estudiante-003",
      },
    ];
    localStorage.setItem("usuarios_db", JSON.stringify(usuarios));
  }

  if (!localStorage.getItem("programas_db")) {
    const programas = [
      {
        id: "1",
        nombre: "Ingeniería de Sistemas",
        modalidad: "Presencial",
        estado: "ACTIVO",
      },
      {
        id: "2",
        nombre: "Administración de Empresas",
        modalidad: "Virtual",
        estado: "ACTIVO",
      },
    ];
    localStorage.setItem("programas_db", JSON.stringify(programas));
  }

  if (!localStorage.getItem("materias_db")) {
    const materias = [
      { id: "1", nombre: "Cálculo Diferencial", estado: "ACTIVO" },
      { id: "2", nombre: "Programación Básica", estado: "ACTIVO" },
    ];
    localStorage.setItem("materias_db", JSON.stringify(materias));
  }

  if (!localStorage.getItem("grupos_db")) {
    const grupos = [
      {
        id: "1",
        nombre: "Grupo A",
        semestre: "2026-1",
        cupoMaximo: 30,
        materiaId: "1",
        profesorId: "2",
        estado: "ACTIVO",
      },
    ];
    localStorage.setItem("grupos_db", JSON.stringify(grupos));
  }

  if (!localStorage.getItem("matriculas_db")) {
    const matriculas = [
      { id: "1", estudianteId: "3", grupoId: "1", estado: "ACTIVO" },
    ];
    localStorage.setItem("matriculas_db", JSON.stringify(matriculas));
  }
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  inicializarDB();

  const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");
  const [enviandoRecuperacion, setEnviandoRecuperacion] = useState(false);

  const [formData, setFormData] = useState({ correo: "", contraseña: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(formData.correo, formData.contraseña);
  };


  const handleRecuperacion = (e) => {
    e.preventDefault();
    setEnviandoRecuperacion(true);

    setTimeout(() => {
      const usuarios = JSON.parse(localStorage.getItem("usuarios_db") || "[]");
      const existe = usuarios.find((u) => u.correo === correoRecuperacion);

      if (!existe) {
        showAlert({
          title: "Error",
          text: "No existe una cuenta con ese correo.",
          icon: "error",
        });
      } else {
        showAlert({
          title: "Correo enviado",
          text: "✅ Correo enviado. Revisa tu bandeja de entrada.",
          icon: "success",
        });
        setCorreoRecuperacion("");
        setMostrarRecuperacion(false);
      }
      setEnviandoRecuperacion(false);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[var(--color-primario)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[var(--color-primario)] rounded-2xl shadow-2xl p-8 border border-[var(--color-secundario)]/10">
        <h1 className="text-3xl font-bold text-center text-[var(--color-acento)] mb-2">
          LOGIN
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Accede a la plataforma académica
        </p>

        {!mostrarRecuperacion && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-semibold text-[var(--color-acento)] mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--color-secundario)]/20 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-[var(--color-acento)] mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[var(--color-secundario)]/20 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="bg-[var(--color-secundario)] text-white font-semibold py-3 px-4 rounded-lg"
              >
                Iniciar sesión
              </button>

              <button
                type="button"
                onClick={() => navigate("/registrar")}
                className="border border-[var(--color-secundario)] text-[var(--color-secundario)] font-semibold py-3 px-4 rounded-lg"
              >
                Registrar
              </button>

              <button
                type="button"
                onClick={() => {
                  setMostrarRecuperacion(true);
                }}
                className="text-[var(--color-acento)] font-medium py-2"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </form>
        )}

        {mostrarRecuperacion && (
          <form onSubmit={handleRecuperacion} className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--color-acento)]">
              Recuperar contraseña
            </h2>

            <input
              type="email"
              value={correoRecuperacion}
              onChange={(e) => setCorreoRecuperacion(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
              className="w-full px-4 py-3 border border-[var(--color-secundario)]/20 rounded-lg"
            />

            <button
              type="submit"
              disabled={enviandoRecuperacion}
              className="w-full bg-[var(--color-secundario)] text-white py-3 rounded-lg"
            >
              {enviandoRecuperacion ? "Enviando..." : "Enviar correo"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMostrarRecuperacion(false);
                setCorreoRecuperacion("");
              }}
              className="w-full border border-[var(--color-secundario)] text-[var(--color-secundario)] py-3 rounded-lg"
            >
              Volver
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default Login;
