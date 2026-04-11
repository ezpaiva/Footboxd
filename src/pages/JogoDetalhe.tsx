
import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";

import Header from "../components/layout/Header";
import CampoJogo from "../components/ui/CampoJogo";
import ListaJogadores from "../components/ui/ListaJogadores";

import { buscarLineup } from "../services/apiFootball";
import { getUsuarioLogado } from "../services/authService";

import type { IJogo } from "../types/game";
import type { IJogador } from "../types/player";

export default function JogoDetalhe() {
  const { fixtureId } = useParams<{ fixtureId: string }>();
  const location = useLocation();
  const jogo = location.state?.jogo as IJogo | undefined;

  const [casa, setCasa] = useState<IJogador[]>([]);
  const [fora, setFora] = useState<IJogador[]>([]);
  const [coachCasa, setCoachCasa] = useState("");
  const [coachFora, setCoachFora] = useState("");

  const [avaliacoes, setAvaliacoes] = useState<Record<number, number>>({});

  /* ✅ Hook corretamente no topo */
  useEffect(() => {
    if (!fixtureId) return;

    buscarLineup(Number(fixtureId)).then((data) => {
      if (!data || data.length < 2) return;

      setCasa(data[0].startXI.map((p: any) => p.player));
      setFora(data[1].startXI.map((p: any) => p.player));
      setCoachCasa(data[0].coach?.name || "Treinador");
      setCoachFora(data[1].coach?.name || "Treinador");
    });
  }, [fixtureId]);

  if (!jogo) return null;

  /* ✅ Função simples e correta */
  function salvarNota(jogador: IJogador, nota: number) {
    setAvaliacoes((prev) => ({
      ...prev,
      [jogador.number]: nota,
    }));
  }

  /* ✅ Salvar avaliação com login */
  function salvarAvaliacao() {
    const user = getUsuarioLogado();
    if (!user) {
      alert("Você precisa estar logado para salvar a avaliação.");
      return;
    } 

    if (!jogo) return;

    const avaliacaoFinal = {
      usuario: user.email,
      fixtureId: jogo.fixture.id,
      jogo,
      avaliadoEm: new Date().toISOString(),
      notas: avaliacoes,
    };

    const historico = JSON.parse(
      localStorage.getItem("avaliacoes") || "[]"
    );

    historico.push(avaliacaoFinal);
    localStorage.setItem("avaliacoes", JSON.stringify(historico));

    alert("Avaliação salva com sucesso!");
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
              <span className="placar-nome">
                {jogo.teams.home.name}
              </span>
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
              <span className="placar-nome">
                {jogo.teams.away.name}
              </span>
            </div>
          </div>

          <small className="opacity-75 d-block mt-2">
            {new Date(jogo.fixture.date).toLocaleDateString("pt-BR")}
          </small>
        </div>
      </div>

      {/* CONTEÚDO */}
      <main
        className="container-fluid py-5"
        style={{ backgroundColor: "#1d0b3f" }}
      >
        <CampoJogo
          casa={casa.map((j) => ({ number: j.number }))}
          fora={fora.map((j) => ({ number: j.number }))}
        />

        <ListaJogadores
          teamName={jogo.teams.home.name}
          teamLogo={jogo.teams.home.logo}
          coach={coachCasa}
          jogadores={casa}
          salvarNota={salvarNota}
        />

        <ListaJogadores
          teamName={jogo.teams.away.name}
          teamLogo={jogo.teams.away.logo}
          coach={coachFora}
          jogadores={fora}
          salvarNota={salvarNota}
        />

        <div className="text-center mt-4">
          <button
            className="btn btn-success px-5"
            onClick={salvarAvaliacao}
          >
            ✅ Salvar Avaliação
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