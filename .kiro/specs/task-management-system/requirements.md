# Requirements: Task Management System

## Introduction

A full-stack internal task management system. Admins manage users and tasks; Users view and update their assigned tasks. JWT authentication, role-based access, React frontend, Node.js/Express backend, MongoDB database.

---

## Glossary

| Term | Definition |
|---|---|
| Admin | User with admin role — manages users and tasks |
| User | User with user role — views and updates assigned tasks |
| Task_Status | One of: `Pending`, `In Progress`, `Completed` |
| Auth_Token | Signed JWT issued on login, used for all protected requests |
| Protected_API | API endpoint requiring a valid Auth_Token |

---

## Requirements

### 1. Authentication

- Login with username/password returns a signed JWT (8h expiry) containing userId and role
- Invalid credentials return HTTP 401
- Requests to Protected_APIs without a valid token return HTTP 401
- Frontend stores token in localStorage, attaches as `Authorization: Bearer <token>` header
- Unauthenticated navigation to protected routes redirects to `/login`
- Logout clears token and redirects to `/login`

### 2. Role-Based Access Control

- User-role requests to admin-only endpoints return HTTP 403
- Admin sees Admin Dashboard after login
- User sees User Dashboard after login
- UI hides controls not permitted for the authenticated role

### 3. Admin — User Management

- Admin can create users (username, password, role)
- Duplicate username returns HTTP 409
- Missing required fields return HTTP 400
- Passwords stored as bcrypt hash (cost 12) — never in plaintext
- Admin can list all users (id, username, role — no password hash)
- Admin can delete a user (their tasks become unassigned)

### 4. Admin — Task Management

- Admin can create tasks (title required, description optional) — status defaults to `Pending`
- Admin can assign a task to a user
- Assigning to non-existent task or user returns HTTP 404
- Admin can view all tasks with status and assignee
- Admin can delete a task

### 5. User — Task Viewing and Status Updates

- User sees only tasks assigned to them
- User can update status of their own tasks
- Updating a task not assigned to the user returns HTTP 403
- Invalid status value returns HTTP 400 with valid values listed
- Status update reflects immediately without page reload

### 6. REST API Contract

| Method | Path | Auth | Role |
|---|---|---|---|
| POST | `/login` | None | — |
| POST | `/users` | JWT | Admin |
| GET | `/users` | JWT | Admin |
| DELETE | `/users/:id` | JWT | Admin |
| POST | `/tasks` | JWT | Admin |
| PATCH | `/tasks/:id/assign` | JWT | Admin |
| GET | `/tasks` | JWT | Admin + User |
| PATCH | `/tasks/:id/status` | JWT | Admin + User |
| DELETE | `/tasks/:id` | JWT | Admin |

- All responses are JSON with `Content-Type: application/json`
- Malformed JSON body returns HTTP 400

### 7. Data Persistence

- MongoDB persists users (username unique) and tasks (assignee nullable ref to users)
- Data survives server restarts
- No schema migrations needed (MongoDB schemaless, Mongoose handles validation)

### 8. Frontend UI Quality

- Login page: clean dark SaaS-style design, loading state, error message on failure
- Admin Dashboard: hero banner, stat cards, user management panel, task board
- User Dashboard: hero banner, progress bar, filter tabs, task grid with status cards
- Responsive: mobile (375px) through desktop (1440px)
- Loading skeletons, toast notifications, confirmation dialogs for destructive actions
- Status color coding: Pending=gray, In Progress=amber, Completed=green

### 9. Security

- CORS restricted to configured frontend origin
- Input sanitized via Mongoose schema validation
- JWT secret loaded from environment variable — never hardcoded
- Unhandled errors return generic HTTP 500 — no stack traces to client

### 10. Docker (Bonus)

- `backend/Dockerfile` — Node.js production image
- `frontend/Dockerfile` — multi-stage Vite build + nginx serve
- `docker-compose.yml` — orchestrates mongo, backend, frontend
- All secrets via environment variables, no hardcoded values
- `docker compose up` starts all three services
