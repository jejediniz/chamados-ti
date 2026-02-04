import { useState } from "react";
import { useChamados } from "../contextos/chamadosContext";

const DEMANDAS_PADRAO = [
  "Computador não liga",
  "Internet lenta",
  "Erro em sistema",
  "Impressora não funciona",
  "Solicitação de acesso",
  "Outro problema",
];

export default function ChamadoRapido() {
  const { criarChamado } = useChamados();

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    prioridade: "media",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.titulo || !form.descricao) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    await criarChamado({
      titulo: form.titulo,
      descricao: form.descricao,
      prioridade: form.prioridade,
    });

    setForm({ titulo: "", descricao: "", prioridade: "media" });
    alert("Chamado aberto com sucesso!");
  }

  return (
    <div className="center-page">
      <div className="open-ticket">
        <h2>Abrir Chamado</h2>
        <p>Informe o problema para o suporte de TI</p>

        <form onSubmit={handleSubmit} className="open-form">
          <div>
            <label>Qual é o problema?</label>
            <select name="titulo" value={form.titulo} onChange={handleChange}>
              <option value="">Selecione</option>
              {DEMANDAS_PADRAO.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Descrição</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descreva o problema com detalhes"
            />
          </div>

          <div>
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

          <div className="form-actions center">
            <button className="btn-primary">Abrir Chamado</button>
          </div>
        </form>
      </div>
    </div>
  );
}
