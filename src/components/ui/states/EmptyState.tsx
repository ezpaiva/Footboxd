export default function EmptyState({
  title = "Nada por aqui",
  message = "Ainda não há registros disponíveis.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="footboxd-card state-card p-4 text-center">
      <div className="d-flex flex-column align-items-center justify-content-center gap-3">
        <div className="state-icon">📭</div>
        <div className="fs-5 fw-semibold text-light">{title}</div>
        <div className="text-muted small">{message}</div>
      </div>
    </div>
  );
}
