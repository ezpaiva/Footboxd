const API_URL = "https://v3.football.api-sports.io";

const HEADERS = {
  "x-apisports-key": import.meta.env.VITE_API_FOOTBALL_KEY,
};

function getFromSessionCache(key: string) {
  const cached = sessionStorage.getItem(key);
  return cached ? JSON.parse(cached) : null;
}

function saveToSessionCache(key: string, data: any) {
  sessionStorage.setItem(key, JSON.stringify(data));
}

function formatDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
}

async function fetchApi(endpoint: string) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: HEADERS,
  });

  const data = await res.json();
  console.log("API RESPONSE:", data);

  if (!res.ok || !Array.isArray(data.response)) {
    throw new Error("Erro ao acessar dados da API‑Football");
  }

  return Array.isArray(data.response) ? data.response : [];
}

export async function buscarResultados() {
  const cacheKey = "resultados";
  const cached = getFromSessionCache(cacheKey);
  if (cached) {
    return cached;
  }
  const data = await fetchApi(`/fixtures?date=${formatDate(-1)}`);
  saveToSessionCache(cacheKey, data);
  return data;
}

export async function buscarAoVivo() {
  const cacheKey = "aoVivo";
  const cached = getFromSessionCache(cacheKey);
  if (cached) {
    return cached;
  }
  const data = await fetchApi(`/fixtures?live=all`);
  saveToSessionCache(cacheKey, data);
  return data;
}

export async function buscarProximos() {
  const cacheKey = "proximos";
  const cached = getFromSessionCache(cacheKey);
  if (cached) {
    return cached;
  }
  const data = await fetchApi(`/fixtures?date=${formatDate(1)}`);
  saveToSessionCache(cacheKey, data);
  return data;
}

export async function buscarLineup(fixtureId: number) {
  const cacheKey = `lineup_${fixtureId}`;
  const cached = getFromSessionCache(cacheKey);
  if (cached) {
    return cached;
  }
  const data = await fetchApi(`/fixtures/lineups?fixture=${fixtureId}`);
  saveToSessionCache(cacheKey, data);
  return data;
}