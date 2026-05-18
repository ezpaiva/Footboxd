import { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";

import { minhas, excluir } from "../services/avaliacoesService";
import { getUsuarioLogado } from "../services/authService";
import { buscarLineup, buscarFixture } from "../services/apiFootball";

interface AvaliacaoResponse {
  id: number;
  fixtureId: number;
  tipo: "JOGO" | "TECNICO" | "JOGADOR";
  referenciaId: number;
  nota: number;
  criadoEm: string;
}

type FixtureResponse = {
  fixture?: { id: number };
  teams: {
    home: { id?: number; name: string; logo: string };
    away: { id?: number; name: string; logo: string };
  };
};

type LineupResponse = Array<{
  team?: { id?: number; name?: string; logo?: string };
  coach?: { id?: number; name?: string };
  startXI?: Array<{
    player: {
      id: number;
      name: string;
      pos: string;
      number?: number;
    };
  }>;
}>;

interface JogoInfo {
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;

  jogadores: Record<number, { name: string; pos: string; number?: number }>;

  coachCasa: { id: number; name: string };
  coachFora: { id: number; name: string };
}

const jogoCache = new Map<number, JogoInfo>();

async function buscarInfoJogo(fixtureId: number): Promise<JogoInfo | null> {
  if (jogoCache.has(fixtureId)) return jogoCache.get(fixtureId)!;

  try {
    const [fixtureRaw, lineupRaw] = await Promise.all([
      buscarFixture(fixtureId) as Promise<FixtureResponse | null>,
      buscarLineup(fixtureId) as Promise<LineupResponse | null>,
    ]);

    if (!fixtureRaw || !fixtureRaw.teams) return null;
    if (!lineupRaw || lineupRaw.length < 2) return null;

    const home = fixtureRaw.teams.home;
    const away = fixtureRaw.teams.away;

    const jogadores: Record<number, { name: string; pos: string; number?: number }> = {};

    for (const side of lineupRaw) {
      side.startXI?.forEach((p) => {
        const id = p.player.id;
        jogadores[id] = {
          name: p.player.name,
          pos: p.player.pos,
          number: p.player.number,
        };
      });
    }

    const coachCasaId = lineupRaw[0]?.coach?.id ?? 0;
    const coachForaId = lineupRaw[1]?.coach?.id ?? 0;

    const info: JogoInfo = {
      homeTeam: home?.name || "Time Casa",
      homeLogo: home?.logo || "",
      awayTeam: away?.name || "Time Fora",
      awayLogo: away?.logo || "",

      jogadores,

      coachCasa: { id: coachCasaId, name: lineupRaw[0]?.coach?.name || "Técnico" },
      coachFora: { id: coachForaId, name: lineupRaw[1]?.coach?.name || "Técnico" },
    };

    jogoCache.set(fixtureId, info);
    return info;
  } catch (err) {
    console.error("Erro ao buscar info jogo:", err);
    return null;
  }
}

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

function renderReferencia(item: AvaliacaoResponse, jogoInfo: JogoInfo | null) {
  const referencia = formatReferencia(item, jogoInfo);

  return (
    <div className="d-flex align-items-center gap-2">
      {jogoInfo?.homeLogo && jogoInfo?.awayLogo ? (
        <div className="d-flex align-items-center gap-1">
          <img
            src={jogoInfo.homeLogo}
            alt={jogoInfo.homeTeam}
            width={28}
            height={28}
            className="rounded-circle border"
          />
          <img
            src={jogoInfo.awayLogo}
            alt={jogoInfo.awayTeam}
            width={28}
            height={28}
            className="rounded-circle border"
          />
        </div>
      ) : null}
      <span>{referencia}</span>
    </div>
  );
}

export default function Dashboard() {
  const usuario = getUsuarioLogado();

  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [jogoInfoMap, setJogoInfoMap] = useState<Map<number, JogoInfo | null>>(
    () => new Map()
  );

  useEffect(() => {
    const usuarioAtual = getUsuarioLogado();
    if (!usuarioAtual) return;

    (async () => {
      try {
        setCarregando(true);
        setErro(null);

        const data = await minhas();
        setAvaliacoes(data);

        const fixtureIds = [...new Set(data.map((a: AvaliacaoResponse) => a.fixtureId))];

        const entries = await Promise.all(
          fixtureIds.map(async (fid) => [fid, await buscarInfoJogo(fid)] as const)
        );

        setJogoInfoMap(new Map(entries));
      } catch (err) {
        console.error(err);
        setErro("Falha ao carregar suas avaliações.");
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const jogosAvaliados = useMemo(
    () => new Set(avaliacoes.map((item) => item.fixtureId)).size,
    [avaliacoes]
  );

  const melhoresItens = useMemo(
    () => [...avaliacoes].sort((a, b) => b.nota - a.nota).slice(0, 3),
    [avaliacoes]
  );

  const pioresItens = useMemo(
    () => [...avaliacoes].sort((a, b) => a.nota - b.nota).slice(0, 3),
    [avaliacoes]
  );

  const ultimasAvaliacoes = useMemo(
    () =>
      [...avaliacoes]
        .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))
        .slice(0, 10),
    [avaliacoes]
  );

  async function handleExcluir(id: number) {
    try {
      await excluir(id);
      setAvaliacoes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setErro("Não foi possível excluir essa avaliação.");
    }
  }

  if (!usuario) return null;

  return (
    <>
      <Header pageTitle="Histórico de Avaliações" />

      <main className="page">
        <section className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card p-3 text-center">
              <strong>Jogos avaliados</strong>
              <span className="fs-3">{jogosAvaliados}</span>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="card p-3 text-center">
              <strong>Avaliações registradas</strong>
              <span className="fs-3">{avaliacoes.length}</span>
            </div>
          </div>
        </section>

        {erro && <div className="alert alert-danger">{erro}</div>}

        <section className="row mb-4">
          <div className="col-md-6">
            <div className="card p-3 h-100">
              <h5>Melhores avaliações</h5>

              {carregando ? (
                <div>Carregando...</div>
              ) : melhoresItens.length === 0 ? (
                <div className="text-muted small">Nenhuma avaliação disponível.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {melhoresItens.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {renderReferencia(item, jogoInfoMap.get(item.fixtureId) || null)}
                      <strong>{item.nota.toFixed(1)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="card p-3 h-100">
              <h5>Piores avaliações</h5>

              {carregando ? (
                <div>Carregando...</div>
              ) : pioresItens.length === 0 ? (
                <div className="text-muted small">Nenhuma avaliação disponível.</div>
              ) : (
                <ul className="list-group list-group-flush">
                  {pioresItens.map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {renderReferencia(item, jogoInfoMap.get(item.fixtureId) || null)}
                      <strong>{item.nota.toFixed(1)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section className="row">
          <div className="col-12">
            <div className="card p-3">
              <h5>Todas as avaliações</h5>

              {carregando ? (
                <div>Carregando...</div>
              ) : ultimasAvaliacoes.length === 0 ? (
                <div className="text-muted small">Nenhuma avaliação registrada ainda.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm table-borderless align-middle">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Referência</th>
                        <th>Nota</th>
                        <th>Data</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ultimasAvaliacoes.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <span className="badge bg-secondary">
                              {item.tipo === "JOGADOR"
                                ? "JOG"
                                : item.tipo === "TECNICO"
                                ? "TEC"
                                : "JGO"}
                            </span>
                          </td>

                          <td>{renderReferencia(item, jogoInfoMap.get(item.fixtureId) || null)}</td>

                          <td>
                            <strong>{item.nota.toFixed(1)}</strong>
                          </td>

                          <td>{new Date(item.criadoEm).toLocaleString("pt-BR")}</td>

                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleExcluir(item.id)}
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}