import { useAuth } from "../contextos/authContext";
import { useChamados } from "../contextos/chamadosContext";

const STATUS_LABEL = {
  aberto: "Aberto",
  em_andamento: "Em andamento",
  fechado: "Fechado",
};

export default function ChamadosCliente() {
  const { usuario } = useAuth();
  const { chamados, carregando } = useChamados();

  if (carregando) {
    return <p>Carregando chamados...</p>;
  }

  const meusChamados = usuario?.id
    ? chamados.filter((c) => c.usuario_id === usuario.id)
    : [];

  return (
    <>
      <div className="page-header">
        <h2>Meus chamados</h2>
        <p className="page-subtitle">
          Acompanhe o andamento dos seus atendimentos
        </p>
      </div>

      <div className="cliente-chamados">
        {meusChamados.length === 0 && (
          <p className="empty">Nenhum chamado registrado.</p>
        )}

        {meusChamados.map((c) => (
          <div key={c.id} className="cliente-card">
            <div className="cliente-topo">
              <span className={`status status-${c.status}`}>
                {STATUS_LABEL[c.status] || c.status}
              </span>
              {c.created_at && (
                <span className="data">
                  {new Date(c.created_at).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>

            <h4 className="demanda">{c.titulo}</h4>

            {c.descricao && (
              <p className="obs">
                <strong>Descrição:</strong> {c.descricao}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
