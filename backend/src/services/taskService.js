const Task = require('../models/Task');
const User = require('../models/User');
const { NotFoundError, ForbiddenError, ValidationError } = require('../errors');

const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];

function mapTask(task) {
  const obj = task.toObject ? task.toObject() : task;
  return {
    id: obj._id.toString(),
    title: obj.title,
    description: obj.description,
    status: obj.status,
    assignee: obj.assignee
      ? {
          id: obj.assignee._id ? obj.assignee._id.toString() : obj.assignee.toString(),
          username: obj.assignee.username || undefined,
        }
      : null,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

async function createTask(title, description) {
  const task = await Task.create({ title, description: description || null });
  return mapTask(task);
}

async function assignTask(taskId, userId) {
  const task = await Task.findById(taskId);
  if (!task) throw new NotFoundError(`Task with id ${taskId} not found`);

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError(`User with id ${userId} not found`);

  task.assignee = userId;
  await task.save();

  const populated = await Task.findById(taskId).populate('assignee', 'username');
  return mapTask(populated);
}

async function listTasks(requestingUserId, role) {
  const query = role === 'admin'
    ? Task.find()
    : Task.find({ assignee: requestingUserId });

  const tasks = await query.populate('assignee', 'username').sort({ createdAt: -1 });
  return tasks.map(mapTask);
}

async function updateTaskStatus(taskId, requestingUserId, role, status) {
  if (!VALID_STATUSES.includes(status)) {
    throw new ValidationError(
      `Invalid status. Valid values are: ${VALID_STATUSES.join(', ')}`,
      ['status']
    );
  }

  const task = await Task.findById(taskId);
  if (!task) throw new NotFoundError(`Task with id ${taskId} not found`);

  if (role === 'user') {
    const assigneeId = task.assignee ? task.assignee.toString() : null;
    if (assigneeId !== requestingUserId.toString()) {
      throw new ForbiddenError('You can only update tasks assigned to you');
    }
  }

  task.status = status;
  await task.save();

  const populated = await Task.findById(taskId).populate('assignee', 'username');
  return mapTask(populated);
}

async function deleteTask(taskId) {
  const task = await Task.findById(taskId);
  if (!task) throw new NotFoundError(`Task with id ${taskId} not found`);
  await Task.findByIdAndDelete(taskId);
}

module.exports = { createTask, assignTask, listTasks, updateTaskStatus, deleteTask };
