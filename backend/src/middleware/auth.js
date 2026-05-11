const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors');

function jwtMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthError('Missing or malformed Authorization header'));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.sub, role: payload.role };
    next();
  } catch (err) {
    next(new AuthError(err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token'));
  }
}

module.exports = jwtMiddleware;
