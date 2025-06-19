const Category = require('../models/Category');
const fs = require('fs');
const path = require('path');

// Base URL for the application
const BASE_URL = "http://localhost:5000";

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({isDeleted: { $ne: true }});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all categories
exports.getCategoriesForUser = async (req, res) => {
  try {
    const categories = await Category.find({isDeleted: { $ne: true }});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create category
exports.createCategory = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { name, description } = req.body;
    let imageUrl = null;

    // Handle image upload if file exists
    if (req.file) {
      // Generate unique filename
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `category_${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;
      
      // Move file to public uploads directory
      const newFilePath = path.join(uploadsDir, fileName);
      fs.renameSync(req.file.path, newFilePath);
      
      // Create the complete image URL
      imageUrl = `/uploads/${fileName}`;
      
      console.log('Image uploaded successfully:', imageUrl);
    }

    // Create category with image URL
    const category = new Category({ 
      name, 
      description, 
      image: imageUrl 
    });
    
    await category.save();
    res.status(201).json(category);
    
  } catch (err) {
    console.error('Error creating category:', err);
    res.status(400).json({ error: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    console.log('Update request body:', req.body);
    console.log('Update request file:', req.file);
    
    const { name, description } = req.body;
    let imageUrl = null;

    // Handle image upload if new file exists
    if (req.file) {
      // Generate unique filename
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `category_${Date.now()}_${Math.random().toString(36).substring(7)}${fileExtension}`;
      
      // Move file to public uploads directory
      const newFilePath = path.join(uploadsDir, fileName);
      fs.renameSync(req.file.path, newFilePath);
      
      // Create the complete image URL
      imageUrl = `/uploads/${fileName}`;
      
      console.log('New image uploaded successfully:', imageUrl);
    }

    // Prepare update data
    const updateData = { name, description };
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(400).json({ error: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
