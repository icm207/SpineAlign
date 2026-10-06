import { z } from 'zod';

export const pointSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
});

export const createPatientSchema = z.object({
  code: z.string().trim().min(3).max(32).optional(),
  name: z.string().trim().min(1).max(120).optional(),
  birthDate: z.coerce.date().optional(),
});

export const createAssessmentSchema = z.object({
  patientId: z.string().uuid(),
  leftShoulder: pointSchema,
  rightShoulder: pointSchema,
  imageWidth: z.number().int().positive().max(50000),
  imageHeight: z.number().int().positive().max(50000),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
