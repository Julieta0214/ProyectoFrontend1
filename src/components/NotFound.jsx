import { Link } from "react-router-dom";
import conoImg from "../assets/images/cono.png";
import compuImg from "../assets/images/compu.png";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center mt-16 mb-16">
      <div className="flex items-center gap-4">
        <img src={conoImg} alt="Imagen de mantenimiento" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-800">¡Ups! 404 </h1>
        <h2 className="text-xl font-semibold text-gray-600">
          Parece que la página que buscas no se pudo encontrar.
        </h2>
        <p className="text-gray-500">
          Sigue navegando en nuestra página de inicio
        </p>

        <ul className="listLinks mt-6">
          <li>
            <Link
              to="/"
              className="inline-block px-10 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-sm hover:bg-blue-800 transition-colors uppercase tracking-wider text-sm border-b-4 border-blue-900 active:border-b-0 active:translate-y-0.5"
            >
              Regresar al Login
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <img src={compuImg} alt="Imagen de computadora" />
      </div>
    </div>
  );
}
