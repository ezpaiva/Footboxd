interface Props {
  titulo: string;
  quantidade: number;
  cor?: string;
}

export default function DashboardResumo({ titulo, quantidade }: Props) {
  return (
    <div className="card text-center">
      <div className="card-body">
        <h5>{titulo}</h5>
        <h2>{quantidade}</h2>
      </div>
    </div>
  );
}