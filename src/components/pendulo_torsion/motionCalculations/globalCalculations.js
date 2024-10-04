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

// Función para calcular el periodo del péndulo amortiguado
export const calculatePeriod = (omegaD) => {
  return (2 * Math.PI) / omegaD;
};

// Función para calcular la frecuencia
export const calculateFrequency = (period) => {
  return 1 / period;
};

export const checkQuadrant = (angle) => {
  // Normaliza el ángulo entre 0 y 2π
  const normalAngle = angle % (2 * Math.PI);

  if (normalAngle >= 0 && normalAngle < Math.PI / 2) {
    return 1;
  } else if (normalAngle >= Math.PI / 2 && normalAngle < Math.PI) {
    return 2;
  } else if (normalAngle >= Math.PI && normalAngle < (3 * Math.PI) / 2) {
    return 3;
  } else {
    return 4;
  }
};

export const changeQuadrant = (angle, newQuadrant) => {
  if (checkQuadrant(angle) == newQuadrant) return angle;
  // Normaliza el ángulo entre 0 y 2π
  let normalAngle = angle % (2 * Math.PI);

  // Si el ángulo es negativo, ajusta sumando 2π para llevarlo al rango positivo
  if (normalAngle < 0) {
    normalAngle += 2 * Math.PI;
  }

  // Calcula el valor relativo en el cuadrante original
  let angleInQuadrant = normalAngle % (Math.PI / 2);

  console.log(checkQuadrant(angle));
  console.log(angleInQuadrant);

  // Ajusta el ángulo al nuevo cuadrante
  switch (newQuadrant) {
    case 1:
      return angleInQuadrant;
    case 2:
      return Math.PI / 2 + angleInQuadrant;
    case 3:
      return Math.PI + angleInQuadrant;
    case 4:
      return (3 * Math.PI) / 2 + angleInQuadrant;
    default:
      throw new Error("El cuadrante debe ser un valor entre 1 y 4.");
  }
};
