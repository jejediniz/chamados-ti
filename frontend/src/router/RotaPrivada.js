import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contextos/authContext";

export default function RotaPrivada({ perfisPermitidos }) {
  const { estaAutenticado, perfil, carregando } = useAuth();
  const location = useLocation();

  if (carregando) return null;

  if (!estaAutenticado) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (perfisPermitidos && perfil && !perfisPermitidos.includes(perfil)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
