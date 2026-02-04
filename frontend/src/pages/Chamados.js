import { useEffect, useState } from "react";
import { useAuth } from "../contextos/authContext";
import {
  listarChamados,
  criarChamado,
  atualizarStatusChamado,
  excluirChamado,
} from "../services/chamadosApi";

const STATUS_LABEL = {
  aberto: "Aberto",
  em_andamento: "Em atendimento",
  fechado: "Fechado",
};

export default function Chamados() {
  const { usuario } = useAuth();
  const isAdmin = usuario?.perfil === "ADMIN";

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
      await atualizarStatusChamado(editandoId, form.status || "aberto");
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
    <>
      <h2>Chamados</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
        />

        <textarea
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
        />

        <select
          name="prioridade"
          value={form.prioridade}
          onChange={handleChange}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>

        {editandoId && (
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="aberto">Aberto</option>
            <option value="em_andamento">Em andamento</option>
            <option value="fechado">Fechado</option>
          </select>
        )}

        <button type="submit">
          {editandoId ? "Atualizar" : "Criar"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Título</th>
            <th>Prioridade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {chamados.map(c => (
            <tr key={c.id}>
              <td>{STATUS_LABEL[c.status]}</td>
              <td>{c.titulo}</td>
              <td>{c.prioridade}</td>
              <td>
                <button onClick={() => editarChamado(c)}>Editar</button>
                {isAdmin && (
                  <button onClick={() => remover(c.id)}>Excluir</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
