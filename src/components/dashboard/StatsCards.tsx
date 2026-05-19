export default function StatsCards({
  jogosAvaliados,
  totalAvaliacoes,
}: {
  jogosAvaliados: number;
  totalAvaliacoes: number;
}) {
  return (
    <section className="row mb-4">
      <div className="col-md-6 mb-3">
        <div className="footboxd-card p-3 text-center">
          <strong>Jogos avaliados</strong>
          <div className="fs-2">{jogosAvaliados}</div>
        </div>
      </div>

      <div className="col-md-6 mb-3">
        <div className="footboxd-card p-3 text-center">
          <strong>Avaliações registradas</strong>
          <div className="fs-2">{totalAvaliacoes}</div>
        </div>
      </div>
    </section>
  );
}