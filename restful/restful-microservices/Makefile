.PHONY: up down build logs dev-gateway dev-auth dev-items

# Docker Compose (production-like)
up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build

logs:
	docker-compose logs -f

# Local dev (requires Node.js + PostgreSQL running)
dev-gateway:
	cd gateway && npm install && npm run start:dev

dev-auth:
	cd services/auth-service && npm install && npx prisma migrate dev && npm run start:dev

dev-items:
	cd services/items-service && npm install && npx prisma migrate dev && npm run start:dev

# Setup DBs manually (for local dev without Docker)
setup-db:
	psql -U postgres -c "CREATE DATABASE ne_auth_db;" || true
	psql -U postgres -c "CREATE DATABASE ne_items_db;" || true
