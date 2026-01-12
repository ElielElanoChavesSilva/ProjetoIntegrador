const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

// @route   POST /orders
// @desc    Create an order
// @access  Private
router.post('/', orderController.createOrder);

// @route   GET /orders
// @desc    Get all orders for a user
// @access  Private
router.get('/', orderController.getOrders);

// @route   GET /orders/:id
// @desc    Get a single order by ID
// @access  Private
router.get('/:id', orderController.getOrderById);

// @route   PUT /orders/:id
// @desc    Update an order
// @access  Private
router.put('/:id', orderController.updateOrder);

// @route   DELETE /orders/:id
// @desc    Delete an order
// @access  Private
router.delete('/:id', orderController.deleteOrder);


module.exports = router;