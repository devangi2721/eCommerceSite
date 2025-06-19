const userService = require('../services/userService');

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    console.log(users,"users");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/admin/users/:id (soft delete)
const softDeleteUser = async (req, res) => {
  try {
    const deletedUser = await userService.softDeleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User soft deleted', user: deletedUser });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getUsers,
  updateUser,
  softDeleteUser
};