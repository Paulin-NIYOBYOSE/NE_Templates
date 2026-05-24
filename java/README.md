# Java OOP + Spring Boot + React — Exam Template

Generic template for TVET practical exams. Works for any scenario: shopping, parking, equipment rental, laptop assignment — just rename entities and go.

**Stack:** Spring Boot 3.2 | React 18 + TS + Vite | MySQL/PostgreSQL | JWT | Swagger

---

## Run It

### 1. Database

```sql
CREATE DATABASE exam_template_db;
```

Then load the trigger:

```bash
psql -U postgres -d exam_template_db -f database/trigger-postgresql.sql
# OR: mysql -u root -p exam_template_db < database/trigger-mysql.sql
```

### 2. Backend

Set DB profile in `backend/src/main/resources/application.properties`:

```properties
spring.profiles.active=postgresql   # or mysql
```

Set your DB credentials in `application-postgresql.properties` (or `application-mysql.properties`).

```bash
cd backend
mvn spring-boot:run
```

- Runs on **http://localhost:8080**
- Swagger: **http://localhost:8080/swagger-ui.html**
- Auto-seeds: `admin@example.com`/`admin123`, `user@example.com`/`user123`, 5 products

### 3. Frontend

```bash
cd frontend-react
npm install
npm run dev
```

- Runs on **http://localhost:5173**
- Login → Add to Cart → Checkout → Report. Done.

---

## Project Layout

```
backend/src/main/java/com/exam/template/
├── entity/          # Product, User, StockRecord, Transaction (rename these)
├── dto/             # Request/response objects (validation here)
├── repository/      # JPA repos + custom queries (stock calc, date range)
├── service/         # Business logic (auth, CRUD, checkout, report)
├── controller/      # REST endpoints (auth, products, stock, transactions)
├── security/        # JWT generation/validation, filter, SecurityConfig
├── config/          # CORS, Swagger, Security rules
├── exception/       # Global handler → consistent JSON errors
└── seeder/          # Auto-inserts sample data on startup

frontend-react/src/
├── api/             # Axios instance + API call functions
├── context/         # AuthContext (JWT state), CartContext (local cart)
├── components/      # Navbar, Pagination, ProtectedRoute
└── pages/           # Login, Signup, Dashboard, Cart, Report

database/
├── schema-*.sql     # Table definitions (reference only, Hibernate creates them)
└── trigger-*.sql    # Auto-calc total on transaction insert
```

---

## Code Breakdown (What Does What)

### Backend

| File                           | Purpose                                                           |
| ------------------------------ | ----------------------------------------------------------------- |
| `BaseEntity.java`              | Abstract class — `id`, `createdAt`, `updatedAt` auto-managed      |
| `User.java`                    | email, password(BCrypt), firstName, lastName, role                |
| `Product.java`                 | code, name, type, price, inDate — **your main entity to rename**  |
| `StockRecord.java`             | Tracks IN/OUT quantities per product                              |
| `Transaction.java`             | Links user + product + quantity + total                           |
| `SecurityConfig.java`          | Defines which endpoints are public/admin/authenticated            |
| `JwtTokenProvider.java`        | Generates & validates JWT tokens                                  |
| `JwtAuthenticationFilter.java` | Reads JWT from request header, sets auth context                  |
| `TransactionService.java`      | Checkout logic — has commented stock validation, enable if needed |
| `DataSeeder.java`              | Runs on startup — creates users + products + stock                |
| `GlobalExceptionHandler.java`  | Catches all exceptions → returns clean JSON errors                |

### Frontend

| File                 | Purpose                                                                 |
| -------------------- | ----------------------------------------------------------------------- |
| `axiosInstance.ts`   | Base URL + auto-attaches JWT + handles 401 redirect                     |
| `AuthContext.tsx`    | Stores user/token in state + localStorage, provides login/signup/logout |
| `CartContext.tsx`    | Local cart state (add/remove/update/clear), no backend persistence      |
| `DashboardPage.tsx`  | Fetches paginated products, shows cards with "Add to Cart"              |
| `CartPage.tsx`       | Shows cart items, quantity controls, checkout button → calls API        |
| `ReportPage.tsx`     | Fetches transaction report with date filters + pagination               |
| `ProtectedRoute.tsx` | Redirects to /login if not authenticated                                |

### Database Triggers

Auto-calculate `total = unit_price * quantity` on INSERT into transactions table. Java code also does this as fallback — belt and suspenders.

---

## API Endpoints

| Endpoint                           | Auth   | What                              |
| ---------------------------------- | ------ | --------------------------------- |
| `POST /api/auth/signup`            | Public | Register                          |
| `POST /api/auth/login`             | Public | Login → JWT token                 |
| `GET /api/products?page=0&size=10` | Public | List entities (paginated)         |
| `GET /api/products/{code}`         | Public | Get one by code                   |
| `POST /api/products`               | Admin  | Create entity                     |
| `PUT /api/products/{code}`         | Admin  | Update                            |
| `DELETE /api/products/{code}`      | Admin  | Delete                            |
| `POST /api/quantities`             | Admin  | Add stock record                  |
| `POST /api/transactions/checkout`  | User   | Process cart                      |
| `GET /api/transactions/report`     | User   | Transaction report (date filters) |

Admin ops (create product, add stock) → use **Swagger UI** or Postman.

---

## Adapt for Exam Day

### Rename (find & replace)

| Generic       | Replace With (example)           |
| ------------- | -------------------------------- |
| `Product`     | `Parking`, `Equipment`, `Laptop` |
| `code`        | `parkingCode`, `serialNumber`    |
| `name`        | `parkingName`, `model`           |
| `price`       | `hourlyFee`, `rentalPrice`       |
| `Transaction` | `Booking`, `Assignment`          |
| `StockRecord` | `Availability`, `Inventory`      |

### Files to touch

**Backend:** Entity → DTO → Repository → Service → Controller → SecurityConfig paths → DataSeeder
**Frontend:** `productApi.ts` (API path) → page labels in `DashboardPage`, `CartPage`, `ReportPage`
**Database:** Update trigger SQL with new table/column names

### Enable stock validation

In `TransactionService.java`, uncomment the stock check + deduction blocks (clearly marked with comments).

---

## Checklist

```
[ ] CREATE DATABASE + run trigger SQL
[ ] Set profile (mysql/postgresql) + credentials
[ ] Rename entities to match exam
[ ] Update SecurityConfig endpoint paths
[ ] Update DataSeeder with exam data
[ ] cd backend && mvn spring-boot:run
[ ] Update frontend labels + API paths
[ ] cd frontend-react && npm install && npm run dev
[ ] Test: signup → login → cart → checkout → report
```

---

## Troubleshooting

| Problem                      | Fix                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------- |
| CORS error                   | Add your frontend URL to `app.cors.allowed-origins` in application.properties |
| 401 errors                   | Token missing/expired — re-login                                              |
| DB connection refused        | Check credentials in profile properties, ensure DB is running                 |
| Tables not created           | Set `ddl-auto=create` once, then switch back to `update`                      |
| Swagger not loading          | Check SecurityConfig permits `/swagger-ui/**`, `/v3/api-docs/**`              |
| Frontend can't reach backend | Check `API_BASE_URL` in `src/api/axiosInstance.ts` matches backend port       |
