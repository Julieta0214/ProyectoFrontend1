import Swal from "sweetalert2";

/**
 * Función reutilizable para mostrar alertas de SweetAlert2
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
  }).then(() => {
    if (navigate && url) {
      navigate(url);
    }
  });
};
