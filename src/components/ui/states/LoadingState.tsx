export default function LoadingState({
  message = "Carregando...",
}: {
  message?: string;
}) {
  return (
    <div className="footboxd-card state-card p-4 text-center">
      <div className="d-flex flex-column align-items-center justify-content-center gap-3">
        <div className="state-icon spinner-border text-light" role="status">
          <span className="visually-hidden">Carregando</span>
        </div>
        <div className="text-light fw-semibold">{message}</div>
      </div>
    </div>
  );
}
