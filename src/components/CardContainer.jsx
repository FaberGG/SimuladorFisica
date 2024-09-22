//import React from "react";
import "./styles/cardContainer.css";
import Card from "./Card";

//imagenes usadas
import imgPenduloTorsion from "./assets/pendulo-torsion.jpg";

export default function CardContainer() {
  return (
    <div className="card-container">
      <div className="page-content">
        {/* // TARJETA PENDULO DE TORSION */}
        <Card
          title="Pendulo de torsion"
          copy="voluptates, architecto, magnam deserunt sed possimus. accusamus?"
          url="pendulo-torsion"
          imageUrl=""
        />
      </div>
    </div>
  );
}
