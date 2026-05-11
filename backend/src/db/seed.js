const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Seeds the database with a default admin user if none exists.
 * Runs automatically on server startup.
 */
async function seedAdmin() {
  const existing = await User.findOne({ role: 'admin' });

  if (existing) {
    console.log('Admin user already exists — skipping seed.');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 12);

  await User.create({
    username: 'admin',
    password: hashedPassword,
    role: 'admin',
  });

  console.log('');
  console.log('========================================');
  console.log('  Default admin user created!');
  console.log('  Username : admin');
  console.log('  Password : admin123');
  console.log('  ⚠️  Change this password after login!');
  console.log('========================================');
  console.log('');
}

module.exports = seedAdmin;
