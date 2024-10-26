//funcion para calcular el cuadrante
import { changeQuadrant, checkQuadrant } from "./globalCalculations";
export * from "./globalCalculations";

// SECCION CONDICIONES INICIALES
export const checkDampedType = (omega, gamma) => {
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

const calculatePositionCriticallyDamped = (time, initAmplitude, gamma) => {
  return (initAmplitude.c1 + initAmplitude.c2 * time) * Math.exp(-gamma * time);
};

const calculatePositionSubDamped = (
  time,
  initAmplitude,
  omegaD,
  gamma,
  phi
) => {
  return (
    initAmplitude * Math.exp(-gamma * time) * Math.cos(omegaD * time + phi)
  );
};

const calculatePositionOverDamped = (time, initAmplitude, omega, gamma) => {
  return (
    initAmplitude.c1 *
      Math.exp(
        (-gamma + Math.sqrt(Math.pow(gamma, 2) - Math.pow(omega, 2))) * time
      ) +
    initAmplitude.c2 *
      Math.exp(
        (-gamma - Math.sqrt(Math.pow(gamma, 2) - Math.pow(omega, 2))) * time
      )
  );
};
export const calculateInitAmplitude = (
  phi,
  initPosition,
  initVelocity,
  omega,
  omegaD,
  gamma,
  dampedType
) => {
  switch (dampedType) {
    case "criticallyDamped":
      return { c1: initPosition, c2: initVelocity + initPosition * gamma };
    case "subDamped":
      if (initPosition != 0) return initPosition / Math.cos(phi);
      return -initVelocity / (gamma * Math.cos(phi) + omegaD * Math.sin(phi));
    case "overDamped":
      const m1 = -gamma + Math.sqrt(Math.pow(gamma, 2) - Math.pow(omega, 2));
      const m2 = -gamma - Math.sqrt(Math.pow(gamma, 2) - Math.pow(omega, 2));
      const c2 = (initVelocity - initPosition * m1) / (m2 - m1);
      return { c1: initPosition - c2, c2: c2 };
    default:
      return 0;
  }
};

export const calculateOmegaD = (omega, gamma) => {
  return Math.sqrt(Math.pow(omega, 2) - Math.pow(gamma / 2, 2));
};

// Función para calcular amortiguamineto gamma r
export const calculateGamma = (b, inertia) => {
  return b / (2 * inertia);
};

// Función para calcular amortiguamineto phi
export const calculatePhi = (initPosition, initVelocity, omegaD, gamma) => {
  let phi = 0;
  const restriction = (phi) => (-gamma * Math.cos(phi)) / omegaD;
  // Caso cuando la posición inicial es 0
  if (initPosition == 0) {
    return initVelocity > 0 ? (3 * Math.PI) / 2 : Math.PI / 2;
  }
  // Caso cuando la velocidad inicial es 0
  if (initVelocity == 0) {
    phi = Math.abs(Math.atan(-gamma / omegaD));
    return initPosition > 0 ? changeQuadrant(phi, 4) : changeQuadrant(phi, 2);
  }

  //calculo la arco-tangente
  phi = Math.abs(
    Math.atan(-gamma / omegaD - initVelocity / (omegaD * initPosition))
  );

  //calculo el valor de la restriccion
  if (initPosition > 0) {
    if (initVelocity > 0) {
      phi = changeQuadrant(phi, 4);
      if (Math.sin(phi) > restriction(phi))
        console.log("Phi fuera del rango: no cumple sin<0, cos>0, tan<0");
    } else {
      phi =
        gamma > initVelocity / initPosition
          ? changeQuadrant(phi, 1)
          : changeQuadrant(phi, 4);
      if (Math.sin(phi) < restriction(phi))
        console.log(
          "Phi fuera del rango CI1>0 y CI2<0 cuadrante de phi:" +
            checkQuadrant(phi)
        );
    }
  } else {
    if (initVelocity > 0) {
      phi =
        gamma > initVelocity / initPosition
          ? changeQuadrant(phi, 3)
          : changeQuadrant(phi, 2);
      if (Math.sin(phi) > restriction(phi))
        console.log(
          "Phi fuera del rango CI1<0 y CI2>0 cuadrante de phi:" +
            checkQuadrant(phi)
        );
    } else {
      phi = changeQuadrant(phi, 2);
      if (Math.sin(phi) < restriction(phi))
        console.log(
          "Phi fuera del rango CI1<0 y CI2<0 cuadrante de phi:" +
            checkQuadrant(phi)
        );
    }
  }
  return phi;
};

// SECCION FUNCIONES DE TIEMPO

// Función principal para calcular la posición angular en función del tiempo
export const calculatePosition = (
  time,
  initAmplitude,
  omega,
  omegaD,
  gamma,
  phi,
  dampedType
) => {
  const type = dampedType;

  switch (type) {
    case "criticallyDamped":
      return calculatePositionCriticallyDamped(time, initAmplitude, gamma);

    case "subDamped":
      return calculatePositionSubDamped(
        time,
        initAmplitude,
        omegaD,
        gamma,
        phi
      );

    case "overDamped":
      return calculatePositionOverDamped(time, initAmplitude, omega, gamma);

    default:
      return 0;
  }
};

export const calculateAmplitude = (time, initAmplitude, gamma) => {
  return initAmplitude * Math.exp(-gamma * time);
};

// Función para calcular la energía mecánica total del sistema
export const calculateEnergy = (velocity, position, inertia, k) => {
  //Si es subdamped{
  //}else { }
  return 0.5 * (inertia * Math.pow(velocity, 2) + k * Math.pow(position, 2));
};
