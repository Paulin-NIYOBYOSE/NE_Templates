# Backend - NestJS API

This is the backend API for the NE exam template, built with NestJS, Prisma, and PostgreSQL.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy `.env.example` to `.env` and configure your database:

```bash
cp .env.example .env
```

3. Run database migrations:

```bash
pnpm prisma migrate dev
```

4. Seed the database:

```bash
pnpm prisma db seed
```

## Development

```bash
# Start development server
pnpm run start:dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate test coverage
pnpm test:cov
```

## API Documentation

Once running, visit:

- Swagger UI: http://localhost:3001/api/docs
- OpenAPI JSON: http://localhost:3001/api/docs-json

## Project Structure

```
src/
├── auth/           # Authentication (JWT, login, signup)
├── users/          # User management
├── items/          # Example CRUD module
├── common/         # Shared utilities, guards, decorators
├── prisma/         # Prisma service
├── app.module.ts   # Root module
└── main.ts         # Application entry point
```

## Adding New Entities

1. Update `prisma/schema.prisma` with your model
2. Run `pnpm prisma migrate dev --name add-your-entity`
3. Copy the `items` module as a template
4. Update DTOs, service, and controller
5. Register the module in `app.module.ts`

## Default Credentials

- Admin: `admin@example.com` / `Admin123!`
- Attendant: `attendant@example.com` / `User123!`
- User: `user@example.com` / `User123!`
