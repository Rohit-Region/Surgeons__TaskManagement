# Design: Task Management System

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite, React Router v6, Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Deployment | Docker + Docker Compose |

---

## Architecture

```
Browser (React SPA :3000)
    │  HTTP/JSON + Bearer token
    ▼
Express API (:4000)
    ├── JWT Middleware
    ├── Role Guard Middleware
    ├── Validator Middleware
    ├── Auth Routes   → Auth Service
    ├── User Routes   → User Service
    └── Task Routes   → Task Service
                            │
                            ▼
                       MongoDB (:27017)
                       ├── users collection
                       └── tasks collection
```

---

## Backend Structure

```
backend/src/
├── app.js              # Express setup, middleware, routes
├── server.js           # DB connect, seed, listen
├── errors.js           # AppError, AuthError, ForbiddenError, NotFoundError, ConflictError, ValidationError
├── db/
│   ├── connect.js      # Mongoose connection
│   └── seed.js         # Auto-seed default admin on first run
├── models/
│   ├── User.js         # username, password (hashed), role
│   └── Task.js         # title, description, status, assignee (ref User)
├── middleware/
│   ├── auth.js         # Verify Bearer JWT → req.user = { userId, role }
│   ├── roleGuard.js    # requireRole(role) factory → 403 if mismatch
│   ├── validate.js     # validate([fields]) factory → 400 if missing
│   └── errorHandler.js # Global error handler → maps AppError to HTTP status
├── routes/
│   ├── authRouter.js   # POST /login
│   ├── usersRouter.js  # POST /users, GET /users, DELETE /users/:id
│   └── tasksRouter.js  # POST /tasks, PATCH /:id/assign, GET /tasks, PATCH /:id/status, DELETE /:id
└── services/
    ├── authService.js  # login() → JWT
    ├── userService.js  # createUser, listUsers, getUserById, deleteUser
    └── taskService.js  # createTask, assignTask, listTasks, updateTaskStatus, deleteTask
```

---

## Frontend Structure

```
frontend/src/
├── App.jsx             # BrowserRouter, AuthProvider, ToastProvider, routes
├── main.jsx            # Entry point, imports global styles
├── api/
│   ├── client.js       # Axios instance + Bearer token interceptor + 401 redirect
│   ├── authApi.js      # login()
│   ├── usersApi.js     # createUser, listUsers, deleteUser
│   └── tasksApi.js     # createTask, assignTask, listTasks, updateTaskStatus, deleteTask
├── context/
│   ├── AuthContext.jsx # token, user, login(), logout() — persisted in localStorage
│   └── ToastContext.jsx# showToast(message, variant) — auto-dismiss 3s
├── components/
│   ├── ProtectedRoute.jsx
│   ├── Button.jsx, Input.jsx, Badge.jsx, Spinner.jsx, Toast.jsx
│   ├── admin/
│   │   ├── CreateUserForm.jsx
│   │   ├── CreateTaskForm.jsx
│   │   ├── UserManagementPanel.jsx  (with delete + confirm dialog)
│   │   ├── TaskManagementPanel.jsx  (with delete + confirm dialog)
│   │   └── AssignTaskControl.jsx
│   └── user/
│       ├── TaskCard.jsx
│       └── StatusSelector.jsx       (optimistic update)
├── layouts/
│   ├── AdminLayout.jsx  # Dark indigo navbar
│   └── UserLayout.jsx   # Dark green navbar
├── pages/
│   ├── LoginPage.jsx    # Dark SaaS-style, grid background, no floating cards
│   ├── AdminDashboard.jsx
│   └── UserDashboard.jsx
└── styles/
    ├── variables.css    # CSS custom properties (colors, spacing, shadows, gradients)
    └── global.css       # Reset, fonts, animations
```

---

## Data Models

### User
```js
{
  _id: ObjectId,
  username: String (unique, required),
  password: String (bcrypt hash, never returned in responses),
  role: 'admin' | 'user',
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```js
{
  _id: ObjectId,
  title: String (required),
  description: String | null,
  status: 'Pending' | 'In Progress' | 'Completed' (default: 'Pending'),
  assignee: ObjectId | null (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### API Response Shapes

```js
// User (password never included)
{ id: string, username: string, role: string, createdAt: string }

// Task
{ id: string, title: string, description: string|null, status: string,
  assignee: { id: string, username: string } | null,
  createdAt: string, updatedAt: string }

// JWT payload
{ sub: string (userId), role: string, iat: number, exp: number }

// Error response
{ error: { code: string, message: string, fields?: string[] } }
```

---

## Design System

### Colors
| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#6366F1` | Primary actions |
| `--color-success` | `#10B981` | Completed status |
| `--color-warning` | `#F59E0B` | In Progress status |
| `--color-neutral` | `#94A3B8` | Pending status |
| `--color-error` | `#EF4444` | Errors, delete actions |

### Status Color Coding
| Status | Border | Badge |
|---|---|---|
| Pending | `#94A3B8` gray | Gray pill |
| In Progress | `#F59E0B` amber | Amber pill |
| Completed | `#10B981` green | Green pill |

### Key UI Decisions
- Login: dark `#0A0A0F` background with subtle dot-grid — no floating decorative cards
- Navbars: Admin = deep indigo gradient, User = deep green gradient
- Stat cards: gradient backgrounds (purple, pink, cyan, green)
- Confirmation dialogs: blurred backdrop overlay before any delete action
- Toast notifications: gradient backgrounds, auto-dismiss 3s, progress bar

---

## Error Handling

### Backend Error Hierarchy
```
AppError (base)
├── AuthError        → 401
├── ForbiddenError   → 403
├── NotFoundError    → 404
├── ConflictError    → 409
└── ValidationError  → 400 (includes fields array)
```

### Frontend Error Handling
| Scenario | Behavior |
|---|---|
| Login failure | Inline error, username preserved, password cleared |
| 401 mid-session | Axios interceptor clears auth, redirects to `/login` |
| Form validation | Field-level error messages |
| Delete action | Confirmation dialog before API call |
| Success | Toast notification (green) |
| API error | Toast notification (red) |
