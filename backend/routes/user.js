const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const { auth } = require('../middleware/auth');
const orderController = require('../controllers/orderController');


// Category CRUD routes (admin only)
router.get('/categoriesForUser',  categoryController.getCategoriesForUser);

// Feature products route for user
router.get('/feature-products', productController.getFeatureProducts);

// All products for user (not deleted)
router.get('/products', productController.getProductsForUser);

// Place order (user)
router.post('/orders', auth, orderController.placeOrder);

// Get order history for user
router.get('/orders/history', auth, orderController.getUserOrders);

// Cancel order (user)
router.put('/orders/:id/cancel', auth, orderController.cancelOrderByUser);

module.exports = router; 