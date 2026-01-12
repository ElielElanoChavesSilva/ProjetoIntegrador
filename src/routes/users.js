const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

// @route   GET /users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', userController.getUserProfile);

// @route   PUT /users/profile
// @desc    Update current user's profile
// @access  Private
router.put('/profile', userController.updateUserProfile);

// @route   DELETE /users/profile
// @desc    Delete current user's profile
// @access  Private
router.delete('/profile', userController.deleteUserProfile);

module.exports = router;
