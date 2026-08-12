# Architecture

```mermaid
flowchart TD
    Visitor --> Frontend[React + Vite Frontend]
    Frontend --> API[Express REST API]
    API --> Prisma[Prisma ORM]
    Prisma --> Postgres[(PostgreSQL)]

    Frontend --> RSVP[POST /api/rsvp]
    RSVP --> Guest[Guest Record]
    Guest --> PassToken[Secure Pass Token]
    PassToken --> DigitalPass[Digital Pass UI + QR]
    DigitalPass --> VerifyRoute[/verify/:token]
```

## Modules

### Frontend
- Public website + countdown + RSVP
- Campaign card generator
- Pass and verify pages
- Admin login/dashboard

### Backend
- Auth module
- RSVP module
- Pass + Verify modules
- Admin module
- Middleware (auth, validation errors, rate limiting)

### Database
- Admin
- Guest
- Pass
- Attendance status enum
