import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import Header from "../components/Header";
import CampoJogo from "../components/CampoJogo";
import { buscarLineup } from "../services/apiFootball";
import type { IJogo } from "../types/IJogo";
import type { IJogador } from "../types/IJogador";
import ListaJogadores from "../components/ListaJogadores";

export default function JogoDetalhe() {
  const { fixtureId } = useParams<{ fixtureId: string }>();
  const location = useLocation();
  const jogo = location.state?.jogo as IJogo | undefined;

  const [casa, setCasa] = useState<IJogador[]>([]);
  const [fora, setFora] = useState<IJogador[]>([]);
  const [coachCasa, setCoachCasa] = useState("");
  const [coachFora, setCoachFora] = useState("");

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

  return (
    <>
      <Header pageTitle="Detalhes do Jogo" />

<div
  className="placar-wrapper text-white py-3"
  style={{
    background: "linear-gradient(180deg, #3a1c93, #160034)",
  }}
>
  <div className="container text-center">
    <div className="placar-unificado">

      {/* TIME CASA */}
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

      {/* PLACAR */}
      <div className="placar-centro">
        <strong>{jogo.goals.home}</strong>
        <img
          src="/favicon.png"
          alt="Placar"
          className="placar-trofeu"
        />
        <strong>{jogo.goals.away}</strong>
      </div>

      {/* TIME FORA */}
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

      <main
        className="container-fluid py-5"
        style={{
          backgroundColor: "#1d0b3f",
        }}>

      {/* CAMPO */}
      <CampoJogo
        casa={casa.map((j) => ({ number: j.number }))}
        fora={fora.map((j) => ({ number: j.number }))}
      />

<ListaJogadores
  teamName={jogo.teams.home.name}
  teamLogo={jogo.teams.home.logo}
  coach={coachCasa}
  jogadores={casa}
/>

<ListaJogadores
  teamName={jogo.teams.away.name}
  teamLogo={jogo.teams.away.logo}
  coach={coachFora}
  jogadores={fora}
/>
    </main>
    </>
  );
}

function Lista({
  team,
  coach,
  jogadores,
}: {
  team: string;
  coach: string;
  jogadores: IJogador[];
}) {
  return (
    <div className="lista-time">
      <h4>{team}</h4>

      <div className="linha-nota">
        <span>Treinador</span>
        <strong>{coach}</strong>
        <input type="number" placeholder="0–10" />
      </div>

      {jogadores.map((j) => (
        <div key={j.number} className="linha-nota">
          <span>{j.number}</span>
          <strong>{j.name}</strong>
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
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