import { describe, it, expect } from 'vitest';
import { computeShoulderInclination } from '../src/domain/shoulderAngle.js';

const img = { width: 1000, height: 800 };

describe('computeShoulderInclination', () => {
  it('hombros a la misma altura → ángulo 0 y diferencia 0', () => {
    const r = computeShoulderInclination({ x: 300, y: 400 }, { x: 700, y: 400 }, img);
    expect(r.angleDeg).toBe(0);
    expect(r.heightDiffPx).toBe(0);
    expect(r.heightDiffPct).toBe(0);
  });

  it('hombro derecho más bajo → ángulo positivo', () => {
    const r = computeShoulderInclination({ x: 0, y: 0 }, { x: 100, y: 100 }, img);
    expect(r.angleDeg).toBeCloseTo(45, 1);
    expect(r.heightDiffPx).toBe(100);
    expect(r.heightDiffPct).toBe(10);
  });

  it('hombro derecho más alto → ángulo negativo', () => {
    const r = computeShoulderInclination({ x: 0, y: 100 }, { x: 100, y: 0 }, img);
    expect(r.angleDeg).toBeCloseTo(-45, 1);
    expect(r.heightDiffPx).toBe(100);
  });

  it('heightDiffPct usa el ancho de la imagen como referencia', () => {
    const r = computeShoulderInclination({ x: 0, y: 0 }, { x: 50, y: 25 }, { width: 500, height: 500 });
    expect(r.heightDiffPct).toBe(5);
  });

  it('lanza error con coordenadas inválidas', () => {
    expect(() => computeShoulderInclination({ x: NaN, y: 0 }, { x: 1, y: 1 }, img)).toThrow();
    expect(() => computeShoulderInclination(null, { x: 1, y: 1 }, img)).toThrow();
  });

  it('lanza error con dimensiones inválidas', () => {
    expect(() => computeShoulderInclination({ x: 0, y: 0 }, { x: 1, y: 1 }, { width: 0, height: 100 })).toThrow();
  });
});
