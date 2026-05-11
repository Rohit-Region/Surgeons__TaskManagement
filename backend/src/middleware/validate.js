const { ValidationError } = require('../errors');

function validate(requiredFields) {
  return function validationMiddleware(req, res, next) {
    const missing = requiredFields.filter(
      (f) => req.body[f] === undefined || req.body[f] === null || req.body[f] === ''
    );
    if (missing.length > 0) {
      return next(new ValidationError(`Missing required fields: ${missing.join(', ')}`, missing));
    }
    next();
  };
}

module.exports = { validate };
