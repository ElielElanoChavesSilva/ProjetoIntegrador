const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// Caminho: /api/auth/register
router.post('/register', AuthController.register);

// Caminho: /api/auth/login
router.post('/login', AuthController.login);

module.exports = router;