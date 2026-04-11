import { useEffect, useState } from "react";
import CardJogo from "../components/ui/CardJogo";
import { buscarResultados } from "../services/apiFootball";
import type { IJogo } from "../types/game";
import Headers from "../components/layout/Header";

export default function Resultados() {
  const [resultados, setResultados] = useState<IJogo[]>([]);

  useEffect(() => {
    buscarResultados().then(setResultados);
  }, []);

  return (
    <>
    <Headers pageTitle="Resultados" />
    
      <main
        className="container-fluid py-5"
        style={{
          backgroundColor: "#1d0b3f",
        }}>
      <h2 className="mb-4">Todos os Resultados</h2>

      <div className="row">
        {resultados.map((jogo) => (
          <div
            key={jogo.fixture.id}
            className="col-md-4 mb-3"
          >
            <CardJogo jogo={jogo} />
          </div>
        ))}
      </div>
    </main>
    </>
  );
}