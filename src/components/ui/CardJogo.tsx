import { Link } from "react-router-dom";
import type { IJogo } from "../types/IJogo";

export default function CardJogo({ jogo }: { jogo: IJogo }) {
  const status = jogo.fixture.status?.short;
  const isResultado = status === "FT";
  const isAoVivo = status === "LIVE" || status === "1H" || status === "2H";
  const isProximo = !isResultado && !isAoVivo;

  return (
    <Link
      to={`/jogo/${jogo.fixture.id}`}
      state={{ jogo }}
      className="text-decoration-none"
    >
      <div
        className="h-100 text-white p-3"
        style={{
          background: "linear-gradient(180deg, #6a00ff, #3a1c93)",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">

          <div className="d-flex align-items-center gap-2">
            {jogo.teams.home.logo && (
              <img
                src={jogo.teams.home.logo}
                alt={jogo.teams.home.code}
                style={{ width: "48px", height: "48px" }}
              />
            )}
              <strong className="fs-6">
                {(jogo.teams.home.code ??
                  jogo.teams.home.name.slice(0, 3).toUpperCase())}
              </strong>
          </div>

          <span
            className="px-2 py-1 rounded fw-bold"
            style={{
              background: "#1a003d",
              fontSize: "12px",
            }}
          >
            {isResultado || isAoVivo
              ? `${jogo.goals?.home ?? 0} x ${jogo.goals?.away ?? 0}`
              : "VS"}
          </span>

          <div className="d-flex align-items-center gap-2">
            <strong className="fs-6">
              {(jogo.teams.away.code ??
                jogo.teams.away.name.slice(0, 3).toUpperCase())}
            </strong>
            {jogo.teams.away.logo && (
              <img
                src={jogo.teams.away.logo}
                alt={jogo.teams.away.code}
                style={{ width: "48px", height: "48px" }}
              />
            )}
          </div>
        </div>

        <div className="text-center mb-3 opacity-75">
          {isProximo
            ? new Date(jogo.fixture.date).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })
            : new Date(jogo.fixture.date).toLocaleDateString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}
        </div>

        <div className="text-center">
          <span
            className="px-3 py-1 rounded-pill"
            style={{
              background: "#1a003d",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {isResultado
              ? "Resultado"
              : isAoVivo
              ? "Ao Vivo"
              : "Detalhes"}
          </span>
        </div>
      </div>
    </Link>
  );
}