const API_URL = "https://v3.football.api-sports.io";

const HEADERS = {
  "x-apisports-key": import.meta.env.VITE_API_FOOTBALL_KEY,
};

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

  return data.response;
}

export function buscarResultados() {
  return fetchApi(`/fixtures?date=${formatDate(-1)}`);
}

export function buscarAoVivo() {
  return fetchApi(`/fixtures?live=all`);
}

export function buscarProximos() {
  return fetchApi(`/fixtures?date=${formatDate(1)}`);
}

export function buscarLineup(fixtureId: number) {
  return fetchApi(`/fixtures/lineups?fixture=${fixtureId}`);
}