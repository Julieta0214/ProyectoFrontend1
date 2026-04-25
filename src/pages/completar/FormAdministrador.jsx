import { useState } from "react";

export const FormAdministrador = () => {
  const [usuario, setUsuario] = useState(null);
  const [tituloProfesional, setTituloProfesional] = useState("");
  const [especializacion, setEspecializacion] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <div>
      <h1>FormAdministrador</h1>
    </div>
  );
};
