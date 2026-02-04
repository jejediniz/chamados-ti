import { NavLink } from "react-router-dom";
import { useAuth } from "../contextos/authContext";
import { PERFIS } from "../config/perfis";

export default function Cabecalho() {
  const { estaAutenticado, perfil, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive ? "nav-btn active" : "nav-btn";

  if (!estaAutenticado) return null;

  return (
    <header className="app-header">
      <h1>Sistemas de chamados da T.i</h1>

      <nav className="top-nav">
        <NavLink to="/" className={linkClass}>
          Dashboard
        </NavLink>

        {(perfil === PERFIS.TECNICO || perfil === PERFIS.ADMIN) && (
          <NavLink to="/chamados" className={linkClass}>
            Gestão de Chamados
          </NavLink>
        )}

        {(perfil === PERFIS.USUARIO || perfil === PERFIS.ADMIN) && (
          <NavLink to="/abrir-chamado" className={linkClass}>
            Abrir Chamado
          </NavLink>
        )}

        <button onClick={logout} className="nav-btn logout">
          Sair
        </button>
      </nav>
    </header>
  );
}
