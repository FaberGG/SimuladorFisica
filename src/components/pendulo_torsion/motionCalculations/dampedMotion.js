// SECCION CONDICIONES INICIALES

// Función para calcular la amplitud inicial
export const calculateInitAmplitude = () => {
  // Amplitud inicial angular (en radianes)
  return 0; // Reemplazar con el valor correcto
};

// Función para calcular la frecuencia angular natural (omega)
export const calculateOmega = (k, inertia) => {
  return Math.sqrt(k / inertia);
};
// Función para calcular la frecuencia amortiguada (omegaD)
export const calculateOmegaD = (k, inertia, gamma) => {
  return Math.sqrt(k / inertia - (1 / 4) * Math.pow(gamma / inertia, 2));
};

// Función para calcular amortiguamineto gamma
export const calculateGamma = () => {
  return 0;
};

// Función para calcular amortiguamineto phi
export const calculatePhi = () => {
  return 0;
};

// Función para calcular el periodo del péndulo amortiguado
export const calculatePeriod = (omegaD) => {
  return (2 * Math.PI) / omegaD;
};

// Función para calcular la frecuencia
export const calculateFrequency = (period) => {
  return 1 / period;
};

// SECCION FUNCIONES DE TIEMPO

// Función para calcular la posición angular theta en función del tiempo
export const calculatePosition = (
  time,
  inertia,
  initAmplitude,
  omegaD,
  gamma,
  phi
) => {
  return (
    initAmplitude *
    Math.exp((-gamma / (2 * inertia)) * time) *
    Math.cos(omegaD * time + phi)
  );
};

// Función para calcular la amplitud en función del tiempo
export const calculateAmplitude = (time, initAmplitude, gamma) => {
  return 0;
};

// Función para calcular la energía mecánica total del sistema
export const calculateEnergy = (time, velocity, position, inertia, k) => {
  return 0.5 * (inertia * Math.pow(velocity, 2) + k * Math.pow(position, 2));
};
