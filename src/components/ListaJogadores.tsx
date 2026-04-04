interface Jogador {
  number: number;
  name: string;
  pos?: string; // GK, DF, MF, FW
}

interface Props {
  teamName: string;
  teamLogo?: string;
  coach: string;
  jogadores: Jogador[];
}

export default function ListaJogadores({
  teamName,
  teamLogo,
  coach,
  jogadores,
}: Props) {
  return (
    <div className="lista-time-box">
                
            {/* Cabeçalho do time */}
        <div className="lista-time-header">
        {teamLogo && (
            <img src={teamLogo} alt={teamName} />
        )}
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
            />
        </div>

      {/* Jogadores */}
      {jogadores.map((j) => (
        <div key={j.number} className="linha-jogador">
          <span className="bolha-numero">{j.number}</span>

          <span className="nome">{j.name}</span>

          <span className="posicao">
            {j.pos || "MF"}
          </span>

          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            placeholder="0–10"
            onBlur={(e) => {
              let v = parseFloat(e.target.value);
              if (isNaN(v)) e.target.value = "";
              else e.target.value = Math.min(10, Math.max(0, v)).toFixed(1);
            }}
          />
        </div>
      ))}
    </div>
  );
}