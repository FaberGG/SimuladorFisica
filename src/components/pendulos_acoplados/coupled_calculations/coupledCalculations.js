import { roundDecimal } from "../../pendulo_torsion/motionCalculations/globalCalculations";

export const checkVibrationMode = (A1, A2, B1, B2) => {
  // Verificar si estamos en el modo en oposición (Modo 2)
  if (roundDecimal(A1, 2) == 0 && roundDecimal(B1, 2) == 0) {
    return 2; // Modo en oposición
  }

  // Verificar si estamos en el modo en fase (Modo 1)
  if (roundDecimal(A2, 2) == 0 && roundDecimal(B2, 2) == 0) {
    return 1; // Modo en fase
  }
  return 0;
};

// Función para resolver la ecuación cuadrática y calcular las frecuencias normales omega_1 y omega_2
export function calculateOmegas(inertia, inertia2, K1, K2) {
  let omega = Math.sqrt(
    (2 * inertia2 * K1 +
      inertia * K2 -
      Math.sqrt(
        4 * Math.pow(inertia2, 2) * Math.pow(K1, 2) +
          Math.pow(inertia, 2) * Math.pow(K2, 2)
      )) /
      (2 * inertia * inertia2)
  );
  let omega2 = Math.sqrt(
    (2 * inertia2 * K1 +
      inertia * K2 +
      Math.sqrt(
        4 * Math.pow(inertia2, 2) * Math.pow(K1, 2) +
          Math.pow(inertia, 2) * Math.pow(K2, 2)
      )) /
      (2 * inertia * inertia2)
  );
  console.log({
    description: "omegas elevados al cuadrado",
    omega_pow2: Math.pow(omega, 2),
    omega2_pow2: Math.pow(omega2, 2),
  });
  return { omega: omega, omega2: omega2 };
}

// Exportamos la función para calcular las relaciones entre amplitudes A1/B1 y A2/B2
export const calculateAmplitudeRelation = (k, omega, omega2, inertia) => {
  // Relación de amplitud para el primer modo normal: A1 / B1
  const M = k / (2 * k - Math.pow(omega, 2) * inertia);

  // Relación de amplitud para el segundo modo normal: A2 / B2
  const N = k / (2 * k - Math.pow(omega2, 2) * inertia);

  console.log({
    description: "Relacion entre amplitudes A1/B1=M, A2/B2=N",
    M: M,
    N: N,
  });
  // Devolvemos un objeto con las relaciones de amplitud
  return {
    M: M,
    N: N,
  };
};

const auxCalculateA2 = (initPosition, initPosition2, M, N) => {
  return (M * initPosition2 - initPosition) / (M / N - 1);
};
export const calculateAmplitude = (initPosition, initPosition2, M, N) => {
  const A2 = auxCalculateA2(initPosition, initPosition2, M, N);
  const A1 = initPosition - A2;

  return { A1: A1, A2: A2 };
};
export const calculateAmplitude2 = (initPosition, initPosition2, M, N) => {
  const A2 = auxCalculateA2(initPosition, initPosition2, M, N);
  const A1 = initPosition - A2;

  const B1 = A1 / M;
  const B2 = A2 / N;
  return { B1: B1, B2: B2 };
};

// Función para calcular θ1(t)
export function position1(time, A1, A2, omega, omega2, phi) {
  return A1 * Math.cos(omega * time + phi) + A2 * Math.cos(omega2 * time + phi);
}

// Función para calcular θ2(t)
export function position2(time, B1, B2, omega, omega2, phi) {
  return B1 * Math.cos(omega * time + phi) + B2 * Math.cos(omega2 * time + phi);
}

export const calculateStrEcuation = (time, A, B, omega, omega2, phi = 0) => {
  const time_r = roundDecimal(time, 2);
  const omega_r = roundDecimal(omega, 2);
  const omega2_r = roundDecimal(omega2, 2);
  const A_r = roundDecimal(A, 2);
  const B_r = roundDecimal(B, 2);

  let strEcuation = `${A_r} * cos(${omega_r} * ${time_r} + ${phi}) + ${B_r} * cos(${omega2_r} * ${time_r} + ${phi})`;

  return strEcuation;
};
