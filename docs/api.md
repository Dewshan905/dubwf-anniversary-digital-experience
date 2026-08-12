# API Documentation

Base URL: `http://localhost:4000`

## Public

### POST /api/rsvp
Creates RSVP and pass token for confirmed guests.

Body:
```json
{
  "fullName": "Jane Doe",
  "phoneNumber": "+94771234567",
  "email": "jane@example.com",
  "attendanceStatus": "CONFIRMED"
}
```

### GET /api/pass/:token
Returns pass details for pass rendering.

### GET /api/verify/:token
Returns safe verification result for QR scans.

## Auth

### POST /api/auth/login
Admin login.

Body:
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

## Admin (Bearer token required)

### GET /api/admin/stats
Total/confirmed/declined counts.

### GET /api/admin/guests?search=&status=
Guest list with optional search/status filter.

### PATCH /api/admin/guests/:id
Update guest fields/status.

### DELETE /api/admin/guests/:id
Delete guest and pass.
