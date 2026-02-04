import { NavLink } from "react-router-dom";
import { useAuth } from "../contextos/authContext";

export default function Cabecalho() {
  const { estaAutenticado, logout, usuario } = useAuth();

  const isAdmin = usuario?.admin === true;
  const isTi = usuario?.tipo === "ti";

  const linkClass = ({ isActive }) =>
    isActive ? "nav-btn active" : "nav-btn";

  if (!estaAutenticado) return null;

  return (
    <header className="app-header">
      <h1>Sistema de Chamados de TI</h1>

      <nav className="top-nav">
        <NavLink to="/" className={linkClass}>
          Dashboard
        </NavLink>

        {(isTi || isAdmin) && (
          <NavLink to="/chamados" className={linkClass}>
            Gestão de Chamados
          </NavLink>
        )}

        <NavLink to="/abrir-chamado" className={linkClass}>
          Abrir Chamado
        </NavLink>

        <NavLink to="/meus-chamados" className={linkClass}>
          Meus Chamados
        </NavLink>

        {isAdmin && (
          <NavLink to="/usuarios" className={linkClass}>
            Usuários
          </NavLink>
        )}

        <button onClick={logout} className="nav-btn logout">
          Sair
        </button>
      </nav>
    </header>
  );
}
