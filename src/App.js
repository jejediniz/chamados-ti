import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/routes";

import { AuthProvider } from "./contextos/authContext";
import { ChamadosProvider } from "./contextos/chamadosContext";

function App() {
  return (
    <AuthProvider>
      <ChamadosProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ChamadosProvider>
    </AuthProvider>
  );
}

export default App;
