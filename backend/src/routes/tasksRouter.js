const express = require('express');
const { requireRole } = require('../middleware/roleGuard');
const { validate } = require('../middleware/validate');
const taskService = require('../services/taskService');

const router = express.Router();

router.post('/', requireRole('admin'), validate(['title']), async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body.title, req.body.description);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/assign', requireRole('admin'), validate(['userId']), async (req, res, next) => {
  try {
    const task = await taskService.assignTask(req.params.id, req.body.userId);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const tasks = await taskService.listTasks(req.user.userId, req.user.role);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', validate(['status']), async (req, res, next) => {
  try {
    const task = await taskService.updateTaskStatus(req.params.id, req.user.userId, req.user.role, req.body.status);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
