import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contextos/authContext";

export default function RotaTiOuAdmin() {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  if (carregando) return null;

  const permitido = usuario?.tipo === "ti" || usuario?.admin === true;

  if (!permitido) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
