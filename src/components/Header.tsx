interface HeaderProps {
  pageTitle: string;
}

export default function Header({ pageTitle }: HeaderProps) {
  return (
    <header className="bg-dark text-white py-3 mb-4">
      <div className="container text-center">
        <h1 className="h4 mb-1">FOOTBOXD</h1>
        <h2 className="h6 text-secondary mb-0">{pageTitle}</h2>
      </div>
    </header>
  );
}