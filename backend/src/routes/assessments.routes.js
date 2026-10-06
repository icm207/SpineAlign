import { Router } from 'express';
import fs from 'node:fs';
import { fileTypeFromFile } from 'file-type';
import { prisma } from '../lib/prisma.js';
import { upload } from '../middleware/upload.js';
import { createAssessmentSchema } from '../validation/schemas.js';
import { computeShoulderInclination } from '../domain/shoulderAngle.js';
import { classifyInclination } from '../domain/classification.js';
import { generateAssessmentReport } from '../services/report.js';

export const assessmentsRouter = Router();

const MIME_OK = new Set(['image/jpeg', 'image/png', 'image/webp']);

assessmentsRouter.post('/patients/:patientId/assessments', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Falta la imagen' });

    // Validar el tipo REAL del archivo (no solo la extensión)
    const type = await fileTypeFromFile(req.file.path);
    if (!type || !MIME_OK.has(type.mime)) {
      fs.unlinkSync(req.file.path);
      return res.status(415).json({ error: 'El archivo no es una imagen JPG/PNG/WebP válida' });
    }

    // Los campos de coordenadas llegan como JSON en partes del multipart
    const body = {
      patientId: req.params.patientId,
      leftShoulder: JSON.parse(req.body.leftShoulder),
      rightShoulder: JSON.parse(req.body.rightShoulder),
      imageWidth: Number(req.body.imageWidth),
      imageHeight: Number(req.body.imageHeight),
    };
    const data = createAssessmentSchema.parse(body);

    const patient = await prisma.patient.findUnique({ where: { id: data.patientId } });
    if (!patient) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }

    const metrics = computeShoulderInclination(data.leftShoulder, data.rightShoulder, {
      width: data.imageWidth,
      height: data.imageHeight,
    });
    const classification = classifyInclination(metrics.angleDeg);

    const assessment = await prisma.assessment.create({
      data: {
        patientId: data.patientId,
        imagePath: req.file.filename,
        leftShoulder: data.leftShoulder,
        rightShoulder: data.rightShoulder,
        imageWidth: data.imageWidth,
        imageHeight: data.imageHeight,
        angleDeg: metrics.angleDeg,
        heightDiffPx: metrics.heightDiffPx,
        heightDiffPct: metrics.heightDiffPct,
        classification,
      },
    });
    res.status(201).json(assessment);
  } catch (err) {
    if (req.file) fs.unlink(req.file.path, () => {});
    next(err);
  }
});

assessmentsRouter.get('/patients/:patientId/assessments', async (req, res, next) => {
  try {
    const list = await prisma.assessment.findMany({
      where: { patientId: req.params.patientId },
      orderBy: { date: 'asc' },
    });
    res.json(list);
  } catch (err) {
    next(err);
  }
});

assessmentsRouter.get('/assessments/:id', async (req, res, next) => {
  try {
    const a = await prisma.assessment.findUnique({ where: { id: req.params.id } });
    if (!a) return res.status(404).json({ error: 'Evaluación no encontrada' });
    res.json(a);
  } catch (err) {
    next(err);
  }
});

assessmentsRouter.get('/assessments/:id/report', async (req, res, next) => {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: req.params.id },
      include: { patient: true },
    });
    if (!assessment) return res.status(404).json({ error: 'Evaluación no encontrada' });
    generateAssessmentReport({ assessment, patient: assessment.patient }, res);
  } catch (err) {
    next(err);
  }
});

assessmentsRouter.get('/assessments/:id/image', async (req, res, next) => {
  try {
    const a = await prisma.assessment.findUnique({ where: { id: req.params.id } });
    if (!a) return res.status(404).json({ error: 'Evaluación no encontrada' });
    const path = `${process.env.UPLOAD_DIR || './uploads'}/${a.imagePath}`;
    res.type((await fileTypeFromFile(path))?.mime ?? 'application/octet-stream');
    fs.createReadStream(path).pipe(res);
  } catch (err) {
    next(err);
  }
});
