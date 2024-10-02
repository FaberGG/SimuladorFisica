import * as SimpleHarmonic from "./simpleHarmonicMotion";
import * as Damped from "./dampedMotion";
import * as ForcedUndamped from "./forcedUndampedMotion";
import * as ForcedDamped from "./forcedDampedMotion";

export function getMotionCalculations(motionType) {
  switch (motionType) {
    case "simple":
      return SimpleHarmonic;
    case "damped":
      return Damped;
    case "forcedUndamped":
      return ForcedUndamped;
    case "forcedDamped":
      return ForcedDamped;
    default:
      throw new Error(`Tipo de movimiento no soportado: ${motionType}`);
  }
}
