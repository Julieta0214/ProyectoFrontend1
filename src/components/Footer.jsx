import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[var(--color-secundario)] text-white">
      <div className="max-w-7xl mx-auto px-6 py-14">
        
        <div className="grid md:grid-cols-4 gap-10">
          
          {/* Logo / descripción */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <GraduationCap size={28} />
              </div>
              <h2 className="text-xl font-bold">
                Sistema de Notas
              </h2>
            </div>

            <p className="text-sm text-gray-300 leading-6">
              Plataforma académica moderna para la gestión de estudiantes,
              docentes, calificaciones y programas académicos.
            </p>
          </div>
