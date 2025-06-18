const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { registerController, loginController, getMeController } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Register
router.post('/register', validateRegister, registerController);

// Login
router.post('/login', validateLogin, loginController);

// Get current user (protected)
router.get('/me', auth, getMeController);

module.exports = router; 