import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Resultados from "./pages/Resultados";
import AoVivo from "./pages/AoVivo";
import Proximos from "./pages/Proximos";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/ao-vivo" element={<AoVivo />} />
        <Route path="/proximos" element={<Proximos />} />
      </Routes>
    </BrowserRouter>
  );
};
