import type { IJogador } from "../../types/player";

interface Props {
  teamName: string;
  teamLogo?: string;
  coach: string;
  jogadores: IJogador[];
  notas?: Record<number, number>;
  coachNota?: number;
  onNotaChange?: (jogador: IJogador, nota: number | undefined) => void;
  onCoachNotaChange?: (nota: number | undefined) => void;
}

export default function ListaJogadores({
  teamName,
  teamLogo,
  coach,
  jogadores,
  notas,
  coachNota,
  onNotaChange,
  onCoachNotaChange,
}: Props) {
  return (
    <div className="lista-time-box">
      
      {/* Cabeçalho do time */}
      <div className="lista-time-header">
        {teamLogo && <img src={teamLogo} alt={teamName} />}
        <strong>{teamName}</strong>
      </div>

      {/* Técnico */}
      <div className="linha-jogador tecnico">
        <span className="bolha-numero">T</span>
        <span className="nome">{coach}</span>
        <span className="posicao">TC</span>
        <input
          type="number"
          min={0}
          max={10}
          step={0.1}
          placeholder="0–10"
          value={coachNota ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            if (!onCoachNotaChange) return;
            if (value === "") {
              onCoachNotaChange(undefined);
              return;
            }
            const parsed = Number(value);
            if (!Number.isNaN(parsed)) {
              onCoachNotaChange(Math.min(10, Math.max(0, parsed)));
            }
          }}
        />
      </div>

      {/* Jogadores */}
      {jogadores.map((j) => (
        <div key={j.number} className="linha-jogador">
          <span className="bolha-numero">{j.number}</span>
          <span className="nome">{j.name}</span>
          <span className="posicao">{j.pos || "MF"}</span>

          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            placeholder="0–10"
            value={notas?.[j.number] ?? ""}
            onChange={(e) => {
              if (!onNotaChange) return;
              const value = e.target.value;
              if (value === "") {
                onNotaChange(j, undefined);
                return;
              }
              const parsed = Number(value);
              if (!Number.isNaN(parsed)) {
                onNotaChange(j, Math.min(10, Math.max(0, parsed)));
              }
            }}
            onBlur={(e) => {
              const parsed = Number(e.target.value);
              if (!Number.isNaN(parsed)) {
                e.target.value = parsed.toFixed(1);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}