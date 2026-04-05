export default function Rodape() {
  return (
    <footer className="rodape">
      <address>
        <strong>Ezequiel Ribeiro de Paiva</strong> ·{" "}
        <span>{new Date().toLocaleDateString("pt-BR")}</span> ·{" "}
        <span>Desenvolvimento Web</span>·{" "}
        <span>Orientando: Professor Alexandre Almeida</span>
      </address>
    </footer>
  );
}