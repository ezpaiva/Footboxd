import type { Usuario } from "../types/user";

interface UsuarioComSenha extends Usuario {
  senha: string;
}

const USERS_KEY = "usuarios";
const LOGGED_KEY = "usuario_logado";

export function criarConta(
  nome: string,
  email: string,
  senha: string
): boolean {
  const usuarios: UsuarioComSenha[] =
    JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

  if (usuarios.find((u) => u.email === email)) {
    return false; 
  }

  usuarios.push({ nome, email, senha });
  localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
  return true;
}

export function login(email: string, senha: string): Usuario | null {
  const usuarios: UsuarioComSenha[] =
    JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

  const user = usuarios.find(
    (u) => u.email === email && u.senha === senha
  );

  if (!user) return null;

  const usuarioLogado: Usuario = {
    nome: user.nome,
    email: user.email,
  };

  localStorage.setItem(LOGGED_KEY, JSON.stringify(usuarioLogado));
  return usuarioLogado;
}

export function logout() {
  localStorage.removeItem(LOGGED_KEY);
}

export function getUsuarioLogado(): Usuario | null {
  const data = localStorage.getItem(LOGGED_KEY);
  return data ? JSON.parse(data) : null;
}
