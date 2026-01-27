import { useState } from "react";
import { useChamados } from "../contextos/chamadosContext";
import { useAuth } from "../contextos/authContext";
import { STATUS_CHAMADO } from "../services/chamadosService";

const STATUS_LABEL = {
  ABERTO: "Aberto",
  EM_ATENDIMENTO: "Em atendimento",
  AGUARDANDO_CLIENTE: "Aguardando cliente",
  AGUARDANDO_TERCEIRO: "Aguardando terceiro",
  RESOLVIDO: "Resolvido",
  FECHADO: "Fechado",
};

function formatarDataBR(dataISO) {
  if (!dataISO) return "-";
  return new Date(dataISO).toLocaleDateString("pt-BR");
}

export default function Chamados() {
  const {
    chamados,
    criarChamado,
    atualizarChamado,
    excluirChamado,
    chamadoEmEdicao,
    setChamadoEmEdicao,
  } = useChamados();

  const { usuario } = useAuth();
  const isAdmin = usuario?.perfil === "ADMIN";

  const [form, setForm] = useState({
    responsavel: "",
    demanda: "",
    categoria: "SUPORTE",
    impacto: "MEDIO",
    status: STATUS_CHAMADO.ABERTO,
    obs: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function limpar() {
    setChamadoEmEdicao(null);
    setForm({
      responsavel: "",
      demanda: "",
      categoria: "SUPORTE",
      impacto: "MEDIO",
      status: STATUS_CHAMADO.ABERTO,
      obs: "",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.responsavel || !form.demanda) return;

    if (chamadoEmEdicao) {
      atualizarChamado(chamadoEmEdicao.id, form);
    } else {
      criarChamado(form);
    }

    limpar();
  }

  function editarChamado(c) {
    setChamadoEmEdicao({
      ...c,
      historico: Array.isArray(c.historico) ? c.historico : [],
      comentarios: Array.isArray(c.comentarios) ? c.comentarios : [],
    });

    setForm({
      responsavel: c.responsavel || "",
      demanda: c.demanda || "",
      categoria: c.categoria || "SUPORTE",
      impacto: c.impacto || "MEDIO",
      status: c.status || STATUS_CHAMADO.ABERTO,
      obs: c.obs || "",
    });
  }

  function removerChamado(id) {
    if (!isAdmin) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este chamado?"
    );

    if (confirmar) {
      excluirChamado(id);
    }
  }

  return (
    <>
      <div className="page-header">
        <h2>Chamados</h2>
        <p className="page-subtitle">
          Fluxo profissional de atendimento
        </p>
      </div>

      <div className="chamados-layout">
        {/* FORMULÁRIO */}
        <div className="form-card">
          <h3>{chamadoEmEdicao ? "Editar chamado" : "Novo chamado"}</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Responsável</label>
              <input
                name="responsavel"
                value={form.responsavel}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Demanda</label>
              <input
                name="demanda"
                value={form.demanda}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Categoria</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="SUPORTE">Suporte</option>
                <option value="INFRA">Infraestrutura</option>
              </select>
            </div>

            <div className="form-group">
              <label>Impacto</label>
              <select
                name="impacto"
                value={form.impacto}
                onChange={handleChange}
              >
                <option value="BAIXO">Baixo</option>
                <option value="MEDIO">Médio</option>
                <option value="ALTO">Alto</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                {Object.values(STATUS_CHAMADO).map(s => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Observações</label>
              <textarea
                name="obs"
                value={form.obs}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button className="btn-primary" type="submit">
                Salvar
              </button>
            </div>
          </form>
        </div>

        {/* LISTA */}
        <div className="table-card">
          <div className="table-header">
            <h3>Chamados registrados</h3>
          </div>

          <table className="chamados-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Demanda</th>
                <th>Responsável</th>
                <th>Abertura</th>
                <th>Prioridade</th>
                <th>SLA (h)</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {chamados.map(c => (
                <tr key={c.id}>
                  <td>
                    <span
                      className={`status status-${c.status?.toLowerCase()}`}
                    >
                      {STATUS_LABEL[c.status]}
                    </span>
                  </td>
                  <td>{c.demanda}</td>
                  <td>{c.responsavel}</td>
                  <td>{formatarDataBR(c.criadoEm)}</td>
                  <td>{c.prioridade || "-"}</td>
                  <td>{c.slaHoras ?? "-"}</td>
                  <td>
                    <button onClick={() => editarChamado(c)}>
                      Editar
                    </button>

                    {isAdmin && (
                      <button
                        className="btn-danger"
                        onClick={() => removerChamado(c.id)}
                      >
                        Excluir
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HISTÓRICO */}
      {chamadoEmEdicao && (
        <div className="form-card">
          <h3>Histórico do chamado</h3>

          {chamadoEmEdicao.historico.length === 0 ? (
            <p>Nenhum histórico disponível.</p>
          ) : (
            <ul>
              {chamadoEmEdicao.historico.map((h, i) => (
                <li key={i}>
                  {new Date(h.data).toLocaleString("pt-BR")} — {h.acao}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
