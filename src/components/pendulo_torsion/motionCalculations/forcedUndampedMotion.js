// SECCION CONDICIONES INICIALES

// Función para calcular la amplitud inicial
export const calculateInitAmplitude = (
  phi,
  initPosition,
  initVelocity,
  omega
) => {
  if (initPosition == 0) {
    // Calcular A a partir de la velocidad inicial
    return Math.abs(initVelocity / (omega * Math.sin(phi)));
  } else if (initVelocity == 0) {
    // Calcular A a partir de la posición inicial
    return Math.abs(initPosition / Math.cos(phi));
  } else {
    // Si ambas no son cero, calcular A dividiendo las ecuaciones para evitar indeterminaciones
    const amplitudeFromPosition = initPosition / Math.cos(phi);
    const amplitudeFromVelocity = -initVelocity / (omega * Math.sin(phi));
    // Tomamos el promedio de ambas amplitudes para un valor más estable
    return (amplitudeFromPosition + amplitudeFromVelocity) / 2;
  }
};

// Función para calcular la frecuencia angular natural (omega)
export const calculateOmega = (k, inertia) => {
  return Math.sqrt(k / inertia);
};

// Función para calcular amortiguamineto phi
export const calculatePhi = (initPosition, initVelocity, omega) => {
  let phi = 0;
  // Caso cuando la posición inicial es 0
  if (initPosition == 0) {
    return initVelocity > 0 ? (3 * Math.PI) / 2 : Math.PI / 2;
  }

  // Caso cuando la velocidad inicial es 0
  if (initVelocity == 0) {
    return initPosition > 0 ? 0 : Math.PI;
  }
  // Calculo de phi usando atan2 para manejar los signos correctamente
  phi = Math.atan2(-initVelocity / omega, initPosition);

  // Normalizamos phi al rango [0, 2 * PI]
  if (phi < 0) {
    phi += 2 * Math.PI;
  }

  return phi;
};

// Función para calcular el periodo del péndulo amortiguado
export const calculatePeriod = (omegaF) => {
  return (2 * Math.PI) / omegaF;
};

// Función para calcular la frecuencia
export const calculateFrequency = (period) => {
  return 1 / period;
};

// SECCION FUNCIONES DE TIEMPO

// Función para calcular la posición angular theta en función del tiempo
export const calculatePosition = (
  time,
  initAmplitude,
  phi,
  omega,
  omegaF,
  F0,
  inertia
) => {
  // Primera parte: Movimiento natural
  const naturalPart = initAmplitude * Math.cos(omega * time + phi);

  // Segunda parte: Movimiento forzado por la fuerza externa
  const forcedPart =
    (F0 / (inertia * (Math.pow(omega, 2) - Math.pow(omegaF, 2)))) *
    Math.cos(omegaF * time);

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
  const naturalVelocity = -initAmplitude * omega * Math.sin(omega * time + phi);

  // Segunda parte: Movimiento forzado por la fuerza externa
  const forcedVelocity =
    (-(F0 * omegaF) / (inertia * (Math.pow(omega, 2) - Math.pow(omegaF, 2)))) *
    Math.sin(omegaF * time);

  // Retornamos la suma de ambas partes
  return naturalVelocity + forcedVelocity;
};

// Función para calcular la aceleración angular en función del tiempo
export const calculateAcceleration = (time) => {
  return 0;
};

// Función para calcular la amplitud en función del tiempo
export const calculateAmplitude = (time, initAmplitude) => {
  return initAmplitude;
};

// Función para calcular la energía mecánica total del sistema
export const calculateEnergy = (velocity, position, inertia, k) => {
  // Energía cinética: 1/2 * I * omega^2
  const kineticEnergy = 0.5 * inertia * velocity ** 2;

  // Energía potencial: 1/2 * k * theta^2
  const potentialEnergy = 0.5 * k * position ** 2;

  // Energía total
  const totalEnergy = kineticEnergy + potentialEnergy;

  return totalEnergy;
};
