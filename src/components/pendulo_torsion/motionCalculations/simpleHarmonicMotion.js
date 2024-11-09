import { changeQuadrant, roundDecimal } from "./globalCalculations";
export * from "./globalCalculations";

export function calculatePhi(initPosition, initVelocity, omega) {
  let phi = 0;

  // Caso cuando la posición inicial es 0
  if (initPosition == 0) {
    return initVelocity > 0 ? (3 * Math.PI) / 2 : Math.PI / 2;
  }

  // Caso cuando la velocidad inicial es 0
  if (initVelocity == 0) {
    return initPosition > 0 ? 0 : Math.PI;
  }
  // Calcula phi con la arctan
  phi = Math.abs(Math.atan(-initVelocity / (omega * initPosition)));

  if (initPosition > 0) {
    //posicIon inicial positiva
    return initVelocity > 0 ? changeQuadrant(phi, 4) : changeQuadrant(phi, 1);
  } else {
    //posiscion inicial negativa
    return initVelocity > 0 ? changeQuadrant(phi, 3) : changeQuadrant(phi, 2);
  }
}

export function calculateInitAmplitude(phi, initPosition, initVelocity, omega) {
  // Si la posición inicial es cero, se despeja A de la ec. de vel inicial
  if (initPosition == 0) {
    // Calcular A a partir de la velocidad inicial
    return -initVelocity / (omega * Math.sin(phi));
  }
  return initPosition / Math.cos(phi);
  //return initPosition / Math.cos(phi - Math.atan(k / inertia));
}

// Sección de funciones dependientes del tiempo

export function calculatePosition(time, initAmplitude, phi, omega) {
  // Parámetros: definir los parametros
  return initAmplitude * Math.cos(omega * time + phi);
}

export function calculateVelocity(time, initAmplitude, phi, omega) {
  // Parámetros: definir los parametros
  return -initAmplitude * omega * Math.sin(omega * time + phi);
}

export function calculateEnergy(velocity, position, inertia, k) {
  // Parámetros: definir los parametros
  return 0.5 * (inertia * Math.pow(velocity, 2) + k * Math.pow(position, 2));
}

export const calculateStrEcuation = (time, initAmplitude, phi, omega) => {
  const A = roundDecimal(initAmplitude, 2);
  const t = roundDecimal(time, 2);
  const w = roundDecimal(omega, 2);
  const p = roundDecimal(phi, 2);

  return `${A} * cos(${w} * ${t} + ${p})`;
};
