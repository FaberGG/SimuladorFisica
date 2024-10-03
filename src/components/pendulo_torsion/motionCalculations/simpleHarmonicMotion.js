import { PositionMesh } from "@react-three/drei";
import { sin, velocity } from "three/webgpu";

export function calculatePhi(initPosition, initVelocity, omega) {
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
}

export function calculateInitAmplitude(phi, initPosition, initVelocity, omega) {
  // Si la posición inicial es cero, se despeja A de la ec. de vel inicial
  if (initPosition == 0) {
    // Calcular A a partir de la velocidad inicial
    return -initVelocity / (omega * Math.sin(phi));
  }
  // Si ambas no son cero, dividir las ecuaciones para evitar indeterminaciones
  return initPosition / Math.cos(phi);
  //return initPosition / Math.cos(phi - Math.atan(k / inertia));
}

export function calculateOmega(inertia, k) {
  // Calcula la frecuencia angular omega (frecuencia natural)
  // Parámetros: definir los parametros
  return Math.sqrt(k / inertia);
}

export function calculatePeriod(omega) {
  // Calcula el período del péndulo (2π / omega)
  // variables: { omega } -> frecuencia natural
  return (2 * Math.PI) / omega;
}

export function calculateFrequency(period) {
  // Calcula la frecuencia (1 / período)
  // variables: { period } -> período del péndulo
  return 1 / period;
}

// Sección de funciones dependientes del tiempo

export function calculatePosition(time, initAmplitude, phi, omega) {
  // Parámetros: definir los parametros
  return initAmplitude * Math.cos(omega * time + phi);
}

export function calculateVelocity(time, initAmplitude, phi, omega) {
  // Parámetros: definir los parametros
  return -initAmplitude * omega * Math.sin(omega * time + phi);
}

export function calculateEnergy(velocity, position, inertia, k) {
  // Parámetros: definir los parametros
  return 0.5 * (inertia * Math.pow(velocity, 2) + k * Math.pow(position, 2));
}
