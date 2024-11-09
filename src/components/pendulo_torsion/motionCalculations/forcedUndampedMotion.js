import { changeQuadrant, roundDecimal } from "./globalCalculations";
import { calculateInitAmplitude, calculatePhi } from "./simpleHarmonicMotion";
export { calculatePhi } from "./simpleHarmonicMotion";
export * from "./globalCalculations";
// SECCION CONDICIONES INICIALES

export const checkResonance = (omega, omegaF) => {
  return roundDecimal(omega, 1) == roundDecimal(omegaF, 1);
};

const calculateConstantC = (omega, omegaF, Fo, inertia) => {
  if (omegaF > omega) {
    return Fo / inertia / (Math.pow(omegaF, 2) - Math.pow(omega, 2));
  }
  if (checkResonance(omega, omegaF)) {
    return Fo / (2 * inertia * omega);
  } else {
    return Fo / inertia / (Math.pow(omega, 2) - Math.pow(omegaF, 2));
  }
};

//calcula phi en el cuadrante correcto
export const calculatePhiForUnd = (
  initPosition,
  initVelocity,
  omega,
  omegaF,
  Fo,
  inertia
) => {
  if (checkResonance(omega, omegaF))
    return calculatePhi(initPosition, initVelocity, omega);

  const C = calculateConstantC(omega, omegaF, Fo, inertia);

  const term = omegaF > omega ? initPosition + C : initPosition - C;
  if (term == 0) {
    return initVelocity > 0 ? (3 * Math.PI) / 2 : Math.PI / 2;
  }

  const phi = Math.abs(Math.atan(-initVelocity / (omega * term)));

  if (term > 0) {
    //cos+
    return initVelocity > 0 ? changeQuadrant(phi, 4) : changeQuadrant(phi, 1);
  }
  return initVelocity > 0 ? changeQuadrant(phi, 3) : changeQuadrant(phi, 2);
};

// Función para calcular la amplitud inicial
export const calculateForcedInitAmplitude = (
  phi,
  initPosition,
  initVelocity,
  omega,
  omegaF,
  Fo,
  inertia
) => {
  const C = calculateConstantC(omega, omegaF, Fo, inertia);
  let A = 0;
  if (checkResonance(omega, omegaF)) {
    //calculo como un MAS
    A = calculateInitAmplitude(phi, initPosition, initVelocity, omega);
    return { A: A, C: C };
  }
  //si no

  const term = omegaF > omega ? initPosition + C : initPosition - C;

  A = term / Math.cos(phi);

  return { A: A, C: C };
};

// SECCION FUNCIONES DE TIEMPO
// Función para calcular la posición angular theta en función del tiempo
export const calculatePosition = (time, initAmplitude, phi, omega, omegaF) => {
  if (checkResonance(omega, omegaF)) {
    return (
      initAmplitude.A * Math.cos(omega * time + phi) +
      initAmplitude.C * time * Math.sin(omega * time)
    );
  }

  let delta = omegaF < omega ? 0 : Math.PI;
  // Primera parte: Movimiento natural
  const naturalPart = initAmplitude.A * Math.cos(omega * time + phi);

  // Segunda parte: Movimiento forzado por la fuerza externa
  const forcedPart = initAmplitude.C * Math.cos(omegaF * time + delta);

  // Retornamos la suma de ambas partes
  return naturalPart + forcedPart;
};

export const calculateAmplitude = (time, initAmplitude) => {
  return initAmplitude.C * time;
};

// Función para calcular la velocidad angular en función del tiempo
export const calculateVelocity = (
  time,
  initAmplitude,
  phi,
  omega,
  omegaF,
  F0,
  inertia
) => {
  // Primera parte: Movimiento natural
  const naturalVelocity =
    -initAmplitude.A * omega * Math.sin(omega * time + phi);
  let delta = omegaF < omega ? 0 : Math.PI;
  const forcedPart = checkResonance(omega, omegaF)
    ? initAmplitude.C * Math.sin(omega * time) +
      initAmplitude.C * time * omega * Math.cos(omega * time)
    : -initAmplitude.C * omegaF * Math.sin(omegaF * time + delta);
  // Segunda parte: Movimiento forzado por la fuerza externa

  // Retornamos la suma de ambas partes
  return naturalVelocity + forcedPart;
};

// Función para calcular la energía mecánica total del sistema
export const calculateEnergy = (time, initAmplitude, omegaF, Fo) => {
  const Potencia =
    -Fo * initAmplitude.A * omegaF * (Math.sin(2 * omegaF * time) / 2);
  return Potencia;
};

export const calculateStrEcuation = (
  time,
  initAmplitude,
  phi,
  omega,
  omegaF
) => {
  const t = roundDecimal(time, 2);
  const w = roundDecimal(omega, 2);
  const wF = roundDecimal(omegaF, 2);
  const A = roundDecimal(initAmplitude.A, 2);
  const C = roundDecimal(initAmplitude.C, 2);
  const p = roundDecimal(phi, 2);
  const delta = wF < w ? 0 : Math.PI; // Ajuste de fase para fuera de resonancia

  if (checkResonance(omega, omegaF)) {
    // Caso en resonancia: combinación de un MAS con un término lineal en tiempo
    return `${A} * cos(${w} * ${t} + ${p}) + ${C} * ${t} * sin(${w} * ${t})`;
  } else {
    // Caso fuera de resonancia: suma de movimiento natural y forzado
    return `${A} * cos(${w} * ${t} + ${p}) + ${C} * cos(${wF} * ${t} + ${delta})`;
  }
};
