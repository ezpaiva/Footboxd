import type { Item } from "../../types/Item";

interface CardProps {
  item: Item;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

function Card({ item, onToggle, onRemove }: CardProps) {
  return (
    <div className="card mb-2">
      <div className="card-body d-flex justify-content-between align-items-center">
        <span
          style={{
            textDecoration: item.complete ? "line-through" : "none",
          }}
        >
          {item.name}
        </span>

        <div>
          <button
            className="btn btn-sm btn-success me-2"
            onClick={() => onToggle(item.id)}
          >
            ✓
          </button>

          <button
            className="btn btn-sm btn-danger"
            onClick={() => onRemove(item.id)}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;