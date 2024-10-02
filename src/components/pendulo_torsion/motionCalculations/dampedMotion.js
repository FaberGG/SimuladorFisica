// SECCION CONDICIONES INICIALES
const dampedType = (omega, gamma) => {
  if (omega == gamma) {
    return "criticallyDamped";
  }
  if (omega > gamma) {
    return "subDamped";
  }
  if (omega < gamma) {
    return "overDamped";
  }
};

const calculateCriticallyDamped = (time, initAmplitude, gamma) => {
  return (initAmplitude + initAmplitude) * Math.exp(-gamma * time);
};

const calculateSubDamped = (time, initAmplitude, omegaD, gamma, phi) => {
  return (
    initAmplitude *
    Math.exp(-gamma * time) *
    Math.cos(Math.pow(omegaD, 2) - Math.pow(gamma, 2) * time + phi)
  );
};

const calculateOverDamped = (time, initAmplitude, gamma1, gamma2) => {
  return (
    initAmplitude *
    (Math.exp(
      -gamma1 + Math.sqrt(Math.pow(gamma1, 2) - Math.pow(omegaD)) * time
    ) +
      Math.exp(
        -gamma2 + Math.sqrt(Math.pow(gamma2, 2) - Math.pow(omegaD)) * time
      ))
  );
};
export const calculateInitAmplitude = (
  phi,
  initPosition,
  initVelocity,
  omegaD
) => {
  return Math.sqrt(
    Math.pow(initPosition, 2) + Math.pow(initVelocity / omegaD, 2)
  );
};

// Función para calcular la frecuencia angular natural (omega)
export const calculateOmega = (k, inertia) => {
  return Math.sqrt(k / inertia);
};

export const calculateOmegaD = (omega, gamma) => {
  return Math.sqrt(Math.pow(omega, 2) - Math.pow(gamma / 2, 2));
};

// Función para calcular amortiguamineto gamma r
export const calculateGamma = (b, inertia) => {
  return (b / 2) * inertia;
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
export const calculatePeriod = (omegaD) => {
  return (2 * Math.PI) / omegaD;
};

// Función para calcular la frecuencia
export const calculateFrequency = (period) => {
  return 1 / period;
};

// SECCION FUNCIONES DE TIEMPO

// Función principal para calcular la posición angular en función del tiempo
export const calculatePosition = (
  time,
  initAmplitude,
  omega,
  omegaD,
  gamma,
  phi
) => {
  const type = dampedType(omega, gamma);

  switch (type) {
    case "criticallyDamped":
      return calculateCriticallyDamped(time, initAmplitude, gamma);

    case "subDamped":
      return calculateSubDamped(time, initAmplitude, omegaD, gamma, phi);

    case "overDamped":
      const gamma1 = gamma / 2;
      const gamma2 = gamma / 3; // Valores aproximados, puedes ajustarlos según tu sistema
      return calculateOverDamped(time, initAmplitude, gamma1, gamma2);

    default:
      return 0; // Caso predeterminado
  }
};

export const calculateAmplitude = (time, initAmplitude, gamma) => {
  return initAmplitude * Math.exp(-gamma * time);
};

// Función para calcular la energía mecánica total del sistema
export const calculateEnergy = (velocity, position, inertia, k) => {
  return 0.5 * (inertia * Math.pow(velocity, 2) + k * Math.pow(position, 2));
};
