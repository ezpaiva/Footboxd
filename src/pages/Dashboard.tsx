import Header from "../components/layout/Header";
import { getUsuarioLogado } from "../services/authService";
import CardJogadorAvaliado from "../components/ui/CardJogadorAvaliado";
import CardJogo from "../components/ui/CardJogo";
import type { IJogo } from "../types/game";
import CardJogadorNoJogo from "../components/ui/CardJogadorNoJogo";
interface NotaJogador {
  nome: string;
  nota: number;
  lado: "home" | "away";
}

interface Avaliacao {
  usuario: string;
  fixtureId: number;
  jogo: IJogo;
  avaliadoEm: string;
  notas: Record<number, NotaJogador>;
}

interface JogadorAvaliado {
  numero: number;
  nome: string;
  nota: number;
  lado: "home" | "away";
  jogo: IJogo;
}

export default function Dashboard() {
  const usuario = getUsuarioLogado();

  if (!usuario) {
    return null;
  }

  const todasAvaliacoes: Avaliacao[] = JSON.parse(
    localStorage.getItem("avaliacoes") || "[]"
  );

  const avaliacoesUsuario = todasAvaliacoes.filter(
    (a) => a.usuario === usuario.email
  );

  const jogosAvaliados = avaliacoesUsuario.length;

  const jogadoresAvaliados = avaliacoesUsuario.reduce(
    (total, a) => total + Object.keys(a.notas).length,
    0
  );

  const listaJogadores: JogadorAvaliado[] = avaliacoesUsuario.flatMap(
    (a) =>
      Object.entries(a.notas).map(([numero, info]) => ({
        numero: Number(numero),
        nome: info.nome,
        nota: info.nota,
        lado: info.lado,
        jogo: a.jogo,
      }))
  );

  const melhoresJogadores = [...listaJogadores]
    .sort((a, b) => b.nota - a.nota)
    .slice(0, 3);

  const pioresJogadores = [...listaJogadores]
    .sort((a, b) => a.nota - b.nota)
    .slice(0, 3);

  const ultimosJogos = [...avaliacoesUsuario]
    .sort(
      (a, b) =>
        new Date(b.avaliadoEm).getTime() -
        new Date(a.avaliadoEm).getTime()
    )
    .slice(0, 3);

  return (
    <>
      <Header pageTitle=" Histórico de Avaliações" />

      <main className="page">
        <section className="row mb-4">
          <div className="col-md-6">
            <div className="card p-3 text-center">
              <strong>Jogos avaliados</strong>
              <span className="fs-3">{jogosAvaliados}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-3 text-center">
              <strong>Jogadores avaliados</strong>
              <span className="fs-3">{jogadoresAvaliados}</span>
            </div>
          </div>
        </section>

        <section className="row">
          <div className="col-md-4">
            <div className="card p-3 h-100">
              <h5>Melhores jogadores</h5>

              {melhoresJogadores.length === 0 ? (
                <div className="text-muted small">
                  Nenhum jogador em destaque.
                </div>
              ) : (
                melhoresJogadores.map((j) => (
                <CardJogadorNoJogo
                  key={`${j.jogo.fixture.id}-${j.numero}`}
                  jogo={j.jogo}
                  nomeJogador={j.nome}
                  numero={j.numero}
                  nota={j.nota}
                  lado={j.lado}
                />
                ))
              )}
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 h-100">
              <h5>Piores jogadores</h5>

              {pioresJogadores.length === 0 ? (
                <div className="text-muted small">
                  Nenhum jogador em destaque.
                </div>
              ) : (
                pioresJogadores.map((j) => (
                  <CardJogadorNoJogo
                    key={`${j.jogo.fixture.id}-${j.numero}`}
                    jogo={j.jogo}
                    nomeJogador={j.nome}
                    numero={j.numero}
                    nota={j.nota}
                    lado={j.lado}
                  />
                ))
              )}
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 h-100">
              <h5>Últimos jogos avaliados</h5>

              {ultimosJogos.length === 0 ? (
                <div className="text-muted small">
                  Nenhum jogo avaliado.
                </div>
              ) : (
                ultimosJogos.map((a) => (
                  <CardJogo
                    key={a.fixtureId}
                    jogo={a.jogo}
                  />
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}