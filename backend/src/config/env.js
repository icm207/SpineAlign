import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET debe tener al menos 8 caracteres'),
  JWT_EXPIRES_IN: z.string().default('12h'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  THRESHOLD_SYMMETRIC_MAX: z.coerce.number().default(2),
  THRESHOLD_MILD_MAX: z.coerce.number().default(5),
  THRESHOLD_MODERATE_MAX: z.coerce.number().default(10),
  UPLOAD_MAX_MB: z.coerce.number().positive().default(5),
  UPLOAD_DIR: z.string().default('./uploads'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Variables de entorno inválidas:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGIN.split(',').map((o) => o.trim()),
};
