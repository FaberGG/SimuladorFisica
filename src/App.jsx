import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import CardContainer from "./components/CardContainer";
import PenduloTorsionMain from "./components/PenduloTorsionMain";
function App() {
  return (
    <>
      <Routes>
        {/* se renderizan las rutas
        (segun la ruta en el url renderiza el compenente correspondiente) */}
        <Route path="/" element={<CardContainer></CardContainer>}></Route>
        <Route
          path="/pendulo-torsion"
          element={<PenduloTorsionMain isCoupled={false} />}
        ></Route>
        <Route
          path="/pendulos-acoplados"
          element={<PenduloTorsionMain isCoupled={true} />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
