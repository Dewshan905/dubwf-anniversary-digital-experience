# Deployment Guide

## Frontend (Vercel)
1. Import repository into Vercel.
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable:
   - `VITE_API_URL=https://your-backend-domain`

## Backend (Render or Railway)
1. Deploy from `backend` directory.
2. Build command: `npm install && npm run prisma:generate && npm run build`
3. Start command: `npm run start`
4. Environment variables:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `PORT`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`

## Database (Neon / Supabase PostgreSQL)
1. Create PostgreSQL database.
2. Set `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) in backend env.
3. Run migrations:
   ```bash
   npm run prisma:migrate -- --name init_dubwf_anniversary
   npm run prisma:migrate:status
   ```
4. Seed admin/demo data:
   ```bash
   npm run prisma:seed
   ```

## Production Notes
- Keep CORS allowlist in `FRONTEND_URL`.
- Use a strong `JWT_SECRET`.
- Keep `.env` out of source control.
