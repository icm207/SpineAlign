import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.routes.js';
import { patientsRouter } from './routes/patients.routes.js';
import { assessmentsRouter } from './routes/assessments.routes.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigins }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', apiLimiter);

app.use('/api/auth', authRouter);
app.use('/api/patients', requireAuth, patientsRouter);
// assessments router define /patients/:id/assessments y /assessments/:id
app.use('/api', requireAuth, assessmentsRouter);

app.use(notFound);
app.use(errorHandler);
