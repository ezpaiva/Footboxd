/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Rodape from "../components/layout/Footer";
import CardJogo from "../components/ui/CardJogo";
import LoadingState from "../components/ui/states/LoadingState";
import ErrorState from "../components/ui/states/ErrorState";
import EmptyState from "../components/ui/states/EmptyState";

import { login, criarConta } from "../services/authService";
import { buscarResultados } from "../services/apiFootball";
import type { IJogo } from "../types/game";

type LoginLocationState = { from?: { pathname?: string } };

function resolveFrom(state: unknown, fallback = "/home") {
  const s = state as LoginLocationState | null;
  const path = s?.from?.pathname;
  return typeof path === "string" && path && path !== "/login" ? path : fallback;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [modoCriarConta, setModoCriarConta] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const [resultados, setResultados] = useState<IJogo[]>([]);
  const [loadingResultados, setLoadingResultados] = useState(true);
  const [erroResultados, setErroResultados] = useState<string | null>(null);

  const from = useMemo(() => resolveFrom(location.state), [location.state]);

  const token = localStorage.getItem("token");
  if (token) return <Navigate to={from} replace />;

  useEffect(() => {
    async function carregarResultados() {
      setLoadingResultados(true);
      setErroResultados(null);

      try {
        const data = await buscarResultados();
        setResultados(data.slice(0, 9));
      } catch (error) {
        console.error("Login resultados error:", error);
        setErroResultados("Falha ao carregar os resultados.");
        setResultados([]);
      } finally {
        setLoadingResultados(false);
      }
    }

    carregarResultados();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    try {
      if (modoCriarConta) {
        const ok = await criarConta(nome, email, senha);
        if (!ok) return setErro("Falha ao criar conta. Verifique os dados.");

        alert("Conta criada com sucesso! Faça login.");
        setModoCriarConta(false);
        setNome("");
        setSenha("");
        return;
      }

      const user = await login(email, senha);
      if (!user) return setErro("E-mail ou senha inválidos.");

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login submit error:", error);
      setErro("Ocorreu um erro durante o login. Tente novamente.");
    }
  }

  return (
    <>
      <Header pageTitle="Footboxd" />

      <main className="container-fluid py-5">
        <div className="form-container">
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <h3 className="mb-3 text-center text-light">
            {modoCriarConta ? "Criar Conta" : "Login"}
          </h3>

          {modoCriarConta && (
            <input
              className="form-control mb-2"
              placeholder="Nome"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          )}

          <input
            className="form-control mb-2"
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {erro && <div className="alert alert-danger py-1 text-center">{erro}</div>}

          <button className="btn btn-primary w-100 mb-2" type="submit">
            {modoCriarConta ? "Criar Conta" : "Entrar"}
          </button>

          <button
            type="button"
            className="btn btn-link w-100 text-light"
            onClick={() => {
              setErro("");
              setModoCriarConta((v) => !v);
            }}
          >
            {modoCriarConta ? "Já tenho conta" : "Criar conta"}
          </button>
          </form>
        </div>

        <section style={{ marginTop: "2rem" }}>
          <h5 className="text-center mb-3 text-light">Últimos Resultados</h5>

          {loadingResultados ? (
            <LoadingState message="Buscando os últimos resultados" />
          ) : erroResultados ? (
            <ErrorState message={erroResultados} onRetry={() => {
              setErroResultados(null);
              setLoadingResultados(true);
              buscarResultados()
                .then((data) => setResultados(data.slice(0, 9)))
                .catch((error) => {
                  console.error("Retry resultados error:", error);
                  setErroResultados("Falha ao carregar os resultados.");
                })
                .finally(() => setLoadingResultados(false));
            }} />
          ) : resultados.length === 0 ? (
            <EmptyState
              title="Sem resultados"
              message="Não foi possível carregar resultados no momento."
            />
          ) : (
            <div className="d-flex gap-3 px-3" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
              {resultados.map((jogo) => (
                <div key={jogo.fixture.id} style={{ minWidth: 260 }}>
                  <CardJogo jogo={jogo} />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Rodape />
    </>
  );
}