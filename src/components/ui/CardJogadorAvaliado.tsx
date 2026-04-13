interface Props {
  numero: number;
  nome: string;
  nota: number;
  lado: "home" | "away";
}

export default function CardJogadorAvaliado({
  numero,
  nome,
  nota,
  lado,
}: Props) {
  const notaFinal =
    typeof nota === "number" && !isNaN(nota) ? nota.toFixed(1) : "—";

  return (
    <div
      style={{
        background: "#a390c4",
        borderRadius: 8,
        padding: "8px 12px",
        marginBottom: 8,
        color: "#000",
      }}
    >
      <strong>{nome || "Jogador desconhecido"}</strong>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        #{numero} • {lado === "home" ? "Casa" : "Visitante"}
      </div>

      <div style={{ marginTop: 4 }}>
        Nota: <strong>{notaFinal}</strong>
      </div>
    </div>
  );
}
