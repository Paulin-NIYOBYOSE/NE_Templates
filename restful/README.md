# RESTful API & Web App Template for TVET Exams

Production-ready full-stack template: NestJS + Next.js + PostgreSQL + JWT + Swagger

## Stack

- **Backend**: NestJS + Prisma ORM + PostgreSQL
- **Frontend**: Next.js 14 (App Router) + TailwindCSS
- **Auth**: JWT + Role-based access (ADMIN, ATTENDANT, USER)
- **Docs**: Swagger at `/api/docs`

## Features

✅ Auth (signup/login/JWT) ✅ CRUD pattern ✅ Pagination ✅ Validation ✅ Role guards ✅ Swagger docs

## Quick Setup

```bash
# 1. Database
psql -U postgres -c "CREATE DATABASE tvet_exam_db;"

# 2. Backend
cd backend
pnpm install
cp .env.example .env  # Edit DATABASE_URL
pnpm prisma migrate dev
pnpm prisma db seed
pnpm run start:dev    # → http://localhost:3001

# 3. Frontend (new terminal)
cd frontend
pnpm install
cp .env.local.example .env.local
pnpm run dev          # → http://localhost:3000
```

**Login**: `admin@example.com` / `Admin123!`

## Project Structure

```
backend/src/
├── auth/          # JWT authentication
├── users/         # User management
├── items/         # ⭐ COPY THIS for new entities
├── common/        # Guards, filters, DTOs
└── prisma/        # Database service

frontend/src/
├── app/(auth)/           # Login/signup
├── app/(protected)/
│   └── items/            # ⭐ COPY THIS for new entities
├── components/           # Navbar, Pagination
├── lib/                  # API client, auth
└── types/                # TypeScript types
```

## Adding New Entity (e.g., Vehicle)

### 1. Database

```prisma
// backend/prisma/schema.prisma
model Vehicle {
  id          String   @id @default(uuid())
  plateNumber String   @unique
  model       String
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

```bash
pnpm prisma migrate dev --name add-vehicle
```

### 2. Backend

```bash
cd backend/src
cp -r items vehicles
# Update: class names, Prisma model, routes, DTOs
# Register in app.module.ts
```

### 3. Frontend

```bash
cd frontend/src/app/(protected)
cp -r items vehicles
# Update: API endpoints, types, forms
```

### 4. Test

- Swagger: http://localhost:3001/api/docs
- Browser: http://localhost:3000/vehicles

## Key Files

**Backend:**

- Schema: `backend/prisma/schema.prisma`
- CRUD template: `backend/src/items/`
- Auth: `backend/src/auth/`

**Frontend:**

- Pages template: `frontend/src/app/(protected)/items/`
- API client: `frontend/src/lib/api.ts`
- Types: `frontend/src/types/`

## Commands

```bash
# Backend
pnpm run start:dev        # Dev server
pnpm prisma studio        # DB GUI
pnpm prisma migrate dev   # New migration
pnpm test                 # Tests

# Frontend
pnpm run dev              # Dev server
pnpm run build            # Production build
```

## Exam Workflow

1. **Read requirements** → Identify entities
2. **Update schema** → Add models to `schema.prisma`
3. **Migrate** → `pnpm prisma migrate dev`
4. **Copy Items module** → Rename for each entity
5. **Test in Swagger** → Verify all endpoints
6. **Copy Items pages** → Update forms/types
7. **Test in browser** → Full CRUD flow

## Swagger Auth

1. POST `/auth/login` → Get `accessToken`
2. Click "Authorize" → Enter `Bearer <token>`
3. Test protected endpoints

## Troubleshooting

```bash
# DB connection failed
psql -U postgres -l

# Port in use
# Change PORT in backend/.env

# Prisma errors
pnpm prisma generate
pnpm prisma migrate reset  # ⚠️ Deletes data
```

## Demo Credentials

- Admin: `admin@example.com` / `Admin123!`
- Attendant: `attendant@example.com` / `User123!`
- User: `user@example.com` / `User123!`

---

**Docs**: Swagger at `/api/docs` | **Template**: Copy `items/` module | **Auth**: JWT in headers
