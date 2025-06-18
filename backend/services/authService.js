const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerService = async ({ name, email, password, role }) => {
  let user = await User.findOne({ email });
  if (user) {
    const error = new Error('User already exists');
    error.status = 400;
    throw error;
  }
  user = new User({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    role: role || 'user',
  });
  await user.save();
  const payload = { user: { id: user.id, role: user.role } };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.status = 400;
    throw error;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.status = 400;
    throw error;
  }
  const payload = { user: { id: user.id, role: user.role } };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const getMeService = async (userId) => {
  return User.findById(userId).select('-password');
};

module.exports = { registerService, loginService, getMeService }; 