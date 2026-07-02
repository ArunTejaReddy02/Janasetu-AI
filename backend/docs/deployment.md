# JanaSetu-AI — Deployment Guide

## Prerequisites

- Docker Desktop ≥ 24.x
- Node.js ≥ 20.x
- npm ≥ 10.x

## Local Development (Docker)

```bash
cd backend

# 1. Copy and configure env
cp .env .env.local
# Edit .env.local with your actual keys

# 2. Start services
docker-compose up -d postgres redis

# 3. Install dependencies
npm install

# 4. Generate Prisma client
npm run prisma:generate

# 5. Run migrations
npm run prisma:migrate

# 6. Seed database
npm run prisma:seed

# 7. Start dev server
npm run start:dev
```

## Endpoints After Bootstrap

| URL                          | Description        |
|------------------------------|--------------------|
| http://localhost:3000/health | Health check       |
| http://localhost:3000/api/docs | Swagger UI       |
| http://localhost:8080        | Adminer (DB UI)    |

## Production Docker Build

```bash
docker-compose build
docker-compose -f docker-compose.yml up -d
```

## Database Management

```bash
# Run migrations
npm run prisma:migrate

# Reset (DESTRUCTIVE)
ts-node scripts/migrate.ts --reset --seed

# Open Prisma Studio
npm run prisma:studio
```
