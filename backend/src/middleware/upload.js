import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve(process.env.UPLOAD_DIR || './uploads');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Nombre seguro: UUID + extensión permitida. Nunca usar el nombre original.
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp']);

export const upload = multer({
  storage,
  limits: { fileSize: (Number(process.env.UPLOAD_MAX_MB) || 5) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.has(ext)) {
      return cb(Object.assign(new Error('Solo se permiten imágenes JPG, PNG o WebP'), { status: 415 }));
    }
    cb(null, true);
  },
});
