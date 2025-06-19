const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();
const { adminDashboardController, dashboardStatsController } = require('../controllers/adminController');
const productController = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Temporary storage, will be moved to public/uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Example admin-only route
router.get('/dashboard', auth, adminOnly, adminDashboardController);

// user CRUD routes (admin only)
router.get('/users', auth, adminOnly, userController.getUsers);
router.put('/users/:id', auth, adminOnly, userController.updateUser);
router.delete('/users/:id', auth, adminOnly, userController.softDeleteUser);

// Product CRUD routes (admin only)
router.post('/products', auth, adminOnly, upload.single('image'), productController.createProduct);
router.get('/products', auth, adminOnly, productController.getProducts);
router.get('/products/:id', auth, adminOnly, productController.getProductById);
router.put('/products/:id', auth, adminOnly, upload.single('image'), productController.updateProduct);
router.delete('/products/:id', auth, adminOnly, productController.deleteProduct);

// Category CRUD routes (admin only)
router.get('/categories', categoryController.getCategories);
router.post('/categories', auth, adminOnly, upload.single('image'), categoryController.createCategory);
router.put('/categories/:id', auth, adminOnly, upload.single('image'),
    categoryController.updateCategory);
router.delete('/categories/:id', auth, adminOnly, categoryController.deleteCategory);

// Order CRUD routes (admin only)
router.get('/orders', auth, adminOnly, orderController.getOrders);
router.put('/:id/cancel', auth, adminOnly, orderController.cancelOrder);

// Dashboard stats route (admin only)
router.get('/dashboard/stats', auth, adminOnly, dashboardStatsController);

// Dashboard recent orders route (admin only)
router.get('/dashboard/recent-orders', auth, adminOnly, require('../controllers/adminController').recentOrdersController);

module.exports = router; 