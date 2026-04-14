import type { IJogador } from "../../types/player";

interface Props {
  teamName?: string;
  jogadores: IJogador[];
  align: "left" | "right";
}

export default function Lineup({
  teamName,
  jogadores,
  align,
}: Props) {

  if (!jogadores || jogadores.length === 0) {
    return (
      <div
        className="p-4 text-white"
        style={{
          background: "linear-gradient(180deg, #3a1c93, #25114d)",
          borderRadius: "12px",
        }}
      >
        <h5
          className={`fw-bold mb-2 text-${
            align === "left" ? "start" : "end"
          }`}
        >
          {teamName}
        </h5>

        <p className="opacity-75 mb-0">
          Escalação ainda não disponível.
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-4 text-white"
      style={{
        background: "linear-gradient(180deg, #3a1c93, #25114d)",
        borderRadius: "12px",
      }}
    >
      <h5
        className={`fw-bold mb-3 text-${
          align === "left" ? "start" : "end"
        }`}
      >
        {teamName}
      </h5>

      <ul className="list-unstyled mb-0">
        {jogadores.map((jogador, index) => (
          <li
            key={index}
            className="d-flex justify-content-between align-items-center mb-2"
          >
            {align === "left" ? (
              <>
                <span>
                  {jogador.number} – {jogador.name}
                </span>
                <span className="badge bg-secondary">
                  {jogador.pos}
                </span>
              </>
            ) : (
              <>
                <span className="badge bg-secondary">
                  {jogador.pos}
                </span>
                <span>
                  {jogador.name} – {jogador.number}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
