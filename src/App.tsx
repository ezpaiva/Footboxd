import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Resultados from "./pages/Resultados";
import AoVivo from "./pages/AoVivo";
import Proximos from "./pages/Proximos";
import JogoDetalhe from "./pages/JogoDetalhe";
import AppLayout from "./components/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/ao-vivo" element={<AoVivo />} />
          <Route path="/proximos" element={<Proximos />} />
          <Route path="/jogo/:fixtureId" element={<JogoDetalhe />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
  
}

