import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { showAlert } from "../utils/alerts";

export const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    tipoDocumento: "CC",
    documento: "",
    correo: "",
    numeroCelular: "",
    password: "",
    confirmPassword: "",
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validarFormulario = () => {
    let nuevosErrores = {};

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(formData.correo)) {
      nuevosErrores.correo = "Correo electrónico inválido";
    }

    if (!/^\d+$/.test(formData.documento)) {
      nuevosErrores.documento = "Solo se permiten números";
    }

    const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!regexPassword.test(formData.password)) {
      nuevosErrores.password =
        "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial";
    }

    if (formData.password !== formData.confirmPassword) {
      nuevosErrores.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      // Cargar usuarios existentes de la base de datos unificada
      const usuarios = JSON.parse(localStorage.getItem("usuarios_db") || "[]");

      // Validar duplicados
      if (usuarios.some((u) => u.correo === formData.correo)) {
        showAlert({
          title: "Error",
          text: "Ya existe un usuario registrado con ese correo electrónico.",
          icon: "error",
        });
        return;
      }
      if (usuarios.some((u) => u.documento === formData.documento)) {
        showAlert({
          title: "Error",
          text: "Ya existe un usuario registrado con ese número de documento.",
          icon: "error",
        });
        return;
      }

      // Crear nuevo usuario
      const nuevoUsuario = {
        id: crypto.randomUUID(),
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        tipoDocumento: formData.tipoDocumento,
        documento: formData.documento,
        correo: formData.correo,
        numeroCelular: formData.numeroCelular,
        contraseña: formData.password,
        rol: null, // El admin asignará el rol
        token: `token-${Date.now()}`,
        tokenRegistro: `reg-${Date.now()}`,
        estado: "ACTIVO",
        registro: "INCOMPLETO",
      };

      // Guardar en usuarios_db
      usuarios.push(nuevoUsuario);
      localStorage.setItem("usuarios_db", JSON.stringify(usuarios));

      showAlert({
        title: "Registro Exitoso",
        text: "Usuario registrado correctamente. Revisa tu correo electrónico para continuar con el registro (Simulado). El administrador debe asignarte un rol.",
        icon: "success",
        navigate,
        url: "/login",
      });
    } catch (error) {
      console.error("Error:", error);
      showAlert({
        title: "Error",
        text: `No se pudo registrar el usuario: ${error.message}`,
        icon: "error",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-primario)] flex items-center justify-center px-4 py-8">
      <form
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-4 border border-[var(--color-secundario)]/10"
        onSubmit={handleRegister}
      >
        <h1 className="text-2xl font-bold text-center text-[var(--color-acento)] mb-4">
          Formulario de Registro
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-acento)]">Nombres</label>
            <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-acento)]">Apellidos</label>
            <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-acento)]">Tipo Doc.</label>
            <select name="tipoDocumento" value={formData.tipoDocumento} onChange={handleChange} className="mt-1 w-full p-2 border rounded-lg">
              <option value="CC">Cédula</option>
              <option value="TI">Tarjeta de identidad</option>
              <option value="PP">Pasaporte</option>
              <option value="CE">Cédula extranjera</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-acento)]">Documento</label>
            <input type="text" name="documento" value={formData.documento} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-lg" />
            {errores.documento && <p className="text-red-500 text-xs">{errores.documento}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">Correo</label>
          <input type="email" name="correo" value={formData.correo} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-lg" />
          {errores.correo && <p className="text-red-500 text-xs">{errores.correo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">Celular</label>
          <input type="text" name="numeroCelular" value={formData.numeroCelular} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-lg" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">Contraseña</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-lg" />
          {errores.password && <p className="text-red-500 text-xs">{errores.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-acento)]">Confirmar Contraseña</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-lg" />
          {errores.confirmPassword && <p className="text-red-500 text-xs">{errores.confirmPassword}</p>}
        </div>

        <button type="submit" className="w-full bg-[var(--color-secundario)] text-white py-3 rounded-lg font-semibold mt-4">Registrar</button>
      </form>
    </main>
  );
};
