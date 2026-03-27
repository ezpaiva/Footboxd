import { fetchApi } from "./api";


export const getJogosAoVivo = async () => {
  try {
    const data = await fetchApi("/football-live-data");

    return data?.response || data || [];

  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    return [];
  }
};