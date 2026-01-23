import { useContext } from "react";
import { ChamadosContext } from "../contextos/chamadosContext";

export default function Inicio() {
  const { chamados } = useContext(ChamadosContext);

  const total = chamados.length;

  const abertos = chamados.filter(
    (c) => (c.status || "Aberto") === "Aberto"
  ).length;

  const atendimento = chamados.filter(
    (c) => (c.status || "Aberto") === "Em Atendimento"
  ).length;

  const concluidos = chamados.filter(
    (c) => (c.status || "Aberto") === "Concluído"
  ).length;

  return (
    <div>
      {/* CABEÇALHO DA PÁGINA */}
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="page-subtitle">
          Visão geral dos chamados de TI
        </p>
      </div>

      {/* CARDS */}
      <div className="dashboard">
        <div className="dashboard-card total">
          <span>Total de Chamados</span>
          <strong>{total}</strong>
        </div>

        <div className="dashboard-card aberto">
          <span>Abertos</span>
          <strong>{abertos}</strong>
        </div>

        <div className="dashboard-card atendimento">
          <span>Em Atendimento</span>
          <strong>{atendimento}</strong>
        </div>

        <div className="dashboard-card concluido">
          <span>Concluídos</span>
          <strong>{concluidos}</strong>
        </div>
      </div>
    </div>
  );
}
