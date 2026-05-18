import type { Usuario } from "../types/user";
import { apiFetch, setToken, clearToken } from "./api";

const LOGGED_KEY = "usuario_logado";

export async function criarConta(nome: string, email: string, senha: string): Promise<boolean> {
  try {

    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nome,
        login: email,
        senha,
        role: "USER",
      }),
    });

    return true;
  } catch (e) {
    console.error("REGISTER ERROR:", e);
    return false;
  }
}

export async function login(email: string, senha: string): Promise<Usuario | null> {
  try {
    const resp = await apiFetch<{ token: string; nome?: string; login?: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ login: email, senha }),
    });

    setToken(resp.token);

    const usuarioLogado: Usuario = {
      nome: resp.nome ?? email.split("@")[0],
      email: resp.login ?? email,
    };

    localStorage.setItem(LOGGED_KEY, JSON.stringify(usuarioLogado));
    return usuarioLogado;
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    return null;
  }
}

export function logout() {
  clearToken();
  localStorage.removeItem(LOGGED_KEY);
}

export function getUsuarioLogado(): Usuario | null {
  const data = localStorage.getItem(LOGGED_KEY);
  return data ? (JSON.parse(data) as Usuario) : null;
}