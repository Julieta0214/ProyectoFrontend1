import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const FormAdministrador = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      try {
        const usuarios = JSON.parse(localStorage.getItem('usuarios_db') || '[]');
        const found = usuarios.find((u) => u.tokenRegistro === token || u.token === token);
        if (!found) throw new Error('Enlace de registro inválido o expirado');
        setUsuario(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const usuarios = JSON.parse(localStorage.getItem('usuarios_db') || '[]');
      const idx = usuarios.findIndex(u => u.id === usuario.id);
      
      if (idx >= 0) {
        usuarios[idx] = {
          ...usuarios[idx],
          registro: 'COMPLETO'
        };
        localStorage.setItem('usuarios_db', JSON.stringify(usuarios));
        alert('Registro de administrador completado.');
        navigate('/login');
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-[var(--color-primario)] flex items-center justify-center text-white">Cargando...</div>;
  if (error) return <div className="min-h-screen bg-[var(--color-primario)] flex items-center justify-center text-red-400">{error}</div>;

  return (
    <main className="min-h-screen bg-[var(--color-primario)] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-[var(--color-acento)]">Completar Perfil Administrador</h1>
        <p className="mb-6 text-gray-600">Hola {usuario.nombres}, solo confirma para completar tu acceso administrativo.</p>
        
        <button type="submit" className="w-full bg-[var(--color-secundario)] text-white py-2 rounded font-bold">Confirmar Registro</button>
      </form>
    </main>
  );
};
