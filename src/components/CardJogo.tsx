import type { IJogo } from "../types/IJogo";

export default function CardJogo({ jogo }: { jogo: IJogo }) {
  return (
    <div className="card text-center">
      <div className="card-body">
        {jogo.teams.home.name} x {jogo.teams.away.name}
      </div>
    </div>
  );
}