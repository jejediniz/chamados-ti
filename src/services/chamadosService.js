const STORAGE_KEY = "@chamados-ti:chamados";

/* =========================
   STATUS
========================= */
export const STATUS_CHAMADO = {
  ABERTO: "ABERTO",
  EM_ATENDIMENTO: "EM_ATENDIMENTO",
  AGUARDANDO_CLIENTE: "AGUARDANDO_CLIENTE",
  AGUARDANDO_TERCEIRO: "AGUARDANDO_TERCEIRO",
  RESOLVIDO: "RESOLVIDO",
  FECHADO: "FECHADO",
};

/* =========================
   PRIORIDADE
========================= */
export const PRIORIDADE = {
  BAIXA: "BAIXA",
  MEDIA: "MEDIA",
  ALTA: "ALTA",
  CRITICA: "CRITICA",
};

/* =========================
   PRIORIDADE AUTOMÁTICA
========================= */
function calcularPrioridade(categoria, impacto) {
  if (impacto === "ALTO") return PRIORIDADE.CRITICA;
  if (categoria === "INFRA") return PRIORIDADE.ALTA;
  return PRIORIDADE.MEDIA;
}

/* =========================
   SLA (HORAS)
========================= */
function calcularSLA(prioridade) {
  switch (prioridade) {
    case PRIORIDADE.CRITICA:
      return 4;
    case PRIORIDADE.ALTA:
      return 8;
    case PRIORIDADE.MEDIA:
      return 24;
    default:
      return 48;
  }
}

/* =========================
   UTIL
========================= */
function getStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function setStorage(dados) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

/* =========================
   LISTAGEM
========================= */
export async function listarChamados(empresaId) {
  const chamados = getStorage();

  return chamados
    .filter(c => c.empresaId === empresaId)
    .map(c => ({
      ...c,
      historico: Array.isArray(c.historico) ? c.historico : [],
      comentarios: Array.isArray(c.comentarios) ? c.comentarios : [],
    }));
}

/* =========================
   CRIAÇÃO
========================= */
export async function salvarChamado(empresaId, dados) {
  const chamados = getStorage();

  const prioridade = calcularPrioridade(
    dados.categoria,
    dados.impacto
  );

  const agora = new Date().toISOString();

  const novoChamado = {
    id: crypto.randomUUID(),
    empresaId,

    responsavel: dados.responsavel || "",
    demanda: dados.demanda || "",
    categoria: dados.categoria || "SUPORTE",
    impacto: dados.impacto || "MEDIO",
    obs: dados.obs || "",

    status: STATUS_CHAMADO.ABERTO,
    prioridade,
    slaHoras: calcularSLA(prioridade),

    criadoEm: agora,
    fechadoEm: null,

    historico: [
      {
        data: agora,
        acao: "Chamado criado",
      },
    ],

    comentarios: [],
  };

  chamados.push(novoChamado);
  setStorage(chamados);

  return novoChamado;
}

/* =========================
   ATUALIZAÇÃO + AUDITORIA
========================= */
export async function atualizarChamadoStorage(
  empresaId,
  id,
  dadosAtualizados
) {
  const chamados = getStorage();

  const index = chamados.findIndex(
    c => c.id === id && c.empresaId === empresaId
  );

  if (index === -1) {
    throw new Error("Chamado não encontrado");
  }

  const chamadoAtual = chamados[index];

  const historicoAtual = Array.isArray(chamadoAtual.historico)
    ? chamadoAtual.historico
    : [];

  const agora = new Date().toISOString();

  const chamadoAtualizado = {
    ...chamadoAtual,
    ...dadosAtualizados,
    historico: [
      ...historicoAtual,
      {
        data: agora,
        acao: "Chamado atualizado",
      },
    ],
    fechadoEm:
      dadosAtualizados.status === STATUS_CHAMADO.FECHADO
        ? agora
        : chamadoAtual.fechadoEm,
  };

  chamados[index] = chamadoAtualizado;
  setStorage(chamados);

  return chamadoAtualizado;
}
export async function excluirChamadoStorage(empresaId, id) {
  const chamados = JSON.parse(
    localStorage.getItem("@chamados-ti:chamados") || "[]"
  );

  const filtrados = chamados.filter(
    c => !(c.id === id && c.empresaId === empresaId)
  );

  localStorage.setItem(
    "@chamados-ti:chamados",
    JSON.stringify(filtrados)
  );

  return true;
}
