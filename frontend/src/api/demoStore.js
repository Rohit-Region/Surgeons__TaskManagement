/**
 * Demo Store — localStorage-backed data layer.
 * Used when the backend is unreachable.
 * Simulates the full API with realistic data.
 */

const USERS_KEY  = 'demo_users';
const TASKS_KEY  = 'demo_tasks';
const DEMO_KEY   = 'demo_mode_v2';

// ── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 18);
}

function now() {
  return new Date().toISOString();
}

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function getTasks() {
  return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// ── Seed default data on first run ───────────────────────────────────────────

export function seedDemoData() {
  if (localStorage.getItem(DEMO_KEY)) return; // already seeded

  const adminId = uid();
  const userId1 = uid();
  const userId2 = uid();

  const users = [
    { id: adminId, username: 'admin',   password: 'admin123',   role: 'admin', createdAt: now() },
    { id: userId1, username: 'alice',   password: 'alice123',   role: 'user',  createdAt: now() },
    { id: userId2, username: 'bob',     password: 'bob123',     role: 'user',  createdAt: now() },
    { id: uid(),   username: 'Rohit',   password: '123456',     role: 'user',  createdAt: now() },
  ];

  const tasks = [
    { id: uid(), title: 'Design landing page',      description: 'Create wireframes and mockups for the new landing page.', status: 'Completed',   assignee: userId1, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Set up CI/CD pipeline',    description: 'Configure GitHub Actions for automated testing and deployment.', status: 'In Progress', assignee: userId2, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Write API documentation',  description: 'Document all REST endpoints using OpenAPI spec.', status: 'Pending',     assignee: userId1, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Fix login page bug',        description: 'Users report the login button is unresponsive on mobile.', status: 'In Progress', assignee: userId2, createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'Database optimization',    description: 'Add indexes to improve query performance.', status: 'Pending',     assignee: null,    createdAt: now(), updatedAt: now() },
    { id: uid(), title: 'User onboarding flow',     description: 'Build the step-by-step onboarding experience for new users.', status: 'Pending',     assignee: userId1, createdAt: now(), updatedAt: now() },
  ];

  saveUsers(users);
  saveTasks(tasks);
  localStorage.setItem(DEMO_KEY, '1');
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export function demoLogin(username, password) {
  const users = getUsers();
  const user = users.find(u => u.username === username);
  if (!user || user.password !== password) {
    throw { response: { data: { error: { message: 'Invalid username or password' } } } };
  }

  // Build a fake JWT-compatible token (header.payload.signature in base64url)
  const payload = { sub: user.id, role: user.role, username: user.username, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 28800 };
  const header  = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })).replace(/=/g,'');
  const body    = btoa(JSON.stringify(payload)).replace(/=/g,'');
  const fakeToken = `${header}.${body}.demo_signature`;
  return { token: fakeToken };
}

// ── Users ─────────────────────────────────────────────────────────────────────

export function demoListUsers() {
  return getUsers().map(({ password, ...u }) => u);
}

export function demoCreateUser({ username, password, role }) {
  const users = getUsers();
  if (users.find(u => u.username === username)) {
    throw { response: { data: { error: { message: `Username '${username}' is already taken` } } } };
  }
  const user = { id: uid(), username, password, role, createdAt: now() };
  saveUsers([...users, user]);
  const { password: _, ...safe } = user;
  return safe;
}

export function demoDeleteUser(id) {
  saveUsers(getUsers().filter(u => u.id !== id));
  // Unassign tasks
  saveTasks(getTasks().map(t => t.assignee === id ? { ...t, assignee: null, updatedAt: now() } : t));
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

function mapTask(task) {
  const users = getUsers();
  const assignee = task.assignee ? users.find(u => u.id === task.assignee) : null;
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    assignee: assignee ? { id: assignee.id, username: assignee.username } : null,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

export function demoListTasks(userId, role) {
  const tasks = getTasks();
  const filtered = role === 'admin' ? tasks : tasks.filter(t => t.assignee === userId);
  return filtered.map(mapTask).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function demoCreateTask({ title, description }) {
  const task = { id: uid(), title, description: description || null, status: 'Pending', assignee: null, createdAt: now(), updatedAt: now() };
  saveTasks([...getTasks(), task]);
  return mapTask(task);
}

export function demoAssignTask(taskId, userId) {
  const tasks = getTasks();
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) throw { response: { data: { error: { message: 'Task not found' } } } };
  tasks[idx] = { ...tasks[idx], assignee: userId, updatedAt: now() };
  saveTasks(tasks);
  return mapTask(tasks[idx]);
}

export function demoUpdateTaskStatus(taskId, userId, role, status) {
  const VALID = ['Pending', 'In Progress', 'Completed'];
  if (!VALID.includes(status)) throw { response: { data: { error: { message: 'Invalid status' } } } };
  const tasks = getTasks();
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) throw { response: { data: { error: { message: 'Task not found' } } } };
  if (role === 'user' && tasks[idx].assignee !== userId) {
    throw { response: { data: { error: { message: 'You can only update tasks assigned to you' } } } };
  }
  tasks[idx] = { ...tasks[idx], status, updatedAt: now() };
  saveTasks(tasks);
  return mapTask(tasks[idx]);
}

export function demoDeleteTask(taskId) {
  saveTasks(getTasks().filter(t => t.id !== taskId));
}
