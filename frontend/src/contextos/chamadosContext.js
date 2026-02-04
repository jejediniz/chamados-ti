import { createContext, useContext, useEffect, useState } from "react";
import {
  listarChamados,
  salvarChamado,
  atualizarChamadoStorage,
  excluirChamadoStorage,
} from "../services/chamadosService";
import { useAuth } from "./authContext";

export const ChamadosContext = createContext();

export function ChamadosProvider({ children }) {
  const { empresaAtiva, usuario } = useAuth();

  const [chamados, setChamados] = useState([]);
  const [chamadoEmEdicao, setChamadoEmEdicao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      if (!empresaAtiva) {
        setChamados([]);
        setCarregando(false);
        return;
      }

      setCarregando(true);
      const dados = await listarChamados(empresaAtiva.id);
      setChamados(dados);
      setCarregando(false);
    }

    carregar();
  }, [empresaAtiva]);

  async function criarChamado(dados) {
    const novo = await salvarChamado(empresaAtiva.id, dados);
    setChamados(prev => [...prev, novo]);
  }

  async function atualizarChamado(id, dados) {
    const atualizado = await atualizarChamadoStorage(
      empresaAtiva.id,
      id,
      dados
    );

    setChamados(prev =>
      prev.map(c => (c.id === id ? atualizado : c))
    );

    setChamadoEmEdicao(null);
  }

  async function excluirChamado(id) {
    if (usuario?.perfil !== "ADMIN") {
      throw new Error("Ação não permitida");
    }

    await excluirChamadoStorage(empresaAtiva.id, id);

    setChamados(prev =>
      prev.filter(c => c.id !== id)
    );
  }

  return (
    <ChamadosContext.Provider
      value={{
        chamados,
        criarChamado,
        atualizarChamado,
        excluirChamado, // ✅ AGORA ESTÁ SENDO USADO
        chamadoEmEdicao,
        setChamadoEmEdicao,
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
