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

export function listarPorFixture(fixtureId: number) {
  return apiFetch<AvaliacaoResponse[]>(`/avaliacoes?fixtureId=${fixtureId}`);
}

export function minhas() {
  return apiFetch<AvaliacaoResponse[]>(`/avaliacoes/minhas`);
}

export function salvar(avaliacao: AvaliacaoRequest) {
  return apiFetch<AvaliacaoResponse>("/avaliacoes", {
    method: "POST",
    body: JSON.stringify(avaliacao),
  });
}

export function salvarEmLote(avaliacoes: AvaliacaoRequest[]) {
  return apiFetch<AvaliacaoResponse[]>("/avaliacoes/batch", {
    method: "POST",
    body: JSON.stringify(avaliacoes),
  });
}

export function excluir(id: number) {
  return apiFetch<void>(`/avaliacoes/${id}`, {
    method: "DELETE",
  });
}