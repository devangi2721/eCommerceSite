const Product = require('../models/Product');
const { createProductService, updateProductService } = require('../services/productService');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create a new product
const createProduct = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { name, price, category } = req.body;
    let imageUrl = null;

    // Handle image upload if file exists
    if (req.file) {
      // Generate unique filename
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;
      
      // Move file to public uploads directory
      const newFilePath = path.join(uploadsDir, fileName);
      fs.renameSync(req.file.path, newFilePath);
      
      // Create the complete image URL
      imageUrl = `/uploads/${fileName}`;
      
      console.log('Image uploaded successfully:', imageUrl);
    }

    const product = await createProductService({ name, price, image: imageUrl, category });
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
    const product = await Product.findById(req.params.id ,{isDeleted: false});
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    console.log('Update request body:', req.body);
    console.log('Update request file:', req.file);
    
    const { name, price, category } = req.body;
    let imageUrl = null;

    // Handle image upload if new file exists
    if (req.file) {
      // Generate unique filename
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;
      
      // Move file to public uploads directory
      const newFilePath = path.join(uploadsDir, fileName);
      fs.renameSync(req.file.path, newFilePath);
      
      // Create the complete image URL
      imageUrl = `/uploads/${fileName}`;
      
      console.log('New image uploaded successfully:', imageUrl);
    }

    // Prepare update data
    const updateData = { name, price, category };
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const product = await updateProductService(req.params.id, updateData);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id ,{isDeleted: true});
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