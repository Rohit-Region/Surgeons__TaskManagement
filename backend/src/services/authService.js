const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AuthError } = require('../errors');

/**
 * Authenticate a user and return a signed JWT.
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ token: string }>}
 * @throws {AuthError} if credentials are invalid
 */
async function login(username, password) {
  // Find user (include password for comparison)
  const user = await User.findOne({ username }).select('+password');

  if (!user) {
    throw new AuthError('Invalid username or password');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new AuthError('Invalid username or password');
  }

  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '8h' }
  );

  return { token };
}

module.exports = { login };
