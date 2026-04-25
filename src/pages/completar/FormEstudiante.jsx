import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const FormEstudiante = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [programaId, setProgramaId] = useState('');
  const [programas, setProgramas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      try {
        const usuarios = JSON.parse(localStorage.getItem('usuarios_db') || '[]');
        const found = usuarios.find((u) => u.tokenRegistro === token || u.token === token);
        if (!found) throw new Error('Enlace de registro inválido o expirado');
        
        const progs = JSON.parse(localStorage.getItem('programas_db') || '[]');
        
        setUsuario(found);
        setProgramas(progs);
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
          programaId,
          registro: 'COMPLETO'
        };
        localStorage.setItem('usuarios_db', JSON.stringify(usuarios));
        alert('Registro completado con éxito.');
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
        <h1 className="text-2xl font-bold mb-4 text-[var(--color-acento)]">Completar Perfil Estudiante</h1>
        <p className="mb-6 text-gray-600">Hola {usuario.nombres}, selecciona tu programa académico.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Programa Académico</label>
            <select value={programaId} onChange={e => setProgramaId(e.target.value)} required className="w-full p-2 border rounded">
              <option value="">Selecciona un programa</option>
              {programas.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-[var(--color-secundario)] text-white py-2 rounded font-bold">Completar Registro</button>
        </div>
      </form>
    </main>
  );
};
