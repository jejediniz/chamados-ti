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

  async function carregarChamados() {
    setCarregando(true);
    try {
      const data = await listarChamados();
      setChamados(data);
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
    await criarChamado(dados);
    carregarChamados();
  }

  async function atualizarChamadoContext(id, dados) {
    await atualizarChamado(id, dados);
    carregarChamados();
  }

  async function excluirChamadoContext(id) {
    await excluirChamado(id);
    carregarChamados();
  }

  return (
    <ChamadosContext.Provider
      value={{
        chamados,
        carregando,
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
