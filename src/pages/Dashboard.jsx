import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    navigate("/login");
  };

  return (
    <div className="flex flex-1">
      <aside className="w-64 bg-blue-800 text-white p-6 border border-white rounded-2xl hidden md:flex flex-col justify-between">
        <div className="flex justify-center mb-6">
          <img alt="Menú" className="w-23 h-23" />
        </div>

        <nav className="flex-1 flex flex-col justify-between">
          <ul className="flex-1 flex flex-col justify-evenly text-lg font-semibold space-y-2">
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v1H3a1 1 0 000 2h1v4a2 2 0 002 2h8a2 2 0 002-2v-4h1a1 1 0 100-2h-1V8a6 6 0 00-6-6z" />
              </svg>
              <Link to="/login">Logeo</Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm8 4a1 1 0 100-2 1 1 0 000 2zM9 9V5a1 1 0 112 0v4a1 1 0 01-2 0z" />
              </svg>
              <Link to="/login">Registro</Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h4a1 1 0 011 1v6H4a1 1 0 01-1-1v-5zm6 0h7a1 1 0 011 1v5a1 1 0 01-1 1h-7v-6z" />
              </svg>
              <Link to="/login">Cambio de contraseña</Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 3a1 1 0 011 1v1h6a1 1 0 011 1v1h-8v2h8v1a1 1 0 01-1 1h-6v1a1 1 0 01-2 0V4a1 1 0 011-1z" />
              </svg>
              <Link to="/login">Administrador</Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v2H3a1 1 0 000 2h1v4h12v-4h1a1 1 0 100-2h-1V8a6 6 0 00-6-6z" />
              </svg>
              <Link to="/login ">Perfil de profesores</Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 3a1 1 0 00-1 1v2a1 1 0 001 1v10a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 001-1V4a1 1 0 00-1-1H4zm1 6h10v8H5V9z" />
              </svg>
              <Link to="/login ">Grupo de estudiantes</Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11 2a1 1 0 00-1 1v1H5a1 1 0 00-1 1v10h12V5a1 1 0 00-1-1h-5V3a1 1 0 00-1-1z" />
              </svg>
              <Link to="/login ">Perfil de estudiante</Link>
            </li>
            <li className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-white-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4.293 6.707a1 1 0 011.414 0L10 11.586l4.293-4.879a1 1 0 111.414 1.414l-5 5.678a1 1 0 01-1.414 0l-5-5.678a1 1 0 010-1.414z" />
              </svg>
              <Link to="/salir ">Salir</Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};
