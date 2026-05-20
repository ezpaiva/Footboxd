import { apiFetch } from "./api";

export type TipoAvaliacao = "JOGO" | "TECNICO" | "JOGADOR";

export interface AvaliacaoRequest {
  fixtureId: number;
  tipo: TipoAvaliacao;
  referenciaId: number;
  nota: number;
}

export interface AvaliacaoResponse extends AvaliacaoRequest {
  id: number;
  criadoEm: string;
}

export async function listarPorFixture(fixtureId: number) {
  try {
    return await apiFetch<AvaliacaoResponse[]>(`/avaliacoes?fixtureId=${fixtureId}`);
  } catch (error) {
    console.error("listarPorFixture error:", error);
    throw error;
  }
}

export async function minhas() {
  try {
    return await apiFetch<AvaliacaoResponse[]>(`/avaliacoes/minhas`);
  } catch (error) {
    console.error("minhas error:", error);
    throw error;
  }
}

export async function salvar(avaliacao: AvaliacaoRequest) {
  try {
    return await apiFetch<AvaliacaoResponse>("/avaliacoes", {
      method: "POST",
      body: JSON.stringify(avaliacao),
    });
  } catch (error) {
    console.error("salvar error:", error);
    throw error;
  }
}

export async function salvarEmLote(avaliacoes: AvaliacaoRequest[]) {
  try {
    return await apiFetch<AvaliacaoResponse[]>("/avaliacoes/batch", {
      method: "POST",
      body: JSON.stringify(avaliacoes),
    });
  } catch (error) {
    console.error("salvarEmLote error:", error);
    throw error;
  }
}

export async function excluir(id: number) {
  try {
    return await apiFetch<void>(`/avaliacoes/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("excluir error:", error);
    throw error;
  }
}