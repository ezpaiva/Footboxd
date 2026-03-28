import { useEffect, useState } from "react";
import { buscarLineup } from "../services/apiFootball";
import type { IJogador } from "../types/IJogador";

interface Props {
  fixtureId: number;
}

export default function Lineup({ fixtureId }: Props) {
  const [jogadores, setJogadores] = useState<IJogador[]>([]);

  useEffect(() => {
    buscarLineup(fixtureId).then((data) => {
      const titulares =
        data[0]?.startXI?.map((p: any) => p.player) || [];
      setJogadores(titulares);
    });
  }, [fixtureId]);

  return (
    <ul className="list-group mt-3">
      {jogadores.map((jogador, index) => (
        <li
          key={index}
          className="list-group-item d-flex justify-content-between"
        >
          <span>{jogador.name}</span>
          <span className="badge bg-secondary">
            {jogador.pos}
          </span>
        </li>
      ))}
    </ul>
  );
}