import { checkQuadrant } from "./globalCalculations";
import { calculateInitAmplitude } from "./simpleHarmonicMotion";
export {calculatePhi } from "./simpleHarmonicMotion"
export * from "./globalCalculations";
// SECCION CONDICIONES INICIALES

export const checkResonance = (omega, omegaF)=>{
  return omega == omegaF;
}

// Función para calcular la amplitud inicial
export const calculateForcedInitAmplitude = (
  phi,
  initPosition,
  initVelocity,
  omega,
  omegaF,
  Fo,
  inertia,
) => {
  const A = calculateInitAmplitude(phi, initPosition, initVelocity, omega);
  let C 
  if (omegaF > omega) {
    C = (Fo / inertia) / (Math.pow(omegaF, 2) - Math.pow(omega, 2));
  } else if (omega == omegaF){
    C = Fo / 2 * inertia * omega  
  } else {
    C = (Fo / inertia) / (Math.pow(omega, 2) - Math.pow(omegaF, 2));

  }
  console.log({A:A, C:C})
    return {A:A, C:C}
};

// SECCION FUNCIONES DE TIEMPO
// Función para calcular la posición angular theta en función del tiempo
export const calculatePosition = (
  time,
  initAmplitude,
  phi,
  omega,
  omegaF,
  resonance
) => {
  if(resonance) return initAmplitude.C * Math.sin(omega*time);
  let delta = (omegaF < omega) ? 0 : Math.PI;
  // Primera parte: Movimiento natural
  const naturalPart = initAmplitude.A * Math.cos(omega * time + phi);

  // Segunda parte: Movimiento forzado por la fuerza externa
  const forcedPart = initAmplitude.C * Math.cos(omegaF * time + delta);

  // Retornamos la suma de ambas partes
  return naturalPart + forcedPart;
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
  const naturalVelocity = -initAmplitude.A * omega * Math.sin(omega * time + phi);
  // Segunda parte: Movimiento forzado por la fuerza externa
  const forcedVelocity =
    (-(F0 * omegaF) / (inertia * (Math.pow(omega, 2) - Math.pow(omegaF, 2)))) *
    Math.sin(omegaF * time);

  // Retornamos la suma de ambas partes
  return naturalVelocity + forcedVelocity;
};

// Función para calcular la energía mecánica total del sistema
export const calculateEnergy = (omegaF, initAmplitude, Fo, time) => {
  const Potencia = -Fo * initAmplitude * omegaF * (Math.sin(2 * omegaF * time) / 2);
  return Potencia;
};




