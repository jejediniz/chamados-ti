const STORAGE_KEY = "@chamados-ti:chamados";

/**
 * Lista chamados da empresa
 */
export async function listarChamados(empresaId) {
  if (!empresaId) {
    throw new Error("Empresa não informada");
  }

  const dados = localStorage.getItem(STORAGE_KEY);
  const chamados = dados ? JSON.parse(dados) : [];

  return chamados.filter(
    (chamado) => chamado.empresaId === empresaId
  );
}

/**
 * Salva chamado vinculado à empresa
 */
export async function salvarChamado(empresaId, chamado) {
  if (!empresaId) {
    throw new Error("Empresa não informada");
  }

  const dados = localStorage.getItem(STORAGE_KEY);
  const chamados = dados ? JSON.parse(dados) : [];

  const novoChamado = {
    ...chamado,
    id: Date.now(),
    empresaId,
    status: "ABERTO",
  };

  chamados.push(novoChamado);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chamados));

  return novoChamado;
}
