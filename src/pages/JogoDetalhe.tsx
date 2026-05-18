import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

import Header from "../components/layout/Header";
import CampoJogo from "../components/ui/CampoJogo";
import ListaJogadores from "../components/ui/ListaJogadores";

import { buscarLineup } from "../services/apiFootball";
import { listarPorFixture, salvarEmLote } from "../services/avaliacoesService";
import { getUsuarioLogado } from "../services/authService";

import type { AvaliacaoRequest } from "../services/avaliacoesService";
import type { IJogo } from "../types/game";
import type { IJogador } from "../types/player";

interface NotaJogador {
  nome: string;
  nota: number;
  lado: "home" | "away";
}

export default function JogoDetalhe() {
  const { fixtureId } = useParams<{ fixtureId: string }>();
  const location = useLocation();
  const jogo = location.state?.jogo as IJogo | undefined;

  const [casa, setCasa] = useState<IJogador[]>([]);
  const [fora, setFora] = useState<IJogador[]>([]);
  const [coachCasa, setCoachCasa] = useState("");
  const [coachFora, setCoachFora] = useState("");
  const [avaliacoes, setAvaliacoes] = useState<Record<string, NotaJogador>>({});
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!fixtureId) return;

    async function carregarDados() {
      try {
        const data = await buscarLineup(Number(fixtureId));
        if (!data || data.length < 2) return;

        const casaPlayers = data[0].startXI.map((p) => p.player);
        const foraPlayers = data[1].startXI.map((p) => p.player);
        const coachCasaName = data[0].coach?.name || "Treinador";
        const coachForaName = data[1].coach?.name || "Treinador";

        setCasa(casaPlayers);
        setFora(foraPlayers);
        setCoachCasa(coachCasaName);
        setCoachFora(coachForaName);

        const response = await listarPorFixture(Number(fixtureId));
        const map: Record<string, NotaJogador> = {};

        const playerSide = new Map<number, "home" | "away">();
        casaPlayers.forEach((player) => playerSide.set(player.number, "home"));
        foraPlayers.forEach((player) => playerSide.set(player.number, "away"));

        response.forEach((item) => {
          if (item.tipo === "JOGADOR") {
            const lado = playerSide.get(item.referenciaId) ?? "home";
            const key = `${lado}-${item.referenciaId}`;
            const player = casaPlayers.concat(foraPlayers).find((p) => p.number === item.referenciaId);
            map[key] = {
              nome: player?.name ?? `Jogador #${item.referenciaId}`,
              nota: item.nota,
              lado,
            };
          }

          if (item.tipo === "TECNICO") {
            const key = item.referenciaId === 2 ? "coach-away" : "coach-home";
            map[key] = {
              nome: item.referenciaId === 2 ? coachForaName : coachCasaName,
              nota: item.nota,
              lado: item.referenciaId === 2 ? "away" : "home",
            };
          }
        });

        setAvaliacoes(map);
      } catch (err) {
        console.error(err);
        setErro("Falha ao carregar os dados do jogo ou avaliações existentes.");
      }
    }

    carregarDados();
  }, [fixtureId]);

  if (!jogo) return null;

  function atualizarNota(key: string, nota: number | undefined, nome: string, lado: "home" | "away") {
    setAvaliacoes((prev) => {
      const next = { ...prev };
      if (nota === undefined) {
        delete next[key];
      } else {
        next[key] = { nome, nota, lado };
      }
      return next;
    });
  }

  function salvarNota(jogador: IJogador, nota: number | undefined, lado: "home" | "away") {
    atualizarNota(`${lado}-${jogador.number}`, nota, jogador.name, lado);
  }

  function salvarCoachNota(key: "coach-home" | "coach-away", nota: number | undefined, nome: string, lado: "home" | "away") {
    atualizarNota(key, nota, nome, lado);
  }

  async function salvarAvaliacao() {
    const user = getUsuarioLogado();
    if (!user) {
      alert("Você precisa estar logado para salvar a avaliação.");
      return;
    }

    if (!jogo) return;

    const avaliacoesParaSalvar: AvaliacaoRequest[] = Object.entries(avaliacoes)
      .map(([key, value]) => {
        if (value?.nota === undefined || value?.nota === null || Number.isNaN(value.nota)) {
          return null;
        }

        if (key === "coach-home") {
          return {
            fixtureId: jogo.fixture.id,
            tipo: "TECNICO",
            referenciaId: 1,
            nota: value.nota,
          };
        }

        if (key === "coach-away") {
          return {
            fixtureId: jogo.fixture.id,
            tipo: "TECNICO",
            referenciaId: 2,
            nota: value.nota,
          };
        }

        const parts = key.split("-");
        if (parts.length !== 2) {
          return null;
        }

        const referenciaId = Number(parts[1]);
        if (!Number.isFinite(referenciaId) || referenciaId <= 0) {
          return null;
        }

        return {
          fixtureId: jogo.fixture.id,
          tipo: "JOGADOR",
          referenciaId,
          nota: value.nota,
        };
      })
      .filter((item): item is AvaliacaoRequest => item !== null);

    if (avaliacoesParaSalvar.length === 0) {
      alert("Adicione pelo menos uma nota válida antes de salvar.");
      return;
    }

    try {
      setSalvando(true);
      await salvarEmLote(avaliacoesParaSalvar);
      alert("Avaliações salvas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar as avaliações. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <Header pageTitle="Detalhes do Jogo" />

      {/* PLACAR */}
      <div
        className="placar-wrapper text-white py-3"
        style={{
          background: "linear-gradient(180deg, #3a1c93, #160034)",
        }}
      >
        <div className="container text-center">
          <div className="placar-unificado">
            <div className="placar-time">
              <img
                src={jogo.teams.home.logo}
                alt={jogo.teams.home.name}
                className="placar-escudo"
              />
              <span className="placar-nome">{jogo.teams.home.name}</span>
            </div>

            <div className="placar-centro">
              <strong>{jogo.goals.home}</strong>
              <img
                src="/favicon.png"
                alt="Placar"
                className="placar-trofeu"
              />
              <strong>{jogo.goals.away}</strong>
            </div>

            <div className="placar-time">
              <img
                src={jogo.teams.away.logo}
                alt={jogo.teams.away.name}
                className="placar-escudo"
              />
              <span className="placar-nome">{jogo.teams.away.name}</span>
            </div>
          </div>

          <small className="opacity-75 d-block mt-2">
            {new Date(jogo.fixture.date).toLocaleDateString("pt-BR")}
          </small>
        </div>
      </div>

      {/* CONTEÚDO */}
      <main className="container-fluid py-5" style={{ backgroundColor: "#1d0b3f" }}>
        <CampoJogo
          casa={casa.map((j) => ({ number: j.number }))}
          fora={fora.map((j) => ({ number: j.number }))}
        />

        <ListaJogadores
          teamName={jogo.teams.home.name}
          teamLogo={jogo.teams.home.logo}
          coach={coachCasa}
          jogadores={casa}
          notas={Object.fromEntries(
            Object.entries(avaliacoes)
              .filter(([key, value]) => value.lado === "home" && key !== "coach-home")
              .map(([key, value]) => [Number(key.split("-")[1]), value.nota])
          )}
          coachNota={avaliacoes["coach-home"]?.nota}
          onNotaChange={(jogador, nota) => salvarNota(jogador, nota, "home")}
          onCoachNotaChange={(nota) => salvarCoachNota("coach-home", nota, coachCasa, "home")}
        />

        <ListaJogadores
          teamName={jogo.teams.away.name}
          teamLogo={jogo.teams.away.logo}
          coach={coachFora}
          jogadores={fora}
          notas={Object.fromEntries(
            Object.entries(avaliacoes)
              .filter(([key, value]) => value.lado === "away" && key !== "coach-away")
              .map(([key, value]) => [Number(key.split("-")[1]), value.nota])
          )}
          coachNota={avaliacoes["coach-away"]?.nota}
          onNotaChange={(jogador, nota) => salvarNota(jogador, nota, "away")}
          onCoachNotaChange={(nota) => salvarCoachNota("coach-away", nota, coachFora, "away")}
        />

        {erro && (
          <div className="alert alert-danger text-center mt-3">{erro}</div>
        )}

        <div className="text-center mt-4">
          <button
            className="btn btn-success px-5"
            onClick={salvarAvaliacao}
            disabled={salvando}
          >
            {salvando ? "Salvando..." : "Salvar Avaliação"}
          </button>
        </div>

        <div className="text-center mt-5">
          <Link to="/" className="btn btn-outline-light px-5">
            ← Voltar
          </Link>
        </div>
      </main>
    </>
  );
}
