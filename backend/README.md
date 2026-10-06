# SpineAlign Backend

API REST (Node.js + Express) para el análisis de simetría postural de hombros.

## Estado actual
Fase (b): API con auth JWT, pacientes y evaluaciones (Prisma + SQLite).

## Scripts

```bash
npm install
npm test                  # pruebas con Vitest
npx prisma migrate dev    # crea/migra la BD
node prisma/seed.js       # usuario demo admin@spinealign.local / spinealign123
cp .env.example .env      # y edita JWT_SECRET
npm run dev               # servidor en http://localhost:4000
```

## Módulos de dominio

- `src/domain/shoulderAngle.js` — función pura `computeShoulderInclination(left, right, imageSize)`.
- `src/domain/classification.js` — `classifyInclination(angleDeg, thresholds?)`.
- `src/domain/thresholds.md` — umbrales y su configuración por `.env`.

## Endpoints

- `POST /api/auth/login`
- `POST /api/patients`, `GET /api/patients`
- `POST /api/patients/:patientId/assessments` (multipart: `image` + `leftShoulder`, `rightShoulder`, `imageWidth`, `imageHeight` como JSON)
- `GET /api/patients/:patientId/assessments`
- `GET /api/assessments/:id`
- `GET /api/assessments/:id/image`
