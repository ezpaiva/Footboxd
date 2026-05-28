import type { IJogo } from "../types/game";
import type { IJogador } from "../types/player";
import { apiFetch } from "./api";

const BACKEND_URL = import.meta.env.VITE_API_URL;
const LEGACY_API_URL = "https://v3.football.api-sports.io";

const HEADERS = {
  "x-apisports-key": import.meta.env.VITE_API_FOOTBALL_KEY,
};

interface ApiFootballResponse<T> {
  response: T;
}

export interface LineupTeam {
  startXI: Array<{
    player: IJogador;
  }>;
  coach?: {
    name?: string;
  };
}

type ApiFootballBody<T> = ApiFootballResponse<T[]> | T[] | ApiFootballResponse<T>;

function getFromSessionCache<T>(key: string): T | null {
  const cached = sessionStorage.getItem(key);
  return cached ? (JSON.parse(cached) as T) : null;
}

function saveToSessionCache<T>(key: string, data: T) {
  sessionStorage.setItem(key, JSON.stringify(data));
}

function formatDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

function normalizeApiResponse<T>(body: unknown): T[] {
  if (Array.isArray(body)) {
    return body as T[];
  }

  if (body && typeof body === "object" && "response" in body) {
    const response = (body as ApiFootballResponse<T[]>).response;
    if (Array.isArray(response)) {
      return response;
    }
    if (response === null || response === undefined) {
      return [];
    }
    return [response] as T[];
  }

  throw new Error("Formato de resposta inesperado da API de futebol");
}

async function fetchApi<T>(endpoint: string): Promise<T[]> {
  if (BACKEND_URL?.trim()) {
    const body = await apiFetch<ApiFootballBody<T>>(endpoint, { method: "GET" });
    return normalizeApiResponse<T>(body);
  }

  if (!HEADERS["x-apisports-key"]) {
    throw new Error("Chave da API-Football não configurada (VITE_API_FOOTBALL_KEY)");
  }

  const res = await fetch(`${LEGACY_API_URL}${endpoint}`, {
    headers: HEADERS,
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error("Erro ao acessar dados da API-Football");
  }

  return normalizeApiResponse<T>(body);
}

export async function buscarResultados() {
  const cacheKey = "resultados";
  const cached = getFromSessionCache<IJogo[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const data = await fetchApi<IJogo>(`/fixtures?date=${formatDate(-1)}`);
    saveToSessionCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("buscarResultados error:", error);
    throw error;
  }
}

export async function buscarAoVivo() {
  const cacheKey = "aoVivo";
  const cached = getFromSessionCache<IJogo[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const data = await fetchApi<IJogo>(`/fixtures?live=all`);
    saveToSessionCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("buscarAoVivo error:", error);
    throw error;
  }
}

export async function buscarProximos() {
  const cacheKey = "proximos";
  const cached = getFromSessionCache<IJogo[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const data = await fetchApi<IJogo>(`/fixtures?date=${formatDate(1)}`);
    saveToSessionCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("buscarProximos error:", error);
    throw error;
  }
}

export async function buscarLineup(fixtureId: number) {
  const cacheKey = `lineup_${fixtureId}`;
  const cached = getFromSessionCache<LineupTeam[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const data = await fetchApi<LineupTeam>(`/fixtures/lineups?fixture=${fixtureId}`);
    saveToSessionCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error("buscarLineup error:", error);
    throw error;
  }
}

export async function buscarFixture(fixtureId: number) {
  const cacheKey = `fixture_${fixtureId}`;
  const cached = getFromSessionCache<IJogo>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const data = await fetchApi<IJogo>(`/fixtures?id=${fixtureId}`);
    if (data.length > 0) {
      saveToSessionCache(cacheKey, data[0]);
      return data[0];
    }
    return null;
  } catch (error) {
    console.error("buscarFixture error:", error);
    throw error;
  }
}
