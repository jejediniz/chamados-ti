import { Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio";
import Chamados from "../pages/Chamados";
import ChamadoRapido from "../pages/ChamadoRapido";
import ChamadosCliente from "../pages/ChamadosCliente";
import Login from "../pages/Login";
import PaginaBase from "../pages/PaginaBase";

import RotaPrivada from "./RotaPrivada";
import { PERFIS } from "../config/perfis";

export default function AppRoutes() {
  return (
    <Routes>
      {/* LOGIN — ISOLADO */}
      <Route path="/login" element={<Login />} />

      {/* ÁREA AUTENTICADA */}
      <Route element={<RotaPrivada />}>
        <Route element={<PaginaBase />}>
          
          {/* DASHBOARD */}
          <Route index element={<Inicio />} />

          {/* GESTÃO DE CHAMADOS — TÉCNICO / ADMIN */}
          <Route
            path="chamados"
            element={
              <RotaPrivada perfisPermitidos={[PERFIS.TECNICO, PERFIS.ADMIN]} />
            }
          >
            <Route index element={<Chamados />} />
          </Route>

          {/* ABERTURA DE CHAMADO — USUÁRIO / ADMIN */}
          <Route
            path="abrir-chamado"
            element={
              <RotaPrivada perfisPermitidos={[PERFIS.USUARIO, PERFIS.ADMIN]} />
            }
          >
            <Route index element={<ChamadoRapido />} />
          </Route>

          {/* VISUALIZAÇÃO SIMPLIFICADA — CLIENTE */}
          <Route
            path="meus-chamados"
            element={
              <RotaPrivada perfisPermitidos={[PERFIS.USUARIO]} />
            }
          >
            <Route index element={<ChamadosCliente />} />
          </Route>

        </Route>
      </Route>
    </Routes>
  );
}
