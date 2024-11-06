//import React from "react";
import "./styles/CardContainer.css";
import Card from "./Card";

//imagenes usadas
import imgPenduloTorsion from "./assets/pendulo-torsion.png";
import imgPendulosAcoplados from "./assets/pendulos-acoplados.png";
export default function CardContainer() {
  return (
    <div className="card-container">
      <div className="page-content">
        {/* // TARJETA PENDULO DE TORSION */}
        <Card
          title="Péndulo de torsión"
          copy="Sistema físico que oscila rotacionalmente alrededor de un eje fijo debido a un torque restaurador"
          url="pendulo-torsion"
          imageUrl={imgPenduloTorsion}
        />
        <Card
          title="Pendulos de torsion acoplados"
          copy="Sistema físico que oscila rotacionalmente alrededor de un eje fijo debido a un torque restaurador"
          url="pendulos-acoplados"
          imageUrl={imgPendulosAcoplados}
        />
      </div>
    </div>
  );
}
