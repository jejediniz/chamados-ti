import { useContext, useState } from "react";
import { ChamadosContext } from "../contextos/chamadosContext";

export default function Chamados() {
  const { chamados, criarChamado, removerChamado } =
    useContext(ChamadosContext);

  const [form, setForm] = useState({
    responsavel: "",
    data: "",
    demanda: "",
    status: "Aberto",
    obs: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.responsavel || !form.data || !form.demanda) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    criarChamado(form);

    setForm({
      responsavel: "",
      data: "",
      demanda: "",
      status: "Aberto",
      obs: "",
    });
  }

  return (
    <div>
      {/* CABEÇALHO */}
      <div className="page-header">
        <h2>Chamados</h2>
        <p className="page-subtitle">
          Registro e acompanhamento de chamados
        </p>
      </div>

      <div className="chamados-layout">
        {/* FORMULÁRIO */}
        <div className="form-card">
          <h3>Novo Chamado</h3>

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
              <label>Data</label>
              <input
                type="date"
                name="data"
                value={form.data}
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
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option>Aberto</option>
                <option>Em Atendimento</option>
                <option>Concluído</option>
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

        {/* TABELA */}
        <div className="table-card">
          <div className="table-header">
            <h3>Chamados Registrados</h3>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Responsável</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Demanda</th>
                  <th>Obs</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {chamados.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.responsavel}</td>
                    <td>
                      <span
                        className={`badge ${
                          c.status === "Aberto"
                            ? "aberto"
                            : c.status === "Em Atendimento"
                            ? "atendimento"
                            : "concluido"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>{c.data}</td>
                    <td>{c.demanda}</td>
                    <td>{c.obs}</td>
                    <td>
                      <div className="actions">
                        <button>✏️</button>
                        <button
                          onClick={() => removerChamado(c.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
