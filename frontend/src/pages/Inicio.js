import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChamados } from "../contextos/chamadosContext";
import { Button, Card } from "../components/ui";

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
  const navigate = useNavigate();

  /* ======================
     MÉTRICAS REAIS
  ====================== */
  const total = chamados.length;

  const abertos = chamados.filter((c) => c.status === "aberto").length;
  const andamento = chamados.filter((c) => c.status === "em_andamento").length;
  const fechados = chamados.filter((c) => c.status === "fechado").length;

  /* ======================
     NÚMEROS ANIMADOS
  ====================== */
  const totalAnimado = useAnimatedNumber(total);
  const abertosAnimado = useAnimatedNumber(abertos);
  const andamentoAnimado = useAnimatedNumber(andamento);
  const fechadosAnimado = useAnimatedNumber(fechados);

  const metricCards = useMemo(
    () => [
      {
        key: "total",
        label: "Total de chamados",
        value: totalAnimado,
        sublabel: "Chamados registrados no sistema",
        variant: "primary",
        icon: "📊",
      },
      {
        key: "abertos",
        label: "Abertos",
        value: abertosAnimado,
        sublabel: "Demandas aguardando atendimento",
        variant: "warning",
        icon: "📂",
      },
      {
        key: "andamento",
        label: "Em andamento",
        value: andamentoAnimado,
        sublabel: "Técnicos trabalhando ativo",
        variant: "primary",
        icon: "🛠️",
      },
      {
        key: "fechados",
        label: "Fechados",
        value: fechadosAnimado,
        sublabel: "Atendimentos concluídos",
        variant: "success",
        icon: "✅",
      },
    ],
    [totalAnimado, abertosAnimado, andamentoAnimado, fechadosAnimado]
  );

  return (
    <div>
      <div className="page-header page-header--centered">
        <h2>Dashboard</h2>
        <p className="page-subtitle">
          Visão geral dos chamados com indicadores importantes e próximos passos.
        </p>
        <div className="page-header-actions">
          <Button variant="ghost" onClick={() => navigate("/abrir-chamado")}>
            Abrir chamado
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/chamados")}
            className="btn-md"
          >
            Gestão completa
          </Button>
        </div>
      </div>

      <section className="dashboard-grid">
        {metricCards.map((card) => (
          <Card key={card.key} className="metric-card">
            <div className="metric-card__header">
              <span className="metric-card__icon">{card.icon}</span>
              <span className="metric-card__label">{card.label}</span>
            </div>
            <strong className="metric-card__value">{card.value}</strong>
            <p className="metric-card__body">{card.sublabel}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
