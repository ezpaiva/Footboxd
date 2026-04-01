import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Lineup from "../components/Lineup";
import { buscarLineup } from "../services/apiFootball";
import type { IJogo } from "../types/IJogo";
import type { IJogador } from "../types/IJogador";
import CampoHome from "../components/CampoHome";
import CampoAway from "../components/CampoAway";

export default function JogoDetalhe() {
  const { fixtureId } = useParams<{ fixtureId: string }>();
  const location = useLocation();
  const jogo = location.state?.jogo as IJogo | undefined;
  const [jogadoresCasa, setJogadoresCasa] = useState<IJogador[]>([]);
  const [jogadoresFora, setJogadoresFora] = useState<IJogador[]>([]);
  const [coachCasa, setCoachCasa] = useState<string>("");
  const [coachFora, setCoachFora] = useState<string>("");

  useEffect(() => {
    if (!fixtureId) return;

    buscarLineup(Number(fixtureId)).then((data) => {
      if (!data || data.length < 2) return;

      const casa = data[0];
      const fora = data[1];

      setJogadoresCasa(casa.startXI.map((p: any) => p.player));
      setJogadoresFora(fora.startXI.map((p: any) => p.player));
      setCoachCasa(casa.coach?.name || "Treinador não informado");
      setCoachFora(fora.coach?.name || "Treinador não informado");
    });
  }, [fixtureId]);

  return (
    <>
      <Header pageTitle="Detalhes do Jogo" />

      <div
        className="text-white py-4"
        style={{
          background: "linear-gradient(180deg, #3a1c93, #160034)",
          borderBottom: "2px solid #5a2eff",
        }}
      >
        <div className="container text-center">

          <div className="d-flex justify-content-center align-items-center gap-4">

            <div className="d-flex align-items-center gap-2">
              {jogo?.teams.home.logo && (
                <img
                  src={jogo.teams.home.logo}
                  alt={jogo.teams.home.name}
                  style={{ width: "48px", height: "48px" }}
                />
              )}
              <h4 className="fw-bold m-0">
                {jogo?.teams.home.name}
              </h4>
            </div>

            <div
              className="px-4 py-2 rounded d-flex align-items-center gap-2"
              style={{ background: "#1a003d" }}
            >
              <strong>{jogo?.goals.home}</strong>

              <img
                src="/favicon.png"
                alt="Troféu"
                style={{ width: "28px", height: "28px" }}
              />

              <strong>{jogo?.goals.away}</strong>
            </div>

            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold m-0">
                {jogo?.teams.away.name}
              </h4>
              {jogo?.teams.away.logo && (
                <img
                  src={jogo.teams.away.logo}
                  alt={jogo.teams.away.name}
                  style={{ width: "48px", height: "48px" }}
                />
              )}
            </div>

          </div>

          {jogo?.fixture.date && (
            <p className="mt-2 opacity-75">
              {new Date(jogo.fixture.date).toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>
      </div>

      <main
        className="container-fluid py-5"
        style={{
          backgroundColor: "#1d0b3f",
        }}>
        <div className="container">
          <div className="row g-4">

            <div className="col-md-6">
              <Lineup
                teamName={jogo?.teams.home.name}
                jogadores={jogadoresCasa}
                align="left"
              />
            </div>

            <div className="col-md-6">
              <Lineup
                teamName={jogo?.teams.away.name}
                jogadores={jogadoresFora}
                align="right"
              />
            </div>
          </div>
    
        <CampoHome
          teamName={jogo?.teams.home.name ?? ""}
          coach={coachCasa}
          jogadores={jogadoresCasa}
        />
          <CampoAway
            teamName={jogo?.teams.away.name ?? ""}
            coach={coachFora}
            jogadores={jogadoresFora}
          />
          
          <div className="text-center mt-5">
            <Link to="/" className="btn btn-outline-light px-5">
              ← Voltar
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}