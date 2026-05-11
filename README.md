# Task Management System

A full-stack task management application built for internal company use. The system enables Admins to manage users and tasks, and allows Users to view and update their assigned tasks.

## Architecture

This is a monorepo containing two separate services:

- **Backend**: Node.js/Express REST API with PostgreSQL database
- **Frontend**: React.js SPA built with Vite

## Tech Stack

### Frontend
- **Framework**: React.js 18
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 16
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Testing**: Jest + Supertest

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL with persistent volumes

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 16.x or higher ([Download](https://www.postgresql.org/download/))
- **Docker** and **Docker Compose** (optional, for containerized deployment) ([Download](https://www.docker.com/))
- **npm** or **yarn** package manager

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-system
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# - DATABASE_URL: PostgreSQL connection string
# - JWT_SECRET: Secret key for JWT signing (generate a secure random string)
# - JWT_EXPIRY: Token expiration time (default: 8h)
# - FRONTEND_ORIGIN: Frontend URL for CORS (default: http://localhost:3000)
# - PORT: Backend server port (default: 4000)

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:4000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# - VITE_API_BASE_URL: Backend API URL (default: http://localhost:4000)

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 4. Create Initial Admin User

After setting up the database, you'll need to create an initial admin user. You can do this by:

1. Connecting to your PostgreSQL database
2. Running the following SQL (replace with your desired credentials):

```sql
INSERT INTO users (username, password, role)
VALUES ('admin', '$2a$12$[bcrypt-hash-here]', 'admin');
```

Or use the backend API directly after it's running (implementation details in Task 3).

## Docker Setup

For a containerized deployment using Docker Compose:

```bash
# From the project root directory

# Create environment file
cp .env.example .env

# Edit .env with your Docker configuration

# Start all services (PostgreSQL, Backend, Frontend)
docker compose up

# Or run in detached mode
docker compose up -d

# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes database data)
docker compose down -v
```

When using Docker Compose:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`
- PostgreSQL: `localhost:5432`

## API Endpoints

### Authentication
- `POST /login` - User login (public)

### Users (Admin only)
- `POST /users` - Create new user
- `GET /users` - List all users

### Tasks
- `POST /tasks` - Create task (Admin only)
- `GET /tasks` - List tasks (filtered by role)
- `PATCH /tasks/:id/assign` - Assign task to user (Admin only)
- `PATCH /tasks/:id/status` - Update task status (User: own tasks, Admin: all tasks)

All protected endpoints require a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests with UI
npm run test:ui
```

## Project Structure

```
task-management-system/
├── backend/                 # Backend API service
│   ├── src/
│   │   ├── db/             # Database client and migrations
│   │   ├── middleware/     # Express middleware (auth, validation, errors)
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic layer
│   │   ├── app.js          # Express app configuration
│   │   └── server.js       # Server entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/               # Frontend React application
│   ├── src/
│   │   ├── api/           # API client and service functions
│   │   ├── components/    # React components
│   │   ├── context/       # React context (auth, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── styles/        # Global styles and design tokens
│   │   ├── App.jsx        # Root component
│   │   └── main.jsx       # Application entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── docker-compose.yml      # Docker orchestration (to be created)
├── .env.example           # Root environment template (to be created)
└── README.md              # This file
```

## Features

### Admin Features
- Create and manage user accounts
- Create tasks with title and description
- Assign tasks to users
- View all tasks and their statuses
- Update any task status

### User Features
- View assigned tasks
- Update status of assigned tasks (Pending → In Progress → Completed)
- Clean, modern UI with status-coded task cards

## Security Features

- JWT-based stateless authentication
- bcrypt password hashing (cost factor 12)
- Role-based access control (RBAC)
- CORS protection
- SQL injection prevention via parameterized queries
- HTTP-only secure token transmission
- Input validation and sanitization

## Development Workflow

1. **Backend Development**: Make changes in `backend/src/`
2. **Frontend Development**: Make changes in `frontend/src/`
3. **Database Changes**: Update schema in `backend/src/db/schema.sql` and run migrations
4. **Testing**: Write tests alongside features
5. **Environment Variables**: Never commit `.env` files - use `.env.example` as template

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env` file
- Ensure database exists and migrations have run

### Port Conflicts
- Backend default: 4000 (change PORT in backend/.env)
- Frontend default: 3000 (change in frontend/vite.config.js)
- PostgreSQL default: 5432

### CORS Errors
- Verify FRONTEND_ORIGIN in backend/.env matches your frontend URL
- Check that backend is running and accessible

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Submit a pull request

## License

ISC

## Support

For issues and questions, please open an issue in the repository.
