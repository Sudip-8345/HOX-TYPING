# Typist Pro Backend

Node.js + TypeScript + Express API powering the Typist Pro dashboard.

## Prerequisites

- Node.js 20+
- PostgreSQL (local or cloud)

## Environment

Duplicate `.env.example` as `.env` and update values.

```
cp .env.example .env
```

## Install & Generate

```
cd backend
npm install
npm run prisma:generate
```

## Development

```
npm run dev
```

The API runs on `http://localhost:8000` by default.

## Scripts

- `npm run dev` – start in watch mode
- `npm run build` – TypeScript build
- `npm start` – run compiled build
- `npm run prisma:migrate` – run Prisma migrations

## API Preview

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (requires `Authorization: Bearer <token>`)

## Database Schema

See `prisma/schema.prisma` for models: `User`, `TypingSession`, `DictationTest`, `DictationResult`.
