import { useEffect, useState } from "react";
import CardJogo from "../components/ui/CardJogo";
import Header from "../components/layout/Header";
import LoadingState from "../components/ui/states/LoadingState";
import ErrorState from "../components/ui/states/ErrorState";
import EmptyState from "../components/ui/states/EmptyState";
import { buscarProximos } from "../services/apiFootball";
import type { IJogo } from "../types/game";

export default function Proximos() {
  const [proximos, setProximos] = useState<IJogo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarProximos() {
      setCarregando(true);
      setErro(null);

      try {
        const data = await buscarProximos();
        setProximos(data);
      } catch (error) {
        console.error("Proximos error:", error);
        setErro("Falha ao carregar os próximos jogos.");
      } finally {
        setCarregando(false);
      }
    }

    carregarProximos();
  }, []);

  return (
    <>
      <Header pageTitle="Próximos Jogos" />
      <main className="container-fluid py-5">
        <h2 className="mb-4">Próximos Jogos</h2>

        {carregando ? (
          <LoadingState message="Carregando próximos jogos" />
        ) : erro ? (
          <ErrorState
            message={erro}
            onRetry={() => {
              setErro(null);
              setCarregando(true);
              buscarProximos()
                .then(setProximos)
                .catch((error) => {
                  console.error("Retry próximos error:", error);
                  setErro("Falha ao carregar os próximos jogos.");
                })
                .finally(() => setCarregando(false));
            }}
          />
        ) : proximos.length === 0 ? (
          <EmptyState
            title="Nenhum jogo agendado"
            message="Ainda não há jogos previstos para exibir."
          />
        ) : (
          <div className="row">
            {proximos.map((jogo) => (
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