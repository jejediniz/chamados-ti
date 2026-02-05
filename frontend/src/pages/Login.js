import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contextos/authContext";

export default function Login() {
  const { login, estaAutenticado, carregando, erro } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroLocal, setErroLocal] = useState(null);

  const from = location.state?.from?.pathname || "/";

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !senha) {
      setErroLocal("Informe email e senha");
      return;
    }

    setErroLocal(null);
    await login(email, senha);
  }

  useEffect(() => {
    if (!carregando && estaAutenticado) {
      navigate(from, { replace: true });
    }
  }, [estaAutenticado, carregando, navigate, from]);

  if (carregando && !estaAutenticado) {
    return (
      <div className="center-page">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

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

          {erroLocal && <div className="alert alert-error">{erroLocal}</div>}
          {erro && <div className="alert alert-error">{erro}</div>}

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
              <button type="submit" disabled={carregando}>
                {carregando ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
