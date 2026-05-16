import { GraduationCap, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Notifications from "./Notifications";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const nombres = localStorage.getItem("nombres") || "";
  const apellidos = localStorage.getItem("apellidos") || "";
  const rol = localStorage.getItem("rol");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("id");
    localStorage.removeItem("nombres");
    localStorage.removeItem("apellidos");
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (rol === "ADMINISTRADOR" || rol === "SUPER_ADMIN") return "/admonMain";
    if (rol === "PROFESOR") return "/dashboard/profesor";
    if (rol === "ESTUDIANTE") return "/dashboard/estudiante";
    return "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="bg-[var(--color-secundario)] text-white p-2 rounded-xl shadow-md">
            <GraduationCap size={26} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-[var(--color-acento)]">
              Sistema de Notas
            </h1>
            <p className="text-xs text-gray-500">
              Plataforma Académica
            </p>
          </div>
        </div>

         {/* Navegación central */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <button
            onClick={() => navigate("/")}
            className="hover:text-[var(--color-secundario)] transition"
          >
            Inicio
          </button>

          <button
            onClick={() => navigate("/funcionalidades")}
            className="hover:text-[var(--color-secundario)] transition"
          >
            Funcionalidades
          </button>

          <button
            onClick={() => navigate("/nosotros")}
            className="hover:text-[var(--color-secundario)] transition"
          >
            Nosotros
          </button>

          <button
            onClick={() => navigate("/soporte")}
            className="hover:text-[var(--color-secundario)] transition"
          >
            Soporte
          </button>
        </nav>

         {/* Botones derecha */}
        <div className="flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-4">
              <Notifications />
              <span 
                onClick={() => navigate(getDashboardPath())}
                className="text-sm font-medium text-[var(--color-acento)] cursor-pointer hover:text-[var(--color-secundario)] transition"
              >
                Hola, {nombres} {apellidos}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition text-sm"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 border border-[var(--color-secundario)] text-[var(--color-secundario)] px-4 py-2 rounded-lg hover:bg-[var(--color-secundario)] hover:text-white transition"
              >
                <LogIn size={16} />
                Ingresar
              </button>

              <button
                onClick={() => navigate("/registrar")}
                className="flex items-center gap-2 bg-[var(--color-secundario)] text-white px-4 py-2 rounded-lg hover:scale-105 transition"
              >
                <UserPlus size={16} />
                Registro
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;