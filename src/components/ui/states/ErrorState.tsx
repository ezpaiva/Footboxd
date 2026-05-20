export default function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="footboxd-card state-card p-4 text-center">
      <div className="d-flex flex-column align-items-center justify-content-center gap-3">
        <div className="state-icon text-warning">⚠️</div>
        <div className="text-light fw-semibold">{message}</div>
        {onRetry ? (
          <button className="btn btn-outline-light px-4" onClick={onRetry}>
            Tentar novamente
          </button>
        ) : null}
      </div>
    </div>
  );
}
