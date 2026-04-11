import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";

import CardJogo from "../components/ui/CardJogo";
import {
  buscarResultados,
  buscarAoVivo,
  buscarProximos,
} from "../services/apiFootball";
import type { IJogo } from "../types/game";

export default function Home() {
  const [resultados, setResultados] = useState<IJogo[]>([]);
  const [aoVivo, setAoVivo] = useState<IJogo[]>([]);
  const [proximos, setProximos] = useState<IJogo[]>([]);

  useEffect(() => {
    buscarResultados().then(setResultados);
    buscarAoVivo().then(setAoVivo);
    buscarProximos().then(setProximos);
  }, []);

  const [abaAtiva, setAbaAtiva] = useState<"resultados" | "aoVivo" | "proximos">(
  "resultados"
);

  return (
    <>
      <Header pageTitle="Início" />

      <main
        className="container-fluid py-5"
        style={{
          backgroundColor: "#1d0b3f",
        }}>
        <div className="d-flex justify-content-center mt-4">
          <div
            className="d-flex align-items-center mb-5"
            style={{
              width: "90%",          
              maxWidth: "999px",
              background: "linear-gradient(180deg, #3a1c93, #160034)",
              border: "1px solid #000e8f",
            }}
          >
            <button
              className="btn flex-fill fw-semibold text-center "
              style={{
                borderRadius: "999px",
                background:
                  abaAtiva === "resultados"
                    ? "linear-gradient(90deg, #6a00ff, #7b2cff)"
                    : "transparent",
                color: abaAtiva === "resultados" ? "#ffffff" : "#b9a6ff",
                padding: "10px 0",
              }}
              onClick={() => setAbaAtiva("resultados")}
            >
              Resultados
            </button>

            <button
              className="btn flex-fill fw-semibold text-center"
              style={{
                borderRadius: "999px",
                background:
                  abaAtiva === "aoVivo"
                    ? "linear-gradient(90deg, #6a00ff, #7b2cff)"
                    : "transparent",
                color: abaAtiva === "aoVivo" ? "#ffffff" : "#b9a6ff",
                padding: "10px 0",
              }}
              onClick={() => setAbaAtiva("aoVivo")}
            >
              Ao Vivo
            </button>

            <button
              className="btn flex-fill fw-semibold text-center"
              style={{
                borderRadius: "999px",
                background:
                  abaAtiva === "proximos"
                    ? "linear-gradient(90deg, #6a00ff, #7b2cff)"
                    : "transparent",
                color: abaAtiva === "proximos" ? "#ffffff" : "#b9a6ff",
                padding: "10px 0",
              }}
              onClick={() => setAbaAtiva("proximos")}
            >
              Próximos Jogos
            </button>
          </div>
        </div>

        <section className="mb-5">

          <div className="row">
            {abaAtiva === "resultados" &&
              resultados.slice(0, 9).map((jogo) => (
                <div key={jogo.fixture.id} className="col-12 col-md-4 mb-3">
                  <CardJogo jogo={jogo} />
                </div>
              ))}

            {abaAtiva === "aoVivo" &&
              aoVivo.length === 0 && (
                <p className="text-center text-light opacity-75">
                  Nenhum jogo ao vivo no momento
                </p>
              )}

            {abaAtiva === "aoVivo" &&
              aoVivo.slice(0, 9).map((jogo) => (
                <div key={jogo.fixture.id} className="col-12 col-md-4 mb-3">
                  <CardJogo jogo={jogo} />
                </div>
              ))}

            {abaAtiva === "proximos" &&
              proximos.slice(0, 9).map((jogo) => (
                <div key={jogo.fixture.id} className="col-12 col-md-4 mb-3">
                  <CardJogo jogo={jogo} />
                </div>
              ))}
          </div>
        </section>

         <div className="text-center mb-5">
          <Link
            to={
              abaAtiva === "resultados"
                ? "/resultados"
                : abaAtiva === "aoVivo"
                ? "/ao-vivo"
                : "/proximos"
            }
            className="btn btn-outline-light px-5">
            Ver Mais
          </Link>
        </div>
      </main>
    </>
  );
}