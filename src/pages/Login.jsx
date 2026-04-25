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
        case "ESTUDIANTE":
          navigate("/dashboard/estudiante");
          break;
        case "PROFESOR":
          navigate("/dashboard/profesor");
          break;
        case "ADMINISTRADOR":
        case "SUPER_ADMIN":
          navigate("/admonMain");
          break;
        default:
          setError("Rol no reconocido");
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

      if (!response.ok) {
        const data = await response.json();
        setMensajeRecuperacion(data.message || "No se pudo enviar el correo");
        return;
      }

      setMensajeRecuperacion("✅ Correo enviado. Revisa tu bandeja de entrada.");
      setCorreoRecuperacion("");

    } catch {
      setMensajeRecuperacion("No se pudo conectar con el servidor");
    } finally {
      setEnviandoRecuperacion(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-primario)] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[var(--color-primario)] rounded-2xl shadow-2xl p-8 border border-[var(--color-secundario)]/10">

        <h1 className="text-3xl font-bold text-center text-[var(--color-acento)] mb-2">LOGIN</h1>
        <p className="text-center text-gray-600 mb-6">Accede a la plataforma académica</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

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
                onClick={() => navigate('/registrar')}
                className="border border-[var(--color-secundario)] text-[var(--color-secundario)] font-semibold py-3 px-4 rounded-lg"
              >
                Registrar
              </button>

              <button
                type="button"
                onClick={() => {
                  setMostrarRecuperacion(true);
                  setMensajeRecuperacion("");
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
              onChange={e => setCorreoRecuperacion(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              required
              className="w-full px-4 py-3 border border-[var(--color-secundario)]/20 rounded-lg"
            />

            {mensajeRecuperacion && (
              <p>{mensajeRecuperacion}</p>
            )}

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
                setMensajeRecuperacion("");
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
