# NE Templates - TVET Exam Templates

Ready-to-use templates for Rwanda National Examinations practical exams.

## Templates

### ✅ RESTful API & Web App (`restful/`)

**Stack**: NestJS + Next.js + PostgreSQL + JWT + Swagger  
**Features**: Auth, CRUD, Pagination, Role-based access, Swagger docs  
**Status**: Production-ready

### 🤖 Intelligent Robotics (`intelligent_robotics/`)

**Includes**: Face recognition (ArcFace)  
**Status**: Template available

### 🚧 Coming Soon

- `dsa/` - Data Structures & Algorithms
- `java/` - Java programming
- `mobile/` - Mobile development

## Quick Start

### RESTful Template

```bash
cd restful

# Backend
cd backend
npm install
cp .env.example .env          # Edit DATABASE_URL
npm run prisma:migrate
npm run prisma:seed
npm run start:dev             # → http://localhost:3001

# Frontend (new terminal)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev                   # → http://localhost:3000
```

**Login**: `admin@example.com` / `Admin123!`  
**Swagger**: http://localhost:3001/api/docs

See [restful/README.md](./restful/README.md) for full guide.

### Intelligent Robotics

```bash
cd intelligent_robotics/face_recognition_arcface
# Follow README.md in that folder
```

## Usage Pattern

1. **Copy template** to your exam workspace
2. **Read requirements** → Identify entities
3. **Update database schema** → Add models
4. **Copy CRUD modules** → Adapt for entities
5. **Test** → Swagger + Browser
6. **Submit**

## Exam Tips

- Plan database schema first
- Copy `items/` module for new entities
- Test each feature in Swagger
- Use provided auth system
- Keep code clean and organized

---

**Each template folder contains detailed setup and usage instructions.**
