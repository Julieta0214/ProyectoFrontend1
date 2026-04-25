import { useState } from "react";

export const FormEstudiante = () => {
  const [usuario, setUsuario] = useState(null);
  const [programas, setProgramas] = useState([]);
  const [programaId, setProgramaId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sinProgramas, setSinProgramas] = useState(false);

  return (
    <div>
      <h1>FormEstudiante</h1>
    </div>
  );
};
