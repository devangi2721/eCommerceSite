const User = require('../models/User');

async function getAllUsers() {
  return await User.find({ role: 'user' ,isDeleted: { $ne: true } });
}

// Update user by id
async function updateUser(id, update) {
  return await User.findByIdAndUpdate(id, update, { new: true, select: '-password' });
}

// Soft delete user by id
async function softDeleteUser(id) {
  return await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true, select: '-password' });
}

module.exports = {
  getAllUsers,
  updateUser,
  softDeleteUser,
}; 