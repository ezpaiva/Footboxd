interface HeaderProps {
  pageTitle?: string;
}

export default function Header({ pageTitle }: HeaderProps) {
  return (
    <header
      className="text-center text-white py-5"
      style={{
        background: "linear-gradient(180deg, #3a1c93, #160034)",
        borderBottom: "2px solid #5a2eff",
      }}
    >
      <div className="d-flex justify-content-center align-items-center gap-3">
        <img
          src="/favicon.png"
          alt="Troféu"
          style={{ width: "55px", height: "55px" }}
        />
        <h1 className="header-title">FOOTBOXD</h1>
        <img
          src="/favicon.png"
          alt="Troféu"
          style={{ width: "55px", height: "55px" }}
        />
      </div>

      <p className="header-subtitle">
        Avalie os melhores jogos de futebol
      </p>

      {pageTitle && (
        <p className="mt-3 fw-semibold">
          {pageTitle}
        </p>
      )}
    </header>
  );
}