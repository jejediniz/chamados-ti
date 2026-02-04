import { createContext, useContext, useEffect, useState } from "react";
import { PERFIS } from "../config/perfis";

const AuthContext = createContext(null);

const STORAGE_KEY = "@chamados-ti:auth";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [empresaAtiva, setEmpresaAtiva] = useState(null);
  const [carregando, setCarregando] = useState(true);

  /**
   * Recupera sessão salva
   */
  useEffect(() => {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);

    if (dadosSalvos) {
      try {
        const { usuario, empresaAtiva } = JSON.parse(dadosSalvos);
        setUsuario(usuario);
        setEmpresaAtiva(empresaAtiva);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setCarregando(false);
  }, []);

  /**
   * Persiste sessão
   */
  useEffect(() => {
    if (usuario && empresaAtiva) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ usuario, empresaAtiva })
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [usuario, empresaAtiva]);

  /**
   * Login
   */
  function login(email, senha) {
    const empresaFake = {
      id: 1,
      nome: "Empresa Demo",
      slug: "empresa-demo",
    };

    const perfil =
      email === "admin@chamadosti.com"
        ? PERFIS.ADMIN
        : email.includes("tecnico")
        ? PERFIS.TECNICO
        : PERFIS.USUARIO;

    const usuarioFake = {
      id: 1,
      nome:
        perfil === PERFIS.ADMIN
          ? "Administrador do Sistema"
          : "Usuário Teste",
      email,
      perfil,
      empresa: empresaFake,
    };

    setUsuario(usuarioFake);
    setEmpresaAtiva(empresaFake);
  }

  /**
   * Logout
   */
  function logout() {
    setUsuario(null);
    setEmpresaAtiva(null);
  }

  const estaAutenticado = Boolean(usuario);
  const perfil = usuario?.perfil ?? null;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        perfil,
        empresaAtiva,
        estaAutenticado,
        carregando,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
