import { changeQuadrant } from "./globalCalculations";
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
  gamma
) => {
  let delta = (omegaF < omega) ? 0 : Math.PI;
  return (
    initAmplitude * Math.exp(-gamma * time) * Math.cos(omegaD * time + delta)
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


// Función para calcular la amplitud inicial
export const calculateInitAmplitude = (Fo, k, omegaF, omega, inertia, gamma) => {
  // Amplitud inicial angular (en radianes)
  let A;
  if (omegaF == 0){
    A = Fo / k 
  } else{
    A = (Fo / inertia) / (Math.sqrt( Math.pow( (Math.pow(omega, 2) - Math.pow(omegaF, 2)), 2) + Math.pow((2 * gamma * omegaF), 2) ));
  }
  return A; // Reemplazar con el valor correcto
};

// Función para calcular amortiguamineto gamma r
export const calculateGamma = (b, inertia) => {
  return b / (2 * inertia);
};

// SECCION FUNCIONES DE TIEMPO

// Función para calcular la posición angular theta en función del tiempo
export const calculatePosition = (time, omega, omegaF, initAmplitude, phi) => {
  let delta = (omegaF < omega) ? 0 : Math.PI;
  // Primera parte: Movimiento amortiguado
  const dampedPart = initAmplitude * Math.cos(omega * time + phi);

  // Segunda parte: Movimiento forzado por la fuerza externa
  const forcedPart = initAmplitude * Math.cos(omegaF * time + delta);

  // Retornamos la suma de ambas partes
  return dampedPart + forcedPart;
};

// Función para calcular la velocidad angular en función del tiempo
export const calculateVelocity = (time, omegaF, initAmplitude, phi) => {
  // Primera parte: Movimiento amortiguada
  const dampedVelocity = -initAmplitude * omega * Math.sin(omega * time + phi);

  // Segunda parte: Movimiento forzado por la fuerza externa
  const forcedVelocity =
    (-(F0 * omegaF) / (inertia * (Math.pow(omega, 2) - Math.pow(omegaF, 2)))) *
    Math.sin(omegaF * time);

  // Retornamos la suma de ambas partes
  return dampedVelocity + forcedVelocity;
};

export const calculateDelta = (omega, omegaF, gamma) =>{
  let a = (2*gamma* omegaF);
  let b = (Math.pow(omega, 2) - Math.pow(omegaF , 2));
  let deltaAbs = Math.abs(Math.atan(a / b));
  console.log(deltaAbs)
  if(a > 0){
    return (b>0) ? deltaAbs : changeQuadrant(deltaAbs, 2); 
  }else{
    return (b>0) ? changeQuadrant(deltaAbs, 4) : changeQuadrant(deltaAbs, 3); 
  }
}
// Función para calcular la amplitud en función del tiempo
export const calculateAmplitude = (time, initAmplitude) => {
  return initAmplitude;
};

// Función para calcular la energía mecánica total del sistema
export const calculateEnergy = (time, initAmplitude, gamma, omegaF, delta, inertia, k) => {
  const Potencia = 2 * gamma * inertia * Math.pow(initAmplitude, 2) * Math.pow(omegaF, 2) * Math.pow(Math.sin(omegaF * time - delta), 2);
  return Potencia;
};
