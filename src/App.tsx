import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Resultados from "./pages/Resultados";
import AoVivo from "./pages/AoVivo";
import Proximos from "./pages/Proximos";
import JogoDetalhe from "./pages/JogoDetalhe";
import Dashboard from "./pages/Dashboard";

import AppLayout from "./components/layout/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/ao-vivo" element={<AoVivo />} />
          <Route path="/proximos" element={<Proximos />} />
          <Route path="/jogo/:fixtureId" element={<JogoDetalhe />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
