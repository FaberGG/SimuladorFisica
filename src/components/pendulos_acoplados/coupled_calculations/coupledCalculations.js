export const checkVibrationMode = () => {
  //devuelve 1 para el primer modo
  //devuelve 2 para el segundo modo
  //devuelve 0 para ninguno
  return 1;
};

// Función para resolver la ecuación cuadrática y calcular las frecuencias normales omega_1 y omega_2
export function calculateOmegas(inertia, inertia2, K1, K2) {
  let omega = Math.sqrt(
    (2 * inertia2 * K1 +
      inertia * K2 +
      Math.sqrt(
        4 * Math.pow(inertia2, 2) * Math.pow(K1, 2) +
          Math.pow(inertia, 2) * Math.pow(K2, 2)
      )) /
      (2 * inertia * inertia2)
  );
  let omega2 = Math.sqrt(
    (2 * inertia2 * K1 +
      inertia * K2 -
      Math.sqrt(
        4 * Math.pow(inertia2, 2) * Math.pow(K1, 2) +
          Math.pow(inertia, 2) * Math.pow(K2, 2)
      )) /
      (2 * inertia * inertia2)
  );

  return { omega: omega, omega2: omega2 };
}

// Exportamos la función para calcular las relaciones entre amplitudes A1/B1 y A2/B2
export const calculateAmplitudeRelation = (k, omega, omega2) => {
  // Relación de amplitud para el primer modo normal: A1 / B1
  const M = k / (2 * k - Math.pow(omega, 2));

  // Relación de amplitud para el segundo modo normal: A2 / B2
  const N = k / (2 * k - Math.pow(omega2, 2));

  // Devolvemos un objeto con las relaciones de amplitud
  return {
    M: M,
    N: N,
  };
};

const auxCalculateA1 = (initPosition, initPosition2, M, N) => {
  return (M * initPosition2 - initPosition) / (M / N - 1);
};
export const calculateAmplitude = (initPosition, initPosition2, M, N) => {
  const A2 = auxCalculateA1(initPosition, initPosition2, M, N);
  const A1 = initPosition - A2;
  return { A1: A1, A2: A2 };
};
export const calculateAmplitude2 = (initPosition, initPosition2, M, N) => {
  const A2 = auxCalculateA1(initPosition, initPosition2, M, N);
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

//Calcular la ecuacion de movimiento a mostrar (en string)
export const calculateStrEcuation = (time, A, B, omega1, omega2, phi) => {
  //Para acoplado, phi = 0
  //A, B puede ser A1 A2 cuando es el pendulo 1
  //A, B puede ser B1 B2 cuando es el pendulo 2
  // (las variables correspondientes se pasan en los parametros)

  let strEcuation = "NO IMPLEMENTADO";
  return strEcuation;
};
