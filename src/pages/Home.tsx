import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";

import CardJogo from "../components/ui/CardJogo";
import LoadingState from "../components/ui/states/LoadingState";
import ErrorState from "../components/ui/states/ErrorState";
import EmptyState from "../components/ui/states/EmptyState";
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
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      setCarregando(true);
      setErro(null);

      try {
        const [resultadosData, aoVivoData, proximosData] = await Promise.all([
          buscarResultados(),
          buscarAoVivo(),
          buscarProximos(),
        ]);

        setResultados(resultadosData);
        setAoVivo(aoVivoData);
        setProximos(proximosData);
      } catch (error) {
        console.error("Home data error:", error);
        setErro("Não foi possível carregar os dados iniciais.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  const [abaAtiva, setAbaAtiva] = useState<"resultados" | "aoVivo" | "proximos">(
    "resultados"
  );

  return (
    <>
      <Header pageTitle="Início" />

      <main className="container-fluid py-5">
        <div className="d-flex justify-content-center mt-4" style={{ padding: "0 1rem" }}>
          <div
            className="d-flex align-items-center mb-5 tabs-container"
            style={{
              background: "linear-gradient(180deg, #3a1c93, #160034)",
              border: "1px solid #000e8f",
              borderRadius: "999px",
              padding: "8px",
              gap: "8px",
              maxWidth: "100%",
            }}
          >
            <button
              className="btn flex-fill fw-semibold text-center tab-btn"
              style={{
                borderRadius: "999px",
                background:
                  abaAtiva === "resultados"
                    ? "linear-gradient(90deg, #6a00ff, #7b2cff)"
                    : "transparent",
                color: abaAtiva === "resultados" ? "#ffffff" : "#b9a6ff",
                padding: "12px 20px",
                minWidth: "120px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onClick={() => setAbaAtiva("resultados")}
            >
              Resultados
            </button>

            <button
              className="btn flex-fill fw-semibold text-center tab-btn"
              style={{
                borderRadius: "999px",
                background:
                  abaAtiva === "aoVivo"
                    ? "linear-gradient(90deg, #6a00ff, #7b2cff)"
                    : "transparent",
                color: abaAtiva === "aoVivo" ? "#ffffff" : "#b9a6ff",
                padding: "12px 20px",
                minWidth: "120px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onClick={() => setAbaAtiva("aoVivo")}
            >
              Ao Vivo
            </button>

            <button
              className="btn flex-fill fw-semibold text-center tab-btn"
              style={{
                borderRadius: "999px",
                background:
                  abaAtiva === "proximos"
                    ? "linear-gradient(90deg, #6a00ff, #7b2cff)"
                    : "transparent",
                color: abaAtiva === "proximos" ? "#ffffff" : "#b9a6ff",
                padding: "12px 20px",
                minWidth: "120px",
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
              }}
              onClick={() => setAbaAtiva("proximos")}
            >
              Próximos Jogos
            </button>
          </div>
        </div>

        <section className="mb-5">
          {carregando ? (
            <LoadingState message="Carregando as seções iniciais" />
          ) : erro ? (
            <ErrorState
              message={erro}
              onRetry={() => {
                setErro(null);
                setCarregando(true);
                Promise.all([buscarResultados(), buscarAoVivo(), buscarProximos()])
                  .then(([resultadosData, aoVivoData, proximosData]) => {
                    setResultados(resultadosData);
                    setAoVivo(aoVivoData);
                    setProximos(proximosData);
                  })
                  .catch((error) => {
                    console.error("Home retry error:", error);
                    setErro("Não foi possível carregar os dados iniciais.");
                  })
                  .finally(() => setCarregando(false));
              }}
            />
          ) : (
            <div className="row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              {abaAtiva === "resultados" &&
                (resultados.length === 0 ? (
                  <EmptyState
                    title="Nenhum resultado encontrado"
                    message="Não há resultados para exibir no momento."
                  />
                ) : (
                  resultados.slice(0, 9).map((jogo) => (
                    <div key={jogo.fixture.id}>
                      <CardJogo jogo={jogo} />
                    </div>
                  ))
                ))}

              {abaAtiva === "aoVivo" &&
                (aoVivo.length === 0 ? (
                  <EmptyState
                    title="Nenhum jogo ao vivo"
                    message="Nenhuma partida ao vivo encontrada no momento."
                  />
                ) : (
                  aoVivo.slice(0, 9).map((jogo) => (
                    <div key={jogo.fixture.id}>
                      <CardJogo jogo={jogo} />
                    </div>
                  ))
                ))}

              {abaAtiva === "proximos" &&
                (proximos.length === 0 ? (
                  <EmptyState
                    title="Sem jogos futuros"
                    message="Ainda não há próximos jogos para exibir."
                  />
                ) : (
                  proximos.slice(0, 9).map((jogo) => (
                    <div key={jogo.fixture.id}>
                      <CardJogo jogo={jogo} />
                    </div>
                  ))
                ))}
            </div>
          )}
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