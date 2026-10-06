import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { createPatientSchema } from '../validation/schemas.js';

export const patientsRouter = Router();

patientsRouter.post('/', async (req, res, next) => {
  try {
    const data = createPatientSchema.parse(req.body);
    const code = data.code ?? `P-${randomBytes(3).toString('hex').toUpperCase()}`;
    const patient = await prisma.patient.create({
      data: { code, name: data.name ?? null, birthDate: data.birthDate ?? null },
    });
    res.status(201).json(patient);
  } catch (err) {
    if (err?.code === 'P2002') return res.status(409).json({ error: 'El código ya existe' });
    next(err);
  }
});

patientsRouter.get('/', async (req, res, next) => {
  try {
    const patients = await prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(patients);
  } catch (err) {
    next(err);
  }
});
