import * as SimpleHarmonic from "./simpleHarmonicMotion";
import * as Damped from "./dampedMotion";
import * as Forced from "./forcedMotion";

export function getMotionCalculations(motionType) {
  switch (motionType) {
    case "simple":
      return SimpleHarmonic;
    case "damped":
      return Damped;
    case "forcedUndamped":
      return Forced;
    default:
      throw new Error(`Tipo de movimiento no soportado: ${motionType}`);
  }
}
