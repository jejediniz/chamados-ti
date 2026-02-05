import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import {
  listarChamados,
  criarChamado,
  atualizarChamado,
  excluirChamado,
} from "../services/chamadosApi";

const ChamadosContext = createContext(null);

export function ChamadosProvider({ children }) {
  const { usuario } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [chamadoEmEdicao, setChamadoEmEdicao] = useState(null);
  const [erro, setErro] = useState(null);

  async function carregarChamados() {
    setCarregando(true);
    setErro(null);
    try {
      const { items } = await listarChamados({ page: 1, limit: 200 });
      setChamados(items);
    } catch (error) {
      setErro(error.message || "Erro ao carregar chamados");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (usuario) {
      carregarChamados();
    } else {
      setChamados([]);
    }
  }, [usuario]);

  async function criarChamadoContext(dados) {
    setErro(null);
    await criarChamado(dados);
    carregarChamados();
  }

  async function atualizarChamadoContext(id, dados) {
    setErro(null);
    await atualizarChamado(id, dados);
    carregarChamados();
  }

  async function excluirChamadoContext(id) {
    setErro(null);
    await excluirChamado(id);
    carregarChamados();
  }

  return (
    <ChamadosContext.Provider
      value={{
        chamados,
        carregando,
        erro,
        chamadoEmEdicao,
        setChamadoEmEdicao,
        criarChamado: criarChamadoContext,
        atualizarChamado: atualizarChamadoContext,
        excluirChamado: excluirChamadoContext,
        recarregar: carregarChamados,
      }}
    >
      {children}
    </ChamadosContext.Provider>
  );
}

export function useChamados() {
  const ctx = useContext(ChamadosContext);
  if (!ctx) {
    throw new Error("useChamados deve ser usado dentro de ChamadosProvider");
  }
  return ctx;
}
