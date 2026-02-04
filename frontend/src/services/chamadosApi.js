import api from "./api";

/**
 * LISTAR CHAMADOS
 */
export async function listarChamados() {
  const response = await api.get("/chamados");
  return response.data;
}

/**
 * CRIAR CHAMADO
 */
export async function criarChamado(dados) {
  const response = await api.post("/chamados", {
    titulo: dados.titulo,
    descricao: dados.descricao,
    prioridade: dados.prioridade?.toLowerCase() || "media",
  });

  return response.data;
}

/**
 * ATUALIZAR STATUS
 */
export async function atualizarChamado(id, dados) {
  const response = await api.put(`/chamados/${id}`, {
    titulo: dados.titulo,
    descricao: dados.descricao,
    prioridade: dados.prioridade,
    status: dados.status,
  });

  return response.data;
}

/**
 * DELETAR CHAMADO
 */
export async function excluirChamado(id) {
  await api.delete(`/chamados/${id}`);
  return true;
}
