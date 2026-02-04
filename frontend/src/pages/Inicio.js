import { useEffect, useState } from "react";
import { useChamados } from "../contextos/chamadosContext";

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
  const { chamados } = useChamados();

  /* ======================
     MÉTRICAS REAIS
  ====================== */
  const total = chamados.length;

  const abertos = chamados.filter(c => c.status === "aberto").length;
  const andamento = chamados.filter(c => c.status === "em_andamento").length;
  const fechados = chamados.filter(c => c.status === "fechado").length;

  /* ======================
     NÚMEROS ANIMADOS
  ====================== */
  const totalAnimado = useAnimatedNumber(total);
  const abertosAnimado = useAnimatedNumber(abertos);
  const andamentoAnimado = useAnimatedNumber(andamento);
  const fechadosAnimado = useAnimatedNumber(fechados);

  return (
    <div>
      {/* CABEÇALHO */}
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="page-subtitle">Visão geral dos chamados</p>
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
          <span>Em andamento</span>
          <strong>{andamentoAnimado}</strong>
        </div>

        <div className="dashboard-card concluido">
          <span>Fechados</span>
          <strong>{fechadosAnimado}</strong>
        </div>
      </div>
    </div>
  );
}
