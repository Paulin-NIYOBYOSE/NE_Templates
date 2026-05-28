# Frontend - Next.js App

This is the frontend application for the NE exam template, built with Next.js 14, TypeScript, and TailwindCSS.

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

3. Make sure the backend is running on `http://localhost:3001`

## Development

```bash
# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start

# Run linter
pnpm run lint

# Run tests
pnpm test
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/         # Login and signup pages
│   ├── (protected)/    # Protected routes (dashboard, items)
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page (redirects to login)
│   └── globals.css     # Global styles
├── components/         # Reusable components
│   ├── Navbar.tsx
│   └── Pagination.tsx
├── lib/               # Utilities
│   ├── api.ts         # Axios instance with interceptors
│   ├── auth.ts        # Authentication service
│   └── utils.ts       # Helper functions
└── types/             # TypeScript types
    ├── auth.ts
    └── item.ts
```

## Features

### Authentication

- Login and signup pages with form validation
- JWT token storage in localStorage
- Automatic token injection in API requests
- Protected routes with redirect to login

### Items Management

- List items with pagination
- Create, read, update, delete items
- Role-based access control
- Responsive table design

### Components

- **Navbar**: Navigation with user info and logout
- **Pagination**: Reusable pagination component
- **Protected Layout**: Wrapper for authenticated routes

## Adding New Features

1. **Create a new entity page**:
   - Copy `app/(protected)/items` folder
   - Rename and update for your entity
   - Update API calls in the pages

2. **Add new API endpoints**:
   - Update `lib/api.ts` if needed
   - Create type definitions in `types/`

3. **Add new components**:
   - Create in `components/` folder
   - Import and use in pages

## Styling

This project uses TailwindCSS with custom utility classes:

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- `.input`
- `.card`

Customize colors in `tailwind.config.ts`.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:3001)
