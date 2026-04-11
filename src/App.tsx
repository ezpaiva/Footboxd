import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Resultados from "./pages/Resultados";
import AoVivo from "./pages/AoVivo";
import Proximos from "./pages/Proximos";
import JogoDetalhe from "./pages/JogoDetalhe";
import Dashboard from "./pages/Dashboard";

import AppLayout from "./components/layout/AppLayout";
import { getUsuarioLogado } from "./services/authService";

function PrivateRoute({ children }: { children: ReactNode }) {
  const user = getUsuarioLogado();
  return user ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/ao-vivo" element={<AoVivo />} />
          <Route path="/proximos" element={<Proximos />} />
          <Route path="/jogo/:fixtureId" element={<JogoDetalhe />} />
          <Route path="/dashboard" element={<Dashboard avaliacoes={[]} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
