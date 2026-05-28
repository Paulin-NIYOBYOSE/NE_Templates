# NE Templates

Production-ready templates for National Examinations practical exams.

## Templates

| Template                                             | Stack                                          | Status   |
| ---------------------------------------------------- | ---------------------------------------------- | -------- |
| [**restful/**](./restful/)                           | NestJS + Next.js + PostgreSQL + Toast/Modal UI | ✅ Ready |
| [**java/**](./java/)                                 | Spring Boot + React + MySQL/PostgreSQL         | ✅ Ready |
| [**mobile/**](./mobile/flux-mobile/)                 | Expo + React Native + TypeScript               | ✅ Ready |
| [**intelligent_robotics/**](./intelligent_robotics/) | Python + ArcFace                               | ✅ Ready |
| **dsa/**                                             | Data Structures & Algorithms                   | ✅ Ready |

## Quick Start

### RESTful Monolithic (NestJS + Next.js)

```bash
cd restful/monolithic/backend && npm i && cp .env.example .env && npm run start:dev
cd restful/monolithic/frontend && npm i && cp .env.local.example .env.local && npm run dev
```

→ Backend: `localhost:3001` | Frontend: `localhost:3000` | Swagger: `localhost:3001/api/docs`

### Java (Spring Boot + React)

```bash
cd java/backend && mvn spring-boot:run
cd java/frontend-react && npm i && npm run dev
```

→ Backend: `localhost:8080` | Frontend: `localhost:5173`

### Mobile (Expo)

```bash
cd mobile/flux-mobile && npm i && npx expo start
```

→ Scan QR with Expo Go

### Intelligent Robotics

```bash
cd intelligent_robotics/face_recognition_arcface
# See README.md
```

## How to Use

1. **Copy** the template folder to your workspace
2. **Read** exam requirements → identify entities
3. **Edit config** → update entity names, fields, API endpoints
4. **Run & test** → use Swagger/browser/Expo Go
5. **Submit**

## Exam Tips

- **Plan schema first** — draw entities before coding
- **Copy existing modules** — adapt `items/` or `expenses/` for new entities
- **Test incrementally** — verify each feature works
- **Keep it simple** — use provided auth, don't reinvent

---

**See each folder's README for detailed instructions.**
