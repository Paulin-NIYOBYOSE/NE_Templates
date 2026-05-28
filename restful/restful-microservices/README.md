# NE Microservices Template

Microservices version of the restful template. Same functionality, split into independent services.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Gateway   │────▶│ Auth Service│──▶ PostgreSQL
│  (Next.js)  │     │  (NestJS)   │     │   (3001)    │    (auth_db)
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │Items Service│──▶  │  PostgreSQL │
                    │   (3002)    │     │ (items_db)  │
                    └─────────────┘     └─────────────┘
```

| Service | Port | DB | Responsibility |
|---------|------|-----|----------------|
| Gateway | 3000 | — | Routing, JWT validation, CORS |
| Auth Service | 3001 | ne_auth_db | Login, signup, users |
| Items Service | 3002 | ne_items_db | Items CRUD, tags, reports |

## Quick Start (Docker)

```bash
# One command to run everything
docker-compose up -d

# Gateway:    http://localhost:3000
# Auth:        http://localhost:3001
# Items:       http://localhost:3002
```

## Quick Start (Local Dev)

### 1. Databases

```bash
psql -U postgres -c "CREATE DATABASE ne_auth_db;"
psql -U postgres -c "CREATE DATABASE ne_items_db;"
```

### 2. Auth Service

```bash
cd services/auth-service
npm install
cp .env.example .env
npx prisma migrate dev
npm run start:dev   # → http://localhost:3001
```

### 3. Items Service

```bash
cd services/items-service
npm install
cp .env.example .env
npx prisma migrate dev
npm run start:dev   # → http://localhost:3002
```

### 4. Gateway

```bash
cd gateway
npm install
cp .env.example .env
npm run start:dev   # → http://localhost:3000
```

### 5. Frontend

Copy the frontend from `../restful/frontend`, then:

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Update NEXT_PUBLIC_API_URL=http://localhost:3000/api
npm run dev         # → http://localhost:3000
```

## API Endpoints (via Gateway)

All endpoints go through the gateway at `http://localhost:3000/api`:

| Endpoint | Method | Auth | Service |
|----------|--------|------|---------|
| `/auth/signup` | POST | No | Auth |
| `/auth/login` | POST | No | Auth |
| `/auth/me` | GET | Yes | Auth |
| `/users` | GET | Yes | Auth |
| `/items` | GET/POST | Yes | Items |
| `/items/:id` | GET/PUT/DELETE | Yes | Items |
| `/tags` | GET/POST | Yes | Items |
| `/reports/dashboard` | GET | Yes | Items |

## Folder Structure

```
restful-microservices/
├── gateway/              # API Gateway (NestJS)
│   ├── src/auth/         # JWT validation
│   ├── src/proxy/        # HTTP proxy to services
│   └── Dockerfile
├── services/
│   ├── auth-service/     # Auth + Users (own DB)
│   │   ├── src/auth/
│   │   ├── src/users/
│   │   ├── prisma/
│   │   └── Dockerfile
│   └── items-service/    # Items + Tags + Reports (own DB)
│       ├── src/items/
│       ├── src/tags/
│       ├── src/reports/
│       ├── prisma/
│       └── Dockerfile
├── frontend/             # Same Next.js app (copied from monolithic)
├── docker-compose.yml
├── Makefile
└── README.md
```

## Differences from Monolithic

| | Monolithic | Microservices |
|---|-----------|---------------|
| **Codebase** | Single app | 3 separate apps |
| **Database** | 1 PostgreSQL | 2 PostgreSQL (auth + items) |
| **Deploy** | 1 container | 5 containers (gateway + 2 services + 2 DBs) |
| **Scaling** | Scale whole app | Scale services independently |
| **Complexity** | Lower | Higher |

## Adaptation

Same as monolithic:
1. Update Prisma schemas for your entities
2. Update DTOs, services, controllers
3. Frontend works the same — only the API URL changes

## Troubleshooting

**Gateway can't reach services**
- Check `AUTH_SERVICE_URL` and `ITEMS_SERVICE_URL` in gateway `.env`
- In Docker: use service names (`http://auth-service:3001`)
- Local dev: use `http://localhost:3001`

**CORS errors**
- Update `CORS_ORIGIN` in gateway `.env` to match frontend URL
