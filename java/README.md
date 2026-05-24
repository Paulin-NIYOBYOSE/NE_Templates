# Java OOP + Spring Boot + React Exam Template

A **generic, reusable examination template** for TVET-style practical exams. Adaptable to any scenario: online shopping, parking management, equipment distribution, employee laptop assignment, etc.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Spring Boot 3.2, Spring Data JPA, Spring Security, JWT |
| **Frontend** | React 18 + TypeScript + Vite + Axios |
| **Database** | MySQL or PostgreSQL (configurable via profile) |
| **API Docs** | Swagger UI at `/swagger-ui.html` |
| **Auth** | JWT (signup/login), BCrypt password hashing |
| **Testing** | JUnit 5 + MockMvc + H2 in-memory DB |

---

## Project Structure

```
java/
├── backend/                          # Spring Boot API
│   ├── pom.xml
│   └── src/main/java/com/exam/template/
│       ├── TemplateApplication.java  # Main entry point
│       ├── config/                   # Security, CORS, Swagger configs
│       ├── controller/               # REST controllers
│       ├── dto/                      # Request/Response DTOs
│       ├── entity/                   # JPA entities
│       ├── exception/                # Global exception handler
│       ├── repository/               # Spring Data repositories
│       ├── security/                 # JWT provider, filter, UserDetailsService
│       ├── seeder/                   # CommandLineRunner data seeder
│       └── service/                  # Business logic
├── frontend-react/                   # React + TypeScript SPA
│   ├── src/
│   │   ├── api/                      # Axios API calls
│   │   ├── components/               # Navbar, Pagination, ProtectedRoute
│   │   ├── context/                  # AuthContext, CartContext
│   │   └── pages/                    # Login, Signup, Dashboard, Cart, Report
│   ├── package.json
│   └── vite.config.ts
├── database/                         # SQL scripts
│   ├── schema-mysql.sql
│   ├── schema-postgresql.sql
│   ├── trigger-mysql.sql
│   └── trigger-postgresql.sql
└── README.md
```

---

## Prerequisites

- **Java 17+** (JDK)
- **Maven 3.8+** (or use the `./mvnw` wrapper)
- **Node.js 18+** and **npm**
- **MySQL 8+** or **PostgreSQL 14+**

---

## Quick Start Guide

### 1. Create the Database

**MySQL:**
```sql
CREATE DATABASE exam_template_db;
```

**PostgreSQL:**
```sql
CREATE DATABASE exam_template_db;
```

Then run the trigger script (optional but recommended):
```bash
# MySQL
mysql -u root -p exam_template_db < database/trigger-mysql.sql

# PostgreSQL
psql -U postgres -d exam_template_db -f database/trigger-postgresql.sql
```

> **Note:** Spring Boot with `ddl-auto=update` will auto-create the tables. The SQL schema files are provided for reference/manual setup.

### 2. Configure the Backend

Edit `backend/src/main/resources/application.properties`:

```properties
# Choose your database: mysql or postgresql
spring.profiles.active=mysql
```

Edit the appropriate profile file:
- `application-mysql.properties` – set username/password
- `application-postgresql.properties` – set username/password

### 3. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

The backend starts on **http://localhost:8080**.

Verify:
- Swagger UI: **http://localhost:8080/swagger-ui.html**
- API docs: **http://localhost:8080/v3/api-docs**

The `DataSeeder` automatically inserts:
- **Admin user:** `admin@example.com` / `admin123` (ROLE_ADMIN)
- **Regular user:** `user@example.com` / `user123` (ROLE_USER)
- **5 sample products** with initial stock (100 each)

### 4. Run the Frontend

```bash
cd frontend-react
npm install
npm run dev
```

The frontend starts on **http://localhost:5173**.

### 5. Test the Full Flow

1. Open **http://localhost:5173** – see the product dashboard (public)
2. Click **Signup** or **Login** (`user@example.com` / `user123`)
3. Click **Add to Cart** on products
4. Go to **Cart** page, adjust quantities, click **Checkout**
5. Go to **Report** page to see transactions with date filters

---

## API Endpoints

### Authentication (`/api/auth`) – Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register (email, password, firstName, lastName, phone) |
| POST | `/api/auth/login` | Login, returns JWT token |

### Products (`/api/products`) – RENAME to match exam
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products?page=0&size=10` | Public | Paginated list |
| GET | `/api/products/{code}` | Public | Get by code |
| POST | `/api/products` | Admin | Create (via Swagger) |
| PUT | `/api/products/{code}` | Admin | Update |
| DELETE | `/api/products/{code}` | Admin | Delete |

### Stock (`/api/quantities`) – Admin only, via Swagger/Postman
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quantities` | Add stock record (productCode, quantity, operation) |

