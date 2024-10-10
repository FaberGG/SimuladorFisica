//CALCULO PARA LA INERCIA (SIEMPRE SERA LA MISMA)
// Función para calcular el momento de inercia del sistema
export const calculateInertia = (r, l) => {
  //SE ASUME QUE masaEsfera=1kg y masaBarra = 3kg
  return (4 / 5) * Math.pow(r, 2) + (3 / 4) * Math.pow(l, 2);
};

export function calculateOmega(inertia, k) {
  // Calcula la frecuencia angular omega (frecuencia natural)
  // Parámetros: definir los parametros
  return Math.sqrt(k / inertia);
}

// Función para calcular el periodo
export const calculatePeriod = (omega) => {
  return (2 * Math.PI) / omega;
};

// Función para calcular la frecuencia
export const calculateFrequency = (period) => {
  return 1 / period;
};

export const checkQuadrant = (angle) => {

  if (angle >= 0 && angle < Math.PI / 2) {
    return 1;
  } else if (angle >= Math.PI / 2 && angle < Math.PI) {
    return 2;
  } else if (angle >= Math.PI && angle < (3 * Math.PI) / 2) {
    return 3;
  } else {
    return 4;
  }
};

export const changeQuadrant = (angle, newQuadrant) => {
  // Ajusta el ángulo al nuevo cuadrante
  switch (newQuadrant) {
    case 1:
      return angle;
    case 2:
      return Math.PI - angle;
    case 3:
      return Math.PI + angle;
    case 4:
      return 2 * Math.PI - angle;
    default:
      throw new Error("El cuadrante debe ser un valor entre 1 y 4.");
  }
};
