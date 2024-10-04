import { checkQuadrant } from "./globalCalculations";
export * from "./globalCalculations";

// SECCION CONDICIONES INICIALES

// Función para calcular la amplitud inicial
export const calculateInitAmplitude = () => {
  // Amplitud inicial angular (en radianes)
  return 0; // Reemplazar con el valor correcto
};

// Función para calcular la frecuencia angular angular forzada (omegaF)
export const calculateOmegaF = (k, inertia) => {
  return 0;
};

// Función para calcular amortiguamineto phi
export const calculatePhi = () => {
  return 0;
};

// SECCION FUNCIONES DE TIEMPO

// Función para calcular la posición angular theta en función del tiempo
export const calculatePosition = (time, inertia, initAmplitude, phi) => {
  return 0;
};

// Función para calcular la velocidad angular en función del tiempo
export const calculateVelocity = (time, initAmplitude, phi) => {
  return 0;
};

// Función para calcular la amplitud en función del tiempo
export const calculateAmplitude = (time, initAmplitude) => {
  return 0;
};

// Función para calcular la energía mecánica total del sistema
export const calculateEnergy = (time, velocity, position, inertia, k) => {
  return 0;
};
