import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Rodape from "../components/layout/Footer";
import CardJogo from "../components/ui/CardJogo";

import { login, criarConta } from "../services/authService";
import { buscarResultados } from "../services/apiFootball";

export default function Login() {
  const navigate = useNavigate();

  const [modoCriarConta, setModoCriarConta] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const [resultados, setResultados] = useState<any[]>([]);
  const [loadingResultados, setLoadingResultados] = useState(true);

  useEffect(() => {
    buscarResultados()
      .then((data) => setResultados(data.slice(0, 9)))
      .catch(() => setResultados([]))
      .finally(() => setLoadingResultados(false));
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (modoCriarConta) {
      const sucesso = criarConta(nome, email, senha);
      if (!sucesso) {
        setErro("E-mail já cadastrado.");
        return;
      }
      alert("Conta criada com sucesso! Faça login.");
      setModoCriarConta(false);
      setNome("");
      setSenha("");
      return;
    }

    const user = login(email, senha);
    if (!user) {
      setErro("E-mail ou senha inválidos.");
      return;
    }

    navigate("/home");
  }

  return (
    <>
      <Header pageTitle="Footboxd" />

      <main
        className="container-fluid py-5"
        style={{ backgroundColor: "#1d0b3f" }}
      >
        <form
          onSubmit={handleSubmit}
          className="col-md-6 mx-auto mb-5"
        >
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

          {erro && (
            <div className="alert alert-danger py-1 text-center">
              {erro}
            </div>
          )}

          <button className="btn btn-primary w-100 mb-2">
            {modoCriarConta ? "Criar Conta" : "Entrar"}
          </button>

          <button
            type="button"
            className="btn btn-link w-100 text-light"
            onClick={() => {
              setErro("");
              setModoCriarConta(!modoCriarConta);
            }}
          >
            {modoCriarConta
              ? "Já tenho conta"
              : "Criar conta"}
          </button>
        </form>
        <section>
          <h5 className="text-center mb-3 text-light">
            Últimos Resultados
          </h5>

          {loadingResultados ? (
            <div className="text-center text-light">
              Carregando resultados...
            </div>
          ) : resultados.length === 0 ? (
            <div className="alert alert-info text-center">
              Nenhum resultado disponível.
            </div>
          ) : (
            <div
              className="d-flex gap-3 px-3"
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {resultados.map((jogo) => (
                <div
                  key={jogo.fixture.id}
                  style={{ minWidth: 260 }}
                >
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