import Swal from "sweetalert2";

/**
 * Función reutilizable para mostrar alertas de SweetAlert2
 * @param {Object} options - Configuración de la alerta
 * @param {string} options.title - Título de la alerta
 * @param {string} options.text - Mensaje del cuerpo
 * @param {string} options.icon - 'success', 'error', 'warning', 'info', 'question'
 * @param {string} options.color - Color del botón (ej: '#1d4ed8')
 * @param {string} options.btnText - Texto del botón
 * @param {function} options.navigate - Función de redirección (opcional)
 * @param {string} options.url - Ruta a la que redirigir (opcional)
 */
export const showAlert = ({
  title,
  text,
  icon,
  color,
  btnText,
  navigate,
  url,
}) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonColor: color || "#1d4ed8",
    confirmButtonText: btnText || "Aceptar",
    allowOutsideClick: false,
    timer: 3000,
    timerProgressBar: true,
  }).then((result) => {
    setTimeout(() => {
      navigate(url);
    }, 2800);
    // Si pasaste un navigate y una url, redirige al confirmar
    if (result.isConfirmed && navigate && url) {
      navigate(url);
    }
  });
};
