
import { useEffect, useState } from "react";
import CardJogo from "../components/ui/CardJogo";
import Header from "../components/layout/Header";
import LoadingState from "../components/ui/states/LoadingState";
import ErrorState from "../components/ui/states/ErrorState";
import EmptyState from "../components/ui/states/EmptyState";
import { buscarAoVivo } from "../services/apiFootball";
import type { IJogo } from "../types/game";

export default function AoVivo() {
  const [aoVivo, setAoVivo] = useState<IJogo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarAoVivo() {
      setCarregando(true);
      setErro(null);

      try {
        const data = await buscarAoVivo();
        setAoVivo(data);
      } catch (error) {
        console.error("AoVivo error:", error);
        setErro("Não foi possível carregar os jogos ao vivo.");
      } finally {
        setCarregando(false);
      }
    }

    carregarAoVivo();
  }, []);

  return (
    <>
      <Header pageTitle="Jogos ao Vivo" />
      <main className="container-fluid py-5">
        <h2 className="mb-4">Jogos ao Vivo</h2>

        {carregando ? (
          <LoadingState message="Carregando jogos ao vivo" />
        ) : erro ? (
          <ErrorState
            message={erro}
            onRetry={() => {
              setErro(null);
              setCarregando(true);
              buscarAoVivo()
                .then(setAoVivo)
                .catch((error) => {
                  console.error("Retry ao vivo error:", error);
                  setErro("Não foi possível carregar os jogos ao vivo.");
                })
                .finally(() => setCarregando(false));
            }}
          />
        ) : aoVivo.length === 0 ? (
          <EmptyState
            title="Nenhum jogo ao vivo"
            message="No momento não há partidas ao vivo na API."
          />
        ) : (
          <div className="row">
            {aoVivo.map((jogo) => (
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