### Transactions (`/api/transactions`) – Authenticated
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions/checkout` | Checkout cart items |
| GET | `/api/transactions/report?startDate=...&endDate=...` | Transaction report |
| GET | `/api/transactions/my-report` | Current user's transactions |

---

## Manual Data Insertion

> **Products and quantities must be added manually using Swagger or Postman. No frontend form is provided for these operations, as per exam instructions.**

1. Open Swagger: **http://localhost:8080/swagger-ui.html**
2. Login as admin via `POST /api/auth/login` with `admin@example.com` / `admin123`
3. Copy the JWT token from the response
4. Click **Authorize** button in Swagger, paste: `Bearer <your-token>`
5. Use `POST /api/products` to add entities
6. Use `POST /api/quantities` to add stock records

---

## Database Trigger

The trigger auto-calculates `total = unit_price * quantity` on transaction insert. It is provided as a **database-level guarantee**; the Java code also calculates total as a fallback.

- MySQL: `database/trigger-mysql.sql`
- PostgreSQL: `database/trigger-postgresql.sql`

---

## Adaptation Guide (Exam Day)

### Step 1: Rename Entities

| Generic Name | Example Replacements |
|-------------|---------------------|
| `Product` | `Parking`, `Equipment`, `Laptop`, `Car` |
| `StockRecord` | `AvailableSpaces`, `Inventory`, `StockMovement` |
| `Transaction` | `Booking`, `Purchase`, `Assignment`, `Rental` |
| `User` | `Customer`, `Employee`, `Tenant` |

**Backend files to rename/update:**
- `entity/Product.java` → change class name, table name, fields
- `dto/ProductRequest.java` → change field names
- `repository/ProductRepository.java` → change interface name
- `service/ProductService.java` → change class name
- `controller/ProductController.java` → change class name and endpoint path (`/api/products` → `/api/parkings`)
- `config/SecurityConfig.java` → update endpoint paths in security rules

### Step 2: Update DTOs and Fields

Change field names to match the exam:
- `code` → `parkingCode`, `serialNumber`, `equipmentId`
- `name` → `parkingName`, `laptopModel`
- `price` → `hourlyFee`, `rentalPrice`, `dailyRate`
- `type` → `parkingType`, `category`, `brand`
- `inDate` → `registrationDate`, `purchaseDate`

### Step 3: Modify Trigger SQL

Replace table/column names in the trigger file to match your renamed entities.

### Step 4: Adjust Business Rules

In `TransactionService.java`:
- **Stock validation:** Uncomment the stock check block if the exam requires it
- **Stock deduction:** Uncomment the OUT record creation block
- **Total calculation:** Modify if the exam needs tax, discount, or different formula
- **Status values:** Change from "COMPLETED" to "ACTIVE", "BOOKED", etc.

### Step 5: Update Frontend

In `frontend-react/src/`:
- **Labels:** Search for "Product", "Cart", "Add to Cart" and replace with exam terms
- **Report columns:** Update `ReportPage.tsx` table headers
- **Dashboard:** Update `DashboardPage.tsx` card layout if needed
- **API paths:** If you renamed `/api/products`, update `productApi.ts`

### Step 6: Update Seeder

Edit `seeder/DataSeeder.java` to insert exam-specific sample data.

---

## Exam Day Checklist

- [ ] Create database (`CREATE DATABASE exam_db;`)
- [ ] Update `application-mysql.properties` or `application-postgresql.properties` with DB name and credentials
- [ ] Set `spring.profiles.active=mysql` or `postgresql` in `application.properties`
- [ ] Run trigger SQL script
- [ ] Rename entities, DTOs, controllers, services as needed
- [ ] Update `SecurityConfig.java` endpoint paths
- [ ] Update `DataSeeder.java` with exam sample data
- [ ] Run backend: `cd backend && mvn spring-boot:run`
- [ ] Verify Swagger UI works at `http://localhost:8080/swagger-ui.html`
- [ ] Update React frontend labels and API paths
- [ ] Run frontend: `cd frontend-react && npm install && npm run dev`
- [ ] Manually add core entities via Swagger (if needed beyond seeder)
- [ ] Test: signup → login → add to cart → checkout → view report
- [ ] Verify trigger works (total auto-calculated in DB)

---

## Running Tests

```bash
cd backend
mvn test
```

Tests use H2 in-memory database (no MySQL/PostgreSQL required).

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| CORS error in browser | Check `app.cors.allowed-origins` in `application.properties` includes your frontend URL |
| 401 on protected endpoints | Ensure JWT token is in `Authorization: Bearer <token>` header |
| Database connection refused | Verify DB is running, credentials are correct in profile properties |
| `ddl-auto` not creating tables | Set `spring.jpa.hibernate.ddl-auto=create` (first run only, then switch back to `update`) |
| Swagger not loading | Ensure `/swagger-ui/**` and `/v3/api-docs/**` are in SecurityConfig's `permitAll()` |
| Frontend can't reach backend | Backend must be on port 8080, check `API_BASE_URL` in `axiosInstance.ts` |
