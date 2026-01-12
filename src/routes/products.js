const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST /products
// @desc    Create a new product
// @access  Private
router.post('/', authMiddleware, productController.createProduct);

// @route   PUT /products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', authMiddleware, productController.updateProduct);

// @route   DELETE /products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;