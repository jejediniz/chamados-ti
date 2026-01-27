import { useChamados } from "../contextos/chamadosContext";

const STATUS_LABEL = {
  ABERTO: "Aberto",
  EM_ANDAMENTO: "Em andamento",
  AGUARDANDO_USUARIO: "Aguardando usuário",
  RESOLVIDO: "Resolvido",
};

export default function ChamadosCliente() {
  const { chamados, carregando } = useChamados();

  if (carregando) {
    return <p>Carregando chamados...</p>;
  }

  return (
    <>
      <div className="page-header">
        <h2>Meus chamados</h2>
        <p className="page-subtitle">
          Acompanhe o andamento dos seus atendimentos
        </p>
      </div>

      <div className="cliente-chamados">
        {chamados.length === 0 && (
          <p className="empty">Nenhum chamado registrado.</p>
        )}

        {chamados.map((c) => (
          <div key={c.id} className="cliente-card">
            <div className="cliente-topo">
              <span className={`status status-${c.status.toLowerCase()}`}>
                {STATUS_LABEL[c.status]}
              </span>
              <span className="data">{c.data}</span>
            </div>

            <h4 className="demanda">{c.demanda}</h4>

            {c.obs && (
              <p className="obs">
                <strong>Observação:</strong> {c.obs}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
