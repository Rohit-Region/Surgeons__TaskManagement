const express = require('express');
const { validate } = require('../middleware/validate');
const authService = require('../services/authService');

const router = express.Router();

router.post('/', validate(['username', 'password']), async (req, res, next) => {
  try {
    const result = await authService.login(req.body.username, req.body.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
