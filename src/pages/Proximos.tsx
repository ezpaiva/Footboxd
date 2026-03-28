import { useEffect, useState } from "react";
import CardJogo from "../components/CardJogo";
import { buscarProximos } from "../services/apiFootball";
import type { IJogo } from "../types/IJogo";
import Header from "../components/Header";

export default function Proximos() {
  const [proximos, setProximos] = useState<IJogo[]>([]);

  useEffect(() => {
    buscarProximos().then(setProximos);
  }, []);

  return (
    <>
      <Header pageTitle="Próximos Jogos" />
    <main className="container mt-4">
      <h2 className="mb-4">Próximos Jogos</h2>

      <div className="row">
        {proximos.map((jogo) => (
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