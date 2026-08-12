# DUBWF 1st Anniversary Digital Experience

## Project Overview
Premium digital anniversary experience for the Dankotuwa United Women's Business Forum 1st Anniversary event.

## Problem
The event needed more than a static invitation: guests needed RSVP, digital pass, verification, and organizers needed RSVP management.

## Solution
A full-stack platform with a cinematic public site, timezone-correct countdown, RSVP + pass generation, QR verification, campaign card generator, and admin dashboard.

## Features
- Luxury public anniversary website
- Real-time countdown engine (Asia/Colombo)
- Countdown state campaign cards with export
- RSVP API with validation and duplicate protection
- Digital event pass with QR code
- Public pass verification page
- Admin JWT authentication and guest dashboard
- Organizer stats/search/filter/delete/update

## Tech Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Framer Motion
- Backend: Node.js, Express, Zod, JWT, Helmet, Rate Limit
- Database: PostgreSQL + Prisma ORM

## Architecture
See [architecture.md](docs/architecture.md).

## Project Structure
- [frontend/](frontend)
- [backend/](backend)
- [docs/](docs)
- [Photos/](Photos)

## Screenshots
Add screenshots after running locally and capturing:
- Home hero
- Countdown
- RSVP form
- Digital pass
- Admin dashboard

## How It Works
### RSVP Flow
Visitor submits RSVP -> API validates -> guest saved -> pass token generated for confirmed guest -> pass displayed.

### Digital Pass Flow
Confirmed RSVP receives pass token -> frontend renders pass card + QR -> user downloads/shares.

### Countdown System
Countdown uses explicit Asia/Colombo wall-time calculation with status transitions (10/7/3/tomorrow/tonight/live/completed).

## API Documentation
See [api.md](docs/api.md).

## Database
Prisma schema: [schema.prisma](backend/prisma/schema.prisma)

## Environment Setup
1. Backend:
   - Copy [backend/.env.example](backend/.env.example) to `backend/.env`
   - Set `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) for PostgreSQL
2. Frontend:
   - Copy [frontend/.env.example](frontend/.env.example) to `frontend/.env`
   - Set `VITE_API_URL` to backend URL (example: `http://localhost:4010`)

## Local Development
1. Install frontend deps:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Install backend deps:
   ```bash
   cd backend
   npm install
   npm run prisma:generate
   npm run prisma:migrate -- --name init_dubwf_anniversary
   npm run prisma:migrate:status
   npm run db:check
   npm run prisma:seed
   npm run dev
   ```

## Testing Core Flows
1. Health:
   - `GET http://localhost:4010/health`
2. RSVP create:
   - `POST http://localhost:4010/api/rsvp`
3. Pass retrieve:
   - `GET http://localhost:4010/api/pass/:token`
4. Verify token:
   - `GET http://localhost:4010/api/verify/:token`
5. Admin login:
   - `POST http://localhost:4010/api/auth/login`

## Deployment
See [deployment.md](docs/deployment.md).

## Security
- Input validation with Zod
- JWT auth for admin routes
- Password hashing with bcrypt
- Public RSVP rate limiting
- Secure random pass token generation
- No private data in QR payload

## Future Improvements
- Audit log for admin actions
- RSVP export (CSV)
- Automated reminder scheduler

## Credits / Assets
- Official event images/logo from [Photos/](Photos)

## License
Use your preferred license (MIT recommended).
