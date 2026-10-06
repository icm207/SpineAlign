/**
 * Clasificación de la inclinación según umbrales configurables.
 *
 * Los umbrales por defecto pueden sobreescribirse con variables de entorno
 * (ver .env.example) o pasando un objeto `thresholds` explícito
 * (útil en pruebas).
 *
 * Umbrales por defecto (grados absolutos):
 *   - symmetric: |ángulo| < 2°
 *   - mild:      2° ≤ |ángulo| < 5°
 *   - moderate:  5° ≤ |ángulo| < 10°
 *   - marked:    |ángulo| ≥ 10°
 */

export const CLASSIFICATIONS = Object.freeze({
  SYMMETRIC: 'symmetric',
  MILD: 'mild',
  MODERATE: 'moderate',
  MARKED: 'marked',
});

export function defaultThresholds() {
  return {
    symmetricMax: Number(process.env.THRESHOLD_SYMMETRIC_MAX ?? 2),
    mildMax: Number(process.env.THRESHOLD_MILD_MAX ?? 5),
    moderateMax: Number(process.env.THRESHOLD_MODERATE_MAX ?? 10),
  };
}

/**
 * @param {number} angleDeg Ángulo firmado en grados.
 * @param {{symmetricMax?: number, mildMax?: number, moderateMax?: number}} [thresholds]
 * @returns {'symmetric'|'mild'|'moderate'|'marked'}
 */
export function classifyInclination(angleDeg, thresholds = defaultThresholds()) {
  if (typeof angleDeg !== 'number' || Number.isNaN(angleDeg)) {
    throw new Error('angleDeg debe ser un número');
  }
  const t = { ...defaultThresholds(), ...thresholds };
  if (!(t.symmetricMax < t.mildMax && t.mildMax < t.moderateMax)) {
    throw new Error('Umbrales inválidos: se requiere symmetricMax < mildMax < moderateMax');
  }

  const abs = Math.abs(angleDeg);
  if (abs < t.symmetricMax) return CLASSIFICATIONS.SYMMETRIC;
  if (abs < t.mildMax) return CLASSIFICATIONS.MILD;
  if (abs < t.moderateMax) return CLASSIFICATIONS.MODERATE;
  return CLASSIFICATIONS.MARKED;
}
