import { useContext, useEffect, useState } from "react";
import { ChamadosContext } from "../contextos/chamadosContext";
import { STATUS_CHAMADO } from "../services/chamadosService";

/* ======================
   HOOK DE ANIMAÇÃO
====================== */
function useAnimatedNumber(valor, duracao = 500) {
  const [animado, setAnimado] = useState(0);

  useEffect(() => {
    let inicio = 0;
    const incremento = Math.max(1, Math.ceil(valor / (duracao / 16)));

    function animar() {
      inicio += incremento;
      if (inicio >= valor) {
        setAnimado(valor);
        return;
      }
      setAnimado(inicio);
      requestAnimationFrame(animar);
    }

    animar();
  }, [valor, duracao]);

  return animado;
}

export default function Inicio() {
  const { chamados } = useContext(ChamadosContext);

  const hoje = new Date().toISOString().split("T")[0];

  /* ======================
     MÉTRICAS
  ====================== */
  const total = chamados.length;

  const abertos = chamados.filter(
    c => c.status === STATUS_CHAMADO.ABERTO
  ).length;

  const atendimento = chamados.filter(
    c => c.status === STATUS_CHAMADO.EM_ATENDIMENTO
  ).length;

  const concluidos = chamados.filter(
    c =>
      c.status === STATUS_CHAMADO.RESOLVIDO ||
      c.status === STATUS_CHAMADO.FECHADO
  ).length;

  const criadosHoje = chamados.filter(
    c => c.criadoEm?.startsWith(hoje)
  ).length;

  const fechadosHoje = chamados.filter(
    c => c.fechadoEm?.startsWith(hoje)
  ).length;

  function estourouSLA(chamado) {
    if (
      chamado.status === STATUS_CHAMADO.FECHADO ||
      chamado.status === STATUS_CHAMADO.RESOLVIDO
    ) {
      return false;
    }

    const criado = new Date(chamado.criadoEm);
    const limite = new Date(
      criado.getTime() + chamado.slaHoras * 60 * 60 * 1000
    );

    return new Date() > limite;
  }

  const atrasados = chamados.filter(estourouSLA).length;

  const chamadosAtencao = chamados
    .filter(
      c =>
        c.prioridade === "CRITICA" ||
        estourouSLA(c) ||
        c.status === STATUS_CHAMADO.AGUARDANDO_CLIENTE
    )
    .slice(0, 5);

  /* ======================
     NÚMEROS ANIMADOS
  ====================== */
  const totalAnimado = useAnimatedNumber(total);
  const abertosAnimado = useAnimatedNumber(abertos);
  const atendimentoAnimado = useAnimatedNumber(atendimento);
  const concluidosAnimado = useAnimatedNumber(concluidos);
  const criadosHojeAnimado = useAnimatedNumber(criadosHoje);
  const fechadosHojeAnimado = useAnimatedNumber(fechadosHoje);
  const atrasadosAnimado = useAnimatedNumber(atrasados);

  return (
    <div>
      {/* CABEÇALHO */}
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="page-subtitle">
          Visão geral dos chamados de TI
        </p>
      </div>

      {/* VISÃO GERAL */}
      <div className="dashboard">
        <div className="dashboard-card total">
          <span>Total</span>
          <strong>{totalAnimado}</strong>
        </div>

        <div className="dashboard-card aberto">
          <span>Abertos</span>
          <strong>{abertosAnimado}</strong>
        </div>

        <div className="dashboard-card atendimento">
          <span>Em Atendimento</span>
          <strong>{atendimentoAnimado}</strong>
        </div>

        <div className="dashboard-card concluido">
          <span>Concluídos</span>
          <strong>{concluidosAnimado}</strong>
        </div>
      </div>

      {/* HOJE */}
      <div className="dashboard">
        <div className="dashboard-card total">
          <span>Criados hoje</span>
          <strong>{criadosHojeAnimado}</strong>
        </div>

        <div className="dashboard-card concluido">
          <span>Fechados hoje</span>
          <strong>{fechadosHojeAnimado}</strong>
        </div>

        <div className="dashboard-card alerta">
          <span>SLA estourado</span>
          <strong>{atrasadosAnimado}</strong>
        </div>
      </div>

      {/* ATENÇÃO */}
      <div className="dashboard-atencao">
        <h3>Chamados que exigem atenção</h3>

        {chamadosAtencao.length === 0 && (
          <p>Nenhum chamado crítico no momento.</p>
        )}

        {chamadosAtencao.map(c => (
          <div key={c.id} className="atencao-item">
            <strong>{c.demanda}</strong>
            <span>
              {c.prioridade} · {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
