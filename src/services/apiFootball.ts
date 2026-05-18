import type { IJogo } from "../types/game";
import type { IJogador } from "../types/player";

const API_URL = "https://v3.football.api-sports.io";

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

async function fetchApi<T>(endpoint: string): Promise<T[]> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: HEADERS,
  });

  const data = (await res.json()) as ApiFootballResponse<T[]>;
  console.log("API RESPONSE:", data);

  if (!res.ok || !Array.isArray(data.response)) {
    throw new Error("Erro ao acessar dados da API‑Football");
  }

  return data.response;
}

export async function buscarResultados() {
  const cacheKey = "resultados";
  const cached = getFromSessionCache<IJogo[]>(cacheKey);
  if (cached) {
    return cached;
  }
  const data = await fetchApi<IJogo>(`/fixtures?date=${formatDate(-1)}`);
  saveToSessionCache(cacheKey, data);
  return data;
}

export async function buscarAoVivo() {
  const cacheKey = "aoVivo";
  const cached = getFromSessionCache<IJogo[]>(cacheKey);
  if (cached) {
    return cached;
  }
  const data = await fetchApi<IJogo>(`/fixtures?live=all`);
  saveToSessionCache(cacheKey, data);
  return data;
}

export async function buscarProximos() {
  const cacheKey = "proximos";
  const cached = getFromSessionCache<IJogo[]>(cacheKey);
  if (cached) {
    return cached;
  }
  const data = await fetchApi<IJogo>(`/fixtures?date=${formatDate(1)}`);
  saveToSessionCache(cacheKey, data);
  return data;
}

export async function buscarLineup(fixtureId: number) {
  const cacheKey = `lineup_${fixtureId}`;
  const cached = getFromSessionCache<LineupTeam[]>(cacheKey);
  if (cached) {
    return cached;
  }
  const data = await fetchApi<LineupTeam>(`/fixtures/lineups?fixture=${fixtureId}`);
  saveToSessionCache(cacheKey, data);
  return data;
}

export async function buscarFixture(fixtureId: number) {
  const cacheKey = `fixture_${fixtureId}`;
  const cached = getFromSessionCache<IJogo>(cacheKey);
  if (cached) {
    return cached;
  }
  const data = await fetchApi<IJogo>(`/fixtures?id=${fixtureId}`);
  if (data.length > 0) {
    saveToSessionCache(cacheKey, data[0]);
    return data[0];
  }
  return null;
}
