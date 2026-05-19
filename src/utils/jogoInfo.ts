import { buscarFixture, buscarLineup } from "../services/apiFootball";

export interface JogoInfo {
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;

  jogadores: Record<number, { name: string; pos?: string; number?: number }>;

  coachCasa: { id: number; name: string };
  coachFora: { id: number; name: string };
}

type FixtureResponse = {
  teams: {
    home: { name: string; logo: string };
    away: { name: string; logo: string };
  };
};

type LineupPlayer = {
  player: { id: number; name: string; pos?: string; number?: number };
};

type LineupSide = {
  coach?: { id?: number; name?: string };
  startXI?: LineupPlayer[];
  substitutes?: LineupPlayer[];
};

type LineupResponse = LineupSide[];

const cache = new Map<number, Promise<JogoInfo | null>>();

function addPlayers(
  jogadores: Record<number, { name: string; pos?: string; number?: number }>,
  list?: LineupPlayer[]
) {
  list?.forEach((p) => {
    // Sempre usa player.number como chave, nunca player.id
    if (p.player.number !== null && p.player.number !== undefined) {
      jogadores[p.player.number] = {
        name: p.player.name,
        pos: p.player.pos,
        number: p.player.number,
      };
    }
  });
}

export async function buscarInfoJogo(fixtureId: number): Promise<JogoInfo | null> {
  if (cache.has(fixtureId)) return cache.get(fixtureId)!;

  const promise = (async () => {
    try {
      const [fixtureRaw, lineupRaw] = await Promise.all([
        buscarFixture(fixtureId) as Promise<FixtureResponse | null>,
        buscarLineup(fixtureId) as Promise<LineupResponse | null>,
      ]);

      if (!fixtureRaw?.teams) return null;
      if (!lineupRaw || lineupRaw.length < 2) return null;

      const jogadores: Record<number, { name: string; pos?: string; number?: number }> = {};

      // Apenas adiciona os jogadores titulares (startXI), igual a JogoDetalhe
      for (const side of lineupRaw) {
        addPlayers(jogadores, side.startXI);
      }

      const info: JogoInfo = {
        homeTeam: fixtureRaw.teams.home.name || "Time Casa",
        homeLogo: fixtureRaw.teams.home.logo || "",
        awayTeam: fixtureRaw.teams.away.name || "Time Fora",
        awayLogo: fixtureRaw.teams.away.logo || "",

        jogadores,

        // Coach IDs devem ser 1 (casa) e 2 (fora) para consistência com JogoDetalhe
        coachCasa: { id: 1, name: lineupRaw[0]?.coach?.name || "Técnico" },
        coachFora: { id: 2, name: lineupRaw[1]?.coach?.name || "Técnico" },
      };

      return info;
    } catch (e) {
      console.error("Erro ao buscar info jogo:", e);
      return null;
    }
  })();

  cache.set(fixtureId, promise);
  return promise;
}