import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import CardContainer from "./components/CardContainer";
import { PenduloTorsionMain } from "./components/pendulo_torsion/PenduloTorsionMain";

function App() {
  return (
    <>
      <Routes>
        {/* se renderizan las rutas
        (segun la ruta en el url renderiza el compenente correspondiente) */}
        <Route
          path="/SimuladorFisica"
          element={<CardContainer></CardContainer>}
        ></Route>
        <Route
          path="/SimuladorFisica/pendulo-torsion"
          element={<PenduloTorsionMain />}
        ></Route>
        <Route
          path="/SimuladorFisica/pendulos-acoplados"
          element={<PenduloTorsionMain />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
