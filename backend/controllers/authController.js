const { registerService, loginService, getMeService } = require('../services/authService');

const registerController = async (req, res) => {
  try {
    const token = await registerService(req.body);
    res.json({ token });
  } catch (err) {
    if (err.status) {
      res.status(err.status).json({ msg: err.message });
    } else {
      res.status(500).send('Server error');
    }
  }
};

const loginController = async (req, res) => {
  try {
    const token = await loginService(req.body);
    res.json({ token });
  } catch (err) {
    if (err.status) {
      res.status(err.status).json({ msg: err.message });
    } else {
      res.status(500).send('Server error');
    }
  }
};

const getMeController = async (req, res) => {
  try {
    const user = await getMeService(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports = { registerController, loginController, getMeController }; 