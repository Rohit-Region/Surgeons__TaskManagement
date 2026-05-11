const express = require('express');
const cors = require('cors');
require('dotenv').config();

const jwtMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const authRouter = require('./routes/authRouter');
const usersRouter = require('./routes/usersRouter');
const tasksRouter = require('./routes/tasksRouter');

const app = express();

// CORS — allow requests only from the configured frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
  })
);

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use('/login', authRouter);
app.use('/users', jwtMiddleware, usersRouter);
app.use('/tasks', jwtMiddleware, tasksRouter);

// Health check endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
