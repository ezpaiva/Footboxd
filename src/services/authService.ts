import type { Usuario } from "../types/user";
import { apiFetch, type ApiError } from "./api";

const TOKEN_KEY = "token";
const LOGGED_KEY = "usuario_logado";

type AuthActionResult =
  | { ok: true }
  | { ok: false; message: string };

type LoginResponse = {
  token: string;
  nome: string;
  login: string;
};

function isApiError(e: unknown): e is ApiError {
  return (
    typeof e === "object" &&
    e !== null &&
    "status" in e &&
    "message" in e
  );
}

function getErrorMessage(e: unknown, fallback: string): string {
  if (isApiError(e)) return e.message || fallback;
  if (e instanceof Error) return e.message;
  return fallback;
}

export async function criarConta(
  nome: string,
  email: string,
  senha: string
): Promise<AuthActionResult> {
  const nomeNormalizado = nome.trim();
  const emailNormalizado = email.trim().toLowerCase();

  try {
    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nome: nomeNormalizado,
        login: emailNormalizado,
        senha,
        role: "USER",
      }),
    });

    return { ok: true };
  } catch (e: unknown) {
    if (isApiError(e) && e.status === 409) {
      return { ok: false, message: "E-mail já cadastrado." };
    }

    return {
      ok: false,
      message: getErrorMessage(e, "Não foi possível criar a conta."),
    };
  }
}

export async function login(email: string, senha: string): Promise<Usuario | null> {
  const emailNormalizado = email.trim().toLowerCase();

  try {
    const resp = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ login: emailNormalizado, senha }),
    });

    localStorage.setItem(TOKEN_KEY, resp.token);

    const usuarioLogado: Usuario = {
      nome: resp.nome,
      email: resp.login,
    };

    localStorage.setItem(LOGGED_KEY, JSON.stringify(usuarioLogado));
    return usuarioLogado;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LOGGED_KEY);
}

export function getUsuarioLogado(): Usuario | null {
  const data = localStorage.getItem(LOGGED_KEY);
  return data ? (JSON.parse(data) as Usuario) : null;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
