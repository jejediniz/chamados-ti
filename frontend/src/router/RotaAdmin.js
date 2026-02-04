import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contextos/authContext";

export default function RotaAdmin() {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  if (carregando) return null;

  if (!usuario?.admin) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
