import { useEffect, useState } from "react";
import { useAuth } from "../contextos/authContext";
import {
  listarChamados,
  criarChamado,
  atualizarChamado,
  excluirChamado,
} from "../services/chamadosApi";

const STATUS_LABEL = {
  aberto: "Aberto",
  em_andamento: "Em atendimento",
  fechado: "Fechado",
};

export default function Chamados() {
  const { usuario } = useAuth();
  const isAdmin = usuario?.admin === true;
  const isTi = usuario?.tipo === "ti";

  const [chamados, setChamados] = useState([]);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    prioridade: "media",
  });
  const [editandoId, setEditandoId] = useState(null);

  async function carregarChamados() {
    const data = await listarChamados();
    setChamados(data);
  }

  useEffect(() => {
    carregarChamados();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.titulo || !form.descricao) return;

    if (editandoId) {
      await atualizarChamado(editandoId, {
        titulo: form.titulo,
        descricao: form.descricao,
        prioridade: form.prioridade,
        status: form.status || "aberto",
      });
    } else {
      await criarChamado(form);
    }

    setForm({ titulo: "", descricao: "", prioridade: "media" });
    setEditandoId(null);
    carregarChamados();
  }

  function editarChamado(chamado) {
    setEditandoId(chamado.id);
    setForm({
      titulo: chamado.titulo,
      descricao: chamado.descricao,
      prioridade: chamado.prioridade,
      status: chamado.status,
    });
  }

  async function remover(id) {
    if (!window.confirm("Deseja excluir este chamado?")) return;
    await excluirChamado(id);
    carregarChamados();
  }

  return (
    <div>
      <div className="page-header">
        <h2>Gestão de Chamados</h2>
        <p className="page-subtitle">
          Visualize e gerencie chamados conforme sua permissão
        </p>
      </div>

      <div className="chamados-layout">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-group">
            <label>Título</label>
            <input
              name="titulo"
              placeholder="Título"
              value={form.titulo}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              placeholder="Descrição"
              value={form.descricao}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Prioridade</label>
            <select
              name="prioridade"
              value={form.prioridade}
              onChange={handleChange}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          {editandoId && (
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="aberto">Aberto</option>
                <option value="em_andamento">Em andamento</option>
                <option value="fechado">Fechado</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-acao btn-editar">
              {editandoId ? "Atualizar" : "Criar"}
            </button>
          </div>
        </form>

        <div className="table-card">
          <div className="table-header">
            <strong>Chamados cadastrados</strong>
          </div>
          <table className="chamados-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Título</th>
                <th>Prioridade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {chamados.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className={`status status-${c.status}`}>
                      {STATUS_LABEL[c.status]}
                    </span>
                  </td>
                  <td>{c.titulo}</td>
                  <td>{c.prioridade}</td>
                  <td>
                    <div className="acoes">
                      {isTi && (
                        <button
                          onClick={() => editarChamado(c)}
                          className="btn-acao btn-editar"
                        >
                          Editar
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => remover(c.id)}
                          className="btn-acao btn-excluir"
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {chamados.length === 0 && (
                <tr>
                  <td colSpan="4">Nenhum chamado encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
