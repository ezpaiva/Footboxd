import type { JogoInfo } from "../../utils/jogoInfo";
import Referencia, { type AvaliacaoResponse } from "./Referencia";
import LoadingState from "../ui/states/LoadingState";
import EmptyState from "../ui/states/EmptyState";

export default function AvaliacaoListCard({
  titulo,
  carregando,
  itens,
  jogoInfoMap,
}: {
  titulo: string;
  carregando: boolean;
  itens: AvaliacaoResponse[];
  jogoInfoMap: Map<number, JogoInfo | null>;
}) {
  return (
    <div className="footboxd-card p-3 h-100">
      <h5 className="mb-3">{titulo}</h5>

      {carregando ? (
        <LoadingState message="Buscando avaliações..." />
      ) : itens.length === 0 ? (
        <EmptyState
          title="Sem avaliações aqui"
          message="Volte após adicionar suas primeiras avaliações para aparecer nesta lista."
        />
      ) : (
        <ul className="list-group list-group-flush">
          {itens.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center bg-transparent border-0 px-0"
            >
              <Referencia item={item} jogoInfo={jogoInfoMap.get(item.fixtureId) || null} />
              <strong>{item.nota.toFixed(1)}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}