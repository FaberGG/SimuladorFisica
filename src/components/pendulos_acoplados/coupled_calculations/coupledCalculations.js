export const calculateVelocity = (time, amplitude, omega, phi) => {
  // Retorna la velocidad en función del tiempo.
};

export const calculateOmega = (inertia, length) => {
  // Calcula la frecuencia natural (omega) del sistema acoplado.
};

export const calculatePhi = (amplitude, position) => {
  // Calcula el ángulo de fase (phi) inicial.
};

export const calculatePeriod = (omega) => {
  // Calcula el periodo del movimiento.
};

export const calculateEnergy = (amplitude, omega, inertia) => {
  // Calcula la energía total del sistema.
};

// Función para resolver la ecuación cuadrática y calcular las frecuencias normales omega_1 y omega_2
export function calculateFrequencies(inertia, inertia2, K1, K2, Kc) {
  let A = inertia * inertia2;
  let B = -((K1 + Kc) * inertia2 + (K2 + Kc) * inertia);
  let C = (K1 + Kc) * (K2 + Kc) - Kc * Kc;

  let discriminant = B * B - 4 * A * C;
  if (discriminant < 0) {
    return null;
  }

  let sqrtDiscriminant = Math.sqrt(discriminant);

  // Frecuencias normales (omega_1 y omega_2)
  let omega_squared = (-B - sqrtDiscriminant) / (2 * A);
  let omega2_squared = (-B + sqrtDiscriminant) / (2 * A);

  let omega = Math.sqrt(omega_squared);
  let omega2 = Math.sqrt(omega2_squared);

  return { omega, omega2 };
}

// Exportamos la función para calcular las relaciones entre amplitudes A1/B1 y A2/B2
function calculateAmplitudeRelation(inertia, inertia2, K1, K2, omega, omega2) {
  // Relación de amplitud para el primer modo normal: A1 / B1
  const A1_B1 = 0;

  // Relación de amplitud para el segundo modo normal: A2 / B2
  const A2_B2 = 0;

  // Devolvemos un objeto con las relaciones de amplitud
  return {
    A1_B1: A1_B1,
    A2_B2: A2_B2,
  };
}

// Función para calcular θ1(t)
export function position1(time, A1, A2, omega, omega2, phi) {
  return A1 * Math.cos(omega * time + phi) + A2 * Math.cos(omega2 * time + phi);
}

// Función para calcular θ2(t)
export function position2(time, B1, B2, omega, omega2, phi) {
  return B1 * Math.cos(omega * time + phi) + B2 * Math.cos(omega2 * time + phi);
}
