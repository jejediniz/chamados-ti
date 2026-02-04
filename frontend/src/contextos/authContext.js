import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEY = "@chamados-ti:auth";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  /**
   * Recupera sessão salva
   */
  useEffect(() => {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);

    if (dadosSalvos) {
      try {
        const { usuario } = JSON.parse(dadosSalvos);
        setUsuario(usuario);
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
    if (usuario) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ usuario })
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [usuario]);

  /**
   * LOGIN REAL (BACKEND)
   */
  async function login(email, senha) {
    setCarregando(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      const { token, usuario } = response.data;

      // 🔑 salva o token para as próximas requisições
      localStorage.setItem("token", token);

      setUsuario(usuario);
    } catch (error) {
      alert("Email ou senha inválidos");
    } finally {
      setCarregando(false);
    }
  }

  /**
   * LOGOUT
   */
  function logout() {
    localStorage.removeItem("token");
    setUsuario(null);
  }

  const estaAutenticado = Boolean(usuario);

  return (
    <AuthContext.Provider
      value={{
        usuario,
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
