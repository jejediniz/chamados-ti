import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contextos/authContext";

export default function Login() {
  const { login, estaAutenticado, carregando } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const from = location.state?.from?.pathname || "/";

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !senha) {
      alert("Informe email e senha");
      return;
    }

    login(email, senha);
  }

  useEffect(() => {
    if (!carregando && estaAutenticado) {
      navigate(from, { replace: true });
    }
  }, [estaAutenticado, carregando, navigate, from]);

  if (carregando) return null;

  return (
    <>
      {/* CABEÇALHO DO LOGIN (SEM BOTÕES) */}
      <header className="login-header">
        <h1>Chamados TI</h1>
      </header>

      {/* CONTEÚDO */}
      <div className="center-page">
        <div className="auth-card">
          <h2>Login</h2>
          <p>Informe suas credenciais para acessar o sistema</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Senha</label>
              <input
                type="password"
                placeholder="********"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div className="auth-actions">
              <button type="submit">Entrar</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
