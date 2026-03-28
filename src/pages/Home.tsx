import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Dashboard from "../components/Dashboard";
import CardJogo from "../components/CardJogo";
import { buscarResultados, buscarAoVivo, buscarProximos } 
from "../services/apiFootball";
import type { IJogo } from "../types/IJogo";

export default function Home() {
  const [resultados, setResultados] = useState<IJogo[]>([]);
  const [aoVivo, setAoVivo] = useState<IJogo[]>([]);
  const [proximos, setProximos] = useState<IJogo[]>([]);

  useEffect(() => {
    buscarResultados().then(setResultados);
    buscarAoVivo().then(setAoVivo);
    buscarProximos().then(setProximos);
  }, []);

  return (
    <>

      <Header pageTitle="Início" />

      <main className="container mt-4">

        <div className="row mb-5">
          <div className="col-12 col-md-4 mb-3">
            <Link to="/resultados" className="text-decoration-none">
              <Dashboard
                titulo="Resultados"
                quantidade={resultados.length}
              />
            </Link>
          </div>

          <div className="col-12 col-md-4 mb-3">
            <Link to="/ao-vivo" className="text-decoration-none">
              <Dashboard
                titulo="Ao Vivo"
                quantidade={aoVivo.length}
                cor="danger"
              />
            </Link>
          </div>

          <div className="col-12 col-md-4 mb-3">
            <Link to="/proximos" className="text-decoration-none">
              <Dashboard
                titulo="Próximos Jogos"
                quantidade={proximos.length}
                cor="success"
              />
            </Link>
          </div>
        </div>

        <section className="mb-5">
          <h4 className="text-center mb-4">Resultados</h4>

          <div className="row">
            {resultados.slice(0, 9).map((jogo) => (
              <div
                key={jogo.fixture.id}
                className="col-12 col-md-4 mb-3"
              >
                <CardJogo jogo={jogo} />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <h4 className="text-center mb-4">Jogos ao Vivo</h4>

          <div className="row">
            {aoVivo.slice(0, 9).map((jogo) => (
              <div
                key={jogo.fixture.id}
                className="col-12 col-md-4 mb-3"
              >
                <CardJogo jogo={jogo} />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <h4 className="text-center mb-4">Próximos Jogos</h4>

          <div className="row">
            {proximos.slice(0, 9).map((jogo) => (
              <div
                key={jogo.fixture.id}
                className="col-12 col-md-4 mb-3"
              >
                <CardJogo jogo={jogo} />
              </div>
            ))}
          </div>
        </section>

      </main>
    </>
  );
}