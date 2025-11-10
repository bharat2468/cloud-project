const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

// Get all products
router.get('/', productController.getProducts);

// Search products by query
router.get('/search', productController.searchProducts);

// Get product by ID (must be before /:id to avoid conflicts)
router.get('/:id', productController.getProductById);

// Get products by name
router.get('/name/:name', productController.getProductByName);

// Create new product
router.post('/', productController.createProduct);

module.exports = router;
