import { GraduationCap, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

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