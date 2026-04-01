import { NavLink } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const menuItems = [
    { label: "Início", path: "/" },
    { label: "Resultados", path: "/resultados" },
    { label: "Ao Vivo", path: "/ao-vivo" },
    { label: "Próximos Jogos", path: "/proximos" },
    { label: "Avaliações", path: "/avaliacoes" }, // futura
    { label: "Configurações", path: "/configuracoes" }, // futura
  ];

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <button
        className="close-btn d-md-none"
        onClick={onClose}
        aria-label="Fechar menu"
      > ✕ </button>

      <h3 className="sidebar-title">FOOTBOXD</h3>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}