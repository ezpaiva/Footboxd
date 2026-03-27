export const JogoCard = ({ jogo }: any) => {

  const home = jogo?.homeTeam?.name || jogo?.home_name || "Time A";
  const away = jogo?.awayTeam?.name || jogo?.away_name || "Time B";

  const homeScore = jogo?.homeScore ?? jogo?.home_score ?? "-";
  const awayScore = jogo?.awayScore ?? jogo?.away_score ?? "-";

  return (
    <div className="card mb-3 shadow-sm p-3">

      <div className="d-flex justify-content-between align-items-center">

        {/* Time da casa */}
        <div>
          <strong>{home}</strong>
        </div>

        {/* Placar */}
        <div>
          <span className="fw-bold">
            {homeScore} x {awayScore}
          </span>
        </div>

        {/* Visitante */}
        <div>
          <strong>{away}</strong>
        </div>

      </div>

    </div>
  );
};