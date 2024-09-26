// SECCION CONDICIONES INICIALES

// Función para calcular la amplitud inicial
export const calculateInitAmplitude = () => {
  // Amplitud inicial angular (en radianes)
  return 0; // Reemplazar con el valor correcto
};

// Función para calcular la frecuencia angular natural (omega)
export const calculateOmega = (torsionConstant, inertia) => {
  return Math.sqrt(torsionConstant / inertia);
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
export const calculatePosition = (time, initAmplitude, omegaD, gamma, phi) => {
  return (
    initAmplitude * Math.exp(-gamma * time) * Math.cos(omegaD * time + phi)
  );
};

// Función para calcular la velocidad angular en función del tiempo
export const calculateVelocity = (time, initAmplitude, omegaD, gamma, phi) => {
  return (
    -initAmplitude *
    Math.exp(-gamma * time) *
    (gamma * Math.cos(omegaD * time + phi) +
      omegaD * Math.sin(omegaD * time + phi))
  );
};

// Función para calcular la aceleración angular en función del tiempo
export const calculateAcceleration = (time) => {
  return 0;
};

// Función para calcular la amplitud en función del tiempo
export const calculateAmplitude = (time, initAmplitude, gamma) => {
  return initAmplitude * Math.exp(-gamma * time);
};

// Función para calcular la energía mecánica total del sistema
export const calculateEnergy = (time, initAmplitude, omega, inertia, gamma) => {
  return (
    0.5 *
    inertia *
    Math.pow(omega, 2) *
    Math.pow(initAmplitude, 2) *
    Math.exp(-2 * gamma * time)
  );
};
