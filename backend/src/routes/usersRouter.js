const express = require('express');
const { requireRole } = require('../middleware/roleGuard');
const { validate } = require('../middleware/validate');
const userService = require('../services/userService');

const router = express.Router();

router.post('/', requireRole('admin'), validate(['username', 'password', 'role']), async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body.username, req.body.password, req.body.role);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/', requireRole('admin'), async (req, res, next) => {
  try {
    res.json(await userService.listUsers());
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireRole('admin'), async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
