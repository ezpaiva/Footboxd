import { useEffect, useState } from "react";
import CardJogo from "../components/ui/CardJogo";
import Header from "../components/layout/Header";
import LoadingState from "../components/ui/states/LoadingState";
import ErrorState from "../components/ui/states/ErrorState";
import EmptyState from "../components/ui/states/EmptyState";
import { buscarResultados } from "../services/apiFootball";
import type { IJogo } from "../types/game";

export default function Resultados() {
  const [resultados, setResultados] = useState<IJogo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarResultados() {
      setCarregando(true);
      setErro(null);

      try {
        const data = await buscarResultados();
        setResultados(data);
      } catch (error) {
        console.error("Resultados error:", error);
        setErro("Não foi possível carregar os resultados.");
      } finally {
        setCarregando(false);
      }
    }

    carregarResultados();
  }, []);

  return (
    <>
      <Header pageTitle="Resultados" />

      <main className="container-fluid py-5">
        <h2 className="mb-4">Todos os Resultados</h2>

        {carregando ? (
          <LoadingState message="Buscando os resultados" />
        ) : erro ? (
          <ErrorState
            message={erro}
            onRetry={() => {
              setErro(null);
              setCarregando(true);
              buscarResultados()
                .then(setResultados)
                .catch((error) => {
                  console.error("Retry resultados error:", error);
                  setErro("Não foi possível carregar os resultados.");
                })
                .finally(() => setCarregando(false));
            }}
          />
        ) : resultados.length === 0 ? (
          <EmptyState
            title="Nenhum resultado encontrado"
            message="Não há resultados para exibir no momento."
          />
        ) : (
          <div className="row">
            {resultados.map((jogo) => (
              <div key={jogo.fixture.id} className="col-md-4 mb-3">
                <CardJogo jogo={jogo} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}