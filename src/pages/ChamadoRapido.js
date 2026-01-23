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
    demanda: "",
    responsavel: "",
    setor: "",
    obs: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.demanda || !form.responsavel || !form.setor) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    await criarChamado({
      responsavel: form.responsavel,
      demanda: form.demanda,
      obs: `${form.setor} - ${form.obs}`,
      status: "Aberto",
      data: new Date().toISOString().split("T")[0],
    });

    setForm({ demanda: "", responsavel: "", setor: "", obs: "" });
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
            <select name="demanda" value={form.demanda} onChange={handleChange}>
              <option value="">Selecione</option>
              {DEMANDAS_PADRAO.map((d, i) => (
                <option key={i}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Seu nome</label>
            <input
              name="responsavel"
              value={form.responsavel}
              onChange={handleChange}
              placeholder="Informe seu nome"
            />
          </div>

          <div>
            <label>Setor</label>
            <input
              name="setor"
              value={form.setor}
              onChange={handleChange}
              placeholder="Ex: Financeiro, RH..."
            />
          </div>

          <div>
            <label>Observações (opcional)</label>
            <textarea
              name="obs"
              value={form.obs}
              onChange={handleChange}
              placeholder="Descreva mais detalhes"
            />
          </div>

          <div className="form-actions center">
            <button className="btn-primary">Abrir Chamado</button>
          </div>

        </form>
      </div>
    </div>
  );
}
