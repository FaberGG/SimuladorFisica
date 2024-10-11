import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom"; // Cambia a HashRouter
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      {/* se renderiza el componente app (el programa) */}
      <App />
      {/* el fondo se renderiza a continuación */}
      <div className="stars"></div>
      <div className="twinkling"></div>
    </HashRouter>
  </StrictMode>
);
