import type { JogoInfo } from "../../utils/jogoInfo";
import Referencia, { type AvaliacaoResponse } from "./Referencia";

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
        <div className="footboxd-muted">Carregando...</div>
      ) : itens.length === 0 ? (
        <div className="footboxd-muted small">Nenhuma avaliação disponível.</div>
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