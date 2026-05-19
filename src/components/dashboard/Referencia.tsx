import type { JogoInfo } from "../../utils/jogoInfo";

export type AvaliacaoResponse = {
  id: number;
  fixtureId: number;
  tipo: "JOGO" | "TECNICO" | "JOGADOR";
  referenciaId: number;
  nota: number;
  criadoEm: string;
};

function formatReferencia(item: AvaliacaoResponse, jogoInfo: JogoInfo | null) {
  if (item.tipo === "JOGADOR") {
    const jogador = jogoInfo?.jogadores[item.referenciaId];
    if (jogador) {
      const camisa = jogador.number != null ? ` (#${jogador.number})` : "";
      return `${jogador.name}${camisa}`;
    }
    return `Jogador ID ${item.referenciaId}`;
  }

  if (item.tipo === "TECNICO") {
    if (!jogoInfo) return `Técnico ID ${item.referenciaId}`;
    if (item.referenciaId === jogoInfo.coachCasa.id) return jogoInfo.coachCasa.name;
    if (item.referenciaId === jogoInfo.coachFora.id) return jogoInfo.coachFora.name;
    return `Técnico ID ${item.referenciaId}`;
  }

  if (jogoInfo) return `${jogoInfo.homeTeam} x ${jogoInfo.awayTeam}`;
  return "Avaliação do jogo";
}

export default function Referencia({
  item,
  jogoInfo,
}: {
  item: AvaliacaoResponse;
  jogoInfo: JogoInfo | null;
}) {
  const texto = formatReferencia(item, jogoInfo);

  return (
    <div className="d-flex align-items-center gap-2">
      {jogoInfo?.homeLogo && jogoInfo?.awayLogo ? (
        <div className="d-flex align-items-center gap-1">
          <img
            src={jogoInfo.homeLogo}
            alt={jogoInfo.homeTeam}
            width={24}
            height={24}
            className="rounded-circle border"
          />
          <img
            src={jogoInfo.awayLogo}
            alt={jogoInfo.awayTeam}
            width={24}
            height={24}
            className="rounded-circle border"
          />
        </div>
      ) : null}

      <span className="text-truncate">{texto}</span>
    </div>
  );
}