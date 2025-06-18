const Product = require('../models/Product');
const { createProductService, updateProductService } = require('../services/productService');

// Create a new product
const createProduct = async (req, res) => {
  try {
    console.log(req.body);
    const { name, description, price, image , category} = req.body;
    const product = await createProductService({ name, description, price, image , category });
    res.status(201).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({isDeleted: false});
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get a product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;
    const product = await updateProductService(req.params.id, { name, description, price, image });
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get latest 4 products (feature products for user)
const getFeatureProducts = async (req, res) => {
  try {
    const products = await Product.find({isDeleted: false}).sort({ createdAt: -1 }).limit(4);
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all products for user (not deleted)
const getProductsForUser = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeatureProducts,
  getProductsForUser,
}; 