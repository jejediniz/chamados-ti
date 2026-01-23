import { createContext, useContext, useEffect, useState } from "react";
import { listarChamados, salvarChamado } from "../services/chamadosService";
import { useAuth } from "./authContext";

export const ChamadosContext = createContext();

export function ChamadosProvider({ children }) {
  const auth = useAuth();
  const empresaAtiva = auth?.empresaAtiva;

  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  /**
   * Carrega chamados SOMENTE quando a empresa existir
   */
  useEffect(() => {
    async function carregarChamados() {
      if (!empresaAtiva) {
        setChamados([]);
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        const dados = await listarChamados(empresaAtiva.id);
        setChamados(dados);
      } catch (error) {
        console.error("Erro ao carregar chamados:", error);
        setChamados([]);
      } finally {
        setCarregando(false);
      }
    }

    carregarChamados();
  }, [empresaAtiva]);

  /**
   * Cria chamado sempre vinculado à empresa ativa
   */
  async function criarChamado(dadosChamado) {
    if (!empresaAtiva) {
      throw new Error("Empresa não definida");
    }

    const novoChamado = await salvarChamado(
      empresaAtiva.id,
      dadosChamado
    );

    setChamados((estadoAtual) => [...estadoAtual, novoChamado]);
  }

  return (
    <ChamadosContext.Provider
      value={{
        chamados,
        criarChamado,
        carregando,
      }}
    >
      {children}
    </ChamadosContext.Provider>
  );
}

export function useChamados() {
  return useContext(ChamadosContext);
}
