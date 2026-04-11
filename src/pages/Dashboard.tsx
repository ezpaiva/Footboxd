import type { IJogo } from "../types/game";
import type { IJogador } from "../types/player";

interface AvaliacaoJogador {
  jogador: IJogador;
  nota: number;
}

interface JogoAvaliado {
  jogo: |IJogo;
  avaliado: boolean;
  jogadores: AvaliacaoJogador[];
}

interface DashboardProps {
  avaliacoes: JogoAvaliado[];
}

function Dashboard({ avaliacoes }: DashboardProps) {
  const jogosAvaliados = avaliacoes.length;

  const jogadoresAvaliados = avaliacoes.flatMap(a => a.jogadores);

  const melhores = [...jogadoresAvaliados]
    .sort((a, b) => b.nota - a.nota)
    .slice(0, 3);

  const piores = [...jogadoresAvaliados]
    .sort((a, b) => a.nota - b.nota)
    .slice(0, 3);

  const ultimosJogos = [...avaliacoes]
    .slice(-3)
    .reverse();

  return (
    <main className="container mt-4">
      <section className="row mb-3">
        <div className="col">
          <h5>Jogos avaliados: {jogosAvaliados}</h5>
          <h5>Jogadores avaliados: {jogadoresAvaliados.length}</h5>
        </div>
      </section>

      <section className="row">
        <div className="col-md-4">
          <h6>⭐ Melhores jogadores</h6>
          <ul>
            {melhores.map((m, i) => (
              <li key={i}>{m.jogador.name} – {m.nota}</li>
            ))}
          </ul>
        </div>

        <div className="col-md-4">
          <h6>⚠️ Piores jogadores</h6>
          <ul>
            {piores.map((p, i) => (
              <li key={i}>{p.jogador.name} – {p.nota}</li>
            ))}
          </ul>
        </div>

        <div className="col-md-4">
          <h6>🕒 Últimos jogos avaliados</h6>
          <ul>
            {ultimosJogos.map((j, i) => (
              <li key={i}>
                {j.jogo.teams.home.name} x {j.jogo.teams.away.name}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
``