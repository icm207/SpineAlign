import { describe, it, expect } from 'vitest';
import { classifyInclination, CLASSIFICATIONS } from '../src/domain/classification.js';

describe('classifyInclination', () => {
  it('< 2° es simétrico (incluye signo negativo)', () => {
    expect(classifyInclination(0)).toBe(CLASSIFICATIONS.SYMMETRIC);
    expect(classifyInclination(1.9)).toBe(CLASSIFICATIONS.SYMMETRIC);
    expect(classifyInclination(-1.5)).toBe(CLASSIFICATIONS.SYMMETRIC);
  });

  it('2° a < 5° es leve', () => {
    expect(classifyInclination(2)).toBe(CLASSIFICATIONS.MILD);
    expect(classifyInclination(-4.9)).toBe(CLASSIFICATIONS.MILD);
  });

  it('5° a < 10° es moderado', () => {
    expect(classifyInclination(5)).toBe(CLASSIFICATIONS.MODERATE);
    expect(classifyInclination(-9.99)).toBe(CLASSIFICATIONS.MODERATE);
  });

  it('>= 10° es marcado', () => {
    expect(classifyInclination(10)).toBe(CLASSIFICATIONS.MARKED);
    expect(classifyInclination(-25)).toBe(CLASSIFICATIONS.MARKED);
  });

  it('acepta umbrales personalizados', () => {
    const t = { symmetricMax: 1, mildMax: 3, moderateMax: 6 };
    expect(classifyInclination(1.5, t)).toBe(CLASSIFICATIONS.MILD);
    expect(classifyInclination(7, t)).toBe(CLASSIFICATIONS.MARKED);
  });

  it('rechaza umbrales incoherentes', () => {
    expect(() => classifyInclination(3, { symmetricMax: 5, mildMax: 4, moderateMax: 10 })).toThrow();
  });

  it('lanza error con ángulo inválido', () => {
    expect(() => classifyInclination(NaN)).toThrow();
  });
});
