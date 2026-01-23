import { Outlet } from "react-router-dom";
import Cabecalho from "../componentes/Cabecalho";
import Container from "../componentes/Container";

export default function PaginaBase() {
  return (
    <>
      <Cabecalho />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
