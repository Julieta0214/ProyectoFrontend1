import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const FormProfesor = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [tituloProfesional, setTituloProfesional] = useState("");
  const [especializacion, setEspecializacion] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
