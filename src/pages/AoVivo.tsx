
import { useEffect, useState } from "react";
import CardJogo from "../components/CardJogo";
import { buscarAoVivo } from "../services/apiFootball";
import type { IJogo } from "../types/IJogo";
import Header from "../components/Header";

export default function AoVivo() {
  const [aoVivo, setAoVivo] = useState<IJogo[]>([]);

  useEffect(() => {
    buscarAoVivo().then(setAoVivo);
  }, []);

  return (
    <>
      <Header pageTitle="Jogos ao Vivo" />
      <main
        className="container-fluid py-5"
        style={{
          backgroundColor: "#1d0b3f",
        }}>
      <h2 className="mb-4">Jogos ao Vivo</h2>

      <div className="row">
         {aoVivo.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">
              Nenhum jogo ao vivo no momento.
            </div>
          </div>
        ) : (
          aoVivo.map((jogo) => (
            <div
              key={jogo.fixture.id}
              className="col-md-4 mb-3"
            >
              <CardJogo jogo={jogo} />
            </div>
          ))
        )}
      </div>
    </main>
    </>
  );
}