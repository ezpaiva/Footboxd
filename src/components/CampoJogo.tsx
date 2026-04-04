interface Jogador {
  number: number;
}

interface Props {
  casa: Jogador[];
  fora: Jogador[];
}

export default function CampoJogo({ casa, fora }: Props) {
  return (
    <div className="campo-wrapper">
      <div className="campo">

        {/* TIME DA CASA (ataca para cima) */}
        <Linha y="42%" jogadores={casa.slice(8, 11)} />
        <Linha y="29%" jogadores={casa.slice(5, 8)} />
        <Linha y="16%" jogadores={casa.slice(1, 5)} />
        <Linha y="5%"jogadores={casa.slice(0, 1)} />

        {/* CÍRCULO CENTRAL */}
        <div className="circulo-central" />

        {/* TIME VISITANTE (ataca para baixo) */}
        <Linha y="55%" jogadores={fora.slice(8, 11)} invert />
        <Linha y="69%" jogadores={fora.slice(5, 8)} invert />
        <Linha y="82%" jogadores={fora.slice(1, 5)} invert />
        <Linha y="93%" jogadores={fora.slice(0, 1)} invert />

      </div>
    </div>
  );
}

function Linha({
  jogadores,
  y,
  invert = false,
}: {
  jogadores: Jogador[];
  y: string;
  invert?: boolean;
}) {
  return (
    <div
      className="linha-campo"
      style={{
        top: y,
        flexDirection: invert ? "row-reverse" : "row",
      }}
    >
      {jogadores.map((j) => (
        <div key={j.number} className="bolha-jogador">
          {j.number}
        </div>
      ))}
    </div>
  );
}