import type { JogoInfo } from "../../utils/jogoInfo";
import Referencia, { type AvaliacaoResponse } from "./Referencia";
import LoadingState from "../ui/states/LoadingState";
import EmptyState from "../ui/states/EmptyState";

function tipoBadge(tipo: AvaliacaoResponse["tipo"]) {
  if (tipo === "JOGADOR") return "JOG";
  if (tipo === "TECNICO") return "TEC";
  return "JGO";
}

export default function AvaliacaoTableCard({
  carregando,
  itens,
  jogoInfoMap,
  onExcluir,
}: {
  carregando: boolean;
  itens: AvaliacaoResponse[];
  jogoInfoMap: Map<number, JogoInfo | null>;
  onExcluir: (id: number) => void;
}) {
  return (
    <div className="footboxd-card p-3">
      <h5 className="mb-3">Todas as avaliações</h5>

      {carregando ? (
        <LoadingState message="Carregando avaliações..." />
      ) : itens.length === 0 ? (
        <EmptyState
          title="Nenhuma avaliação encontrada"
          message="A lista está vazia no momento. Avalie algum jogo para aparecer aqui."
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-sm table-borderless align-middle footboxd-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Referência</th>
                <th>Nota</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {itens.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="badge badge-footboxd">{tipoBadge(item.tipo)}</span>
                  </td>

                  <td>
                    <Referencia item={item} jogoInfo={jogoInfoMap.get(item.fixtureId) || null} />
                  </td>

                  <td>
                    <strong>{item.nota.toFixed(1)}</strong>
                  </td>

                  <td>{new Date(item.criadoEm).toLocaleString("pt-BR")}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={() => onExcluir(item.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}