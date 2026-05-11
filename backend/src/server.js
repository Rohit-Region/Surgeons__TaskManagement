require('dotenv').config();

const app = require('./app');
const connectDB = require('./db/connect');
const seedAdmin = require('./db/seed');

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`Task Management API server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
