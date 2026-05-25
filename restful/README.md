# RESTful API & Web App Template

Full-stack template for National Examinations: NestJS + Next.js + PostgreSQL + JWT + Swagger

## Stack

**Backend**: NestJS + Prisma + PostgreSQL  
**Frontend**: Next.js 14 + TailwindCSS  
**Auth**: JWT + Roles (ADMIN, ATTENDANT, USER)  
**Docs**: Swagger at `/api/docs`

## Setup

### 1. Database

```bash
psql -U postgres -c "CREATE DATABASE ne_exam_db;"
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env          # Edit DATABASE_URL
npm run prisma:migrate
npm run prisma:seed
npm run start:dev             # → http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev                   # → http://localhost:3000
```

**Login**: `admin@example.com` / `Admin123!`  
**Swagger**: http://localhost:3001/api/docs

## Project Structure

```
backend/src/
├── auth/          # JWT authentication
├── users/         # User management
├── items/         # ⭐ COPY THIS for new entities
├── common/        # Guards, filters, DTOs
└── prisma/        # Database service

frontend/src/
├── app/(auth)/              # Login/signup pages
├── app/(protected)/items/   # ⭐ COPY THIS for new entities
├── components/              # Reusable UI components
├── lib/                     # API client, auth service
└── types/                   # TypeScript types
```

## Add New Entity (Example: Vehicle)

### Backend

**1. Update schema**

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

**2. Migrate**

```bash
npm run prisma:migrate
```

**3. Create module**

```bash
cd src
cp -r items vehicles
# Update: class names, Prisma model, routes, DTOs
# Register VehiclesModule in app.module.ts
```

### Frontend

**1. Create pages**

```bash
cd src/app/(protected)
cp -r items vehicles
# Update: API endpoints, types, forms, table columns
```

**2. Add types**

```typescript
// src/types/vehicle.ts
export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
```

**3. Test**

- Swagger: http://localhost:3001/api/docs
- Browser: http://localhost:3000/vehicles

## Key Files

**Backend**

- `prisma/schema.prisma` - Database models
- `src/items/` - CRUD template (copy this)
- `src/auth/` - Authentication logic
- `src/common/guards/` - Role guards

**Frontend**

- `app/(protected)/items/` - CRUD pages template (copy this)
- `lib/api.ts` - API client
- `types/` - TypeScript interfaces
- `components/` - Reusable UI components

## Commands

```bash
# Backend
npm run start:dev           # Dev server
npm run prisma:studio       # DB GUI
npm run prisma:migrate      # Run migrations
npm run prisma:seed         # Seed database
npm test                    # Run tests

# Frontend
npm run dev                 # Dev server
npm run build               # Production build
npm run lint                # Lint code
```

## Exam Workflow

1. **Read requirements** → List entities and relationships
2. **Update schema** → Add models to `prisma/schema.prisma`
3. **Migrate** → `npm run prisma:migrate`
4. **Backend**: Copy `items/` → Rename for each entity → Register in `app.module.ts`
5. **Test API** → Use Swagger to verify endpoints
6. **Frontend**: Copy `items/` pages → Update forms/types
7. **Test UI** → Full CRUD flow in browser
8. **Polish** → Add validation, error handling

## Swagger Usage

1. POST `/auth/login` → Copy `accessToken`
2. Click "Authorize" button → Enter `Bearer <token>`
3. Test all protected endpoints

## Demo Accounts

| Email                 | Password  | Role      |
| --------------------- | --------- | --------- |
| admin@example.com     | Admin123! | ADMIN     |
| attendant@example.com | User123!  | ATTENDANT |
| user@example.com      | User123!  | USER      |

## Troubleshooting

**Database connection failed**

```bash
psql -U postgres -l  # Check if DB exists
```

**Port already in use**

```bash
# Change PORT in backend/.env
```

**Prisma errors**

```bash
npm run prisma:generate
npm run prisma:migrate reset  # ⚠️ Deletes all data
```

**bcrypt build errors**

```bash
# Use npm (not pnpm) - already configured
rm -rf node_modules package-lock.json
npm install
```

## Features

✅ JWT authentication with refresh tokens  
✅ Role-based access control (ADMIN, ATTENDANT, USER)  
✅ Generic CRUD pattern with pagination  
✅ Input validation (class-validator)  
✅ Swagger API documentation  
✅ Security (Helmet, CORS, rate limiting)  
✅ Responsive UI with fixed sidebar/navbar  
✅ Database migrations and seeding  
✅ Error handling and filters

---

**Template Pattern**: Copy `items/` module → Adapt for your entities → Test in Swagger → Build UI
