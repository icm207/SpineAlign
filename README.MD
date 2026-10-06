# SpineAlign

Plataforma web biomédica para analizar la simetría postural de los hombros a partir de una fotografía.

- `backend/` — API REST (Node.js + Express + Prisma/SQLite). Ver `backend/README.md`.
- `frontend/` — SPA React + Vite. Ver `frontend/README.md`.

## Puesta en marcha

### Backend
```bash
cd backend
cp .env.example .env          # edita JWT_SECRET y umbrales si quieres
npm install
npx prisma migrate dev
node prisma/seed.js           # crea admin@spinealign.local / spinealign123
npm run dev                   # http://localhost:4000
```

### Frontend (otra terminal)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                   # http://localhost:5173
```

Abre http://localhost:5173, inicia sesión con el usuario seed y crea una nueva evaluación.
