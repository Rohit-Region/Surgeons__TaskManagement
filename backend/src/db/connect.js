// backend/src/db/connect.js
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanagement';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
}

module.exports = connectDB;
