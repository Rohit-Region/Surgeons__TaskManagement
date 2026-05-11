const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const { ConflictError, NotFoundError } = require('../errors');

async function createUser(username, password, role) {
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const user = await User.create({ username, password: hashedPassword, role });
    return user.toJSON();
  } catch (err) {
    if (err.code === 11000) throw new ConflictError(`Username '${username}' is already taken`);
    throw err;
  }
}

async function listUsers() {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map((u) => u.toJSON());
}

async function getUserById(id) {
  const user = await User.findById(id);
  return user ? user.toJSON() : null;
}

async function deleteUser(id) {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError(`User with id ${id} not found`);
  await User.findByIdAndDelete(id);
  await Task.updateMany({ assignee: id }, { $set: { assignee: null } });
}

module.exports = { createUser, listUsers, getUserById, deleteUser };
