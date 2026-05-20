import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";

import { minhas, excluir } from "../services/avaliacoesService";
import { getUsuarioLogado } from "../services/authService";

import { buscarInfoJogo, type JogoInfo } from "../utils/jogoInfo";
import StatsCards from "../components/dashboard/StatsCards";
import AvaliacaoListCard from "../components/dashboard/AvaliacaoListCard";
import AvaliacaoTableCard from "../components/dashboard/AvaliacaoTableCard";
import LoadingState from "../components/ui/states/LoadingState";
import ErrorState from "../components/ui/states/ErrorState";

import type { AvaliacaoResponse } from "../components/dashboard/Referencia";

export default function Dashboard() {
  const usuario = getUsuarioLogado();

  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoResponse[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [fetchErro, setFetchErro] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const [jogoInfoMap, setJogoInfoMap] = useState<Map<number, JogoInfo | null>>(
    () => new Map()
  );

  const carregarAvaliacoes = useCallback(async () => {
    const usuarioAtual = getUsuarioLogado();
    if (!usuarioAtual) return;

    setCarregando(true);
    setFetchErro(null);

    try {
      const data = await minhas();
      setAvaliacoes(data);

      const fixtureIds = [...new Set(data.map((a) => a.fixtureId))];
      const entries = await Promise.all(
        fixtureIds.map(async (fid) => [fid, await buscarInfoJogo(fid)] as const)
      );

      setJogoInfoMap(new Map(entries));
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setFetchErro("Falha ao carregar suas avaliações.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarAvaliacoes();
  }, [carregarAvaliacoes]);

  const jogosAvaliados = useMemo(
    () => new Set(avaliacoes.map((item) => item.fixtureId)).size,
    [avaliacoes]
  );

  const melhoresItens = useMemo(
    () => [...avaliacoes].sort((a, b) => b.nota - a.nota).slice(0, 3),
    [avaliacoes]
  );

  const pioresItens = useMemo(
    () => [...avaliacoes].sort((a, b) => a.nota - b.nota).slice(0, 3),
    [avaliacoes]
  );

  const ultimasAvaliacoes = useMemo(
    () => [...avaliacoes].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 10),
    [avaliacoes]
  );

  async function handleExcluir(id: number) {
    try {
      await excluir(id);
      setAvaliacoes((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      console.error(e);
      setErro("Não foi possível excluir essa avaliação.");
    }
  }

  if (!usuario) return null;

  if (carregando) {
    return (
      <>
        <Header pageTitle="Histórico de Avaliações" />
        <main className="page">
          <LoadingState message="Carregando histórico de avaliações" />
        </main>
      </>
    );
  }

  if (fetchErro) {
    return (
      <>
        <Header pageTitle="Histórico de Avaliações" />
        <main className="page">
          <ErrorState message={fetchErro} onRetry={carregarAvaliacoes} />
        </main>
      </>
    );
  }

  return (
    <>
      <Header pageTitle="Histórico de Avaliações" />

      <main className="page">
        <StatsCards jogosAvaliados={jogosAvaliados} totalAvaliacoes={avaliacoes.length} />

        {erro && <div className="alert alert-danger">{erro}</div>}

        <section className="row mb-4">
          <div className="col-md-6 mb-3">
            <AvaliacaoListCard
              titulo="Melhores avaliações"
              carregando={carregando}
              itens={melhoresItens}
              jogoInfoMap={jogoInfoMap}
            />
          </div>

          <div className="col-md-6 mb-3">
            <AvaliacaoListCard
              titulo="Piores avaliações"
              carregando={carregando}
              itens={pioresItens}
              jogoInfoMap={jogoInfoMap}
            />
          </div>
        </section>

        <section className="row">
          <div className="col-12">
            <AvaliacaoTableCard
              carregando={carregando}
              itens={ultimasAvaliacoes}
              jogoInfoMap={jogoInfoMap}
              onExcluir={handleExcluir}
            />
          </div>
        </section>
      </main>
    </>
  );
}