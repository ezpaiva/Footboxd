import type { IJogo } from "../../types/game";

interface Props {
  jogo: IJogo;
  nomeJogador: string;
  numero: number;
  nota: number;
  lado: "home" | "away";
}

export default function CardJogadorNoJogo({
  jogo,
  nomeJogador,
  numero,
  nota,
  lado,
}: Props) {
  const time =
    lado === "home" ? jogo.teams.home : jogo.teams.away;

  return (
    <div className="card card-jogo">
      {/* Card do jogo (igual Resultados) */}
      <div className="card-jogo-header">
        <img src={jogo.teams.home.logo} alt={jogo.teams.home.name} />
        <span className="vs">vs</span>
        <img src={jogo.teams.away.logo} alt={jogo.teams.away.name} />
      </div>

      <div className="card-jogo-info">
        <small>
          {new Date(jogo.fixture.date).toLocaleDateString("pt-BR")} •{" "}
          {new Date(jogo.fixture.date).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </small>
      </div>

      {/* Jogador avaliado */}
      <div className="card-jogador-avaliado">
        <img src={time.logo} alt={time.name} />

        <div className="info">
          <strong>{nomeJogador}</strong>
          <span>
            #{numero} — {time.name}
          </span>
        </div>

        <span className="nota">Nota {nota.toFixed(1)}</span>
      </div>
    </div>
  );
}
``