interface Jogador {
  number: number;
  name: string;
}

interface Props {
  teamName: string;
  coach: string;
  jogadores: Jogador[];
}

export default function CampoAway({
  teamName,
  coach,
  jogadores,
}: Props) {

  const goleiro = jogadores.slice(0, 1);
  const defesa = jogadores.slice(1, 5);
  const meio = jogadores.slice(5, 8);
  const ataque = jogadores.slice(8, 11);

  return (
    <div
      className="p-4 text-white"
      style={{
        background: "linear-gradient(180deg, #4b00d1, #2a005f)",
        borderRadius: "14px",
      }}
    >
      <h5 className="text-center fw-bold mb-3">
        {teamName}
      </h5>

      <div
        className="d-flex justify-content-between align-items-center p-3 mb-4"
        style={{
          background: "rgba(0,0,0,0.25)",
          borderRadius: "10px",
        }}
      >
        <div>
          <small className="opacity-75">Treinador</small>
          <div className="fw-bold">{coach}</div>
        </div>

        <input
          type="number"
          min={0}
          max={10}
          step={0.1}
          placeholder="0–10"
          className="form-control text-center"
          style={{ width: "84px" }}
        />
      </div>

      <div
        className="position-relative mx-auto"
        style={{
          background: "linear-gradient(180deg, #3a0086, #260052)",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "740px",
          height: "740px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "44%",
            left: 0,
            right: 0,
            height: "1px",
            background: "rgba(255,255,255,0.25)",
          }}
        />

        <Linha y="5%" jogadores={goleiro} />

        <Linha y="30%" jogadores={defesa} />

        <Linha y="54%" jogadores={meio} />

        <Linha y="78%" jogadores={ataque} />
      </div>
    </div>
  );
}

function Linha({
  jogadores,
  y,
}: {
  jogadores: Jogador[];
  y: string;
}) {
  return (
    <div
      className="d-flex justify-content-center"
      style={{
        position: "absolute",
        top: y,
        left: 0,
        right: 0,
        gap: "22px",
      }}
    >
      {jogadores.map((j) => (
        <div
          key={j.number}
          className="text-center"
          style={{
            background: "#ffffff",
            color: "#000",
            borderRadius: "12px",
            width: "140px",
            padding: "14px 10px",
          }}
        >
          <div
            className="fw-bold mx-auto mb-2"
            style={{
              background: "#5a2eff",
              color: "#fff",
              borderRadius: "56%",
              width: "34px",
              height: "34px",
              lineHeight: "34px",
            }}
          >
            {j.number}
          </div>

          <small className="fw-semibold d-block mb-1">
            {j.name}
          </small>

          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            inputMode="decimal"
            placeholder="0–10"
            className="form-control form-control-sm text-center"
            onBlur={(e) => {
              let value = parseFloat(e.target.value);

              if (isNaN(value)) {
                e.target.value = "";
                return;
              }
              if (value < 0) value = 0;
              if (value > 10) value = 10;
              e.target.value = value.toFixed(1);
            }}
          />
        </div>
      ))}
    </div>
  );
}
