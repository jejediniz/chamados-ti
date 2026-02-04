import { Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio";
import Chamados from "../pages/Chamados";
import ChamadoRapido from "../pages/ChamadoRapido";
import ChamadosCliente from "../pages/ChamadosCliente";
import Login from "../pages/Login";
import PaginaBase from "../pages/PaginaBase";

import RotaPrivada from "./RotaPrivada";

export default function AppRoutes() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* ÁREA AUTENTICADA */}
      <Route element={<RotaPrivada />}>
        <Route element={<PaginaBase />}>
          <Route index element={<Inicio />} />
          <Route path="chamados" element={<Chamados />} />
          <Route path="abrir-chamado" element={<ChamadoRapido />} />
          <Route path="meus-chamados" element={<ChamadosCliente />} />
        </Route>
      </Route>
    </Routes>
  );
}
