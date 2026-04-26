# online_exam_back-end
Node js and My SQL with the help of javascript

project-root/
│
├── src/                     # Main source code
│   ├── config/              # Configuration files (DB, env setup)
│   ├── controllers/         # Handle incoming requests (API layer)
│   ├── services/            # Business logic
│   ├── models/              # Database models / schemas
│   ├── routes/              # API route definitions
│   ├── middlewares/         # Custom middleware (auth, logging)
│   ├── utils/               # Helper functions / utilities
│   ├── validations/         # Request validation schemas
│   └── app.js / main.js     # Entry point
│
├── tests/                   # Unit and integration tests
│
├── public/                  # Static files (if needed)
│
├── logs/                    # Log files
│
├── scripts/                 # Automation scripts (migration, seeding)
│
├── .env                     # Environment variables
├── .gitignore
├── package.json / pom.xml   # Dependencies (depends on language)
├── README.md
└── docker-compose.yml       # (Optional) container setup








npm install express mysql2 bcryptjs jsonwebtoken dotenv cors express-validator helmet morgan express-rate-limit 2>&1 | tail -5


# 🎓 Online Exam Portal — Backend API

A production-ready REST API built with **Node.js**, **Express**, and **MySQL** featuring JWT authentication, role-based access control, and a full exam lifecycle.

---

## 📁 Project Structure

```
online-exam-backend/
├── index.js                    # App entry point
├── .env.example                # Environment variable template
├── sql/
│   └── schema.sql              # Database schema + seed data
└── src/
    ├── config/
    │   └── db.js               # MySQL connection pool
    ├── controllers/
    │   ├── auth.controller.js  # Login, register, token refresh
    │   ├── user.controller.js  # Admin user management
    │   ├── subject.controller.js
    │   ├── exam.controller.js  # Exam & question CRUD
    │   └── attempt.controller.js # Start, answer, submit, grade
    ├── middleware/
    │   ├── auth.middleware.js  # JWT verify + role guard
    │   └── validate.middleware.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── user.routes.js
    │   ├── subject.routes.js
    │   ├── exam.routes.js
    │   └── attempt.routes.js
    └── utils/
        ├── jwt.js              # Token helpers
        └── response.js         # Standardised response helpers
```

---

## ⚙️ Setup

### 1. Clone & install
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials and secrets
```

### 3. Create database
```bash
mysql -u root -p < sql/schema.sql
# OR: npm run db:setup
```

### 4. Start server
```bash
npm run dev    # development (nodemon)
npm start      # production
```

**Default admin account:**
- Email: `admin@examportal.com`
- Password: `Admin@123`

---

## 🔐 Authentication Flow

```
POST /api/auth/login
  → { accessToken, refreshToken, user }

Use: Authorization: Bearer <accessToken>  on every protected request

POST /api/auth/refresh-token   { refreshToken }
  → { accessToken, refreshToken }  (tokens are rotated)

POST /api/auth/logout          { refreshToken }
```

---

## 👥 Roles & Permissions

| Feature                    | Admin | Teacher | Student |
|----------------------------|:-----:|:-------:|:-------:|
| Manage users               | ✅    | ❌      | ❌      |
| Create subjects / exams    | ✅    | ✅      | ❌      |
| Add questions              | ✅    | ✅      | ❌      |
| Publish exam               | ✅    | ✅      | ❌      |
| View exam results          | ✅    | ✅ own  | ❌      |
| Manual grading             | ✅    | ✅ own  | ❌      |
| Enroll in subjects         | ❌    | ❌      | ✅      |
| Take exams                 | ❌    | ❌      | ✅      |
| View own results           | ✅    | ✅      | ✅      |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| POST   | `/api/auth/register`      | Register new user        |
| POST   | `/api/auth/login`         | Login, get tokens        |
| POST   | `/api/auth/refresh-token` | Rotate tokens            |
| POST   | `/api/auth/logout`        | Revoke refresh token     |
| GET    | `/api/auth/profile`       | Get own profile          |
| PUT    | `/api/auth/profile`       | Update name / password   |

### Users (Admin only)
| Method | Endpoint           | Description        |
|--------|--------------------|--------------------|
| GET    | `/api/users`       | List all users     |
| GET    | `/api/users/stats` | User count stats   |
| GET    | `/api/users/:id`   | Get user by ID     |
| POST   | `/api/users`       | Create user        |
| PUT    | `/api/users/:id`   | Update user        |
| DELETE | `/api/users/:id`   | Delete user        |

### Subjects
| Method | Endpoint                      | Description            |
|--------|-------------------------------|------------------------|
| GET    | `/api/subjects`               | List subjects          |
| POST   | `/api/subjects`               | Create subject         |
| PUT    | `/api/subjects/:id`           | Update subject         |
| DELETE | `/api/subjects/:id`           | Delete subject         |
| POST   | `/api/subjects/:id/enroll`    | Enroll student         |
| DELETE | `/api/subjects/:id/enroll`    | Unenroll student       |
| GET    | `/api/subjects/:id/students`  | List enrolled students |

### Exams
| Method | Endpoint                      | Description             |
|--------|-------------------------------|-------------------------|
| GET    | `/api/exams`                  | List exams (role-aware) |
| GET    | `/api/exams/:id`              | Exam detail + questions |
| POST   | `/api/exams`                  | Create exam             |
| PUT    | `/api/exams/:id`              | Update exam             |
| DELETE | `/api/exams/:id`              | Delete exam             |
| POST   | `/api/exams/:id/questions`    | Add question            |
| PUT    | `/api/exams/questions/:qid`   | Update question         |
| DELETE | `/api/exams/questions/:qid`   | Delete question         |
| GET    | `/api/exams/:examId/results`  | Exam results summary    |

### Attempts (Student exam-taking)
| Method | Endpoint                           | Description                 |
|--------|------------------------------------|-----------------------------|
| POST   | `/api/exams/:examId/start`         | Start / resume exam         |
| POST   | `/api/attempts/:attemptId/answer`  | Save / update one answer    |
| POST   | `/api/attempts/:attemptId/submit`  | Submit & auto-grade         |
| GET    | `/api/attempts/:attemptId/result`  | View attempt result         |
| PATCH  | `/api/attempts/answers/:id/grade`  | Manually grade essay answer |

---

## 🗄️ Database Schema (ERD Summary)

```
users ──< refresh_tokens
users ──< subjects (teacher_id)
users ──< enrollments >── subjects
subjects ──< exams
users ──< exams (teacher_id)
exams ──< questions ──< options
users ──< exam_attempts >── exams
exam_attempts ──< student_answers >── questions
student_answers >── options (selected)
```

---

## 🔒 Security Features

- **Helmet** — sets secure HTTP headers
- **CORS** — configurable origin whitelist
- **Rate limiting** — 100 req/15 min globally; 20 req/15 min on auth routes
- **bcrypt** (salt rounds = 10) — password hashing
- **JWT** — short-lived access tokens (15 min) + rotating refresh tokens (7 days)
- **Input validation** — express-validator on all POST/PUT routes
- **SQL injection protection** — parameterised queries via mysql2

---

## 🧪 Quick Test (curl)

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@examportal.com","password":"Admin@123"}'

# Use the returned accessToken:
TOKEN="<your_access_token>"

# List users
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN"
```
