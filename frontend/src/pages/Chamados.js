import { useEffect, useState } from "react";
import { useAuth } from "../contextos/authContext";
import {
  listarChamados,
  criarChamado,
  atualizarChamado,
  excluirChamado,
} from "../services/chamadosApi";
import { listarTecnicos } from "../services/usuariosApi";

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
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [limite, setLimite] = useState(10);
  const [meta, setMeta] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    prioridade: "media",
    tecnicoId: "",
  });
  const [editandoId, setEditandoId] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);

  async function carregarChamados(novaPagina = 1) {
    setCarregando(true);
    setErro(null);
    try {
      const { items, meta: metaApi } = await listarChamados({
        page: novaPagina,
        limit: limite,
      });
      setChamados(items);
      setMeta(metaApi);
      setPagina(novaPagina);
    } catch (error) {
      setErro(error.message || "Erro ao carregar chamados");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarChamados(1);
  }, [limite]);

  useEffect(() => {
    async function buscarTecnicos() {
      try {
        const data = await listarTecnicos();
        setTecnicos(data.filter((u) => u.tipo === "ti"));
      } catch {
        //
      }
    }

    buscarTecnicos();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.titulo || !form.descricao) return;

    setErro(null);
    try {
    const payload = {
      titulo: form.titulo,
      descricao: form.descricao,
      prioridade: form.prioridade,
      tecnicoId: form.tecnicoId || undefined,
    }

    if (editandoId) {
      payload.status = form.status || "aberto";
      await atualizarChamado(editandoId, payload);
    } else {
      await criarChamado(payload);
    }
    } catch (error) {
      setErro(error.message || "Erro ao salvar chamado");
      return;
    }

    setForm({ titulo: "", descricao: "", prioridade: "media", tecnicoId: "" });
    setEditandoId(null);
    carregarChamados(pagina);
  }

  function editarChamado(chamado) {
    setEditandoId(chamado.id);
    setForm({
      titulo: chamado.titulo,
      descricao: chamado.descricao,
      prioridade: chamado.prioridade,
      status: chamado.status,
      tecnicoId: chamado.tecnico?.id || "",
    });
  }

  async function remover(id) {
    if (!window.confirm("Deseja excluir este chamado?")) return;
    setErro(null);
      try {
        await excluirChamado(id);
        carregarChamados(pagina);
    } catch (error) {
      setErro(error.message || "Erro ao excluir chamado");
    }
  }

  async function assumirChamado(id) {
    setErro(null);
    try {
      await atualizarChamado(id, { tecnicoId: usuario.id });
      carregarChamados(pagina);
    } catch (error) {
      setErro(error.message || "Erro ao assumir chamado");
    }
  }

  function irParaPagina(novaPagina) {
    if (novaPagina < 1) return;
    if (meta?.totalPages && novaPagina > meta.totalPages) return;
    carregarChamados(novaPagina);
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
          {erro && <div className="alert alert-error">{erro}</div>}

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

          <div className="form-group">
            <label>Técnico responsável</label>
            <select
              name="tecnicoId"
              value={form.tecnicoId}
              onChange={handleChange}
            >
              <option value="">Sem atribuição</option>
              {tecnicos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
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

          <div className="table-actions">
            <label>
              Itens por página
              <select
                value={limite}
                onChange={(e) => setLimite(Number(e.target.value))}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </label>
          </div>

          <table className="chamados-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Título</th>
                <th>Solicitante</th>
                <th>Técnico</th>
                <th>Prioridade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando && (
                <tr>
                  <td colSpan="6">Carregando...</td>
                </tr>
              )}

              {chamados.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className={`status status-${c.status}`}>
                      {STATUS_LABEL[c.status]}
                    </span>
                  </td>
                  <td>{c.titulo}</td>
                  <td>
                    {c.solicitante?.nome || "—"}
                    {c.solicitante?.tipo && (
                      <div className="secondary-text">{c.solicitante.tipo}</div>
                    )}
                  </td>
                  <td>
                    {c.tecnico?.nome || "—"}
                    {c.tecnico?.email && (
                      <div className="secondary-text">{c.tecnico.email}</div>
                    )}
                  </td>
                  <td>{c.prioridade}</td>
                  <td>
                    <div className="acoes">
                      {isTi && (
                        <button
                          onClick={() => assumirChamado(c.id)}
                          className="btn-acao btn-editar"
                        >
                          Assumir
                        </button>
                      )}
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

              {!carregando && chamados.length === 0 && (
                <tr>
                  <td colSpan="6">Nenhum chamado encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>

          {meta && meta.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn-acao"
                onClick={() => irParaPagina(pagina - 1)}
                disabled={pagina <= 1 || carregando}
              >
                Anterior
              </button>

              <span>
                Página {pagina} de {meta.totalPages}
              </span>

              <button
                className="btn-acao"
                onClick={() => irParaPagina(pagina + 1)}
                disabled={pagina >= meta.totalPages || carregando}
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
