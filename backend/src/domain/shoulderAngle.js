/**
 * Cálculo puro de la inclinación de hombros.
 * Sin dependencias externas: testeable de forma aislada.
 *
 * Convenio de coordenadas de imagen: origen arriba-izquierda,
 * eje X a la derecha, eje Y hacia ABAJO.
 *
 * angleDeg > 0  → el hombro derecho está más BAJO que el izquierdo.
 * angleDeg < 0  → el hombro derecho está más ALTO que el izquierdo.
 */

/**
 * @typedef {{x: number, y: number}} Point
 */

/**
 * @param {Point} leftShoulder  Hombro izquierdo del paciente (en la imagen).
 * @param {Point} rightShoulder Hombro derecho del paciente (en la imagen).
 * @param {{width: number, height: number}} imageSize Dimensiones de la imagen.
 * @returns {{angleDeg: number, heightDiffPx: number, heightDiffPct: number}}
 */
export function computeShoulderInclination(leftShoulder, rightShoulder, imageSize) {
  validatePoint(leftShoulder, 'leftShoulder');
  validatePoint(rightShoulder, 'rightShoulder');
  if (!imageSize || !(imageSize.width > 0) || !(imageSize.height > 0)) {
    throw new Error('imageSize debe tener width y height positivos');
  }

  const dx = rightShoulder.x - leftShoulder.x;
  const dy = rightShoulder.y - leftShoulder.y;

  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  const heightDiffPx = Math.abs(leftShoulder.y - rightShoulder.y);
  const heightDiffPct = (heightDiffPx / imageSize.width) * 100;

  return {
    angleDeg: round2(angleDeg),
    heightDiffPx: round2(heightDiffPx),
    heightDiffPct: round2(heightDiffPct),
  };
}

function validatePoint(p, name) {
  if (!p || typeof p.x !== 'number' || typeof p.y !== 'number' || Number.isNaN(p.x) || Number.isNaN(p.y)) {
    throw new Error(`${name} debe ser un punto {x, y} con números válidos`);
  }
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
