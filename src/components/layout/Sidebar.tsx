import { NavLink, useNavigate } from "react-router-dom";
import { getUsuarioLogado, logout } from "../../services/authService";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado(); 

  const menuItems = [
    { label: "Início", path: "/home" },
    { label: "Resultados", path: "/resultados" },
    { label: "Ao Vivo", path: "/ao-vivo" },
    { label: "Próximos Jogos", path: "/proximos" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  function handleLogout() {
    logout();  
    onClose(); 
    navigate("/"); 
  }

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <button
        className="close-btn d-md-none"
        onClick={onClose}
        aria-label="Fechar menu"
      >
        ✕
      </button>

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

      {usuario && (
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <strong>{usuario.nome}</strong>
          </div>

          <button
            className="btn btn-outline-light btn-sm w-100 mt-2"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      )}
    </aside>
  );
}
