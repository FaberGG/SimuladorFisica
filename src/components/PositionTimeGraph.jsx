import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function PositionTimeGraph({ positionData, title }) {
  // positionData es un array de objetos, cada uno con propiedades 'time' y 'position'

  return (
    <div
      style={{ width: "60vh", height: "auto", color: "white", marginTop: "3%" }}
    >
      <h2>{title}</h2>
      <LineChart width={600} height={300} data={positionData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="t" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="position" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}

export default PositionTimeGraph;
