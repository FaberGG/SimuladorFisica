import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* se renderiza el componente app (el programa) */}
      <App />
      {/* el fondo se renderiza a continuacion */}
      <div className="stars"></div>
      <div className="twinkling"></div>
    </BrowserRouter>
  </StrictMode>
);
