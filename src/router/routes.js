import { Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio";
import Chamados from "../pages/Chamados";
import ChamadoRapido from "../pages/ChamadoRapido";
import Login from "../pages/Login";
import PaginaBase from "../pages/PaginaBase";

import RotaPrivada from "./RotaPrivada";
import { PERFIS } from "../config/perfis";

export default function AppRoutes() {
  return (
    <Routes>

      {/* LOGIN — TOTALMENTE ISOLADO */}
      <Route path="/login" element={<Login />} />

      {/* ÁREA AUTENTICADA */}
      <Route element={<RotaPrivada />}>
        <Route element={<PaginaBase />}>

          <Route index element={<Inicio />} />

          <Route
            path="chamados"
            element={
              <RotaPrivada perfisPermitidos={[PERFIS.TECNICO, PERFIS.ADMIN]} />
            }
          >
            <Route index element={<Chamados />} />
          </Route>

          <Route
            path="abrir-chamado"
            element={
              <RotaPrivada perfisPermitidos={[PERFIS.USUARIO, PERFIS.ADMIN]} />
            }
          >
            <Route index element={<ChamadoRapido />} />
          </Route>

        </Route>
      </Route>

    </Routes>
  );
}
