import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLanding = () => {
    navigate("/");
  };

  return (
    <main className="flex-grow flex items-center justify-center px-4 py-20">
      <section className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
        <h1 className="text-3xl font-semibold mb-4 text-[var(--color-acento)]">
          Sesión cerrada
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Has cerrado sesión del Sistema de Notas. ¡Gracias por usar nuestro portal!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            type="button"
            onClick={handleLogin}
            className="px-6 py-2 bg-[var(--color-secundario)] text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition duration-300"
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            onClick={handleLanding}
            className="px-6 py-2 border border-[var(--color-secundario)] text-[var(--color-secundario)] font-semibold rounded-lg shadow-md hover:bg-gray-50 transition duration-300"
          >
            Ir al inicio
          </button>
        </div>
      </section>
    </main>
  );
};

