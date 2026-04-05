import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Rodape from "./Rodape";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
      document.body.style.overflow = sidebarOpen ? "hidden" : "";
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [sidebarOpen]);

  return (
    <div className="app-layout">
  
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

        <main className="app-content">
        <button
            className="menu-toggle d-md-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
        >
            ☰
        </button>

        {children}
        </main>
      <Rodape />
    </div>
  );
}