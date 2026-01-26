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

// @route   GET /users/shopping-list
// @desc    Get user's shopping list
// @access  Private
router.get('/shopping-list', userController.getShoppingList);

// @route   POST /users/shopping-list
// @desc    Add a product to user's shopping list
// @access  Private
router.post('/shopping-list', userController.addProductToShoppingList);

// @route   DELETE /users/shopping-list/:productId
// @desc    Remove a product from user's shopping list
// @access  Private
router.delete('/shopping-list/:productId', userController.removeProductFromShoppingList);

module.exports = router;
